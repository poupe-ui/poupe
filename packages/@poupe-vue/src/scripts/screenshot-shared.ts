/**
 * Shared utilities for screenshot scripts
 */

export interface ScreenshotOptions {
  component?: string
  output?: string
  viewport?: { width: number; height: number }
  fullPage?: boolean
  darkMode?: boolean
  mobile?: boolean
  allViewports?: boolean
  port?: number
}

export interface ParsedArguments {
  options: ScreenshotOptions
  showHelp: boolean
}

/**
 * Parse command line arguments into options
 */
export function parseArguments(arguments_: string[]): ParsedArguments {
  const options: ScreenshotOptions = {};

  // Parse positional arguments
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
  if (arguments_.includes('--all-viewports')) {
    options.allViewports = true;
  }

  // Parse port
  const portIndex = arguments_.indexOf('--port');
  if (portIndex !== -1 && arguments_[portIndex + 1]) {
    options.port = Number.parseInt(arguments_[portIndex + 1], 10);
  }

  // Check for help
  const showHelp = arguments_.includes('--help') || arguments_.includes('-h');

  return { options, showHelp };
}

/**
 * Common help text sections
 */
export const helpSections = {
  options: `Options:
  --dark             Enable dark mode
  --mobile           Use mobile viewport
  --full-page        Capture full page
  --all-viewports    Capture all viewport sizes`,

  examples: {
    manual: `Examples:
  pnpm screenshot                           # Screenshot theme page
  pnpm screenshot button                    # Screenshot button component
  pnpm screenshot theme theme-dark.png --dark
  pnpm screenshot stories --all-viewports
  pnpm screenshot --port 3000               # Use custom port`,

    auto: `Examples:
  pnpm screenshot:auto                    # Screenshot theme page
  pnpm screenshot:auto button --dark      # Screenshot button in dark mode
  pnpm screenshot:auto --all-viewports    # All viewports of theme page
  pnpm screenshot:auto stories --mobile   # Mobile view of stories
  pnpm screenshot:auto --port 8080        # Use custom port`,
  },
};
