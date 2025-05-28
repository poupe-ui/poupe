import {
  Hct,
  TonalPalette,
} from '@poupe/material-color-utilities';

import {
  type AnyColor,
  type RgbColor,
  Colord,
} from 'colord';

export {
  type CustomColor,
  DynamicScheme,
  Hct,
  TonalPalette,
  Variant,
} from '@poupe/material-color-utilities';

export {
  type AnyColor,
  type RgbColor,
  type HslColor,
  type HslaColor,
  Colord,
} from 'colord';

export type ColorMap<K extends string> = Record<K, Hct>;

export type HexColor = `#${string}`;

/** {@link RgbColor} variant with optional alpha value */
export type RgbaColor = RgbColor & { a?: number };

/** destructured {@link Hct} color with optional alpha value */
export interface HctColor {
  h: number
  c: number
  t: number
  a?: number
}

/** ObjectColor represents a destructured Color object */
export type ObjectColor = HctColor | Exclude<AnyColor, string>;

/** Color is any accepted color representation */
export type Color = Hct | Colord | ObjectColor | number | string;

/**
 * Core Material Design 3 palettes for DynamicSchemeOptions.
 * Contains tonal palettes for the standard Material Design color roles.
 */
export type CorePalettes = {
  primary: TonalPalette
  secondary?: TonalPalette
  tertiary?: TonalPalette
  neutral?: TonalPalette
  neutralVariant?: TonalPalette
  error?: TonalPalette
};

/**
 * Type representing the valid keys for core palettes in the Material Design 3 color system.
 * Derived from the keys of the {@link CorePalettes} type, representing standard color roles.
 */
export type CorePaletteKey = keyof CorePalettes;

/**
 * Readonly array of core palette keys used in Material Design 3 color system.
 * Represents the standard color roles that can be defined in a dynamic color scheme.
 */
export const corePaletteKeys: Readonly<CorePaletteKey[]> = [
  'primary',
  'secondary',
  'tertiary',
  'neutral',
  'neutralVariant',
  'error',
];
