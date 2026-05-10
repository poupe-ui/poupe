import {
  describe,
  expectTypeOf,
  it,
} from 'vitest';

import type { ARGB } from '../argb';
import type {
  PaletteKey,
  SpecVersion,
  Variant,
} from '../mcu';
import type {
  ModalSeedsMap,
  Recipe,
  RecipeOverlay,
  SeedOptions,
  SeedsMap,
  SeedValue,
} from '../recipe';

describe('SeedOptions', () => {
  it('admits both the bare-value and the object form', () => {
    // Discriminated union: a SeedOptions is either the bare
    // ARGB or `{ value: ARGB, blend?: boolean }`. Both forms must be
    // assignable to the same parameter slot.
    expectTypeOf<ARGB>().toExtend<SeedOptions>();
    expectTypeOf<{ value: ARGB }>().toExtend<SeedOptions>();
    expectTypeOf<{ blend: boolean; value: ARGB }>().toExtend<SeedOptions>();
  });
});

describe('SeedValue', () => {
  it('exposes both fields as required', () => {
    expectTypeOf<SeedValue['value']>().toEqualTypeOf<ARGB>();
    expectTypeOf<SeedValue['blend']>().toEqualTypeOf<boolean>();
  });

  it('does not admit the bare-value or `blend`-less object form', () => {
    // Canonical form: `blend` is always present. Reusing SeedOptions
    // shapes against this slot must fail — that is the whole point
    // of the type.
    expectTypeOf<ARGB>().not.toExtend<SeedValue>();
    expectTypeOf<{ value: ARGB }>().not.toExtend<SeedValue>();
  });

  it('refines SeedOptions (every SeedValue is a SeedOptions)', () => {
    // The expansion narrows the union arm; relaxing either type
    // shape must regress this assertion before downstream use sites
    // notice.
    expectTypeOf<SeedValue>().toExtend<SeedOptions>();
  });
});

describe('Recipe', () => {
  it('exposes the global substrate fields', () => {
    type R = Recipe<'brand'>;
    expectTypeOf<R['specVersion']>().toEqualTypeOf<SpecVersion>();
    expectTypeOf<R['variant']>().toEqualTypeOf<Variant>();
    expectTypeOf<R['contrast']>().toEqualTypeOf<number>();
  });

  it('primary is mandatory ARGB; other slots are optional SeedOptions', () => {
    type S = Recipe<'brand'>['seeds'];
    // `primary` is the source anchor — mandatory and typed as bare
    // ARGB so the `blend` flag stays moot for this slot.
    expectTypeOf<S['primary']>().toEqualTypeOf<ARGB>();
    expectTypeOf<S['neutralVariant']>().toEqualTypeOf<SeedOptions | undefined>();
    expectTypeOf<S['error']>().toEqualTypeOf<SeedOptions | undefined>();
    // Extras share the same SeedOptions shape — the unified seeds map
    // routes core vs. extra by name at runtime, not at the type level.
    expectTypeOf<S['brand']>().toEqualTypeOf<SeedOptions | undefined>();
  });

  it('per-mode overrides are optional RecipeOverlay<K>', () => {
    type R = Recipe<'brand'>;
    expectTypeOf<R['dark']>().toEqualTypeOf<RecipeOverlay<'brand'> | undefined>();
    expectTypeOf<R['light']>().toEqualTypeOf<RecipeOverlay<'brand'> | undefined>();
  });

  it('defaults K = never (no extras typed in)', () => {
    type S = Recipe['seeds'];
    // With K = never the seeds slot accepts only the six core
    // palette keys — verified via key access since the homomorphic
    // mapped-type expansion is not surface-stable across TS
    // versions. `primary` remains mandatory.
    expectTypeOf<S['primary']>().toEqualTypeOf<ARGB>();
    expectTypeOf<S['neutralVariant']>().toEqualTypeOf<SeedOptions | undefined>();
    expectTypeOf<S['error']>().toEqualTypeOf<SeedOptions | undefined>();
  });

  it('threads S through specVersion when the spec is pinned', () => {
    // `Recipe<K, S>` pins `specVersion` to the literal `S` so the
    // eventual `computeTheme(recipe: Recipe<K, S>): Theme<K, S>` can
    // forward the spec into `Theme<K, S>` (and therefore
    // `ModalRoles<K, S>`) without erasing it to `SpecVersion`.
    expectTypeOf<Recipe<'brand', '2021'>['specVersion']>()
      .toEqualTypeOf<'2021'>();
    expectTypeOf<Recipe<'brand', '2025'>['specVersion']>()
      .toEqualTypeOf<'2025'>();
    // Default still erases to the full union.
    expectTypeOf<Recipe<'brand'>['specVersion']>()
      .toEqualTypeOf<SpecVersion>();
  });
});

