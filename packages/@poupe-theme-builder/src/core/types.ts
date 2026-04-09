import {
  Hct,
  TonalPalette,
} from '@poupe/material-color-utilities';

import {
  type AnyColor,
  Colord,
  type RgbColor,
} from 'colord';

export {
  DynamicScheme,
  Hct,
  TonalPalette,
  Variant,
} from '@poupe/material-color-utilities';

export {
  type AnyColor,
  Colord,
  type HslaColor,
  type HslColor,
  type RgbColor,
} from 'colord';

export type ColorMap<K extends string> = Record<K, Hct>;

export type HexColor = `#${string}`;

/** {@link RgbColor} variant with optional alpha value */
export type RgbaColor = RgbColor & { a?: number };

/** destructured {@link Hct} color with optional alpha value */
export interface HctColor {
  a?: number
  c: number
  h: number
  t: number
}

/** ObjectColor represents a destructured Color object */
export type ObjectColor = Exclude<AnyColor, string> | HctColor;

/** Color is any accepted color representation */
export type Color = Colord | Hct | number | ObjectColor | string;

/**
 * Core Material Design 3 palettes for DynamicSchemeOptions.
 * Contains tonal palettes for the standard Material Design color roles.
 */
export type CorePalettes = {
  error?: TonalPalette
  neutral?: TonalPalette
  neutralVariant?: TonalPalette
  primary: TonalPalette
  secondary?: TonalPalette
  tertiary?: TonalPalette
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

/**
 * Represents a custom color definition with tones and color groups for light and dark schemes
 * @param name - Optional name for the custom color
 * @param tones - Readonly tonal palette defining color variations
 * @param light - Color group representing the light scheme variant
 * @param dark - Color group representing the dark scheme variant
 */
export type CustomColor = {
  dark: Readonly<ColorGroup>
  light: Readonly<ColorGroup>
  name?: string
  tones: TonalPalette
};

/**
 * Represents a color group with specific color roles in a color scheme.
 * Defines the color and its on-color variants for different contexts and containers.
 * @param color - The custom color
 * @param onColor - The color used for content on top of the custom color
 * @param colorContainer - The container variant of the custom color
 * @param onColorContainer - The color used for content on the color container
 */
export type ColorGroup = {
  color: Hct
  colorContainer: Hct
  onColor: Hct
  onColorContainer: Hct
};
