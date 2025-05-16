import {
  Hct,
  rgba,
  hexString,
  rgbString,
  hslString,
} from './builder';

/**
 * Defines the possible color format types for conversion.
 *
 * @remarks
 * Supports predefined formats like 'numbers', 'rgb', 'hsl', 'hex',
 * or a custom formatting function that takes an Hct color and returns a string.
 */
export type ColorFormat = 'numbers' | 'rgb' | 'hsl' | 'hex' | ((c: Hct) => string);

/**
 * Converts an HCT color to a specified format.
 *
 * @param v - The color format to convert to. Can be 'numbers', 'rgb', 'hsl', 'hex', or a custom formatting function.
 * @returns A function that converts an HCT color to the specified string format.
 *
 * @remarks defaults to `'rgb'`
 */
export function colorFormatter(v: ColorFormat = 'rgb'): ((c: Hct) => string) {
  if (typeof v === 'function') return v;

  if (v === 'numbers') {
    return (c: Hct): string => {
      const { r, g, b } = rgba(c);
      return `${r} ${g} ${b}`;
    };
  }

  if (v === 'hsl') return hslString;
  if (v === 'hex') return hexString;
  return rgbString;
}
