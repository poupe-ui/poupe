import {
  describe,
  expectTypeOf,
  it,
} from 'vitest';

import {
  type ARGB,
  asARGB,
} from '../argb';

describe('ARGB brand', () => {
  it('widens to number but plain number does not narrow to ARGB', () => {
    // The brand stops raw numbers standing in for a colour at the type
    // level. `ARGB` is structurally `number & { __brand: 'ARGB' }`, so
    // it remains assignable upward to `number`.
    expectTypeOf<ARGB>().toExtend<number>();
    expectTypeOf<number>().not.toExtend<ARGB>();
  });
});

describe('asARGB', () => {
  it('takes a number and returns the branded ARGB', () => {
    expectTypeOf(asARGB).parameter(0).toEqualTypeOf<number>();
    expectTypeOf(asARGB).returns.toEqualTypeOf<ARGB>();
  });
});
