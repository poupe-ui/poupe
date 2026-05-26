/**
 * Type-level tests for `computeTheme<K, S>`.
 * This file is only type-checked, not executed.
 */
import {
  describe,
  expectTypeOf,
  it,
} from 'vitest';

import type {
  Hct,
  Recipe,
  Theme,
  TonalPalette,
} from '../../types';

import { computeTheme } from '../compute';

declare const brandRecipe: Recipe<'brand'>;
declare const brandRecipe2021: Recipe<'brand', '2021'>;
declare const brandRecipe2025: Recipe<'brand', '2025'>;
declare const plainRecipe: Recipe;

describe('computeTheme<K, S> type plumbing', () => {
  it('threads K through Recipe<K> to Theme<K>', () => {
    const theme = computeTheme(brandRecipe);
    expectTypeOf(theme).toEqualTypeOf<Theme<'brand'>>();
  });

  it('exposes the extra palette on palettes.<K> as a required TonalPalette', () => {
    // ModalPalettes<K> requires every declared K — modal themes always
    // carry the extra palette once K is declared. The runtime symmetry
    // guard in `computeTheme` keeps this contract honest: half-defined
    // extras throw before a Theme is constructed.
    const theme = computeTheme(brandRecipe);
    expectTypeOf(theme.dark.palettes.brand).toEqualTypeOf<TonalPalette>();
    expectTypeOf(theme.light.palettes.brand).toEqualTypeOf<TonalPalette>();
  });

  it('exposes the four-quad ExtraRole<K> accessors on roles as required Hct', () => {
    // ModalRoles<K, S> maps ExtraRole<K> as required `Hct`. The
    // palette-symmetry guard in `pickExtraKeys` ensures every declared
    // K is reachable in both modes — half-defined extras throw before
    // a Theme is constructed — so the four-quad anchor extraction
    // always populates the slot at runtime.
    const theme = computeTheme(brandRecipe);
    expectTypeOf(theme.light.roles.brand).toEqualTypeOf<Hct>();
    expectTypeOf(theme.light.roles.onBrand).toEqualTypeOf<Hct>();
    expectTypeOf(theme.light.roles.brandContainer).toEqualTypeOf<Hct>();
    expectTypeOf(theme.light.roles.onBrandContainer).toEqualTypeOf<Hct>();
  });

  it('defaults K to never and S to SpecVersion when the recipe pins neither', () => {
    // K = never collapses ${K}Palette to never — Theme<never> equals
    // Theme exactly, with no extra-palette surface. S defaults to the
    // union SpecVersion, so spec-dependent slots stay optional.
    const theme = computeTheme(plainRecipe);
    expectTypeOf(theme).toEqualTypeOf<Theme>();
  });

  it('threads S through Recipe<K, S> to Theme<K, S> on `2021`', () => {
    // Recipe<'brand', '2021'> narrows specVersion to the literal; the
    // returned Theme carries the same literal, and ModalRoles<K, '2021'>
    // gates out the *Dim quartet entirely — the keys do not exist on
    // the type, mirroring MCU's spec-2021 role catalogue.
    const theme = computeTheme(brandRecipe2021);
    expectTypeOf(theme).toEqualTypeOf<Theme<'brand', '2021'>>();
    expectTypeOf(theme.specVersion).toEqualTypeOf<'2021'>();
    expectTypeOf<'primaryDim'>().not.toExtend<keyof typeof theme.dark.roles>();
    expectTypeOf<'errorDim'>().not.toExtend<keyof typeof theme.light.roles>();
  });

  it('threads S through Recipe<K, S> to Theme<K, S> on `2025`', () => {
    // Recipe<'brand', '2025'> narrows the spec-dependent slots to
    // required Hct — spec-2025 always emits the *Dim quartet.
    const theme = computeTheme(brandRecipe2025);
    expectTypeOf(theme).toEqualTypeOf<Theme<'brand', '2025'>>();
    expectTypeOf(theme.specVersion).toEqualTypeOf<'2025'>();
    expectTypeOf(theme.dark.roles.primaryDim).toEqualTypeOf<Hct>();
    expectTypeOf(theme.light.roles.errorDim).toEqualTypeOf<Hct>();
  });
});
