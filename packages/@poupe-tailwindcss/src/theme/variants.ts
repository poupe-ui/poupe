import {
  processCSSSelectors,
  type CSSRuleObject,
} from '@poupe/css';

import {
  type Config,
} from '../utils/plugin';

import {
  type Theme,
} from './types';

export type DarkModeStrategy = Exclude<Config['darkMode'], undefined>;

export function makeThemeVariants(
  theme: Readonly<Theme>,
  darkMode: DarkModeStrategy = 'class',
): CSSRuleObject[] {
  const {
    disablePrintMode = false,
  } = theme.options;

  const dark = makeDark(darkMode);

  if (disablePrintMode) {
    return [
      {
        dark,
      },
    ];
  }

  const variants: CSSRuleObject[] = [
    {
      ...makePrintVariants(),
      dark: makeDarkNotPrint(dark),
    },
  ];

  return variants;
}

function makeDark(strategy: DarkModeStrategy = 'class'): CSSRuleObject {
  const darkSelector = getDarkMode(strategy).map(s => `&:where(${s})`);
  const out: CSSRuleObject = {};
  let p = out;

  for (const selector of darkSelector) {
    p[selector] = {};
    p = p[selector];
  }
  p['@slot'] = {};

  return out;
}

function makeDarkNotPrint(dark?: CSSRuleObject): CSSRuleObject {
  return {
    '@media not print': dark || makeDark(),
  };
}

function makePrintVariants(): CSSRuleObject {
  return {
    print: {
      '@media print': {
        '@slot': {},
      },
    },
    screen: {
      '@media screen': {
        '@slot': {},
      },
    },
  };
}

/**
 * Converts a Tailwind dark mode strategy into the corresponding CSS selector or media query string.
 * @param darkMode - The dark mode strategy to convert
 * @returns A string representation for use in CSS selectors or media queries
 */
export function getDarkMode(darkMode: DarkModeStrategy = 'class'): string[] {
  switch (darkMode) {
    case false:
      return [];
    case 'media':
      return ['@media (prefers-color-scheme: dark)'];
    case 'class':
    case 'selector':
      return [defaultDarkSelector];
    default: {
      if (Array.isArray(darkMode) && darkMode.length > 0) {
        const [mode, value] = darkMode;
        switch (mode) {
          case 'class':
          case 'selector':
            return processCSSSelectors(value) ?? [defaultDarkSelector];
        }

        // TODO: variant modes
      }

      throw new Error(`Invalid darkMode strategy: ${JSON.stringify(darkMode)}.`);
    }
  }
}

const defaultDarkSelector = '.dark, .dark *';
