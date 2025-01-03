import {
  type KebabCase,

  kebabCase,
} from './utils';

import {
  type Color,
  Hct,

  hct,
} from './core';

import {
  type StandardDynamicSchemeKey,
  type CustomDynamicColorKey,

  customDynamicColors,
  standardDynamicColorKeys,
  StandardDynamicColorKey,
  standardDynamicSchemes,
  standardPaletteKeys,
  StandardPaletteKey,
} from './dynamic-color-data';

import {
  type ColorOptions,

  makeCustomColors,
  makeStandardColorsFromScheme,
  makeStandardPaletteFromScheme,
} from './dynamic-color';

/** flattens ThemeColorOptions or ThemeColors */
function flattenPartialColorOptions(c?: Color | ColorOptions | Partial<ColorOptions>): Partial<ColorOptions> {
  if (c === undefined) {
    return {};
  } else if (c instanceof Hct || typeof c !== 'object') {
    return { value: c };
  } else {
    return c;
  }
}

/** flattens ThemeColors */
function flattenColorOptions(c: Color | ColorOptions): ColorOptions {
  return c instanceof Hct || typeof c !== 'object' ? { value: c } : c;
}

/**
 * ThemeColorOptions defines the colors of the theme but without requiring any particular option
 */
export type ThemeColorOptions<K extends string> = { primary: Partial<ColorOptions> } & Record<K, Partial<ColorOptions>>;

/**
 * ThemeColors describes colors used to build the theme.
 */
export type ThemeColors<K extends string> = { primary: Color | ColorOptions } & Record<K, Color | ColorOptions>;

/**
 * FlatThemeColors defines the colors of the theme
 */
export type FlatThemeColors<K extends string> = { primary: ColorOptions } & Record<K, ColorOptions>;

/** flattens a ThemeColorOptions */
export function flattenPartialThemeColors<K extends string>(colors: ThemeColorOptions<K> | ThemeColors<K>) {
  const out = {} as Record<keyof typeof colors, Partial<ColorOptions>>;
  const keys = Object.keys(colors) as Array<keyof typeof colors>;

  for (const c of keys) {
    out[c] = flattenPartialColorOptions(colors[c]);
  }

  return out;
}

/** flattens a ThemeColors */
export function flattenThemeColors<K extends string>(colors: ThemeColors<K>) {
  const out = {} as Record<keyof typeof colors, ColorOptions>;
  const keys = Object.keys(colors) as Array<keyof typeof colors>;

  for (const c of keys) {
    out[c] = flattenColorOptions(colors[c]);
  }

  return out;
}

/**
 * makeThemeKeys returns the keys of makeTheme makes without calculating
 * the values.
 */
export function makeThemeKeys<K extends string>(colors: ThemeColorOptions<K> | ThemeColors<K>) {
  type PaletteKey = StandardPaletteKey | KebabCase<K>;
  type ColorKey = PaletteKey | StandardDynamicColorKey | CustomDynamicColorKey<KebabCase<K>>;

  const configOptions = {} as Record<PaletteKey, Partial<ColorOptions>>;
  const paletteKeys: PaletteKey[] = [...standardPaletteKeys];
  const keys: ColorKey[] = [...standardDynamicColorKeys];

  const $colors = Object.keys(colors) as Array<keyof typeof colors>;
  for (const name of $colors) {
    const kebabName = kebabCase(name) as KebabCase<K>;

    // preserve config
    configOptions[kebabName] = flattenPartialColorOptions(colors[name]);

    if (!(kebabName in keys)) {
      // custom color
      paletteKeys.push(kebabName);
      for (const pattern in customDynamicColors) {
        keys.push(pattern.replace('{}', kebabName) as CustomDynamicColorKey<KebabCase<K>>);
      }
    }
  }

  // additional standard palette colors
  for (const name of standardPaletteKeys) {
    if (!(name in keys)) {
      keys.push(name);
    }
    if (!(name in configOptions)) {
      configOptions[name] = {};
    }
  }

  return {
    keys,
    paletteKeys,
    configOptions,
  };
}
/**
 * @param colors - base colors of the theme.
 * @param scheme - Material color scheme to use.
 * @param contrastLevel - contrast level from -1 (minimum) to 1 (maximum). 0 represents standard.
 * @returns dark and light themes.
 */
export function makeTheme<K extends string>(colors: ThemeColors<K>,
  scheme: StandardDynamicSchemeKey = 'content',
  contrastLevel: number = 0,
) {
  const { primary, ...extraColors } = flattenThemeColors(colors);
  const source = hct(primary.value);

  const schemeFactory = standardDynamicSchemes[scheme] || standardDynamicSchemes.content;
  const darkScheme = schemeFactory(source, true, contrastLevel);
  const lightScheme = schemeFactory(source, false, contrastLevel);

  const darkPalette = makeStandardPaletteFromScheme(darkScheme);
  const lightPalette = makeStandardPaletteFromScheme(lightScheme);
  const darkStandardColors = makeStandardColorsFromScheme(darkScheme);
  const lightStandardColors = makeStandardColorsFromScheme(lightScheme);

  const { colors: customPaletteKeys, dark: darkCustomColors, light: lightCustomColors } = makeCustomColors(source, extraColors);

  type ColorKey = keyof typeof darkPalette & keyof typeof darkStandardColors & keyof typeof darkCustomColors;
  type PaletteKey = keyof typeof darkPalette & typeof customPaletteKeys[0];

  const dark: { [P in ColorKey]: Hct } = {
    ...darkPalette,
    ...darkStandardColors,
    ...darkCustomColors,
  };

  const light: { [P in ColorKey]: Hct } = {
    ...lightPalette,
    ...lightStandardColors,
    ...lightCustomColors,
  };

  const darkCustomPalette: Record<string, Hct> = {
    ...darkPalette,
  };

  const lightCustomPalette: Record<string, Hct> = {
    ...lightPalette,
  };

  for (const k of customPaletteKeys) {
    darkCustomPalette[k] = darkCustomColors[k as keyof typeof darkCustomColors];
    lightCustomPalette[k] = lightCustomColors[k as keyof typeof lightCustomColors];
  }

  return {
    source,
    darkScheme,
    lightScheme,
    darkPalette: darkCustomPalette as { [P in PaletteKey]: Hct },
    lightPalette: lightCustomPalette as { [P in PaletteKey]: Hct },
    dark,
    light,
  };
}
