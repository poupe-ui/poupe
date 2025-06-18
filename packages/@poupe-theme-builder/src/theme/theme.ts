import type { KebabCase } from 'type-fest';

import {
  kebabCase,
  pairs,
  unsafeKeys,
} from '@poupe/css';

import {
  DynamicScheme,
  Hct,
  TonalPalette,
} from '../core';

import {
  type StandardDynamicColors,
  makeCustomColorsFromPalettes,
  makeDynamicScheme,
  makeStandardColorsFromScheme,
  makeStandardPaletteFromScheme,
  makeStandardPaletteKeyColorsFromScheme,
} from './colors';

import {
  makeStandardStateVariants,
  makeCustomStateVariants,
} from './states';

import {
  type CustomDynamicColorKey,
  type StandardDynamicSchemeKey,
  type StandardDynamicColorKey,
  type StandardPaletteKey,

  customDynamicColors,
  standardDynamicColorKeys,
  standardDynamicSchemes,
  standardPaletteKeys,
} from './data';

import {
  flattenPartialColorOptions,
  makeThemePalettes,
} from './palettes';

import {
  type ColorOptions,
  type ThemeColors,
  type ThemeGenerationOptions,
} from './types';

import {
  isNonEmpty,
} from './utils';

/**
 * FlatThemeColors defines the colors of the theme
 */
export type FlatThemeColors<K extends string> = { primary: ColorOptions } & Record<K, ColorOptions>;

/**
 * makeThemeKeys returns the keys of makeTheme makes without calculating
 * the values.
 */
export function makeThemeKeys<K extends string>(colors: Partial<ThemeColors<K>>) {
  type PaletteKey = KebabCase<StandardPaletteKey> | KebabCase<K>;
  type ColorKey = PaletteKey | StandardDynamicColorKey | CustomDynamicColorKey<KebabCase<K>>;

  const colorOptions = {} as Record<PaletteKey, Partial<ColorOptions>>;
  const kebabStandardPaletteKeys = standardPaletteKeys.map(s => kebabCase(s)) as PaletteKey[];
  const paletteKeys = [...kebabStandardPaletteKeys];
  const keys: ColorKey[] = [...standardDynamicColorKeys];

  for (const name of unsafeKeys(colors)) {
    const kebabName = kebabCase(name) as KebabCase<K>;

    // preserve config
    colorOptions[kebabName] = flattenPartialColorOptions(colors[name]);

    if (!keys.includes(kebabName)) {
      // custom color
      paletteKeys.push(kebabName);
      for (const pattern in customDynamicColors) {
        keys.push(pattern.replace('{}', kebabName) as CustomDynamicColorKey<KebabCase<K>>);
      }
    }
  }

  // additional standard palette colors
  for (const kebabName of kebabStandardPaletteKeys) {
    if (!keys.includes(kebabName)) {
      keys.push(kebabName);
    }
    if (!(kebabName in colorOptions)) {
      colorOptions[kebabName] = {};
    }
  }

  return {
    keys,
    paletteKeys,
    colorOptions,
  };
}

/**
 * @param colors - base colors of the theme.
 * @param scheme - Material color scheme to use.
 * @param contrastLevel - contrast level from -1 (minimum) to 1 (maximum). 0 represents standard.
 * @param extraOptions - Additional theme generation options.
 * @returns dark and light themes.
 */
export function makeTheme<K extends string>(
  colors: ThemeColors<K>,
  scheme: StandardDynamicSchemeKey = 'content',
  contrastLevel: number = 0,
  extraOptions?: Partial<ThemeGenerationOptions>,
) {
  const options: ThemeGenerationOptions = {
    scheme,
    contrastLevel,
    useColorMix: false,
    ...extraOptions,
  };

  return makeThemeWithOptions(colors, options);
}

