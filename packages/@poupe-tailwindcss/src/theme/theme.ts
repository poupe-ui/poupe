/* imports */
import {
  type CSSRuleObject,
  getDeepRule,
  setDeepRule,
} from '@poupe/css';

import {
  type ColorMap,
  type ThemeColors as ThemeBuilderColors,
  assembleCSSColors,
  Hct,
  makeTheme as makeThemeColors,
  makeThemeKeys,
  rgba,
} from '@poupe/theme-builder';

import {
  flattenColorOptions,
} from './options';

import {
  type Shades,
  getShades,
  makeShades,
} from './shades';

import {
  type Theme,
  type ThemeColorConfig,
  type ThemeOptions,
  defaultThemePrefix,
} from './types';

import {
  debugLog,
  hexString,
  hslString,
  unsafeKeys,
} from './utils';

import {
  type DarkModeStrategy,
  getDarkMode,
} from './variants';

/* re-exports */
export {
  makeThemeComponents,
} from './components';

export {
  type Theme,
} from './types';

/**
 * Creates a theme configuration based on the provided theme options.
 *
 * @param options - Theme configuration options
 * @returns A fully configured theme object with color palettes for dark and light modes
 *
 * @remarks
 * This function supports two theme generation modes:
 * - When `omitTheme` is true, it generates a theme with minimal configuration
 * - When `omitTheme` is false (default), it generates a full theme with dark and light color palettes
 */
export function makeTheme<K extends string>(options: ThemeOptions<K>) {
  debugLog(options.debug, 'makeTheme', options);

  const $colors = options.colors as ThemeBuilderColors<K>;
  const { omitTheme = false } = options;

  if (omitTheme) {
    const { keys, paletteKeys } = makeThemeKeys($colors);

    return newTheme<K, typeof paletteKeys[number], typeof keys[number]>(options, paletteKeys, keys);
  }

  const {
    dark,
    light,
    darkPalette,
  } = makeThemeColors($colors, options.scheme, options.contrastLevel);

  const keys = unsafeKeys(dark);
  const paletteKeys = unsafeKeys(darkPalette);

  return newTheme<K, typeof paletteKeys[number], typeof keys[number]>(options, paletteKeys, keys, dark, light);
}

function newTheme<
  K0 extends string,
  K1 extends string,
  K2 extends string,
>(
  options: ThemeOptions<K0>,
  paletteKeys: K1[],
  keys: K2[],
  dark?: Record<K2, Hct>,
  light?: Record<K2, Hct>,
): Theme {
  const darkColors: ColorMap<string> | undefined = dark ? {} as ColorMap<string> : undefined;
  const lightColors: ColorMap<string> | undefined = light ? {} as ColorMap<string> : undefined;
  const colors: Record<K2, ThemeColorConfig> = {} as Record<K2, ThemeColorConfig>;

  const { themePrefix = defaultThemePrefix } = options;
  const defaultShades = options.shades;

  // iterate over palette colors that might have custom shades
  for (const k0 of unsafeKeys(options.colors)) {
    const color = flattenColorOptions(options.colors[k0]);
    const { shades } = getShades(color?.shades, defaultShades);

    setColor(k0 as K2, themePrefix, shades, colors, darkColors, lightColors, dark, light);
  }

  // rest of the palette keys take the default shades
  for (const key of paletteKeys as unknown[] as K2[]) {
    if (key in colors) continue;

    setColor(key, themePrefix, defaultShades, colors, darkColors, lightColors, dark, light);
  }

  // and the rest have no shades
  for (const key of keys) {
    if (key in colors) continue;

    setColor(key, themePrefix, false, colors, darkColors, lightColors, dark, light);
  }

  return {
    options,
    keys,
    paletteKeys,
    dark: darkColors,
    light: lightColors,
    colors,
  };
}

function setColor<K extends string>(
  key: K,
  prefix: string,
  shades: Shades,
  colors: Record<K, ThemeColorConfig>,
  darkColors: ColorMap<string> | undefined,
  lightColors: ColorMap<string> | undefined,
  dark: Record<K, Hct> | undefined,
  light: Record<K, Hct> | undefined,
) {
  if (dark && darkColors) {
    for (const [k, v] of newThemeColorHct(key, dark[key], shades)) {
      darkColors[k] = v;
    }
  }

  if (light && lightColors) {
    for (const [k, v] of newThemeColorHct(key, light[key], shades)) {
      lightColors[k] = v;
    }
  }

  colors[key] = newThemeColorConfig(key, shades, prefix);
}

function newThemeColorHct(key: string, value: Hct, shades: Shades): [string, Hct][] {
  const out: [string, Hct][] = [
    [key, value],
  ];

  if (shades) {
    const shadesMap = makeShades(value, shades);
    for (const shade of shades) {
      out.push([`${key}-${shade}`, shadesMap[shade]]);
    }
  }

  return out;
}

function newThemeColorConfig(key: string, shades: Shades, prefix: string): ThemeColorConfig {
  const base = `--${prefix}${key}`;

  if (!shades) {
    return {
      value: base,
    };
  }

  return {
    value: base,
    shades: Object.fromEntries(shades.map(shade => [shade, `${base}-${shade}`])),
  };
}

