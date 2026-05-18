import {
  describe,
  expect,
  expectTypeOf,
  it,
} from 'vitest';

import type { ARGB } from '../../types';
import { getRandomColor } from '../random';

describe('getRandomColor', () => {
  it('returns a branded ARGB', () => {
    const a = getRandomColor();
    expectTypeOf(a).toEqualTypeOf<ARGB>();
  });

  it('returns an opaque ARGB (alpha byte stamped to 0xFF)', () => {
    // `argbFromColord` drops source alpha at the boundary; the high
    // byte must be 0xFF for every roll.
    const a = getRandomColor();
    expect((a >>> 24) & 0xFF).toBe(0xFF);
  });

  it('produces different colours across calls', () => {
    // 8 random 24-bit samples collide with vanishingly small
    // probability; the floor of 2 distinct values pins that the
    // result is actually drawn, not a constant.
    const samples = new Set<ARGB>();
    for (let i = 0; i < 8; i++) {
      samples.add(getRandomColor());
    }
    expect(samples.size).toBeGreaterThan(1);
  });
});
