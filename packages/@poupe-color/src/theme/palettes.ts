import {
  Blend,
  DynamicScheme,
  type Hct,
  TonalPalette,
} from '@poupe/material-color-utilities';

import {
  type ARGB,
  type PaletteKey,
  paletteKeys,
  type SeedOptions,
} from '../types';
import {
  argbFromHCT,
  keys,
} from '../utils';

import type { ThemeSubstrate } from './substrate';
import { expandSeed } from './seeds';

/**
 * The six core MD3 tonal palettes for one mode, named to match the
 * `${name}Palette` accessors a `ModalTheme` exposes so the result can
 * be spread directly into the Modal.
 */
export type SchemePalettes = {
  readonly errorPalette: TonalPalette
  readonly neutralPalette: TonalPalette
  readonly neutralVariantPalette: TonalPalette
  readonly primaryPalette: TonalPalette
  readonly secondaryPalette: TonalPalette
  readonly tertiaryPalette: TonalPalette
};

/**
 * Build `TonalPalette` pins for every entry in a `SeedOptions` map.
 *
 * For each slot the seed is canonicalised via {@link expandSeed} with
 * the supplied `defaultBlend`; the resolved value is harmonised
 * against `source` via `Blend.harmonize` when `blend` is `true`, or
 * passed through raw on `blend: false`; the result feeds
 * `TonalPalette.fromHct(hct(argb))`.
 *
 * The map is sparse: only slots the input table set become entries
 * in the output. Unset slots are absent — downstream consumers fall
 * through to MCU's variant pipeline (for the baseline core path) or
 * inherit the baseline palette by reference (for overlay paths).
 *
 * One factory covers every layer of the Recipe → Theme pipeline.
 * Callers vary `defaultBlend` per layer: baseline maps default to
 * `true` (harmonise unless opted out), per-mode overlays default to
 * `false` (raw pin unless opted in).
 */
export const makePalettes = <K extends string>(
  source: Hct,
  table: Partial<Record<K, SeedOptions>> | undefined,
  defaultBlend: boolean,
  hct: (argb: ARGB) => Hct,
): Partial<Record<K, TonalPalette>> => {
  const out: Partial<Record<K, TonalPalette>> = {};
  if (!table) return out;
  const sourceARGB: ARGB = argbFromHCT(source);
  for (const k of keys(table)) {
    const entry = expandSeed(table[k], defaultBlend);
    if (entry === undefined) continue;
    const argb: ARGB = entry.blend ?
      (Blend.harmonize(entry.value, sourceARGB) as ARGB) :
      entry.value;
    out[k] = TonalPalette.fromHct(hct(argb));
  }
  return out;
};

/**
 * Fill the canonical six core {@link SchemePalettes} from
 * pre-built `TonalPalette` pins plus the global substrate.
 *
 * Pinned slots are threaded into a stub `DynamicScheme` as overrides
 * and read back off the resulting palette set; unset slots fall
 * through to MCU's variant pipeline, which derives them from
 * `sourceColorHct = source`.
 *
 * Implementation: build a stub `DynamicScheme` to read off the merged
 * palette set (MCU doesn't expose variant palette logic as a separate
 * API), then discard. The palettes flow into a real `DynamicScheme`
 * in `buildModalTheme` per mode so role colours derive against the
 * mode-resolved set.
 *
 * `contrastLevel: 0` / `isDark: false` are stub values — the palette
 * set MCU computes does not depend on contrast or mode, only on the
 * source HCT and the variant. The stub never produces a role colour.
 */
export const fillCorePalettes = (
  source: Hct,
  pins: Partial<Record<PaletteKey, TonalPalette>>,
  substrate: ThemeSubstrate,
): SchemePalettes => {
  const overrides: Partial<Record<`${PaletteKey}Palette`, TonalPalette>> = {};
  for (const k of paletteKeys) {
    const pin = pins[k];
    if (pin !== undefined) overrides[`${k}Palette`] = pin;
  }

  const stub = new DynamicScheme({
    sourceColorHct: source,

    contrastLevel: 0,
    specVersion: substrate.specVersion,
    variant: substrate.variant,

    ...overrides,

    isDark: false,
  });

  return {
    errorPalette: stub.errorPalette,
    neutralPalette: stub.neutralPalette,
    neutralVariantPalette: stub.neutralVariantPalette,
    primaryPalette: stub.primaryPalette,
    secondaryPalette: stub.secondaryPalette,
    tertiaryPalette: stub.tertiaryPalette,
  };
};

/**
 * Overlay a per-mode `TonalPalette` pin map onto a baseline
 * {@link SchemePalettes} set.
 *
 * For every {@link PaletteKey} present in `overlay`, the
 * `${k}Palette` slot is replaced by reference. Slots absent from
 * `overlay` inherit the baseline palette by reference.
 *
 * When `overlay` is empty (or every entry is absent), the baseline
 * set is returned by reference — preserving cross-mode reference
 * identity on palettes without an overlay pin.
 */
export const overlayCorePalettes = (
  baseline: SchemePalettes,
  overlay: Partial<Record<PaletteKey, TonalPalette>>,
): SchemePalettes => {
  const hasOverlay = paletteKeys.some((k) => overlay[k] !== undefined);
  if (!hasOverlay) return baseline;

  const out: Record<string, TonalPalette> = { ...baseline };
  for (const k of paletteKeys) {
    const pin = overlay[k];
    if (pin !== undefined) out[`${k}Palette`] = pin;
  }
  return out as SchemePalettes;
};
