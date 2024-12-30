// imports
//
import { Prettify } from './utils';

import {
  type HexColor,
  type Color,
  Hct,

  hct,
  hexFromHct,
} from './core';

// export
//
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
];

// Shades can be an array of numbers between 0 and 1000 where
// 0 is full brightness and 1000 full darkness. if it's true,
// the defaultShades will be used, and if false only the DEFAULT
// entry will be set.
export type Shades = boolean | number[];

export function makeShades(color: Color, shades: Shades = true) {
  const c1 = hct(color);

  const out: Record<number | 'DEFAULT', Hct> = {
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

  return out as Prettify<typeof out>;
}

export function makeHexShades(baseColor: Color, shades: Shades = true) {
  const t = makeShades(baseColor, shades);

  type K = keyof typeof t;
  type T = Record<K, HexColor>;

  const keys = Object.keys(t) as K[];
  const out = {} as Partial<T>;

  for (const shade of keys) {
    const c = t[shade];
    if (c !== undefined) {
      out[shade] = hexFromHct(c);
    }
  }

  return out as T;
}
