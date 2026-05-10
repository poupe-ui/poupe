import {
  describe,
  expectTypeOf,
  it,
} from 'vitest';

import type {
  DynamicScheme,
  Hct,
  PaletteKey,
  SpecVersion,
  TonalPalette,
  Variant,
} from '../mcu';
import {
  type ExtendedRole,
  type ExtraRole,
  type ModalPalettes,
  type ModalRoles,
  type ModalTheme,
  type Mode,
  type RequiredStandardRole,
  type RoleKey,
  type SpecDependentRole,
  specsWithDim,
  type StandardRole,
  type Theme,
} from '../theme';

describe('Mode', () => {
  it('equals dark | light', () => {
    expectTypeOf<Mode>().toEqualTypeOf<'dark' | 'light'>();
  });
});

describe('Role catalogues', () => {
  it('SpecDependentRole<SpecVersion> equals the *Dim quartet', () => {
    expectTypeOf<SpecDependentRole>().toEqualTypeOf<
      'errorDim' | 'primaryDim' | 'secondaryDim' | 'tertiaryDim'
    >();
  });

  it('SpecDependentRole<\'2021\'> equals never', () => {
    expectTypeOf<SpecDependentRole<'2021'>>().toEqualTypeOf<never>();
  });

  it('SpecDependentRole<\'2025\'> equals the *Dim quartet', () => {
    expectTypeOf<SpecDependentRole<'2025'>>().toEqualTypeOf<
      'errorDim' | 'primaryDim' | 'secondaryDim' | 'tertiaryDim'
    >();
  });

  it('SpecDependentRole<\'2026\'> equals the *Dim quartet', () => {
    expectTypeOf<SpecDependentRole<'2026'>>().toEqualTypeOf<
      'errorDim' | 'primaryDim' | 'secondaryDim' | 'tertiaryDim'
    >();
  });

  it('SpecDependentRole<\'2021\' | \'2025\'> distributes per member', () => {
    // Distribution rule: the conditional resolves independently for
    // each union member, then the per-member results form a union.
    // `'2021'` yields `never` and drops out of that union; `'2025'`
    // yields the quartet — so the mixed-union result is the quartet.
    expectTypeOf<SpecDependentRole<'2021' | '2025'>>().toEqualTypeOf<
      'errorDim' | 'primaryDim' | 'secondaryDim' | 'tertiaryDim'
    >();
  });

  it('every non-2021 SpecVersion is enumerated in specsWithDim', () => {
    // Tripwire — derived from `specsWithDim` so catalogue additions
    // flow through automatically; the only hand-maintained literal
    // is the no-Dim baseline (`'2021'`). If MCU adds a spec that
    // ends up in neither side, this assertion fails at type-check,
    // forcing an explicit audit of whether the new spec ships the
    // `*Dim` quartet before `SpecDependentRole<S>` silently includes
    // it.
    type Uncovered = Exclude<SpecVersion, '2021' | typeof specsWithDim[number]>;
    expectTypeOf<Uncovered>().toEqualTypeOf<never>();
  });

  it('ExtendedRole equals the seven-entry union', () => {
    expectTypeOf<ExtendedRole>().toEqualTypeOf<
      'onSurfaceBright' | 'onSurfaceContainer' | 'onSurfaceContainerHigh' |
      'onSurfaceContainerHighest' | 'onSurfaceContainerLow' |
      'onSurfaceContainerLowest' | 'onSurfaceDim'
    >();
  });

  it('RequiredStandardRole equals the full required-role union', () => {
    expectTypeOf<RequiredStandardRole>().toEqualTypeOf<
      // surface family (includes the four MCU `allColors`-excluded roles —
      // `scrim`, `shadow`, `surfaceTint`, `surfaceVariant` — which the
      // resolver reads via dedicated accessors)
      'background' | 'inverseOnSurface' | 'inverseSurface' |
      'onBackground' | 'onSurface' | 'onSurfaceVariant' |
      'outline' | 'outlineVariant' | 'scrim' | 'shadow' | 'surface' |
      'surfaceBright' | 'surfaceContainer' | 'surfaceContainerHigh' |
      'surfaceContainerHighest' | 'surfaceContainerLow' |
      'surfaceContainerLowest' | 'surfaceDim' | 'surfaceTint' |
      'surfaceVariant' |
      // primary family
      'inversePrimary' | 'onPrimary' | 'onPrimaryContainer' |
      'onPrimaryFixed' | 'onPrimaryFixedVariant' | 'primary' |
      'primaryContainer' | 'primaryFixed' | 'primaryFixedDim' |
      // secondary family
      'onSecondary' | 'onSecondaryContainer' | 'onSecondaryFixed' |
      'onSecondaryFixedVariant' | 'secondary' | 'secondaryContainer' |
      'secondaryFixed' | 'secondaryFixedDim' |
      // tertiary family
      'onTertiary' | 'onTertiaryContainer' | 'onTertiaryFixed' |
      'onTertiaryFixedVariant' | 'tertiary' | 'tertiaryContainer' |
      'tertiaryFixed' | 'tertiaryFixedDim' |
      // error family (no `errorFixed*`; MCU does not define them)
      'error' | 'errorContainer' | 'onError' | 'onErrorContainer' |
      // palette key colours
      'errorPaletteKeyColor' | 'neutralPaletteKeyColor' |
      'neutralVariantPaletteKeyColor' | 'primaryPaletteKeyColor' |
      'secondaryPaletteKeyColor' | 'tertiaryPaletteKeyColor'
    >();
  });

  it('StandardRole equals the union of required and spec-dependent catalogues', () => {
    expectTypeOf<StandardRole>()
      .toEqualTypeOf<RequiredStandardRole | SpecDependentRole>();
  });
});

