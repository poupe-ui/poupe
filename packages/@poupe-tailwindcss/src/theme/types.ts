/* imports */
import {
  type ColorMap,
  type StandardDynamicSchemeKey,
  type StandardPaletteKey,
} from '@poupe/theme-builder';

import {
  type KebabCase,
} from '../utils/builder';

import {
  type Shades,
} from './shades';

export {
  type Color,
  type ColorMap,
  Hct,
  type StandardDynamicSchemeKey,
  type StandardPaletteKey,
} from '@poupe/theme-builder';

/* re-exports */
export type { KebabCase } from 'type-fest';

export type Theme = {
  readonly keys: string[]
  readonly options: ThemeOptions
  readonly paletteKeys: string[]

  readonly colors: Record<string, ThemeColorConfig>
  readonly dark: ColorMap<string> | undefined
  readonly light: ColorMap<string> | undefined
};

export type ThemeColorConfig = {
  shades?: Record<number, string>
  value: string
};

/**
 * Configuration options for defining a theme with customizable color schemes and styling.
 * @typeParam K - A generic type parameter representing additional color keys.
 **/
export type ThemeOptions<K extends string = string> = {
  /** Enable debug mode for theme generation. @defaultValue `false` */
  debug?: boolean

  /** Prefix for theme-related class names, defaults to 'md-'.  @defaultValue `'md-'` */
  themePrefix: string

  /** Prefix for surface class names, defaults to 'surface-'.
   * Set to `false` to disable surface generation.
   *  @defaultValue `'surface-'`
   * */
  surfacePrefix: false | string

  /** Prefix for shape class names, defaults to 'shape-'.
   * Set to `false` to disable shape generation.
   *  @defaultValue `'shape-'`
   * */
  shapePrefix: false | string

  /** Flag to omit theme generation, @defaultValue `false` */
  omitTheme: boolean

  /** Flag to extend existing color palette, @defaultValue `false` */
  extendColors: boolean

  /** Dynamic color scheme type, @defaultValue `'content'` */
  scheme: StandardDynamicSchemeKey

  /** Theme contrast level, @defaultValue `0` */
  contrastLevel: number

  /** Suffix for dark theme variants, @defaultValue `''` */
  darkSuffix: string

  /** Suffix for light theme variants, @defaultValue `''` */
  lightSuffix: string

  /** Color shade values used in theme generation,
   * @defaultValue `[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]`
   **/
  shades: Shades

  /** Disable print mode, @defaultValue `false` */
  disablePrintMode?: boolean

  /** Use CSS color-mix() for state colors instead of pre-calculated values
   * @defaultValue false
   */
  useColorMix?: boolean

  /** Color configuration for the theme. */
  colors: ThemeColors<K>
};

/**
 * Defines the color configuration for a theme, including primary and optional additional colors.
 * @typeParam K - A generic type parameter representing custom color keys.
 * @remarks
 * This type allows defining:
 * - A required primary color configuration
 * - Optional standard palette colors (excluding primary)
 * - Custom color keys transformed to kebab-case
 */
export type ThemeColors<K extends string> = {
  [name in Exclude<StandardPaletteKey, 'primary'>]?: string | ThemeColorOptions
} & {
  [name in KebabCase<K>]: boolean | string | ThemeColorOptions
} & {
  primary: string | ThemeColorOptions
};

/**
 * Defines the options for a color configuration within a theme.
 * @remarks
 * This type allows defining:
 * - The color value, either a string or an object with default and shade values.
 * - Whether the color should be harmonized.
 * - The shades associated with the color.
 */
export type ThemeColorOptions = {
  harmonized?: boolean
  shades?: Shades | true /** @defaultValue `[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]` */
  value?: string
};

export const defaultPrimaryColor = '#74bef5'; // blue from Tailwind CSS's logo
export const defaultThemePrefix = 'md-';
export const defaultThemeDarkSuffix = '';
export const defaultThemeLightSuffix = '';
export const defaultThemeContrastLevel = 0;
export const defaultThemeScheme: StandardDynamicSchemeKey = 'content';
export const defaultSurfacePrefix = 'surface-';
export const defaultShapePrefix = 'shape-';
