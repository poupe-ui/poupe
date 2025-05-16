import {
  type CSSRules,
  formatCSSRulesArray,
  interleavedRules,
  keys,
  renameRules,
} from '@poupe/css';

import {
  defaultPersistentColors,
} from './config';

import {
  makeThemeBases,
  makeThemeComponents,
} from './theme';

import {
  type Theme,
  type ThemeColorConfig,
  Hct,
} from './types';

import {
  type DarkModeStrategy,
  makeThemeVariants,
} from './variants';

/**
 * Converts a CSS selector name to a utility format.
 *
 * @param name - The original selector name to be transformed
 * @returns A string representing the selector in the utility format
 *
 * @example
 * ```
 * // Input: '.button'
 * // Output: '@utility button'
 * // Input: 'hover'
 * // Output: '@utility hover'
 * ```
 */
const utilityName = (name: string) => `@utility ${name.startsWith('.') ? name.slice(1) : name}`;

/**
 * Converts a variant name to a custom variant format.
 *
 * @param name - The original variant name to be transformed
 * @returns A string representing the variant in the custom variant format
 *
 * @example
 * ```
 * // Input: 'hover'
 * // Output: '@custom-variant hover'
 * ```
 */
const variantName = (name: string) => `@custom-variant ${name}`;

/**
 * Processes component CSS rules by converting them to utility format.
 *
 * @param components - An array of component CSS rule objects to be processed
 * @returns An array of CSS rule objects converted to utility format
 *
 * @example
 * ```
 * // Input: [{ '.button': { color: 'blue' } }]
 * // Output: [{ '@utility button': { color: 'blue' } }]
 * ```
 */
const prepareComponents = (components: Record<string, CSSRules>[]): CSSRules[] => components.map(group => renameRules(group, utilityName));

/**
 * Transforms an array of variant CSS rules by converting their selectors to custom variant format.
 *
 * @param variants - An array of CSS rule objects representing variants
 * @returns An array of CSS rule objects with selectors renamed to custom variant format
 *
 * @example
 * ```
 * // Input: [{ '.hover': { color: 'blue' } }]
 * // Output: [{ '@custom-variant hover': { color: 'blue' } }]
 * ```
 */
const prepareVariants = (variants: CSSRules[]): CSSRules[] => variants.map(group => renameRules(group, variantName));

/**
 * Formats a theme configuration into a series of CSS rules and utilities.
 *
 * @param theme - The theme configuration object to be processed
 * @param darkMode - Strategy for handling dark mode, defaults to 'class'
 * @param indent - Indentation string for formatting, defaults to two spaces
 * @param stringify - Optional function to convert Hct color values to string format. defaults to `rgb()`
 * @returns An array of formatted CSS rule strings
 */
export function formatTheme(
  theme: Theme,
  darkMode: DarkModeStrategy = 'class',
  indent: string = '  ',
  stringify?: (value: Hct) => string,
): string[] {
  const { extendColors = false } = theme.options;

  const variants = makeThemeVariants(theme, darkMode);
  const bases = makeThemeBases(theme, darkMode, stringify);
  const themeColorRules = themeColors(theme.colors, extendColors);
  const components = makeThemeComponents(theme);

  const rules: CSSRules[] = [
    ...prepareVariants(variants),
    // bases
    ...(bases.length > 0 ? [{ '@layer base': bases }] : []),
    // theme
    {
      '@theme': interleavedRules(themeColorRules),
    },
    // components
    ...prepareComponents(components),
  ];

  return formatCSSRulesArray(interleavedRules(rules), {
    indent,
  });
}

/**
 * Generates CSS custom property rules for theme colors.
 *
 * @param colors - Record of theme color configurations
 * @param extendColors - Whether to extend existing colors or reset them, defaults to false
 * @param persistentColors - Record of persistent colors that should be preserved if not overridden
 * @returns An array of CSS rule objects for the theme colors
 */
export function themeColors(
  colors: Record<string, ThemeColorConfig>,
  extendColors: boolean = false,
  persistentColors: Record<string, string> = defaultPersistentColors,
): CSSRules[] {
  const rules: CSSRules[] = [];

  if (!extendColors) {
    // reset
    rules.push({ '--color-*': 'initial' });

    // persistent colors not customized
    const colorRules: CSSRules = {};
    for (const key of [...keys(persistentColors)].sort((a, b) => a.localeCompare(b))) {
      if (!(key in colors)) {
        colorRules[`--color-${key}`] = persistentColors[key];
      }
    }
    rules.push(colorRules);
  }

  // theme colors
  const themeColors: CSSRules = {};
  for (const key of [...keys(colors)].sort((a, b) => a.localeCompare(b))) {
    const c = colors[key];
    themeColors[`--color-${key}`] = `var(${c.value})`;
    if (c.shades) {
      // shades
      for (const shade of [...keys(c.shades)].sort((a: number, b: number) => a - b)) {
        themeColors[`--color-${key}-${shade}`] = `var(${c.shades[shade]})`;
      }
    }
  }
  rules.push(themeColors);
  return rules;
}
