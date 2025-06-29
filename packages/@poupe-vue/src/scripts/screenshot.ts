#!/usr/bin/env tsx
/**
 * Screenshot helper for capturing component states
 * Usage: pnpm screenshot [component-name] [output-file]
 */

import { parseArguments, helpSections, type ScreenshotOptions } from './screenshot-shared';
import {
  initializeScreenshot,
  navigateToComponent,
  captureScreenshot,
  captureMultipleViewports,
  cleanup,
} from './screenshot-core';

async function takeScreenshot(options: ScreenshotOptions = {}) {
  const {
    component = 'theme',
    output = `${component}-${Date.now()}.png`,
    fullPage = false,
    allViewports = false,
  } = options;

  const context = await initializeScreenshot(options);

  try {
    // Navigate to component if specified
    if (component) {
      await navigateToComponent(context, component);
    }

    // Take screenshot
    const outputPath = await captureScreenshot(context.page, output, { fullPage });
    console.log(`✅ Screenshot saved to: ${outputPath}`);

    // Take additional viewport screenshots if requested
    if (allViewports) {
      await captureMultipleViewports(context, output, { fullPage });
    }
  } catch (error) {
    console.error('❌ Screenshot failed:', error);
    throw error;
  } finally {
    await cleanup(context);
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
               Can be: theme, stories, or any story name (e.g., button, surface, card)
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
