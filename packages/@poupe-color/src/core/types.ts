/**
 * Defines type definitions for various color models used throughout the Poupe UI color system.
 * Each color type can include an optional opacity value.
 */

/**
 * RGB color model - represents colors in terms of red, green, and blue components.
 */
export type RGBColor = {
  /** Red component (0-255) */
  r: number
  /** Green component (0-255) */
  g: number
  /** Blue component (0-255) */
  b: number
  /** Optional transparency value (0-1) */
  opacity?: number
};

/**
 * LAB color model - device-independent color model that represents colors
 * using lightness (L) and two color-opponent dimensions (a, b).
 */
export type LabColor = {
  /** Lightness component (0-100) */
  l: number
  /** Green-red component (typically -128 to +127) */
  a: number
  /** Blue-yellow component (typically -128 to +127) */
  b: number
  /** Optional transparency value (0-1) */
  opacity?: number
};

/**
 * HCL color model - represents colors in terms of hue, chroma, and luminance.
 * Similar to HSL but provides better perceptual uniformity.
 */
export type HCLColor = {
  /** Hue component in degrees (0-360) */
  h: number
  /** Chroma component (saturation-like) */
  c: number
  /** Luminance component */
  l: number
  /** Optional transparency value (0-1) */
  opacity?: number
};

/**
 * HCT color model - represents colors in terms of hue, chroma, and tone.
 * Used in Material Design's color system for accessibility and consistency.
 */
export type HCTColor = {
  /** Hue component in degrees (0-360) */
  h: number
  /** Chroma component (colorfulness) */
  c: number
  /** Tone component (lightness perception) */
  t: number
  /** Optional transparency value (0-1) */
  opacity?: number
};

/**
 * HSL color model - represents colors in terms of hue, saturation, and lightness.
 * A cylindrical representation of the RGB color model.
 */
export type HSLColor = {
  /** Hue component in degrees (0-360) */
  h: number
  /** Saturation component (0-100%) */
  s: number
  /** Lightness component (0-100%) */
  l: number
  /** Optional transparency value (0-1) */
  opacity?: number
};

/**
 * HSV color model - represents colors in terms of hue, saturation, and value (brightness).
 * Also known as HSB (hue, saturation, brightness).
 */
export type HSVColor = {
  /** Hue component in degrees (0-360) */
  h: number
  /** Saturation component (0-100%) */
  s: number
  /** Value/brightness component (0-100%) */
  v: number
  /** Optional transparency value (0-1) */
  opacity?: number
};

/**
 * Union type for all supported object-based color representations.
 * Used for type checking and consistent handling of different color models.
 */
export type ObjectColor = RGBColor | LabColor | HCLColor | HCTColor | HSLColor | HSVColor;

/**
 * Union type representing any valid color input format.
 * Can be a string (e.g., hex, named color), number (e.g., RGB integer),
 * or any of the supported object-based color models.
 */
export type AnyColor = string | number | ObjectColor;
