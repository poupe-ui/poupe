import {
  type Theme,
  type ThemeColorConfig,
} from './types';

import {
  type CSSRuleObject,
  type DarkModeStrategy,
  formatCSSRuleObjects,
  unsafeKeys,
} from './utils';

import {
  makeThemeBases,
  makeThemeComponents,
} from './theme';

import {
  defaultPersistentColors,
} from './config';

function formatRulesSet(key: string, rules: CSSRuleObject[], indent: string = '  ', newLine: string = '\n', prefix: string = ''): string[] {
  const nextPrefix = `${prefix}${indent}`;

  const out: string[] = [
    `${prefix}${key} {${newLine}`,
  ];

  for (const [i, entry] of rules.entries()) {
    out.push(
      formatCSSRuleObjects(entry, indent, newLine, nextPrefix),
      newLine,

      // blank line between rules
      (i < rules.length - 1) ? newLine : '',
    );
  }

  out.push(`${prefix}}${newLine}`);
  return out;
}

function formatUtilities(u: CSSRuleObject, indent: string = '  ', newLine: string = '\n', prefix: string = ''): string[] {
  const utilities: CSSRuleObject = {};
  for (const [name, value] of Object.entries(u)) {
    utilities[`@utility ${name}`] = value;
  }

  return [
    formatCSSRuleObjects(utilities, indent, newLine, prefix),
    newLine,
  ];
}

/**
 * Writes a formatted theme to a buffer.
 *
 * @param theme - The theme configuration to be written
 * @param out - The buffer to write the formatted theme into
 * @param darkMode - Strategy for handling dark mode, defaults to 'class'
 * @param indent - Indentation string for formatting, defaults to two spaces
 * @param newLine - Newline character for formatting, defaults to LF
 * @returns The number of bytes written to the buffer
 */
export function writeTheme(
  theme: Theme,
  out: Buffer,
  darkMode: DarkModeStrategy = 'class',
  indent: string = '  ',
  newLine: string = '\n',
) {
  const chunks = formatTheme(theme, darkMode, indent, newLine);
  return out.write(chunks.join(''));
}

/**
 * Formats a theme configuration into a series of CSS rules and utilities.
 *
 * @param theme - The theme configuration object to be processed
 * @param darkMode - Strategy for handling dark mode, defaults to 'class'
 * @param indent - Indentation string for formatting, defaults to two spaces
 * @param newLine - Newline character for formatting, defaults to LF
 * @returns An array of formatted CSS rule strings
 */
export function formatTheme(
  theme: Theme,
  darkMode: DarkModeStrategy = 'class',
  indent: string = '  ',
  newLine: string = '\n',
): string[] {
  const { extendColors = false } = theme.options;

  const out: string[] = [];
  const bases = makeThemeBases(theme, darkMode);
  const themeColorRules = themeColors(theme.colors, extendColors);
  const components = makeThemeComponents(theme);

  // bases
  if (bases.length > 0) {
    out.push(
      ...formatRulesSet('@layer base', bases, indent, newLine),
      newLine,
    );
  }

  // theme colors
  out.push(
    ...formatRulesSet('@theme', themeColorRules, indent, newLine),
    newLine,
  );

  // components
  for (const [i, entry] of components.entries()) {
    out.push(
      ...formatUtilities(entry, indent, newLine),

      // blank line between groups
      (i < components.length - 1) ? newLine : '',
    );
  }

  return out;
}

export function themeColors(
  colors: Record<string, ThemeColorConfig>,
  extendColors: boolean = false,
  persistentColors: Record<string, string> = defaultPersistentColors,
): CSSRuleObject[] {
  const rules: CSSRuleObject[] = [];

  if (!extendColors) {
    const out: CSSRuleObject = {};

    // reset
    rules.push({ '--color-*': 'initial' });

    // persistent colors not customized
    for (const key of unsafeKeys(persistentColors).sort((a, b) => a.localeCompare(b))) {
      if (!(key in colors)) {
        out[`--color-${key}`] = persistentColors[key];
      }
    }
    rules.push(out);
  }

  // custom colors
  const out: CSSRuleObject = {};
  for (const key of unsafeKeys(colors).sort((a, b) => a.localeCompare(b))) {
    const c = colors[key];
    out[`--color-${key}`] = `var(${c.value})`;
    if (c.shades) {
      // shades
      for (const shade of unsafeKeys(c.shades).sort((a, b) => a - b)) {
        out[`--color-${key}-${shade}`] = `var(${c.shades[shade]})`;
      }
    }
  }
  rules.push(out);
  return rules;
}
