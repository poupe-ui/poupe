import {
  colord as origColord,
} from 'colord';

import {
  type Color,
  type HexColor,
  Colord,
  Hct,

  colord,
  normalizeColor,
  rgba,

  hexFromArgb,
  hexFromColord,
  hexFromHct,
  hexFromHctColor,
} from './colors';

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
  return rgbaString;
}

/** @returns the Hex RGB Color string for the given {@link Color} */
export const hexString = (c: Color): HexColor => {
  if (c instanceof Hct) {
    return hexFromHct(c);
  } else if (c instanceof Colord) {
    return hexFromColord(c);
  } else if (typeof c === 'number') {
    return hexFromArgb(c);
  } else if (typeof c === 'object' && 't' in c) {
    return hexFromHctColor(c);
  } else {
    const c1 = origColord(normalizeColor(c));
    return hexFromColord(c1);
  }
};

/** @returns the HSL or HSLA color string representation of the given {@link Color}, with optional alpha control */
export function hslString(c: Color, alpha: boolean = true): string {
  const { h, s, l, a: a0 } = colord(c).toHsl();
  const a = alpha === false ? 1 : a0;

  if (a < 1) {
    return `hsla(${h}, ${s}%, ${l}%, ${a})`;
  }
  return `hsl(${h}, ${s}%, ${l}%)`;
}

/**
 * Converts a color to an RGB or RGBA string representation.
 * @param c - The color to convert
 * @param alpha - Whether to include alpha channel (defaults to true)
 * @returns A CSS-compatible RGB or RGBA string
 */
export const rgbaString = (c: Color, alpha: boolean = true): string => {
  const { r, g, b, a: a0 = 1 } = rgba(c);
  const a = alpha === false ? 1 : a0;

  if (a < 1) {
    return `rgb(${r} ${g} ${b} / ${a.toFixed(2)})`;
  }
  return `rgb(${r} ${g} ${b})`;
};
