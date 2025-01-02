import {
  type Color,
  type ColorMap,
  hct,
  Hct,
} from './core';

import {
  type StandardDynamicSchemeKey,

  standardDynamicSchemes,
} from './dynamic-color-data';

import {
  type ColorOptions,

  makeCustomColors,
  makeStandardColorsFromScheme,
} from './dynamic-color';

/**
 * ThemeColors describes colors used to build the theme.
 */
export type ThemeColors<K extends string> = { primary: Color | ColorOptions } & Record<K, Color | ColorOptions>;

export type FlatThemeColors<K extends string> = { primary: ColorOptions } & Record<K, ColorOptions>;

function flattenColorOptions(c: Color | ColorOptions): ColorOptions {
  if (c instanceof Hct) {
    return { value: c };
  }
  if (typeof c !== 'object') {
    return { value: hct(c) };
  }
  return c;
}

export function flattenThemeColors<K extends string>(colors: ThemeColors<K>) {
  const out = {} as Record<string, ColorOptions>;

  for (const [name, value] of Object.entries(colors)) {
    out[name] = flattenColorOptions(value);
  }

  return out as FlatThemeColors<K>;
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
  const source = primary.value as Hct;

  const schemeFactory = standardDynamicSchemes[scheme] || standardDynamicSchemes.content;
  const darkScheme = schemeFactory(source, true, contrastLevel);
  const lightScheme = schemeFactory(source, false, contrastLevel);

  const { dark: darkCustomColors, light: lightCustomColors } = makeCustomColors(source, extraColors);
  const darkStandardColors = makeStandardColorsFromScheme(darkScheme);
  const lightStandardColors = makeStandardColorsFromScheme(lightScheme);

  type N = keyof typeof darkStandardColors & keyof typeof darkCustomColors;

  const dark: ColorMap<N> = {
    ...darkStandardColors,
    ...darkCustomColors,
  };

  const light: ColorMap<N> = {
    ...lightStandardColors,
    ...lightCustomColors,
  };

  return {
    source,
    darkScheme,
    lightScheme,
    dark,
    light,
  };
}
