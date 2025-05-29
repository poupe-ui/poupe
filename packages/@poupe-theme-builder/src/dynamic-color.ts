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
  Hct,
  DynamicScheme,
  Variant,

  hct,
  makeCustomColor,
} from './core/index';

import {
  type CustomDynamicColorKey,
  type StandardDynamicColorKey,
  type StandardPaletteKey,

  standardDynamicColors,
  customDynamicColors,
  standardPaletteKeyColors,
} from './dynamic-color-data';

// types
//

/**
 * ColorOptions describes how a color must be processed.
 */
export interface ColorOptions {
  value: Color

  /** name allows us to customize the tailwindcss color name */
  name?: boolean | string

  /** harmonize indicates the value must be blended to the source color */
  harmonize?: boolean
};

/**
 * @param color - color name in the table
 * @param colors - table of ColorOptions
 * @returns desired name for the color. undefined if the color is to be omitted.
 */
export function getColorNameOption<K extends string>(color: K, colors: Record<K, Partial<ColorOptions>>): string | undefined {
  const $opt = colors[color];
  if ($opt === undefined || $opt.name === undefined || $opt.name === true) {
    return color; // default
  } else if ($opt.name !== false && $opt.name !== '') {
    return $opt.name; // custom
  } else {
    return undefined; // omit
  }
}

type StandardDynamicColors = { [K in StandardDynamicColorKey]: Hct };
type StandardPaletteColors = { [K in StandardPaletteKey]: Hct };

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

  for (const [name, fn] of pairs(standardPaletteKeyColors)) {
    out[name] = fn(scheme);
  }

  return out;
}

export function makeCustomColors<K extends string>(source: Color, colors: Record<K, ColorOptions>) {
  const $source = hct(source);

  const colorOptions = {} as Record<KebabCase<K>, ColorOptions>;
  const darkColors: Partial<CustomDynamicColors<K>> = {};
  const lightColors: Partial<CustomDynamicColors<K>> = {};

  for (const color in colors) {
    const kebabName = kebabCase(color) as KebabCase<K>;
    const options = colors[color];
    const $color = hct(options.value);
    const harmonize = options.harmonize ?? true;

    const cc = makeCustomColor($color, harmonize ? $source : undefined, kebabName);

    const { dark, light } = cc;

    colorOptions[kebabName] = options;

    for (const [pattern, fn] of Object.entries(customDynamicColors)) {
      const name = pattern.replace('{}', kebabName) as keyof CustomDynamicColors<K>;

      darkColors[name] = fn(dark);
      lightColors[name] = fn(light);
    }
  }

  return {
    source,
    colors: unsafeKeys(colorOptions),
    colorOptions: colorOptions,
    dark: darkColors as CustomDynamicColors<K>,
    light: lightColors as CustomDynamicColors<K>,
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
