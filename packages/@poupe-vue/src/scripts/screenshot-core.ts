/**
 * Core screenshot functionality
 */

import { chromium, devices, type Browser, type Page } from 'playwright';
import { resolve } from 'pathe';
import { existsSync, mkdirSync } from 'node:fs';

export interface ScreenshotContext {
  browser: Browser
  page: Page
  baseUrl: string
}

export interface CoreScreenshotOptions {
  viewport?: { width: number; height: number }
  fullPage?: boolean
  darkMode?: boolean
  mobile?: boolean
  port?: number
}

/**
 * Initialize browser and page for screenshots
 */
export async function initializeScreenshot(options: CoreScreenshotOptions = {}): Promise<ScreenshotContext> {
  const {
    viewport = { width: 1280, height: 800 },
    darkMode = false,
    mobile = false,
    port = 5173,
  } = options;

  // Launch browser
  const browser = await chromium.launch({
    headless: true,
  });

  // Create context with device emulation if mobile
  const contextOptions = mobile
    ? { ...devices['iPhone 13'] }
    : { viewport };

  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();

  // Get base URL
  const baseUrl = process.env.VITE_DEV_SERVER_URL || `http://localhost:${port}`;

  // Navigate to dev server
  await page.goto(baseUrl, { waitUntil: 'networkidle' });

  // Apply dark mode if requested
  if (darkMode) {
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });
  }

  return { browser, page, baseUrl };
}

/**
 * Navigate to a specific component
 */
export async function navigateToComponent(context: ScreenshotContext, component: string) {
  const { page, baseUrl } = context;

  if (component === 'stories') {
    // Navigate directly to stories page (empty hash)
    await page.goto(`${baseUrl}#stories`, { waitUntil: 'networkidle' });
  } else if (component && component !== 'theme') {
    // Navigate directly to specific story using hash
    await page.goto(`${baseUrl}#${component}`, { waitUntil: 'networkidle' });
  }

  // Wait for navigation to complete
  await page.waitForTimeout(500);
}

/**
 * Ensure screenshots directory exists
 */
export function ensureScreenshotsDirectory(): string {
  const screenshotsDirectory = resolve(process.cwd(), 'screenshots');
  if (!existsSync(screenshotsDirectory)) {
    mkdirSync(screenshotsDirectory, { recursive: true });
  }
  return screenshotsDirectory;
}

/**
 * Take a screenshot and save it
 */
export async function captureScreenshot(
  page: Page,
  filename: string,
  options: { fullPage?: boolean } = {},
): Promise<string> {
  const screenshotsDirectory = ensureScreenshotsDirectory();

  // Always save in screenshots directory
  const outputFilename = filename.includes('/') ? filename.split('/').pop()! : filename;
  const outputPath = resolve(screenshotsDirectory, outputFilename);

  await page.screenshot({
    path: outputPath,
    fullPage: options.fullPage,
  });

  return outputPath;
}

/**
 * Clean up browser resources
 */
export async function cleanup(context: ScreenshotContext) {
  await context.browser.close();
}

/**
 * Take screenshots with multiple viewports
 */
export async function captureMultipleViewports(
  context: ScreenshotContext,
  baseFilename: string,
  options: { fullPage?: boolean } = {},
) {
  const { page } = context;
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1920, height: 1080 },
  ];

  const results: string[] = [];

  for (const vp of viewports) {
    await page.setViewportSize(vp);
    await page.waitForTimeout(100);

    const vpFilename = baseFilename.replace('.png', `-${vp.name}.png`);
    const path = await captureScreenshot(page, vpFilename, options);
    results.push(path);
    console.log(`✅ ${vp.name} screenshot saved to: ${path}`);
  }

  return results;
}
