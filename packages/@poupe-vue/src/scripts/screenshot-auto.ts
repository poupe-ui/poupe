#!/usr/bin/env tsx
/**
 * Automated screenshot helper that manages dev server lifecycle
 * Usage: pnpm screenshot:auto [component] [options]
 */

import { spawn } from 'node:child_process';
import { resolve, dirname } from 'pathe';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

interface AutoScreenshotOptions {
  component?: string
  darkMode?: boolean
  mobile?: boolean
  fullPage?: boolean
  allViewports?: boolean
  port?: number
}

async function runScreenshots(options: AutoScreenshotOptions) {
  const port = options.port || 5173;

  console.log('🚀 Starting dev server...');

  // Create Vite dev server
  const server = await createServer({
    server: {
      port,
      strictPort: true,
    },
    logLevel: 'error',
  });

  try {
    // Start the server
    await server.listen();

    console.log(`✅ Dev server ready at http://localhost:${port}`);

    // Set environment variable for screenshot script
    process.env.VITE_DEV_SERVER_URL = `http://localhost:${port}`;

    // Build screenshot command
    const arguments_: string[] = [];

    if (options.component) {
      arguments_.push(options.component);
    }

    if (options.darkMode) {
      arguments_.push('--dark');
    }

    if (options.mobile) {
      arguments_.push('--mobile');
    }

    if (options.fullPage) {
      arguments_.push('--full-page');
    }

    if (options.allViewports) {
      arguments_.push('--all-viewports');
    }

    // Run screenshot script
    console.log('\n📸 Taking screenshots...');
    const screenshotProcess = spawn('tsx', [
      resolve(__dirname, 'screenshot.ts'),
      ...arguments_,
    ], {
      stdio: 'inherit',
    });

    // Wait for screenshot to complete
    await new Promise<void>((resolve, reject) => {
      screenshotProcess.on('exit', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Screenshot process exited with code ${code}`));
        }
      });

      screenshotProcess.on('error', reject);
    });

    console.log('\n✨ All screenshots completed successfully!');
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  } finally {
    // Always clean up dev server
    console.log('\n🛑 Stopping dev server...');
    await server.close();
  }
}

// Parse command line arguments
const arguments_ = process.argv.slice(2);
const options: AutoScreenshotOptions = {};

// Simple argument parsing
if (arguments_[0] && !arguments_[0].startsWith('--')) {
  options.component = arguments_[0];
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
if (arguments_.includes('--all-viewports')) {
  options.allViewports = true;
}

// Parse port
const portIndex = arguments_.indexOf('--port');
if (portIndex !== -1 && arguments_[portIndex + 1]) {
  options.port = Number.parseInt(arguments_[portIndex + 1], 10);
}

// Help
if (arguments_.includes('--help') || arguments_.includes('-h')) {
  console.log(`
Automated Screenshot Helper for @poupe/vue

Automatically starts dev server, takes screenshots, and cleans up.

Usage:
  pnpm screenshot:auto [component] [options]

Arguments:
  component    Component to screenshot (default: theme)

Options:
  --dark             Enable dark mode
  --mobile           Use mobile viewport
  --full-page        Capture full page
  --all-viewports    Capture all viewport sizes
  --port <number>    Dev server port (default: 5173)
  --help, -h         Show this help

Examples:
  pnpm screenshot:auto                    # Screenshot theme page
  pnpm screenshot:auto button --dark      # Screenshot button in dark mode
  pnpm screenshot:auto --all-viewports    # All viewports of theme page
  pnpm screenshot:auto stories --mobile   # Mobile view of stories

The script will:
1. Start the dev server automatically
2. Wait for it to be ready
3. Take the requested screenshots
4. Stop the dev server
5. Exit cleanly
`);
  process.exit(0);
}

// Run the automated screenshots
await runScreenshots(options);