describe('ExtraRole and RoleKey', () => {
  it('expands an extra-role name into its four-quad role keys', () => {
    expectTypeOf<ExtraRole<'brand'>>().toEqualTypeOf<
      'brand' | 'brandContainer' | 'onBrand' | 'onBrandContainer'
    >();
  });

  it('RoleKey<never> covers required, spec-dependent, and extended roles', () => {
    expectTypeOf<RoleKey>()
      .toEqualTypeOf<
        ExtendedRole | RequiredStandardRole | SpecDependentRole
    >();
  });

  it('RoleKey<K> adds the four-quad expansion of K', () => {
    type R = RoleKey<'brand'>;
    expectTypeOf<'brand'>().toExtend<R>();
    expectTypeOf<'onBrand'>().toExtend<R>();
    expectTypeOf<'brandContainer'>().toExtend<R>();
    expectTypeOf<'onBrandContainer'>().toExtend<R>();
  });

  it('RoleKey<K, S> threads S through the spec-dependent arm', () => {
    // `S` only narrows the SpecDependentRole<S> contribution; the
    // other three arms (Required, Extended, Extra) are spec-agnostic.
    expectTypeOf<RoleKey<'brand'>>()
      .toEqualTypeOf<
        ExtendedRole | ExtraRole<'brand'> |
        RequiredStandardRole | SpecDependentRole
    >();
    expectTypeOf<RoleKey<'brand', '2021'>>()
      .toEqualTypeOf<
        ExtendedRole | ExtraRole<'brand'> | RequiredStandardRole
    >();
    expectTypeOf<RoleKey<'brand', '2026'>>()
      .toEqualTypeOf<
        ExtendedRole | ExtraRole<'brand'> |
        RequiredStandardRole | SpecDependentRole
    >();
  });

  it('ModalRoles<K> exposes every extra-role slot as Hct', () => {
    // Extras land on the roles bucket via the four-quad expansion and
    // are required on the resolved ModalTheme — the symmetry
    // invariant on Recipe guarantees every declared extra is
    // reachable in both modes.
    type R = ModalRoles<'brand'>;
    expectTypeOf<R['brand']>().toEqualTypeOf<Hct>();
    expectTypeOf<R['onBrand']>().toEqualTypeOf<Hct>();
    expectTypeOf<R['brandContainer']>().toEqualTypeOf<Hct>();
    expectTypeOf<R['onBrandContainer']>().toEqualTypeOf<Hct>();
  });
});

