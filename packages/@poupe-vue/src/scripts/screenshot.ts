#!/usr/bin/env tsx
/**
 * Screenshot helper for capturing component states
 * Usage: pnpm screenshot [component-name] [output-file]
 */

import { chromium, devices } from 'playwright';
import { resolve } from 'pathe';
import { existsSync, mkdirSync } from 'node:fs';
import { parseArguments, helpSections, type ScreenshotOptions } from './screenshot-shared';

async function takeScreenshot(options: ScreenshotOptions = {}) {
  const {
    component = 'theme',
    output = `${component}-${Date.now()}.png`,
    viewport = { width: 1280, height: 800 },
    fullPage = false,
    darkMode = false,
    mobile = false,
    port = 5173,
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
    const baseUrl = process.env.VITE_DEV_SERVER_URL || `http://localhost:${port}`;
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
    if (options.allViewports) {
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
    throw error;
  } finally {
    await browser.close();
  }
}

// Parse command line arguments
const { options, showHelp } = parseArguments(process.argv.slice(2));

// Help
if (showHelp) {
  console.log(`
Screenshot Helper for @poupe/vue

Usage:
  pnpm screenshot [component] [output] [options]

Arguments:
  component    Component to screenshot (default: theme)
  output       Output filename (default: [component]-[timestamp].png)
               Files are always saved in screenshots/ directory

${helpSections.options}
  --port <number>    Dev server port (default: 5173)
  --help, -h         Show this help

${helpSections.examples.manual}
`);
  process.exit(0);
}

// Run screenshot
try {
  await takeScreenshot(options);
} catch {
  process.exit(1);
}