describe('RecipeOverlay', () => {
  it('seeds value is SeedOptions at every slot', () => {
    // Per-mode overlays admit the same SeedOptions shape as the
    // baseline; the resolution layer applies `blend: false` as the
    // contextual default so bare-ARGB entries pass through raw.
    type S = NonNullable<RecipeOverlay<'brand'>['seeds']>;
    expectTypeOf<S['primary']>().toEqualTypeOf<SeedOptions | undefined>();
    expectTypeOf<S['brand']>().toEqualTypeOf<SeedOptions | undefined>();
  });

  it('accepts both the bare-value and the object form', () => {
    type S = NonNullable<RecipeOverlay<'brand'>['seeds']>;
    expectTypeOf<ARGB>().toExtend<NonNullable<S['primary']>>();
    expectTypeOf<{ value: ARGB }>().toExtend<NonNullable<S['primary']>>();
    expectTypeOf<{ blend: boolean; value: ARGB }>().toExtend<NonNullable<S['primary']>>();
  });
});

describe('SeedsMap', () => {
  it('primary is mandatory ARGB; other slots are optional SeedOptions', () => {
    type S = SeedsMap<'brand'>;
    expectTypeOf<S['primary']>().toEqualTypeOf<ARGB>();
    expectTypeOf<S['secondary']>().toEqualTypeOf<SeedOptions | undefined>();
    expectTypeOf<S['neutralVariant']>().toEqualTypeOf<SeedOptions | undefined>();
    expectTypeOf<S['error']>().toEqualTypeOf<SeedOptions | undefined>();
    expectTypeOf<S['brand']>().toEqualTypeOf<SeedOptions | undefined>();
  });

  it('matches Recipe<K>["seeds"] exactly', () => {
    expectTypeOf<Recipe<'brand'>['seeds']>().toEqualTypeOf<SeedsMap<'brand'>>();
  });

  it('rejects a seeds literal without primary', () => {
    // `primary` lives on the bare-ARGB intersection, so any seeds
    // shape that omits it cannot satisfy SeedsMap.
    expectTypeOf<{ brand: SeedOptions }>().not.toExtend<SeedsMap<'brand'>>();
    expectTypeOf<Record<string, never>>().not.toExtend<SeedsMap>();
  });
});

describe('ModalSeedsMap', () => {
  it('every slot is optional SeedOptions', () => {
    type S = ModalSeedsMap<'brand'>;
    expectTypeOf<S['primary']>().toEqualTypeOf<SeedOptions | undefined>();
    expectTypeOf<S['secondary']>().toEqualTypeOf<SeedOptions | undefined>();
    expectTypeOf<S['brand']>().toEqualTypeOf<SeedOptions | undefined>();
  });

  it('matches RecipeOverlay<K>["seeds"] modulo NonNullable', () => {
    expectTypeOf<NonNullable<RecipeOverlay<'brand'>['seeds']>>()
      .toEqualTypeOf<ModalSeedsMap<'brand'>>();
  });

  it('accepts the empty literal (every slot optional)', () => {
    expectTypeOf<Record<string, never>>().toExtend<ModalSeedsMap<'brand'>>();
  });
});

// Recover the *extras* portion of K a Recipe<K> literal binds.
// `SeedsMap<K>` keeps `primary` on the bare-ARGB intersection
// (excluded from the mapped-type slot) and `ModalSeedsMap<K>` admits
// every `PaletteKey` name natively, so neither seed site forces a
// core name into K. The `Exclude<K, PaletteKey>` filter below is
// defensive belt-and-braces — should TS ever widen K to include a
// core name in some future inference scenario, the assertions still
// target only what the recipe declared as extras.
declare function bindK<K extends string>(r: Recipe<K>): Exclude<K, PaletteKey>;

declare const variant: Variant;
declare const specVersion: SpecVersion;
declare const value: ARGB;

describe('Recipe<K> K-inference across seed sites', () => {
  it('binds K from baseline-only extras', () => {
    expectTypeOf(
      bindK({
        variant,
        specVersion,
        contrast: 0,
        seeds: { primary: value, brand: value },
      }),
    ).toEqualTypeOf<'brand'>();
  });

  it('binds K from an overlay-only extra declaration', () => {
    // K binds at the type level whenever the literal mentions a
    // non-core key at any of the three seed sites — the unification
    // of `K | PaletteKey` across baseline + dark + light forces it.
    // The runtime symmetry guard at theme-construction entry decides
    // whether the input is accepted; type-level inference simply
    // unions.
    expectTypeOf(
      bindK({
        variant,
        specVersion,
        contrast: 0,
        seeds: { primary: value },
        dark: { seeds: { tag: value } },
      }),
    ).toEqualTypeOf<'tag'>();
  });

  it('unions K across baseline and a per-mode overlay', () => {
    expectTypeOf(
      bindK({
        variant,
        specVersion,
        contrast: 0,
        seeds: { primary: value, brand: value },
        light: { seeds: { tag: value } },
      }),
    ).toEqualTypeOf<'brand' | 'tag'>();
  });

  it('unions K across both per-mode overlays without baseline', () => {
    expectTypeOf(
      bindK({
        variant,
        specVersion,
        contrast: 0,
        seeds: { primary: value },
        dark: { seeds: { tag: value } },
        light: { seeds: { brand: value } },
      }),
    ).toEqualTypeOf<'brand' | 'tag'>();
  });
});
