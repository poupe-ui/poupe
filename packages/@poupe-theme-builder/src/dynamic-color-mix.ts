import {
  unsafeKeys,
} from '@poupe/css';

import {
  type Color,
  type Hct,

  colord,
  hctFromColord,
} from './core/colors';

/** @returns the result of mixing two colors in given ratios */
export function makeColorMix(base: Color, other: Color, ratios: number): Hct;
export function makeColorMix(base: Color, other: Color, ratios: Array<number>): Hct[];
export function makeColorMix<K extends string>(base: Color, other: Color, ratios: Record<K, number>): Record<K, Hct>;
export function makeColorMix<K extends string>(base: Color, other: Color, ratios: number | Array<number> | Record<K, number>): Hct | Hct[] | Record<K, Hct> {
  const c0 = colord(base);
  const c1 = colord(other);

  if (typeof ratios === 'number') {
    // single value
    const c = c0.mix(c1, ratios);
    return hctFromColord(c);
  }

  if (Array.isArray(ratios)) {
    // array
    const out: Hct[] = [];
    for (const r of ratios) {
      const c = c0.mix(c1, r);
      out.push(hctFromColord(c));
    }
    return out;
  }

  // named
  const out = {} as Record<K, Hct>;
  for (const k of unsafeKeys(ratios)) {
    const c = c0.mix(c1, ratios[k]);
    out[k] = hctFromColord(c);
  }

  return out;
}
