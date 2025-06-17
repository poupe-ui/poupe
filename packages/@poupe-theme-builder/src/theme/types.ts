import {
  type Color,
  type CorePalettes,
  TonalPalette,
} from '../core';

import {
  type StandardDynamicSchemeKey,
} from './data';

/**
 * Configuration options for defining a color in a palette.
 */
export interface ColorOptions {
  /** The color value to use */
  value: Color
  /** Whether to harmonize the color with the primary color. Defaults to true */
  harmonize?: boolean
};

/**
 * Extended color options that include a custom name for the color.
 */
export interface CustomColorOptions extends ColorOptions {
  /** Custom name for the color. Defaults to the key name if not specified */
  name?: string
}

/** Type representing all possible color option formats for theme colors */
export type ThemeColorOptions = Color | ColorOptions;

/**
 * Type representing a complete set of palette colors with custom keys.
 * Includes the required Material Design core palette colors.
 *
 * @typeParam K - Custom color key names
 */
export type ThemeColors<K extends string> = Record<K, Color | CustomColorOptions> & {
  /** Primary color (required) - can be a Color or object with value property */
  primary: Color | { value: Color }
  /** Secondary color */
  secondary?: ThemeColorOptions
  /** Tertiary color */
  tertiary?: ThemeColorOptions
  /** Neutral color */
  neutral?: ThemeColorOptions
  /** Neutral variant color */
  neutralVariant?: ThemeColorOptions
  /** Error color */
  error?: ThemeColorOptions
};

/**
 * Complete set of palettes including core palettes and custom palettes.
 *
 * @typeParam K - Custom palette key names
 */
export type Palettes<K extends string> = CorePalettes & Record<K, TonalPalette>;

/**
 * Options for theme generation
 */
export interface ThemeGenerationOptions {
  /** Material color scheme to use. Defaults to 'content' */
  scheme?: StandardDynamicSchemeKey
  /** Contrast level from -1 (minimum) to 1 (maximum). 0 represents standard. Defaults to 0 */
  contrastLevel?: number
  /** Use CSS color-mix() for state colors instead of generating pre-computed variants. Defaults to false */
  useColorMix?: boolean
}
