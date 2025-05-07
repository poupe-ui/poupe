import { type Config } from './plugin';

export { type Config } from './plugin';

export type DarkModeStrategy = Exclude<Config['darkMode'], undefined>;

/**
 * Converts a Tailwind dark mode strategy into the corresponding CSS selector or media query string.
 * @param darkMode - The dark mode strategy to convert
 * @returns A string representation for use in CSS selectors or media queries
 */
export function getDarkMode(darkMode: DarkModeStrategy = 'class'): string {
  switch (darkMode) {
    case false:
      return '';
    case 'media':
      return 'media';
    case 'class':
      return '.dark';
    default: {
      if (Array.isArray(darkMode) && darkMode.length > 0) {
        const [mode, value] = darkMode;
        if (mode === 'class') {
          return value || '.dark';
        }
        // TODO: implement selector and variant modes
      }

      throw new Error(`Invalid darkMode strategy: ${JSON.stringify(darkMode)}.`);
    }
  }
}