describe('ModalRoles', () => {
  it('roles are typed Hct on the required catalogue', () => {
    // Roles carry the rich HCT representation. ARGB lives on the
    // Recipe input side; HCT on the Theme output side.
    expectTypeOf<ModalRoles['primary']>().toEqualTypeOf<Hct>();
    expectTypeOf<ModalRoles['onTertiary']>().toEqualTypeOf<Hct>();
    expectTypeOf<ModalRoles['onPrimaryFixedVariant']>().toEqualTypeOf<Hct>();
  });

  it('spec-dependent roles default to Hct (S = SpecVersion union)', () => {
    // With no spec narrowing, the default S = SpecVersion union
    // distributes to include the *Dim slots; they're required `Hct`.
    expectTypeOf<ModalRoles['primaryDim']>().toEqualTypeOf<Hct>();
    expectTypeOf<ModalRoles['errorDim']>().toEqualTypeOf<Hct>();
  });

  it('spec-dependent slots vanish on ModalRoles<K, \'2021\'>', () => {
    // The *Dim quartet doesn't exist on the 2021 spec; ModalRoles
    // gates every member of the quartet at the type level so the
    // resolver never has to synthesise a value MCU hasn't defined.
    type R2021 = ModalRoles<never, '2021'>;
    expectTypeOf<'primaryDim'>().not.toExtend<keyof R2021>();
    expectTypeOf<'secondaryDim'>().not.toExtend<keyof R2021>();
    expectTypeOf<'tertiaryDim'>().not.toExtend<keyof R2021>();
    expectTypeOf<'errorDim'>().not.toExtend<keyof R2021>();
  });

  it('spec-dependent slots are required Hct on ModalRoles<K, \'2025\'>', () => {
    type R2025 = ModalRoles<never, '2025'>;
    expectTypeOf<R2025['primaryDim']>().toEqualTypeOf<Hct>();
    expectTypeOf<R2025['secondaryDim']>().toEqualTypeOf<Hct>();
    expectTypeOf<R2025['tertiaryDim']>().toEqualTypeOf<Hct>();
    expectTypeOf<R2025['errorDim']>().toEqualTypeOf<Hct>();
  });

  it('keyof ModalRoles<never, \'2025\'> is the full required + extended + quartet union', () => {
    // Exhaustive shape pin — a deletion from `requiredStandardRoles`,
    // `extendedRoles`, or `specDependentRoles` regresses here instead
    // of slipping through the runtime-array tests alone.
    expectTypeOf<keyof ModalRoles<never, '2025'>>()
      .toEqualTypeOf<ExtendedRole | RequiredStandardRole | SpecDependentRole>();
  });

  it('extended roles are populated by enrichment — typed as Hct', () => {
    // ExtendedRole names have no MaterialDynamicColors backing;
    // enrichment populates them at construction time (typically
    // inheriting from `onSurface`), so they read as `Hct` on the
    // resolved ModalTheme.
    expectTypeOf<ModalRoles['onSurfaceDim']>().toEqualTypeOf<Hct>();
    expectTypeOf<ModalRoles['onSurfaceContainerHigh']>().toEqualTypeOf<Hct>();
    expectTypeOf<ExtendedRole>().toExtend<keyof ModalRoles>();
  });
});

