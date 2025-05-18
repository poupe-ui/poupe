import {
  LabColor,
  RGBColor,
  HSLColor,
  HCLColor,
  color as factory,
  rgb as rgbFactory,
  hsl as hslFactory,
  hcl as hclFactory,
  lab as labFactory,
} from 'd3-color';

import type {
  AnyColor,
  RGBColor as myRGBColor,
  LabColor as myLabColor,
  HCLColor as myHCLColor,
  HCTColor as myHCTColor,
  HSLColor as myHSLColor,
  HSVColor as myHSVColor,
} from '../core/types';

import { rgbaFromARGB } from '../core/utils';

/**
 * Converts various color representations to a D3 color object.
 *
 * @param color - A color input that can be a string, number, or color object
 * @returns A D3 color object (LabColor, RGBColor, HSLColor, or HCLColor) or undefined if conversion fails
 * @remarks Supports conversion from:
 * - CSS color strings
 * - 32-bit ARGB numbers
 * - RGB objects with optional opacity
 * - Lab objects with optional opacity
 * - HCL objects with optional opacity
 * - HSL objects with optional opacity
 * - HSV objects with optional opacity
 */
export function color(
  color: AnyColor,
): LabColor | RGBColor | HSLColor | HCLColor | undefined {
  if (typeof color === 'string') {
    const c = factory(color);
    return c === null ? undefined : c;
  } else if (typeof color === 'number') {
    return asRGB(rgbaFromARGB(color));
  } else if (!color) {
    return undefined;
  } else if (isLab(color)) {
    return color as LabColor;
  } else if (isRGB(color)) {
    return color as RGBColor;
  } else if (isHSL(color)) {
    return color as HSLColor;
  } else if (isHCL(color)) {
    return color as HCLColor;
  } else if ('l' in color && 'a' in color && 'b' in color) {
    return asLab(color);
  } else if ('r' in color && 'g' in color && 'b' in color) {
    return asRGB(color);
  } else if ('h' in color && 'c' in color && 'l' in color) {
    return asHCL(color);
  } else if ('h' in color && 's' in color && 'l' in color) {
    return asHSL(color);
  } else if ('h' in color && 's' in color && 'v' in color) {
    return asHSV(color);
  } else {
    return undefined;
  }
}

/**
 * Converts a custom L*a*b* color object to a D3 LABColor object.
 *
 * @param color - A L*a*b* color object with lightness, a, b, and optional opacity values
 * @returns A D3 LABColor object representing the converted color
 */
export function asLab(color: myLabColor): LabColor {
  return labFactory(color.l, color.a, color.b, color.opacity ?? 1);
}

/**
 * Converts a custom RGB color object to a D3 RGBColor object.
 *
 * @param color - An RGB color object with red, green, blue, and optional opacity values
 * @returns A D3 RGBColor object representing the converted color
 */
export function asRGB(color: myRGBColor): RGBColor {
  return rgbFactory(color.r, color.g, color.b, color.opacity ?? 1);
}

/**
 * Converts a custom HSL color object to a D3 HSLColor object.
 *
 * @param color - An HSL color object with hue, saturation, lightness, and optional opacity values
 * @returns A D3 HSLColor object representing the converted color
 */
export function asHSL(color: myHSLColor): HSLColor {
  return hslFactory(color.h, color.s, color.l, color.opacity ?? 1);
}

/**
 * Converts a custom HSV color object to a D3 HSLColor object.
 *
 * @param color - An HSV color object with hue, saturation, value, and optional opacity values
 * @returns A D3 HSLColor object representing the converted HSV color in HSL space
 * @remarks Performs HSV to HSL conversion using the formula:
 * - L = V * (1 - S/2)
 * - S = (V - L) / min(L, 1 - L) if L is not 0 or 1, otherwise 0
 */
export function asHSV(color: myHSVColor): HSLColor {
  const l = color.v * (1 - color.s / 2);
  const s = l === 0 || l === 1 ? 0 : (color.v - l) / Math.min(l, 1 - l);
  return hslFactory(color.h, s, l, color.opacity ?? 1);
}

/**
 * Converts a custom HCL color object to a D3 HCLColor object.
 *
 * @param color - An HCL color object with hue, chroma, lightness, and optional opacity values
 * @returns A D3 HCLColor object representing the converted color
 */
export function asHCL(color: myHCLColor): HCLColor {
  return hclFactory(color.h, color.c, color.l, color.opacity ?? 1);
}

/**
 * Converts a custom HCT color object to a D3 HCLColor object.
 *
 * @param color - An HCT color object with hue, chroma, tone, and optional opacity values
 * @returns A D3 HCLColor object where the tone value is mapped to the lightness parameter
 * @remarks HCT (Hue, Chroma, Tone) is converted to HCL by using the tone value as lightness
 */
export function asHCT(color: myHCTColor): HCLColor {
  return hclFactory(color.h, color.c, color.t, color.opacity ?? 1);
}

/**
 * Checks if the given color is an instance of a L*a*b* color.
 *
 * @param color - The color to check
 * @returns A boolean indicating whether the color is a D3 LAB color instance
 */
export function isLab(color: unknown): boolean {
  return color instanceof labFactory.prototype.constructor;
}

/**
 * Checks if the given color is an instance of an RGB color.
 *
 * @param color - The color to check
 * @returns A boolean indicating whether the color is a D3 RGB color instance
 */
export function isRGB(color: unknown): boolean {
  return color instanceof rgbFactory.prototype.constructor;
}

/**
 * Checks if the given color is an instance of an HSL color.
 *
 * @param color - The color to check
 * @returns A boolean indicating whether the color is a D3 HSL color instance
 */
export function isHSL(color: unknown): boolean {
  return color instanceof hslFactory.prototype.constructor;
}

/**
 * Checks if the given color is an instance of an HCL color.
 *
 * @param color - The color to check
 * @returns A boolean indicating whether the color is a D3 HCL color instance
 */
export function isHCL(color: unknown): boolean {
  return color instanceof hclFactory.prototype.constructor;
}