function makeThemeWithOptions<K extends string>(
  colors: ThemeColors<K>,
  options: ThemeGenerationOptions,
) {
  const { source, corePalettes, extraPalettes, colors: colorOptions } = makeThemePalettes(colors);
  const { contrastLevel = 0, scheme = 'content' } = options;

  const variant = standardDynamicSchemes[scheme] || standardDynamicSchemes.content;
  const darkScheme = makeDynamicScheme(source, variant, contrastLevel, true, corePalettes);
  const lightScheme = makeDynamicScheme(source, variant, contrastLevel, false, corePalettes);

  const baseResult = {
    source,
    colorOptions,
    darkScheme,
    lightScheme,
    extraPalettes,
    ...makeThemeFromSchemes(darkScheme, lightScheme, extraPalettes),
  };

  if (options.useColorMix) {
    return baseResult;
  }

  // Generate state colors
  const { dark, light } = baseResult;
  const darkStateColors = makeStandardStateVariants(dark as StandardDynamicColors);
  const lightStateColors = makeStandardStateVariants(light as StandardDynamicColors);

  // Add custom state colors if there are extra palettes
  const darkCustomStateColors = isNonEmpty(extraPalettes) ? makeCustomStateVariants(baseResult.dark) : {};
  const lightCustomStateColors = isNonEmpty(extraPalettes) ? makeCustomStateVariants(baseResult.light) : {};

  return {
    ...baseResult,
    dark: {
      ...dark,
      ...darkStateColors,
      ...darkCustomStateColors,
    },
    light: {
      ...light,
      ...lightStateColors,
      ...lightCustomStateColors,
    },
  };
}

export function makeThemeFromSchemes<K extends string>(
  darkScheme: DynamicScheme,
  lightScheme: DynamicScheme,
  extraPalettes?: Record<K, TonalPalette>,
) {
  const {
    palettes: darkPalettes,
    keyColors: darkKeyColors,
    colors: darkStandardColors,
  } = cookThemeScheme(darkScheme);

  const {
    palettes: lightPalettes,
    keyColors: lightKeyColors,
    colors: lightStandardColors,
  } = cookThemeScheme(lightScheme);

  const {
    dark: darkCustomColors,
    light: lightCustomColors,
    keyColors: extraKeyColors,
  } = cookThemeCustomColors(extraPalettes);

  type ColorKey = keyof typeof darkKeyColors & keyof typeof darkStandardColors & keyof typeof darkCustomColors;
  type ThemeKeyColor = keyof typeof darkKeyColors & keyof typeof extraPalettes;

  const dark: { [P in ColorKey]: Hct } = {
    ...darkKeyColors,
    ...darkStandardColors,
    ...darkCustomColors,
  };

  const light: { [P in ColorKey]: Hct } = {
    ...lightKeyColors,
    ...lightStandardColors,
    ...lightCustomColors,
  };

  const $darkKeyColors: { [P in ThemeKeyColor]: Hct } = {
    ...darkKeyColors,
    ...extraKeyColors,
  };

  const $lightKeyColors: { [P in ThemeKeyColor]: Hct } = {
    ...lightKeyColors,
    ...extraKeyColors,
  };

  const $darkPalettes: { [P in ThemeKeyColor]: TonalPalette } = {
    ...darkPalettes,
    ...extraPalettes,
  };

  const $lightPalettes: { [P in ThemeKeyColor]: TonalPalette } = {
    ...lightPalettes,
    ...extraPalettes,
  };

  return {
    darkKeyColors: $darkKeyColors,
    lightKeyColors: $lightKeyColors,
    darkPalettes: $darkPalettes,
    lightPalettes: $lightPalettes,
    dark,
    light,
  };
}

function cookThemeScheme(scheme: DynamicScheme) {
  return {
    palettes: makeStandardPaletteFromScheme(scheme),
    keyColors: makeStandardPaletteKeyColorsFromScheme(scheme),
    colors: makeStandardColorsFromScheme(scheme),
  };
}

function cookThemeCustomColors<K extends string>(palettes?: Record<K, TonalPalette>) {
  const { dark, light, palettes: tones } = makeCustomColorsFromPalettes(palettes);
  const keyColors = {} as Record<keyof typeof tones, Hct>;

  for (const [name, palette] of pairs(tones)) {
    keyColors[name] = palette.keyColor;
  }

  return {
    dark,
    light,
    keyColors,
  };
}
