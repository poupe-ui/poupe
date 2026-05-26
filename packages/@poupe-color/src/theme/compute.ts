import { Hct } from '@poupe/material-color-utilities';

import type {
  ARGB,
  Recipe,
  SpecVersion,
  Theme,
} from '../types';
import { memoize } from '../utils';

import type { ThemeSubstrate } from './substrate';
import { buildModalTheme } from './modal';
import {
  fillCorePalettes,
  makePalettes,
  overlayCorePalettes,
} from './palettes';
import {
  pickExtraKeys,
  splitSeeds,
} from './split';

/**
 * Compute a `Theme<K, S>` from a `Recipe<K, S>`. See {@link Theme}
 * and {@link Recipe} for the underlying type definitions.
 *
 * Pipeline:
 *
 * 1. **Split** each layer's `seeds` map into core-palette and extra
 *    subsets via {@link splitSeeds}. Names colliding with the
 *    standard or extended role catalogues throw here — those
 *    outputs are tone-selected, never set from ARGB seeds.
 * 2. **Pick extra keys** — {@link pickExtraKeys} validates palette
 *    symmetry (rejecting half-defined extras declared on one overlay
 *    only, with no baseline counterpart) and returns the
 *    alphabetically-sorted union of declared extras across the three
 *    layers. Symmetric declarations are the precondition for the
 *    `${K}Palette` accessor's required contract; the returned list is
 *    a deterministic iteration anchor downstream.
 * 3. **Resolve source** — `recipe.seeds.primary` (mandatory `ARGB`)
 *    converts to `Hct` via the threaded memo and anchors
 *    `Theme.source`. Per-mode overlays do not influence the source —
 *    they only override per-mode palette derivation.
 * 4. **Build palette pins** — {@link makePalettes} runs uniformly
 *    over every `SeedOptions` map: baseline core + extras and each
 *    per-mode core + extras overlay. Baseline maps default
 *    `blend: true` (harmonise against `source`); per-mode overlays
 *    default `blend: false` (raw pin). The output is a sparse
 *    `Partial<Record<X, TonalPalette>>` per layer.
 * 5. **Fill core palettes** — {@link fillCorePalettes} threads the
 *    baseline core pins into a stub `DynamicScheme` so MCU's
 *    variant pipeline fills unset slots. Returns the full six.
 * 6. **Overlay core per mode** — {@link overlayCorePalettes}
 *    replaces pinned slots in the baseline `SchemePalettes` with
 *    the per-mode pins. Unpinned slots inherit by reference.
 * 7. **Compose extras per mode** — baseline extras spread first,
 *    then the per-mode extras overlay. Slots without an overlay pin
 *    are shared by reference across modes.
 * 8. **Assemble** — {@link buildModalTheme} instantiates a
 *    `DynamicScheme` per mode with the resolved palettes pinned,
 *    extracts every standard role's colour, and pins the four-quad
 *    anchor tones for each extra palette.
 *
 * `K` infers from the seed-map literal so IntelliSense flows
 * end-to-end: autocomplete on `recipe.seeds.<key>` and
 * `theme.dark.<key>` / `theme.dark.<key>Palette` mirror the same `K`
 * catalogue. `S` infers from `recipe.specVersion` (literal `'2021'` /
 * `'2025'`); a pinned spec narrows `Theme<K, S>` so spec-dependent
 * `*Dim` slots collapse to `never` on `'2021'` and to required `Hct`
 * on `'2025'`. Callers do not pass either parameter explicitly.
 *
 * One ARGB→HCT memo is threaded through the source conversion and
 * every `makePalettes` call so an ARGB that appears in multiple
 * slots converts once.
 */
export const computeTheme = <
  K extends string = never,
  S extends SpecVersion = SpecVersion,
>(
  recipe: Recipe<K, S>,
): Theme<K, S> => {
  const { contrast, specVersion, variant } = recipe;
  const substrate: ThemeSubstrate<S> = { contrast, specVersion, variant };

  const baseline = splitSeeds(recipe.seeds);
  const dark = splitSeeds(recipe.dark?.seeds);
  const light = splitSeeds(recipe.light?.seeds);

  const extraKeys = pickExtraKeys(baseline.extra, dark.extra, light.extra);

  const hct = memoize<ARGB, Hct>((a) => Hct.fromInt(a));
  const source = hct(recipe.seeds.primary);

  // TODO: fast path when all six core slots are baseline-pinned —
  // skip fillCorePalettes since MCU's variant derivation in the stub
  // DynamicScheme is wasted work when every output is overridden.
  // (Other shapes — no per-mode overlays, no extras anywhere — are
  // already cheap via empty-map short-circuits in the helpers.)

  const baselineCorePins = makePalettes(source, baseline.core, true, hct);
  const darkCorePins = makePalettes(source, dark.core, false, hct);
  const lightCorePins = makePalettes(source, light.core, false, hct);

  const baselineExtras = makePalettes(source, baseline.extra, true, hct);
  const darkExtras = makePalettes(source, dark.extra, false, hct);
  const lightExtras = makePalettes(source, light.extra, false, hct);

  const baselineCore = fillCorePalettes(source, baselineCorePins, substrate);
  const darkCore = overlayCorePalettes(baselineCore, darkCorePins);
  const lightCore = overlayCorePalettes(baselineCore, lightCorePins);

  return {
    source,

    contrast,
    specVersion,
    variant,

    dark: buildModalTheme<K, S>(
      darkCore,
      source,
      substrate,
      true,
      { ...baselineExtras, ...darkExtras },
      extraKeys,
    ),
    light: buildModalTheme<K, S>(
      lightCore,
      source,
      substrate,
      false,
      { ...baselineExtras, ...lightExtras },
      extraKeys,
    ),
  };
};
