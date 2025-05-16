/**
 * This module provides utilities for generating, validating, and managing color shades
 * in a design system. It converts colors to different shade variants based on the HCT
 * (Hue, Chroma, Tone) color space, which provides perceptually consistent color gradations.
 *
 * Key features:
 * - Defines standard shade scales (50-950)
 * - Validates shade values for consistency
 * - Converts between color formats and shade values
 * - Supports custom shade definitions with flexible configuration
 * - Generates color palettes based on a single color reference
 *
 * @example
 * ```
 * // Generate standard shades from a color
 * const blueShades = makeHexShades('#0047AB');
 *
 * // Generate custom shades
 * const customShades = makeHexShades('#0047AB', [100, 300, 500, 700, 900]);
 * ```
 */
import {
  type Color,
  Hct,
  hct,
  hexFromHct,
  splitHct,
} from '@poupe/theme-builder/core';

/** Represents the possible types for color shades: an array of numbers or false */
export type Shades = number[] | false;

/** Default color shades used when no custom shades are specified, representing a standard range of color intensity from lightest (50) to darkest (950) */
export const defaultShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

/**
 * Processes and validates color shades, with optional append mode and default handling.
 *
 * @param shades - An optional array of shade values, boolean, or undefined
 * @param defaults - Default shade values to use, defaults to `defaultShades`
 * @returns An object containing processed shades and a validation status
 *
 * - If `shades` is `false`, returns `false` shades
 * - If `shades` is `true` or `undefined`, returns default shades
 * - Supports negative values to append to default shades
 * - Validates each shade value
 * - Returns sorted unique shade values
 */
export function getShades(shades?: number[] | boolean | undefined, defaults: number[] | false = defaultShades): { shades: Shades; ok: boolean } {
  if (shades === false) {
    return { shades: false, ok: true };
  } else if (shades === true || shades === undefined) {
    return { shades: defaults, ok: true };
  } else if (!Array.isArray(shades)) {
    return { shades: false, ok: false };
  }

  let appendMode = false;
  const out = new Set<number>();

  for (let shade of shades) {
    if (shade < 0) {
      appendMode = true;
      shade = -shade;
    }

    if (!validShade(shade)) {
      return { shades: false, ok: false };
    }

    out.add(shade);
  }

  if (out.size === 0) {
    return { shades: false, ok: false };
  }

  if (appendMode && defaults) {
    for (const shade of defaults) {
      out.add(shade);
    }
  }

  return {
    shades: [...out].sort((a, b) => a - b),
    ok: true,
  };
}

/** @returns true if the given number is a valid shade value */
export function validShade(n: number): boolean {
  return n > 0 && n < 1000 && Math.round(n) == n;
}

/**
 * Generates a set of Hct color objects for each specified shade value.
 *
 * This function creates a palette of colors by varying the tone (lightness) while
 * preserving the hue and chroma of the input color. It maps each shade value to a
 * corresponding HCT color object.
 *
 * @param color - The base color to generate shades from
 * @param shades - An array of shade values (numbers between 1-999) or `false` to disable shade generation
 *
 * @returns A record mapping each shade value to its corresponding Hct color object,
 * or `undefined` if the provided shades are invalid or disabled
 *
 * @example
 * ```
 * // Generate standard shades from a color
 * const blueHct = hct('#0047AB');
 * const blueShades = makeShades(blueHct, [100, 300, 500, 700]);
 * // Result: { 100: Hct, 300: Hct, 500: Hct, 700: Hct }
 *
 * // Disable shades
 * const noShades = makeShades(blueHct, false);
 * // Result: undefined
 * ```
 */
export function makeShades(color: Color, shades: false): undefined;
export function makeShades<K extends number>(color: Color, shades: K[]): Record<K, Hct>;
export function makeShades<K extends number>(color: Color, shades: K[] | false): Record<K, Hct> | undefined;
export function makeShades<K extends number>(color: Color, shades: K[] | false): Record<K, Hct> | undefined {
  if (!shades) {
    return undefined;
  }

  const { h, c } = splitHct(hct(color));

  return Object.fromEntries(shades.map((shade) => {
    const tone = toTone(shade);

    return [shade, Hct.from(h, c, tone)];
  })) as Record<K, Hct>;
}

function toTone(shade: number): number {
  return Math.max(Math.min(1000 - shade, 1000), 0) / 10;
}

/**
 * Generates a set of hex color values for each specified shade.
 *
 * This is a convenience wrapper around `makeShades()` that converts the Hct color objects
 * to hexadecimal color strings for easier use in UI components and CSS.
 *
 * @param color - The base color to generate shades from
 * @param shades - An array of shade values, or `false` to disable shade generation.
 * Defaults to the standard shade scale (50-950)
 *
 * @returns A record mapping each shade value to its corresponding hex color string,
 * or `undefined` if the provided shades are invalid or disabled
 *
 * @example
 * ```
 * // Generate standard hex shades
 * const blueHexShades = makeHexShades('#0047AB');
 * // Result: { 50: '#E6F0FF', 100: '#CCE0FF', ... 950: '#00142E' }
 *
 * // Generate custom hex shades
 * const customShades = makeHexShades('#0047AB', [100, 500, 900]);
 * // Result: { 100: '#CCE0FF', 500: '#0047AB', 900: '#00183D' }
 *
 * // Disable shades
 * const noShades = makeHexShades('#0047AB', false);
 * // Result: undefined
 * ```
 */
export function makeHexShades(
  color: Color,
  shades: Shades = defaultShades,
) {
  const validShades = makeShades<number>(color, shades);
  if (!validShades) {
    return undefined;
  }

  return Object.fromEntries(Object.entries(validShades).map(([shade, hct]) => {
    return [shade, hexFromHct(hct)];
  }));
}
