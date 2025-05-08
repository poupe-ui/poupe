import {
  type Theme,
  type ThemeOptions,
  type ThemeColorConfig,
  defaultThemePrefix,
} from './types';

import {
  type DarkModeStrategy,
  unsafeKeys,
  getDarkMode,
  hexString,
  hslString,
  debugLog,
} from './utils';

import {
  flattenColorOptions,
} from './options';

import {
  type CSSRuleObject,
  type ColorMap,
  type ThemeColors as ThemeBuilderColors,
  Hct,
  assembleCSSColors,
  makeTheme as makeThemeColors,
  makeThemeKeys,
} from '@poupe/theme-builder';

import {
  type Shades,
  getShades,
  makeShades,
} from './shades';

export {
  type Theme,
} from './types';

export {
  makeThemeComponents,
} from './components';

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

export function makeThemeBases(
  theme: Readonly<Theme>,
  darkMode: DarkModeStrategy = 'class',
): CSSRuleObject[] {
  if (theme.options.debug) {
    debugLog(true, 'makeThemeBases', `darkMode:${darkMode}`, {
      ...theme,
      dark: theme.dark ? Object.fromEntries(Object.entries(theme.dark).map(([k, v]) => [k, hexString(v)])) : undefined,
      light: theme.light ? Object.fromEntries(Object.entries(theme.light).map(([k, v]) => [k, hexString(v)])) : undefined,
    });
  }

  const bases: CSSRuleObject[] = [];

  if (theme.dark && theme.light) {
    const { styles } = assembleCSSColors<string>(
      theme.dark,
      theme.light as typeof theme.dark,
      {
        darkMode: getDarkMode(darkMode),
        lightMode: false,
        prefix: theme.options.themePrefix,
        darkSuffix: theme.options.darkSuffix,
        lightSuffix: theme.options.lightSuffix,
        stringify: hslString,
      },
    );
    bases.push(...styles);
  }

  return bases;
}
