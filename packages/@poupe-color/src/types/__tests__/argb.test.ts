import {
  describe,
  expect,
  expectTypeOf,
  it,
} from 'vitest';

import {
  type ARGB,
  asARGB,
} from '../argb';

describe('asARGB', () => {
  it('stamps a bare RGB integer to opaque ARGB', () => {
    expect(asARGB(0x00_11_22_33)).toBe(0xFF_11_22_33);
  });

  it('passes opaque MCU output through unchanged', () => {
    expect(asARGB(0xFF_11_22_33)).toBe(0xFF_11_22_33);
  });

  it('forces alpha to 0xFF on translucent input', () => {
    expect(asARGB(0x80_11_22_33)).toBe(0xFF_11_22_33);
  });

  it('handles the boundary values 0 and 0xFFFFFFFF', () => {
    expect(asARGB(0)).toBe(0xFF_00_00_00);
    expect(asARGB(0xFF_FF_FF_FF)).toBe(0xFF_FF_FF_FF);
  });

  it('returns an unsigned 32-bit integer (no signed wrap)', () => {
    // `(rgb | 0xFF_00_00_00)` is signed-negative as int32 in JS bitwise
    // ops; the `>>> 0` inside `asARGB` recovers the unsigned form.
    expect(asARGB(0x00_11_22_33)).toBeGreaterThan(0);
    expect(asARGB(0x00_00_00_01)).toBe(0xFF_00_00_01);
  });

  it('rejects NaN as a non-integer', () => {
    expect(() => asARGB(Number.NaN)).toThrow(TypeError);
  });

  it('rejects Infinity as a non-integer', () => {
    expect(() => asARGB(Number.POSITIVE_INFINITY)).toThrow(TypeError);
  });

  it('rejects fractional numbers', () => {
    expect(() => asARGB(0.5)).toThrow(TypeError);
  });

  it('rejects negative values', () => {
    expect(() => asARGB(-1)).toThrow(RangeError);
  });

  it('rejects values above 0xFFFFFFFF', () => {
    expect(() => asARGB(0x1_00_00_00_00)).toThrow(RangeError);
  });

  it('returns an ARGB-branded value', () => {
    const stamped: ARGB = asARGB(0x00_11_22_33);
    expectTypeOf(stamped).toExtend<number>();
  });
});
