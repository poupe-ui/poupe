/**
 * Type-level tests for the `argb` umbrella dispatcher and its
 * per-type variants (`argbFromHCT`, `argbFromColord`).
 *
 * Pins the input unions and return types so that widening or
 * narrowing any of the surfaces trips the type-check, prompting the
 * runtime tests in `argb.test.ts` to grow matching branches.
 *
 * This file is only type-checked, not executed.
 */
import type { Hct } from '@poupe/material-color-utilities';
import type { Colord } from 'colord';

import {
  describe,
  expectTypeOf,
  it,
} from 'vitest';

import type { ARGB } from '../../types';
import {
  argb,
  argbFromColord,
  argbFromHCT,
} from '../argb';

describe('argb umbrella dispatcher type surface', () => {
  it('accepts the four-shape union and nothing else', () => {
    // Pinning the parameter type here means that adding a new input
    // shape (e.g. `{ r, g, b }` plain objects) requires updating both
    // the dispatcher's branches and this assertion together.
    expectTypeOf(argb).parameter(0).toEqualTypeOf<Colord | Hct | number | string>();
  });

  it('returns the branded `ARGB` regardless of which branch fires', () => {
    expectTypeOf(argb).returns.toEqualTypeOf<ARGB>();
  });
});

describe('argbFromHCT type surface', () => {
  it('takes an `Hct` and returns the branded `ARGB`', () => {
    expectTypeOf(argbFromHCT).parameter(0).toEqualTypeOf<Hct>();
    expectTypeOf(argbFromHCT).returns.toEqualTypeOf<ARGB>();
  });
});

describe('argbFromColord type surface', () => {
  it('takes a `Colord` and returns the branded `ARGB`', () => {
    expectTypeOf(argbFromColord).parameter(0).toEqualTypeOf<Colord>();
    expectTypeOf(argbFromColord).returns.toEqualTypeOf<ARGB>();
  });
});
