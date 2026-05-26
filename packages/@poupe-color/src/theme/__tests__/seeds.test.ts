import {
  describe,
  expect,
  it,
} from 'vitest';

import type { ARGB } from '../../types';
import { argb } from '../../utils';

import { expandSeed } from '../seeds';

const blue = argb('#0a84ff');

describe('expandSeed', () => {
  it('returns undefined for an unset slot', () => {
    // `defaultBlend` is irrelevant when v is undefined; pass `true`
    // for baseline-context shape.
    expect(expandSeed(undefined, true)).toBeUndefined();
  });

  it('returns undefined when the object form carries an undefined value (TS bypass)', () => {
    // Reachable only via TypeScript bypass — exposes the single
    // `=== undefined` post-condition every downstream caller relies
    // on as proof that `.value` is materially present.
    const bypass = { value: undefined as unknown as ARGB };
    expect(expandSeed(bypass, true)).toBeUndefined();
  });

  it('lifts the bare-value form to the canonical SeedValue at the supplied defaultBlend', () => {
    // Baseline context passes `true`; the bare-value form mirrors that.
    expect(expandSeed(blue, true)).toEqual({ value: blue, blend: true });
  });

  it('threads an explicit defaultBlend through the bare-value form', () => {
    // Overlay context inverts the default to `false`; nothing on the
    // bare-value form opts back in.
    expect(expandSeed(blue, false)).toEqual({ value: blue, blend: false });
  });

  it('honours an explicit blend on the object form', () => {
    // Explicit `blend` wins over `defaultBlend` regardless of context.
    expect(expandSeed({ value: blue, blend: true }, false)).toEqual({ value: blue, blend: true });
    expect(expandSeed({ value: blue, blend: false }, true)).toEqual({ value: blue, blend: false });
  });

  it('falls through to defaultBlend when the object form omits blend', () => {
    expect(expandSeed({ value: blue }, true)).toEqual({ value: blue, blend: true });
    expect(expandSeed({ value: blue }, false)).toEqual({ value: blue, blend: false });
  });

  it('preserves `blend: false` against a `true` default (no nullish collapse)', () => {
    // `??` distinguishes `false` from `undefined`; pin that `false`
    // is honoured rather than collapsed to the contextual default.
    expect(expandSeed({ value: blue, blend: false }, true)).toEqual({ value: blue, blend: false });
  });
});