/**
 * Finds the last style object in the array that contains a specific selector.
 * @param styles - Array of CSS rule objects to search
 * @param selector - Selector to find (string or array)
 * @returns The last matching style object, or undefined if none found
 */
function findLastStyleWithSelector(
  styles: CSSRuleObject[],
  selector: string | string[],
): CSSRuleObject | undefined {
  let lastMatch: CSSRuleObject | undefined;

  for (const style of styles) {
    if (getDeepRule(style, selector) !== undefined) {
      lastMatch = style;
    }
  }

  return lastMatch;
}

/**
 * Injects shadow RGB variables into existing CSS styles from assembleCSSColors().
 * Finds the appropriate style objects and extends them with shadow RGB definitions.
 * @param theme - Theme configuration with dark/light color maps
 * @param styles - Array of CSS rule objects to extend
 * @param darkSelector - Dark mode selector array
 */
function injectShadowRGBIntoStyles(
  theme: Readonly<Theme>,
  styles: CSSRuleObject[],
  darkSelector: string[],
): void {
  const { themePrefix } = theme.options;
  const shadowRGBVariable = `--${themePrefix}shadow-rgb`;
  const shadowColorKey = 'shadow';

  // Check if shadow colors exist in both dark and light themes
  const darkShadow = theme.dark?.[shadowColorKey];
  const lightShadow = theme.light?.[shadowColorKey];

  if (!darkShadow || !lightShadow) {
    return;
  }

  // Generate direct RGB values from Hct colors (rgba returns 0-255 integers)
  const lightRGBA = rgba(lightShadow);
  const darkRGBA = rgba(darkShadow);

  const lightRGB = `${lightRGBA.r} ${lightRGBA.g} ${lightRGBA.b}`;
  const darkRGB = `${darkRGBA.r} ${darkRGBA.g} ${darkRGBA.b}`;

  // Find and inject light mode shadow RGB into :root
  const rootStyle = findLastStyleWithSelector(styles, ':root');
  if (rootStyle) {
    setDeepRule(rootStyle, ':root', { [shadowRGBVariable]: lightRGB });
  }

  // Only inject dark mode shadow RGB if it differs from light mode
  if (lightRGB !== darkRGB) {
    const darkStyle = findLastStyleWithSelector(styles, darkSelector);
    if (darkStyle) {
      setDeepRule(darkStyle, darkSelector, { [shadowRGBVariable]: darkRGB });
    }
  }
}

/**
 * Generates CSS base styles for a theme with dark and light modes.
 * Includes CSS custom properties for all theme colors and the shadow RGB variable.
 *
 * @param theme - The theme configuration containing dark and light color modes
 * @param darkMode - Strategy for applying dark mode (defaults to 'class')
 * @param stringify - Optional function to convert HCT colors to string representation (defaults to HSL string)
 * @returns An array of CSS rule objects for theme base styles
 * @remarks
 * Automatically generates `--{prefix}shadow-rgb` variable:
 * - When dark/light themes exist: direct RGB values extracted from Hct colors
 * - When dark/light themes don't exist: CSS Level 4 fallback `from var(--{prefix}shadow) r g b`
 */
export function makeThemeBases(
  theme: Readonly<Theme>,
  darkMode: DarkModeStrategy = 'class',
  stringify?: (hct: Hct) => string,
): CSSRuleObject[] {
  if (theme.options.debug) {
    debugLog(true, 'makeThemeBases', `darkMode:${darkMode}`, {
      ...theme,
      dark: theme.dark ? Object.fromEntries(Object.entries(theme.dark).map(([k, v]) => [k, hexString(v)])) : undefined,
      light: theme.light ? Object.fromEntries(Object.entries(theme.light).map(([k, v]) => [k, hexString(v)])) : undefined,
    });
  }

  const bases: CSSRuleObject[] = [];
  const { themePrefix } = theme.options;

  if (theme.dark && theme.light) {
    const darkSelector = getDarkMode(darkMode);
    if (theme.options.disablePrintMode !== true) {
      darkSelector.unshift('@media not print');
    }

    const { styles } = assembleCSSColors<string>(
      theme.dark,
      theme.light as typeof theme.dark,
      {
        darkMode: darkSelector,
        lightMode: false,
        prefix: theme.options.themePrefix,
        darkSuffix: theme.options.darkSuffix,
        lightSuffix: theme.options.lightSuffix,
        stringify: stringify || hslString,
      },
    );

    // Inject shadow RGB variables into existing styles
    injectShadowRGBIntoStyles(theme, styles, darkSelector);

    bases.push(...styles);
  } else {
    // Add fallback for omitted themes
    const shadowVariable = `--${themePrefix}shadow`;
    const shadowRGBVariable = `--${themePrefix}shadow-rgb`;
    bases.push({
      ':root': {
        [shadowRGBVariable]: `var(${shadowRGBVariable}, from var(${shadowVariable}) r g b)`,
      },
    });
  }

  return bases;
}
