// imports
//
import type { KebabCase } from 'type-fest';

import {
  kebabCase,
  pairs,
  unsafeKeys,
} from '@poupe/css';

import {
  type Color,
  type CorePalettes,
  DynamicScheme,
  Hct,
  TonalPalette,
  Variant,

  hct,
  makeCustomColor,
  makeCustomColorFromPalette,
} from '../core';

import {
  type CustomDynamicColorKey,
  type StandardDynamicColorKey,
  type StandardPaletteKey,

  standardDynamicColors,
  customDynamicColors,
  standardPalettes,
} from './data';

import {
  type ColorOptions,
} from './types';

// types
//

type StandardDynamicColors = { [K in StandardDynamicColorKey]: Hct };
type StandardPaletteColors = { [K in KebabCase<StandardPaletteKey>]: Hct };
type StandardPalettes = { [K in KebabCase<StandardPaletteKey>]: TonalPalette };

type CustomDynamicColors<T extends string> = { [K in CustomDynamicColorKey<KebabCase<T>>]: Hct };

export function makeStandardColorsFromScheme(scheme: DynamicScheme) {
  const out = {} as StandardDynamicColors;

  for (const [name, fn] of pairs(standardDynamicColors)) {
    out[name] = Hct.fromInt(fn(scheme));
  }

  return out;
}

export function makeStandardPaletteKeyColorsFromScheme(scheme: DynamicScheme) {
  const out = {} as StandardPaletteColors;
  for (const [kebabName, palette] of pairs(makeStandardPaletteFromScheme(scheme))) {
    out[kebabName] = palette.keyColor;
  }
  return out;
}

export function makeStandardPaletteFromScheme(scheme: DynamicScheme) {
  const out = {} as StandardPalettes;

  for (const [name, fn] of pairs(standardPalettes)) {
    const kebabName = kebabCase(name) as KebabCase<StandardPaletteKey>;
    out[kebabName] = fn(scheme);
  }

  return out;
}

export function makeCustomColors<K extends string>(source: Color, colors: Record<K, ColorOptions>) {
  const $source = hct(source);

  const colorOptions = {} as Record<KebabCase<K>, ColorOptions>;
  const palettes = {} as Record<KebabCase<K>, TonalPalette>;
  const darkColors = {} as CustomDynamicColors<K>;
  const lightColors = {} as CustomDynamicColors<K>;

  for (const [color, options] of pairs(colors)) {
    const kebabName = kebabCase(color) as KebabCase<K>;
    const $color = hct(options.value);
    const harmonize = options.harmonize ?? true;

    const { tones, dark, light } = makeCustomColor($color, harmonize ? $source : undefined, kebabName);

    colorOptions[kebabName] = options;
    palettes[kebabName] = tones;

    for (const [pattern, fn] of Object.entries(customDynamicColors)) {
      const name = pattern.replace('{}', kebabName) as keyof CustomDynamicColors<K>;

      darkColors[name] = fn(dark);
      lightColors[name] = fn(light);
    }
  }

  return {
    source,
    colors: unsafeKeys(colorOptions),
    colorOptions,
    palettes,
    dark: darkColors,
    light: lightColors,
  };
}

export function makeCustomColorsFromPalettes<K extends string>(colors: Record<K, TonalPalette> = {} as Record<K, TonalPalette>) {
  const palettes = {} as Record<KebabCase<K>, TonalPalette>;
  const darkColors = {} as CustomDynamicColors<K>;
  const lightColors = {} as CustomDynamicColors<K>;

  for (const [color, tones] of pairs(colors)) {
    const kebabName = kebabCase(color) as KebabCase<K>;
    const { dark, light } = makeCustomColorFromPalette(tones, kebabName);

    palettes[kebabName] = tones;
    for (const [pattern, fn] of pairs(customDynamicColors)) {
      const name = pattern.replace('{}', kebabName) as keyof CustomDynamicColors<K>;

      darkColors[name] = fn(dark);
      lightColors[name] = fn(light);
    }
  }

  return {
    colors: unsafeKeys(palettes),
    palettes,
    dark: darkColors,
    light: lightColors,
  };
}

/**
 * Creates a dynamic color scheme based on the provided source color, variant, and other parameters.
 *
 * @param source - The source color in HCT color space
 * @param variant - The color scheme to apply
 * @param contrastLevel - The desired contrast level
 * @param isDark - Whether the scheme is for a dark or light theme
 * @param palettes - Optional color palettes to customize the scheme
 * @returns A configured DynamicScheme instance
 */
export function makeDynamicScheme(source: Hct, variant: Variant, contrastLevel: number, isDark: boolean, palettes: Partial<CorePalettes> = {}): DynamicScheme {
  return new DynamicScheme({
    sourceColorHct: source,
    variant,
    contrastLevel,
    isDark,
    primaryPalette: palettes.primary,
    secondaryPalette: palettes.secondary,
    tertiaryPalette: palettes.tertiary,
    neutralPalette: palettes.neutral,
    neutralVariantPalette: palettes.neutralVariant,
    errorPalette: palettes.error,
  });
}
