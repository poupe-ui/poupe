import type {
  DynamicColor,
  DynamicScheme,
  Hct,
  MaterialDynamicColors,
} from '@poupe/material-color-utilities';

import {
  specDependentRoles,
  specsWithDim,
} from '../types';
import { camelCase } from '../utils';

type ExtraAccessor = readonly [string, (c: MaterialDynamicColors) => DynamicColor | undefined];

/**
 * Camel-cased {@link specDependentRoles} as a lookup set. MCU's
 * `MaterialDynamicColors.colorSpec` is statically the 2026 delegate
 * (which always emits the `*Dim` quartet), so `allColors` carries
 * the quartet's `DynamicColor` instances regardless of the live
 * scheme's spec. The runtime filter below honours the type-level
 * contract that `SpecDependentRole<S>` is `never` for any `S`
 * outside {@link specsWithDim} by dropping these entries when the
 * resolved scheme runs against a non-`specsWithDim` spec (currently
 * only `'2021'`).
 */
const SPEC_DEPENDENT_SET: ReadonlySet<string> = new Set(specDependentRoles);

/**
 * MCU spec versions that ship the spec-dependent role catalogue as a
 * lookup set — the `Set` form of {@link specsWithDim} keyed for fast
 * membership tests in {@link extractRoles}.
 */
const SPECS_WITH_DIM: ReadonlySet<string> = new Set(specsWithDim);

/**
 * (camelCase name, accessor) pairs for every role that
 * {@link extractRoles} pulls in by hand because it sits outside MCU's
 * `MaterialDynamicColors.allColors` enumeration. Every entry is
 * unconditional — the supported specs agree on this set. When a future
 * spec drops or adds an extra, parameterise this on `scheme.specVersion`
 * at the call site.
 *
 * - `scrim` / `shadow` / `surfaceTint` / `surfaceVariant` are defined
 *   on `MaterialDynamicColors` but excluded from `allColors`; pulled
 *   in here so the `RequiredStandardRole` contract on `ModalRoles`
 *   holds.
 * - The six palette key colours are exposed via dedicated accessors,
 *   never enumerated in `allColors`.
 *
 * The `*Dim` quartet stays in `allColors` so it does not appear here.
 */
const EXTRA_ACCESSORS: readonly ExtraAccessor[] = [
  ['scrim', (c) => c.scrim()],
  ['shadow', (c) => c.shadow()],
  ['surfaceTint', (c) => c.surfaceTint()],
  ['surfaceVariant', (c) => c.surfaceVariant()],

  ['errorPaletteKeyColor', (c) => c.errorPaletteKeyColor()],
  ['neutralPaletteKeyColor', (c) => c.neutralPaletteKeyColor()],
  ['neutralVariantPaletteKeyColor', (c) => c.neutralVariantPaletteKeyColor()],
  ['primaryPaletteKeyColor', (c) => c.primaryPaletteKeyColor()],
  ['secondaryPaletteKeyColor', (c) => c.secondaryPaletteKeyColor()],
  ['tertiaryPaletteKeyColor', (c) => c.tertiaryPaletteKeyColor()],
];

/**
 * Walk the `DynamicScheme` role catalogue and extract every role's
 * colour, keyed by camelCase role name.
 *
 * The `*Dim` quartet is always present in `allColors` because MCU's
 * `MaterialDynamicColors.colorSpec` is statically the 2026 delegate,
 * which always emits the quartet. The {@link SPEC_DEPENDENT_SET}
 * check below drops those entries when the live scheme's spec is
 * outside {@link specsWithDim}. {@link EXTRA_ACCESSORS} covers the
 * rest — roles defined on `MaterialDynamicColors` but excluded from
 * `allColors`, plus the six palette key colours.
 */
export const extractRoles = (scheme: DynamicScheme): Record<string, Hct> => {
  const c = scheme.colors;
  const out: Record<string, Hct> = {};
  const dropSpecDependent = !SPECS_WITH_DIM.has(scheme.specVersion);

  for (const dc of c.allColors) {
    const name = camelCase(dc.name);
    if (dropSpecDependent && SPEC_DEPENDENT_SET.has(name)) continue;
    out[name] = scheme.getHct(dc);
  }

  for (const [name, get] of EXTRA_ACCESSORS) {
    const dc = get(c);
    if (dc !== undefined) out[name] = scheme.getHct(dc);
  }

  return out;
};
