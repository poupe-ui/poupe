import {
  describe,
  expect,
  it,
} from 'vitest';

import type {
  ARGB,
} from '../../types';

import { splitSeeds } from '../split';

const argument = (n: number): ARGB => n as ARGB;

describe('splitSeeds', () => {
  it('returns empty partitions for an undefined input', () => {
    const out = splitSeeds(undefined);
    expect(out.core).toEqual({});
    expect(out.extra).toEqual({});
  });

  it('routes the six core palette names to the core slot', () => {
    const out = splitSeeds({
      primary: argument(1),
      secondary: argument(2),
      tertiary: argument(3),
      neutral: argument(4),
      neutralVariant: argument(5),
      error: argument(6),
    });
    expect(out.core).toEqual({
      primary: 1,
      secondary: 2,
      tertiary: 3,
      neutral: 4,
      neutralVariant: 5,
      error: 6,
    });
    expect(out.extra).toEqual({});
  });

  it('routes non-core names to the extra slot', () => {
    const out = splitSeeds<'accent' | 'brand'>({
      primary: argument(1),
      brand: argument(2),
      accent: argument(3),
    });
    expect(out.core).toEqual({ primary: 1 });
    expect(out.extra).toEqual({ brand: 2, accent: 3 });
  });

  it('preserves the value type through routing (SeedOptions form)', () => {
    // Value-type generic: same routing for the SeedOptions union.
    // The object form passes through untouched — split does not
    // unwrap.
    const out = splitSeeds<'brand'>({
      primary: { value: argument(1), blend: false },
      brand: argument(2),
    });
    expect(out.core.primary).toEqual({ value: 1, blend: false });
    expect(out.extra.brand).toBe(2 as ARGB);
  });

  it('throws when a seed name collides with a standard role', () => {
    // `surface`, `onPrimary`, `outline` are tone-selected outputs of
    // the core palettes — pinned by the tone map, never by ARGB seeds.
    expect(() => splitSeeds({ surface: argument(1) })).toThrow(/standard or extended role/);
    expect(() => splitSeeds({ onPrimary: argument(1) })).toThrow(/standard or extended role/);
    expect(() => splitSeeds({ outline: argument(1) })).toThrow(/standard or extended role/);
  });

  it('throws when a seed name collides with an extended role', () => {
    // `onSurfaceBright`, `onSurfaceContainer*` are extended role
    // outputs — the enrichment pass populates them; they are not
    // palette seeds.
    expect(() => splitSeeds({ onSurfaceBright: argument(1) })).toThrow(/standard or extended role/);
    expect(() => splitSeeds({ onSurfaceContainer: argument(1) })).toThrow(/standard or extended role/);
  });

  it('skips undefined values without throwing or routing', () => {
    // The cascade may carry undefined as a revert signal. The splitter
    // ignores those values rather than trying to route a missing seed
    // — including names that would collide if their value were defined.
    const out = splitSeeds<'brand' | 'surface'>({
      primary: undefined,
      surface: undefined,
      brand: undefined,
    });
    expect(out.core).toEqual({});
    expect(out.extra).toEqual({});
  });

  it('echoes the offending name in the throw message', () => {
    expect(() => splitSeeds({ surface: argument(1) })).toThrow(/'surface'/);
  });
});
