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

function writeRulesSet(out: Buffer, key: string, rules: CSSRuleObject[], indent: string = '  ', newLine: string = '\n', prefix: string = '') {
  const nextPrefix = `${prefix}${indent}`;

  out.write(`${prefix}${key} {${newLine}`);
  for (const [i, entry] of rules.entries()) {
    out.write(formatCSSRuleObjects(entry, indent, newLine, nextPrefix));
    out.write(newLine);
    if (i < rules.length - 1) {
      out.write(newLine);
    }
  }
  out.write(`${prefix}}${newLine}`);
}

function writeUtilities(out: Buffer, u: CSSRuleObject, indent: string = '  ', newLine: string = '\n', prefix: string = '') {
  const utilities: CSSRuleObject = {};
  for (const [name, value] of Object.entries(u)) {
    utilities[`@utility ${name}`] = value;
  }

  out.write(formatCSSRuleObjects(utilities, indent, newLine, prefix));
  out.write(newLine);
}

export function writeTheme(
  theme: Theme,
  out: Buffer,
  darkMode: DarkModeStrategy = 'class',
  indent: string = '  ',
  newLine: string = '\n',
) {
  const { extendColors = false } = theme.options;

  const bases = makeThemeBases(theme, darkMode);
  const themeColorRules = themeColors(theme.colors, extendColors);
  const components = makeThemeComponents(theme);

  // bases
  writeRulesSet(out, '@layer base', bases, indent, newLine);
  out.write(newLine);

  // theme
  writeRulesSet(out, '@theme', themeColorRules, indent, newLine);
  out.write(newLine);

  // components
  for (const [i, entry] of components.entries()) {
    writeUtilities(out, entry, indent, newLine);

    if (i < components.length - 1) {
      out.write(newLine);
    }
  }
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