describe('ModalPalettes', () => {
  it('keys are bare palette names — no `Palette` suffix', () => {
    // The `Palette` suffix lives on MCU's DynamicScheme because both
    // role and palette accessors share that object's keyspace. With
    // palettes split into their own bucket, the suffix is redundant.
    expectTypeOf<ModalPalettes['primary']>().toEqualTypeOf<TonalPalette>();
    expectTypeOf<ModalPalettes['error']>().toEqualTypeOf<TonalPalette>();
    expectTypeOf<ModalPalettes['neutralVariant']>().toEqualTypeOf<TonalPalette>();
  });

  it('palette values match MCU DynamicScheme palette types', () => {
    // Palette accessors are not branded — TonalPalette is already a
    // distinct nominal type. Pinning the MCU equivalence prevents
    // accidental divergence at the suffix boundary.
    expectTypeOf<DynamicScheme['primaryPalette']>()
      .toEqualTypeOf<ModalPalettes['primary']>();
  });

  it('keys default to the six MD3 palette keys', () => {
    type P = keyof ModalPalettes;
    expectTypeOf<P>().toEqualTypeOf<PaletteKey>();
  });

  it('passing K adds a bare-key slot for the extra palette', () => {
    type P = ModalPalettes<'brand'>;
    expectTypeOf<'brand'>().toExtend<keyof P>();
    expectTypeOf<'primary'>().toExtend<keyof P>();
    expectTypeOf<P['brand']>().toEqualTypeOf<TonalPalette>();
  });
});

describe('Theme and ModalTheme', () => {
  it('Theme<K> exposes dark and light modal themes parameterised by K', () => {
    type T = Theme<'brand'>;
    expectTypeOf<T['dark']>().toEqualTypeOf<ModalTheme<'brand'>>();
    expectTypeOf<T['light']>().toEqualTypeOf<ModalTheme<'brand'>>();
  });

  it('ModalTheme exposes mode, source, scheme, roles, palettes', () => {
    expectTypeOf<ModalTheme['mode']>().toEqualTypeOf<Mode>();
    expectTypeOf<ModalTheme['source']>().toEqualTypeOf<Hct>();
    expectTypeOf<ModalTheme['scheme']>().toEqualTypeOf<DynamicScheme>();
    expectTypeOf<ModalTheme['roles']>().toEqualTypeOf<ModalRoles>();
    expectTypeOf<ModalTheme['palettes']>().toEqualTypeOf<ModalPalettes>();
  });

  it('extra palettes land on the palettes bucket under the bare key', () => {
    type T = Theme<'brand'>;
    expectTypeOf<T['dark']['palettes']['brand']>().toEqualTypeOf<TonalPalette>();
  });

  it('Theme and ModalTheme each carry their own resolved source', () => {
    expectTypeOf<Theme['source']>().toEqualTypeOf<Hct>();
    expectTypeOf<ModalTheme['source']>().toEqualTypeOf<Hct>();
  });

  it('Theme<K> pins the global scalar fields', () => {
    expectTypeOf<Theme['contrast']>().toEqualTypeOf<number>();
    expectTypeOf<Theme['specVersion']>().toEqualTypeOf<SpecVersion>();
    expectTypeOf<Theme['variant']>().toEqualTypeOf<Variant>();
  });

  it('Theme<K, S> threads S through specVersion and both modal halves', () => {
    type T2021 = Theme<'brand', '2021'>;
    expectTypeOf<T2021['specVersion']>().toEqualTypeOf<'2021'>();
    expectTypeOf<T2021['dark']>().toEqualTypeOf<ModalTheme<'brand', '2021'>>();
    expectTypeOf<T2021['light']>().toEqualTypeOf<ModalTheme<'brand', '2021'>>();

    type T2025 = Theme<'brand', '2025'>;
    expectTypeOf<T2025['specVersion']>().toEqualTypeOf<'2025'>();
    expectTypeOf<T2025['dark']>().toEqualTypeOf<ModalTheme<'brand', '2025'>>();
    expectTypeOf<T2025['light']>().toEqualTypeOf<ModalTheme<'brand', '2025'>>();
  });
});
