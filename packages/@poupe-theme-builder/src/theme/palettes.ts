import {
  ColorOptions,
  CustomColorOptions,
  Palettes,
  ThemeColors,
} from './types';

import {
  type Color,
  type CorePalettes,
  type CorePaletteKey,
  Colord,
  Hct,
  TonalPalette,

  corePaletteKeys,
  camelCase,
  hct,
  isObjectColor,
  makeTonalPalette,
  pairs,
  unsafeKeys,
} from './utils';

/**
 * Normalizes a value that could be a direct Color or a partial CustomColorOptions
 * to a partial CustomColorOptions object.
 *
 * @param c - A color, custom color options, or partial custom color options to flatten
 * @returns A normalized (partial) CustomColorOptions object
 */
export function flattenPartialColorOptions(c: Color | CustomColorOptions): CustomColorOptions;
export function flattenPartialColorOptions(c: Color | CustomColorOptions | Partial<CustomColorOptions> | undefined): CustomColorOptions | Partial<CustomColorOptions>;
export function flattenPartialColorOptions(c: Color | CustomColorOptions | Partial<CustomColorOptions> | undefined): CustomColorOptions | Partial<CustomColorOptions> {
  if (c === undefined || c === null) {
    return {};
  } else if (c instanceof Hct || c instanceof Colord) {
    return { value: c };
  } else if (typeof c !== 'object') {
    return { value: c };
  } else if ('value' in c) {
    return c as CustomColorOptions;
  } else if (isObjectColor(c)) {
    return { value: c as Color };
  } else {
    return c as Partial<CustomColorOptions>;
  }
}

/**
 * Normalizes color input to a CustomColorOptions object.
 * Converts raw Color values to CustomColorOptions with HCT color representation.
 *
 * @param c - Color or CustomColorOptions to normalize
 * @returns Normalized CustomColorOptions with HCT color value
 */
export const flattenColorOptions = (c: Color | CustomColorOptions): CustomColorOptions => {
  const c2 = flattenPartialColorOptions(c);
  if (c2.value === undefined) {
    // Partial
    throw new Error('invalid color');
  } else if (c2.value instanceof Hct) {
    // ready
    return c2;
  } else {
    // Color
    return {
      ...c2,
      value: hct(c2.value),
    };
  }
};

/**
 * Creates a complete theme palette system from a set of palette colors.
 * Processes primary color as the source for harmonization and generates
 * tonal palettes for all defined colors.
 *
 * @typeParam K - Custom color key names
 * @param colors - Complete set of palette colors including primary and optional colors
 * @returns Object containing source color, core palettes, all palettes, and color configurations
 */
export const makeThemePalettes = <K extends string>(colors: ThemeColors<K>) => {
  const { colors: $colors } = cookThemeColors(colors);
  const { primary, ...rest } = $colors;
  const { value: primaryValue } = primary;
  const source = hct(primaryValue);

  const corePalettes: CorePalettes = {
    primary: makeTonalPalette(source),
  };

  type ExtraColorKey = Exclude<keyof typeof $colors, CorePaletteKey>;
  const extraPalettes: Record<ExtraColorKey, TonalPalette> = {};

  for (const [name, options] of pairs(rest)) {
    const { value, harmonize = true } = options;
    const tones = makeTonalPalette(value, harmonize ? source : undefined);

    if (corePaletteKeys.includes(name as CorePaletteKey)) {
      corePalettes[name as CorePaletteKey] = tones;
    } else {
      extraPalettes[name as ExtraColorKey] = tones;
    }
  }

  const palettes: Palettes<ExtraColorKey> = { ...corePalettes, ...extraPalettes };

  return {
    source,
    corePalettes,
    extraPalettes,
    palettes,
    colors: $colors as Record<CorePaletteKey | ExtraColorKey, ColorOptions>,
  };
};

function cookThemeColors<K extends string>(colors: ThemeColors<K>) {
  const { primary, ...rest } = colors;
  const out: Record<string, ColorOptions> = {
    primary: flattenColorOptions(primary),
  };

  for (const key of unsafeKeys(rest)) {
    const $options = flattenColorOptions(rest[key]);
    const { name = key } = $options;
    out[camelCase(name)] = $options;
  }

  const keys = Object.keys(out);

  return {
    keys, // just to avoid having the as unused
    colors: out as Record<typeof keys[number], ColorOptions>,
  };
}
