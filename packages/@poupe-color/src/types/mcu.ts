/**
 * MCU surface for `@poupe/color`.
 *
 * Centralises the MCU types (both explicitly-exported and inferred) plus
 * the value catalogues whose types derive from them, so the MCU surface
 * flows through one module. Use-site code imports MCU's runtime classes
 * direct from `@poupe/material-color-utilities`.
 */

import type { DynamicScheme } from '@poupe/material-color-utilities';

// Explicit re-exports — classes and enums MCU's package barrel
// exposes by name. Re-exported in value form so consumers get both
// the runtime binding and the inherent type binding; internal
// type-only consumers use `import type` to pull just the type side.
export {
  // colour primitives
  Hct,
  TonalPalette,

  // dynamic scheme + its variant enum
  DynamicScheme,
  Variant,
} from '@poupe/material-color-utilities';

/**
 * MCU specification year. Inferred from `DynamicScheme.specVersion`.
 */
export type SpecVersion = DynamicScheme['specVersion'];

/**
 * The six MCU palette keys — names of the core tonal palettes that
 * `DynamicScheme` accepts and exposes (`primaryPalette`,
 * `secondaryPalette`, `tertiaryPalette`, `neutralPalette`,
 * `neutralVariantPalette`, `errorPalette`), with the trailing
 * `Palette` suffix dropped.
 *
 * Order matches MCU's natural palette ordering, so iterating
 * `paletteKeys` reproduces the sequence MCU's accessors return.
 */
export const paletteKeys = [
  'primary',
  'secondary',
  'tertiary',
  'neutral',
  'neutralVariant',
  'error',
] as const;

/** Name of an MCU core tonal palette (no `Palette` suffix). */
export type PaletteKey = typeof paletteKeys[number];
