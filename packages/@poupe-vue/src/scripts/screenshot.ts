#!/usr/bin/env tsx
/**
 * Screenshot helper for capturing component states
 * Usage: pnpm screenshot [component-name] [output-file]
 */

import { chromium, devices } from 'playwright';
import { resolve } from 'pathe';
import { existsSync, mkdirSync } from 'node:fs';

interface ScreenshotOptions {
  component?: string
  output?: string
  viewport?: { width: number; height: number }
  fullPage?: boolean
  darkMode?: boolean
  mobile?: boolean
}

async function takeScreenshot(options: ScreenshotOptions = {}) {
  const {
    component = 'theme',
    output = `${component}-${Date.now()}.png`,
    viewport = { width: 1280, height: 800 },
    fullPage = false,
    darkMode = false,
    mobile = false,
  } = options;

  // Ensure screenshots directory exists
  const screenshotsDirectory = resolve(process.cwd(), 'screenshots');
  if (!existsSync(screenshotsDirectory)) {
    mkdirSync(screenshotsDirectory, { recursive: true });
  }

  // Always save in screenshots directory
  const filename = output.includes('/') ? output.split('/').pop()! : output;
  const outputPath = resolve(screenshotsDirectory, filename);

  // Launch browser
  const browser = await chromium.launch({
    headless: true,
  });

  try {
    // Create context with device emulation if mobile
    const contextOptions = mobile
      ? { ...devices['iPhone 13'] }
      : { viewport };

    const context = await browser.newContext(contextOptions);
    const page = await context.newPage();

    // Navigate to dev server
    const baseUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
    await page.goto(baseUrl, { waitUntil: 'networkidle' });

    // Apply dark mode if requested
    if (darkMode) {
      await page.evaluate(() => {
        document.documentElement.classList.add('dark');
      });
    }

    // Navigate to specific component if provided
    if (component !== 'theme') {
      // Click on FAB menu
      await page.click('button[aria-label="Toggle menu"]');
      await page.waitForTimeout(300); // Wait for animation

      // Click on stories toggle
      await page.click('button[aria-label="Show Component Stories"]');
      await page.waitForTimeout(500); // Wait for page transition

      // If specific component requested, navigate to it
      if (component !== 'stories') {
        const componentButton = page.locator(`text="${component}"`).first();
        if (await componentButton.isVisible()) {
          await componentButton.click();
          await page.waitForTimeout(300);
        }
      }
    }

    // Take screenshot
    await page.screenshot({
      path: outputPath,
      fullPage,
    });

    console.log(`✅ Screenshot saved to: ${outputPath}`);

    // Take additional viewport screenshots if requested
    if (process.argv.includes('--all-viewports')) {
      const viewports = [
        { name: 'mobile', width: 375, height: 667 },
        { name: 'tablet', width: 768, height: 1024 },
        { name: 'desktop', width: 1920, height: 1080 },
      ];

      for (const vp of viewports) {
        await page.setViewportSize(vp);
        await page.waitForTimeout(100);

        const vpFilename = filename.replace('.png', `-${vp.name}.png`);
        const vpPath = resolve(screenshotsDirectory, vpFilename);
        await page.screenshot({
          path: vpPath,
          fullPage,
        });

        console.log(`✅ ${vp.name} screenshot saved to: ${vpPath}`);
      }
    }
  } catch (error) {
    console.error('❌ Screenshot failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Parse command line arguments
const arguments_ = process.argv.slice(2);
const options: ScreenshotOptions = {};

// Simple argument parsing
if (arguments_[0] && !arguments_[0].startsWith('--')) {
  options.component = arguments_[0];
}
if (arguments_[1] && !arguments_[1].startsWith('--')) {
  options.output = arguments_[1];
}

// Parse flags
if (arguments_.includes('--dark')) {
  options.darkMode = true;
}
if (arguments_.includes('--mobile')) {
  options.mobile = true;
}
if (arguments_.includes('--full-page')) {
  options.fullPage = true;
}

// Help
if (arguments_.includes('--help') || arguments_.includes('-h')) {
  console.log(`
Screenshot Helper for @poupe/vue

Usage:
  pnpm screenshot [component] [output] [options]

Arguments:
  component    Component to screenshot (default: theme)
  output       Output filename (default: [component]-[timestamp].png)
               Files are always saved in screenshots/ directory

Options:
  --dark             Enable dark mode
  --mobile           Use mobile viewport
  --full-page        Capture full page
  --all-viewports    Capture all viewport sizes
  --help, -h         Show this help

Examples:
  pnpm screenshot                           # Screenshot theme page
  pnpm screenshot button                    # Screenshot button component
  pnpm screenshot theme theme-dark.png --dark
  pnpm screenshot stories --all-viewports
`);
  process.exit(0);
}

// Run screenshot
await takeScreenshot(options);
