// imports
//
import {
  unsafeKeys,
} from './core/utils';

import {
  type Color,
  Hct,

  hct,
} from './core/colors';

import {
  hexFromHct,
} from './core';

/** list of shades to use by default */
export const defaultShades = [
  50,
  100,
  200,
  300,
  400,
  500,
  600,
  700,
  800,
  900,
  950,
];

/**
 * Shades can be an array of numbers between 0 and 1000 where
 * 0 is full brightness and 1000 full darkness. if it's true,
 * the defaultShades will be used, and if false only the DEFAULT
 * entry will be set.
 */
export type Shades = boolean | number[];

/**
 * Shade is a particular shade of a tailwind color
 */
export type Shade = number | 'DEFAULT';

/**
 * @param color - color to use as reference
 * @param shades - list of shade values to use
 * @returns colors based on the given reference with modified tone.
 */
export function makeShades(color: Color, shades: Shades = true) {
  const c1 = hct(color);

  const out: Record<Shade, Hct> = {
    DEFAULT: c1,
  };

  if (shades === false) {
    return out;
  } else if (shades === true) {
    shades = defaultShades;
  }

  const hue = c1.hue;
  const chroma = c1.chroma;

  for (const shade of shades) {
    if (typeof shade === 'number' && shade >= 0 && shade <= 1000) {
      const tone = (1000 - shade) / 10;

      out[shade] = Hct.from(hue, chroma, tone);
    }
  }

  return out;
}

/** @returns a map of shades of the baseColor to be used in tailwind.config.
 *
 * @param baseColor - color used as reference for hue and chroma.
 * @param shades - optional array of shades to use, {@link defaultShades} by default.
 * @param stringify - function to convert {@link Hct} to `string`.
 */
export function withShades<C extends Color, V extends string>(baseColor: C, shades: Shades = true, stringify: ((c: Hct) => V)) {
  const t = makeShades(hct(baseColor), shades);

  type K = keyof typeof t;
  type T = Record<K, V>;

  const out = {} as Partial<T>;

  for (const shade of unsafeKeys(t)) {
    out[shade] = stringify(t[shade]);
  }

  return out as T;
}

/** variant of {@link withShades} that uses hex strings as output */
export function withHexShades<C extends Color>(baseColor: C, shades: Shades = true) {
  return withShades(baseColor, shades, hexFromHct);
}
