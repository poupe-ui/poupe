import {
  type Color,
  Hct,
  hct,
  splitHct,
} from '../utils/builder';

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

export function makeShades(color: Color, shades: false): undefined;
export function makeShades<K extends number>(color: Color, shades: K[]): Record<K, Hct>;
export function makeShades<K extends number>(color: Color, shades: K[] | false): Record<K, Hct> | undefined;
export function makeShades<K extends number>(color: Color, shades: K[] | false): Record<K, Hct> | undefined {
  if (!shades) {
    return undefined;
  }

  const { h, c } = splitHct(hct(color));

  return Object.fromEntries(shades.map((shade) => {
    const tone = (1000 - shade) / 10;

    return [shade, Hct.from(h, c, tone)];
  })) as Record<K, Hct>;
}
