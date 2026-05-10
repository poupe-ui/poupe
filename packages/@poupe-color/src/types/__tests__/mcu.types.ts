import {
  describe,
  expectTypeOf,
  it,
} from 'vitest';

import type {
  DynamicScheme,
  PaletteKey,
  SpecVersion,
} from '../mcu';

describe('PaletteKey', () => {
  it('equals the six MCU palette names', () => {
    expectTypeOf<PaletteKey>().toEqualTypeOf<
      'error' | 'neutral' | 'neutralVariant' |
      'primary' | 'secondary' | 'tertiary'
    >();
  });

  it('rejects unrelated strings at the type level', () => {
    expectTypeOf<'brand'>().not.toExtend<PaletteKey>();
    expectTypeOf<'surface'>().not.toExtend<PaletteKey>();
  });
});

describe('SpecVersion', () => {
  it('mirrors DynamicScheme["specVersion"]', () => {
    // Pins the inferred-type relationship: SpecVersion is defined as
    // `DynamicScheme['specVersion']`, so MCU renaming the field would
    // break this assertion before silently shifting our public type.
    expectTypeOf<SpecVersion>().toEqualTypeOf<DynamicScheme['specVersion']>();
  });
});
