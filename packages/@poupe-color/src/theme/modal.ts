import {
  DynamicScheme,
  type Hct,
  type TonalPalette,
} from '@poupe/material-color-utilities';

import type {
  ModalPalettes,
  ModalRoles,
  ModalTheme,
  SpecVersion,
} from '../types';
import { capitalize } from '../utils';

import type { SchemePalettes } from './palettes';
import type { ThemeSubstrate } from './substrate';
import { extractRoles } from './roles';

/**
 * Material Design 3 anchor tones for the extra-role four-quad. Static
 * by design: bespoke extra palettes sit outside MCU's standard-role
 * contrast curves, so the tones do not vary with `contrast` / `variant`
 * / `specVersion`. Mirrors the per-mode quartet `MaterialDynamicColors`
 * pins for `primary` / `onPrimary` / `primaryContainer` /
 * `onPrimaryContainer` at standard contrast.
 */
const EXTRA_ANCHORS = {
  dark: { color: 80, onColor: 20, container: 30, onContainer: 90 },
  light: { color: 40, onColor: 100, container: 90, onContainer: 10 },
} as const;

/**
 * Build a {@link ModalTheme}<K> for one mode from pre-computed standard
 * palettes, the resolved per-mode source colour, the global substrate,
 * the mode flag, the per-mode extra-palette map, and the
 * symmetry-validated extra-key list.
 *
 * Composition: a `DynamicScheme` with the standard palettes pinned
 * generates the standard role colours; the six standard palettes copy
 * through under their bare names; for every key in `extraKeys`, the
 * four-quad role colours pin to the MD3 anchor tones for the mode and
 * the palette itself is exposed under its bare name.
 *
 * Extra palettes arrive pre-built from `makePalettes` — baseline
 * entries are already harmonised against `Theme.source` (default
 * `blend: true`); per-mode overrides are raw by default. This module
 * is concerned only with anchor-tone extraction.
 *
 * `extraKeys` comes from `pickExtraKeys` and is the alphabetical union
 * of declared extras across baseline / dark / light. Symmetry
 * guarantees `extra[k]` is materially present for every k in the list,
 * so the lookups are non-null.
 *
 * `K` threads from the {@link Recipe} input as `Recipe<K, S>` so `computeTheme<K, S>`
 * preserves the extra-role catalogue end-to-end at the type level. `S`
 * forwards the spec literal so `ModalRoles<K, S>` gates the
 * spec-dependent `*Dim` slots — absent on `'2021'`, required `Hct` on
 * `'2025'`. The `as ModalRoles<K, S>` cast remains because TS cannot
 * prove the dynamic-role iteration in `extractRoles` covers every
 * `RequiredStandardRole`; the runtime promise holds.
 */
export const buildModalTheme = <
  K extends string = never,
  S extends SpecVersion = SpecVersion,
>(
  palettes: SchemePalettes,
  source: Hct,
  substrate: ThemeSubstrate<S>,
  isDark: boolean,
  extra: Partial<Record<K, TonalPalette>>,
  extraKeys: readonly K[],
): ModalTheme<K, S> => {
  const scheme = new DynamicScheme({
    sourceColorHct: source,

    contrastLevel: substrate.contrast,
    specVersion: substrate.specVersion,
    variant: substrate.variant,

    errorPalette: palettes.errorPalette,
    neutralPalette: palettes.neutralPalette,
    neutralVariantPalette: palettes.neutralVariantPalette,
    primaryPalette: palettes.primaryPalette,
    secondaryPalette: palettes.secondaryPalette,
    tertiaryPalette: palettes.tertiaryPalette,

    isDark,
  });

  const anchors = isDark ? EXTRA_ANCHORS.dark : EXTRA_ANCHORS.light;
  const extraRoles: Record<string, Hct> = {};
  const extraPalettesOut: Record<string, TonalPalette> = {};

  for (const k of extraKeys) {
    const palette = extra[k]!;
    const cap = capitalize(k);

    extraPalettesOut[k] = palette;
    extraRoles[k] = palette.getHct(anchors.color);
    extraRoles[`on${cap}`] = palette.getHct(anchors.onColor);
    extraRoles[`${k}Container`] = palette.getHct(anchors.container);
    extraRoles[`on${cap}Container`] = palette.getHct(anchors.onContainer);
  }

  const roles = {
    ...extractRoles(scheme),
    ...extraRoles,
  } as ModalRoles<K, S>;

  const palettesOut = {
    error: palettes.errorPalette,
    neutral: palettes.neutralPalette,
    neutralVariant: palettes.neutralVariantPalette,
    primary: palettes.primaryPalette,
    secondary: palettes.secondaryPalette,
    tertiary: palettes.tertiaryPalette,
    ...extraPalettesOut,
  } as ModalPalettes<K>;

  return {
    mode: isDark ? 'dark' : 'light',
    source,
    scheme,
    roles,
    palettes: palettesOut,
  };
};
