import {
  argbFromHex,
  Hct,
} from '@poupe/material-color-utilities';

import { colord } from 'colord';

import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  argb,
  argbFromColord,
  argbFromHCT,
} from '../argb';

describe('argbFromHCT', () => {
  it('stamps the MCU-canonical u32 ARGB', () => {
    const hct = Hct.fromInt(argbFromHex('#0a84ff'));
    expect(argbFromHCT(hct)).toBe(0xFF_0A_84_FF);
  });

  it('stamps a warm-hue HCT to its canonical ARGB', () => {
    const hct = Hct.fromInt(argbFromHex('#ff5722'));
    expect(argbFromHCT(hct)).toBe(0xFF_FF_57_22);
  });

  it('keeps the alpha byte at 0xFF regardless of MCU output', () => {
    // MCU's `Hct.toInt()` is opaque by construction; pinning the high
    // byte here prevents a regression if a future MCU change leaks
    // alpha bits into the integer.
    const hct = Hct.fromInt(argbFromHex('#000000'));
    expect((argbFromHCT(hct) >>> 24) & 0xFF).toBe(0xFF);
  });
});

describe('argbFromColord', () => {
  it('returns u32 ARGB with alpha 0xFF for an opaque colord', () => {
    expect(argbFromColord(colord('#0a84ff'))).toBe(0xFF_0A_84_FF);
  });

  it('forces opaque alpha on a translucent colord', () => {
    // @poupe/color themes are opaque by construction — input alpha is
    // dropped at the boundary.
    expect(argbFromColord(colord('rgba(10, 132, 255, 0.5)'))).toBe(0xFF_0A_84_FF);
  });

  it('throws on an invalid Colord instance', () => {
    expect(() => argbFromColord(colord('not-a-colour'))).toThrow();
  });
});

describe('argb (umbrella dispatcher)', () => {
  it('stamps a number through asARGB', () => {
    // The high byte is forced to 0xFF — input alpha is ignored.
    expect(argb(0x80_0A_84_FF)).toBe(0xFF_0A_84_FF);
    expect(argb(0x00_0A_84_FF)).toBe(0xFF_0A_84_FF);
  });

  it('routes Hct instances through argbFromHCT', () => {
    const hct = Hct.fromInt(argbFromHex('#0a84ff'));
    expect(argb(hct)).toBe(0xFF_0A_84_FF);
  });

  it('routes Colord instances through argbFromColord', () => {
    expect(argb(colord('#0a84ff'))).toBe(0xFF_0A_84_FF);
    // A translucent Colord still drops alpha — opaque-by-construction.
    expect(argb(colord('rgba(10, 132, 255, 0.5)'))).toBe(0xFF_0A_84_FF);
  });

  it('parses 6-digit hex strings', () => {
    expect(argb('#0a84ff')).toBe(0xFF_0A_84_FF);
  });

  it('parses 3-digit hex short form', () => {
    expect(argb('#0af')).toBe(0xFF_00_AA_FF);
  });

  it('parses 8-digit hex as CSS RGBA-last and drops the trailing alpha', () => {
    // colord follows CSS Color Module Level 4: 8-digit hex is
    // `#RRGGBBAA`, alpha last. The trailing alpha byte is dropped at
    // the boundary; result is the canonical opaque 0xFFRRGGBB.
    expect(argb('#0a84ff80')).toBe(0xFF_0A_84_FF);
  });

  it('parses css rgb() via colord', () => {
    expect(argb('rgb(10, 132, 255)')).toBe(0xFF_0A_84_FF);
  });

  it('parses css hsl() via colord', () => {
    expect(argb('hsl(0, 100%, 50%)')).toBe(0xFF_FF_00_00);
  });

  it('throws on invalid string input with the offending value echoed', () => {
    expect(() => argb('not a colour')).toThrow(/invalid color, got not a colour/);
  });

  it('rejects named CSS colours (namesPlugin not loaded)', () => {
    // colord's named-colour table needs an explicit `namesPlugin`
    // registration — `@poupe/color` does not load it; the consumer
    // decides whether the table is worth the bundle bytes.
    expect(() => argb('red')).toThrow(/invalid color, got red/);
  });

  it('throws on invalid Colord input with the wrapper-shape message', () => {
    // Message shape ('invalid Colord instance' — no input echoed)
    // proves the dispatcher hit argbFromColord, not the trailing
    // permissive `colord(...)` catch-all.
    expect(() => argb(colord('not-a-colour'))).toThrow(/invalid Colord instance/);
  });

  it('routes TS-bypass values through the trailing string catch-all', () => {
    // Values that bypass the TS union land in the dispatcher's final
    // `colord(...)` parse, which throws with the offending input
    // echoed. Routing them through argbFromColord directly would
    // surface `isValid is not a function` instead — the wrong shape.
    // @ts-expect-error runtime catch-all for TS-bypass values
    expect(() => argb(true)).toThrow(/invalid color, got true/);
    // @ts-expect-error runtime catch-all for TS-bypass values
    expect(() => argb(undefined)).toThrow(/invalid color, got undefined/);
    // @ts-expect-error runtime catch-all for TS-bypass values
    // eslint-disable-next-line unicorn/no-null
    expect(() => argb(null)).toThrow(/invalid color, got null/);
    // `[].toString()` is the empty string; the message terminates in
    // the trailing space after "got ". Anchor the regex so the
    // trailing space is visible as a load-bearing match.
    // @ts-expect-error runtime catch-all for TS-bypass values
    expect(() => argb([])).toThrow(/^argb: invalid color, got $/);
    // @ts-expect-error runtime catch-all for TS-bypass values
    expect(() => argb({})).toThrow(/invalid color, got \[object Object\]/);
  });
});
