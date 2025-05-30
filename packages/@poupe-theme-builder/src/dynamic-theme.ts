import type { KebabCase } from 'type-fest';

import {
  kebabCase,
  unsafeKeys,
} from '@poupe/css';

import {
  Hct,
} from './core';

import {
  type ColorOptions,
  type CustomDynamicColorKey,
  type StandardDynamicSchemeKey,
  type StandardDynamicColorKey,
  type StandardPaletteKey,
  type ThemeColors,

  customDynamicColors,
  flattenPartialColorOptions,
  makeThemePalettes,
  standardDynamicColorKeys,
  standardDynamicSchemes,
  standardPaletteKeys,
} from './theme';

import {
  makeCustomColorsFromPalettes,
  makeDynamicScheme,
  makeStandardColorsFromScheme,
  makeStandardPaletteKeyColorsFromScheme,
} from './dynamic-color';

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

    if (!(kebabName in keys)) {
      // custom color
      paletteKeys.push(kebabName);
      for (const pattern in customDynamicColors) {
        keys.push(pattern.replace('{}', kebabName) as CustomDynamicColorKey<KebabCase<K>>);
      }
    }
  }

  // additional standard palette colors
  for (const name of kebabStandardPaletteKeys) {
    if (!(name in keys)) {
      keys.push(name);
    }
    if (!(name in colorOptions)) {
      colorOptions[name] = {};
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
 * @returns dark and light themes.
 */
export function makeTheme<K extends string>(colors: ThemeColors<K>,
  scheme: StandardDynamicSchemeKey = 'content',
  contrastLevel: number = 0,
) {
  const { source, corePalettes, extraPalettes, colors: colorOptions } = makeThemePalettes(colors);

  const variant = standardDynamicSchemes[scheme] || standardDynamicSchemes.content;

  const darkScheme = makeDynamicScheme(source, variant, contrastLevel, true, corePalettes);
  const lightScheme = makeDynamicScheme(source, variant, contrastLevel, false, corePalettes);

  const darkKeyColors = makeStandardPaletteKeyColorsFromScheme(darkScheme);
  const lightKeyColors = makeStandardPaletteKeyColorsFromScheme(lightScheme);
  const darkStandardColors = makeStandardColorsFromScheme(darkScheme);
  const lightStandardColors = makeStandardColorsFromScheme(lightScheme);

  const { colors: customPaletteKeys, dark: darkCustomColors, light: lightCustomColors } = makeCustomColorsFromPalettes(extraPalettes);

  type ColorKey = keyof typeof darkKeyColors & keyof typeof darkStandardColors & keyof typeof darkCustomColors;
  type ThemeKeyColor = keyof typeof darkKeyColors & typeof customPaletteKeys[0];

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

  const darkThemeKeyColors: Record<string, Hct> = {
    ...darkKeyColors,
  };

  const lightThemeKeyColors: Record<string, Hct> = {
    ...lightKeyColors,
  };

  for (const k of customPaletteKeys) {
    darkThemeKeyColors[k] = darkKeyColors[k as keyof typeof darkKeyColors];
    lightThemeKeyColors[k] = lightKeyColors[k as keyof typeof lightKeyColors];
  }

  return {
    source,
    colorOptions,
    darkScheme,
    lightScheme,
    darkKeyColors: darkThemeKeyColors as { [P in ThemeKeyColor]: Hct },
    lightKeyColors: lightThemeKeyColors as { [P in ThemeKeyColor]: Hct },
    dark,
    light,
  };
}
