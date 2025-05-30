import {
  MaterialDynamicColors,
} from '@poupe/material-color-utilities';

import {
  type ColorGroup,
  DynamicScheme,
  Hct,
  TonalPalette,
  Variant,
} from './core/types';

// CustomDynamicColor
//
export const customDynamicColors = {
  '{}': (cc: ColorGroup) => cc.color,
  '{}-container': (cc: ColorGroup) => cc.colorContainer,
  'on-{}': (cc: ColorGroup) => cc.onColor,
  'on-{}-container': (cc: ColorGroup) => cc.onColorContainer,
} satisfies Record<string, (cc: ColorGroup) => Hct>;

export type CustomDynamicColorKey<T extends string> =
  `${T}` |
  `${T}-container` |
  `on-${T}` |
  `on-${T}-container`;

// StandardDynamicColor
//

/** standardDynamicColors are all dynamic colors defined by Material Design 3 */
export const standardDynamicColors = {
  // surface-{}
  'surface': (ds: DynamicScheme) => ds.surface,
  'surface-dim': (ds: DynamicScheme) => ds.surfaceDim,
  'surface-bright': (ds: DynamicScheme) => ds.surfaceBright,
  'surface-variant': (ds: DynamicScheme) => ds.surfaceVariant,
  'surface-container-lowest': (ds: DynamicScheme) => ds.surfaceContainerLowest,
  'surface-container-low': (ds: DynamicScheme) => ds.surfaceContainerLow,
  'surface-container': (ds: DynamicScheme) => ds.surfaceContainer,
  'surface-container-high': (ds: DynamicScheme) => ds.surfaceContainerHigh,
  'surface-container-highest': (ds: DynamicScheme) => ds.surfaceContainerHighest,
  'inverse-surface': (ds: DynamicScheme) => ds.inverseSurface,

  // on-surface-{}
  'on-surface': (ds: DynamicScheme) => ds.onSurface,
  'on-surface-dim': (ds: DynamicScheme) => ds.onSurface,
  'on-surface-bright': (ds: DynamicScheme) => ds.onSurface,
  'on-surface-variant': (ds: DynamicScheme) => ds.onSurfaceVariant,
  'on-surface-container-lowest': (ds: DynamicScheme) => ds.onSurface,
  'on-surface-container-low': (ds: DynamicScheme) => ds.onSurface,
  'on-surface-container': (ds: DynamicScheme) => ds.onSurface,
  'on-surface-container-high': (ds: DynamicScheme) => ds.onSurface,
  'on-surface-container-highest': (ds: DynamicScheme) => ds.onSurface,
  'on-inverse-surface': (ds: DynamicScheme) => ds.inverseOnSurface,

  // primary
  'primary': (ds: DynamicScheme) => ds.primary,
  'primary-container': (ds: DynamicScheme) => ds.primaryContainer,
  'primary-fixed': (ds: DynamicScheme) => ds.primaryFixed,
  'primary-fixed-dim': (ds: DynamicScheme) => ds.primaryFixedDim,
  'inverse-primary': (ds: DynamicScheme) => ds.inversePrimary,
  // on-primary
  'on-primary': (ds: DynamicScheme) => ds.onPrimary,
  'on-primary-container': (ds: DynamicScheme) => ds.onPrimaryContainer,
  'on-primary-fixed': (ds: DynamicScheme) => ds.onPrimaryFixed,
  'on-primary-fixed-variant': (ds: DynamicScheme) => ds.onPrimaryFixedVariant,

  // secondary
  'secondary': (ds: DynamicScheme) => ds.secondary,
  'secondary-container': (ds: DynamicScheme) => ds.secondaryContainer,
  'secondary-fixed': (ds: DynamicScheme) => ds.secondaryFixed,
  'secondary-fixed-dim': (ds: DynamicScheme) => ds.secondaryFixedDim,
  // on-secondary
  'on-secondary': (ds: DynamicScheme) => ds.onSecondary,
  'on-secondary-container': (ds: DynamicScheme) => ds.onSecondaryContainer,
  'on-secondary-fixed': (ds: DynamicScheme) => ds.onSecondaryFixed,
  'on-secondary-fixed-variant': (ds: DynamicScheme) => ds.onSecondaryFixedVariant,

  // tertiary
  'tertiary': (ds: DynamicScheme) => ds.tertiary,
  'tertiary-container': (ds: DynamicScheme) => ds.tertiaryContainer,
  'tertiary-fixed': (ds: DynamicScheme) => ds.tertiaryFixed,
  'tertiary-fixed-dim': (ds: DynamicScheme) => ds.tertiaryFixedDim,
  // on-tertiary
  'on-tertiary': (ds: DynamicScheme) => ds.onTertiary,
  'on-tertiary-container': (ds: DynamicScheme) => ds.onTertiaryContainer,
  'on-tertiary-fixed': (ds: DynamicScheme) => ds.onTertiaryFixed,
  'on-tertiary-fixed-variant': (ds: DynamicScheme) => ds.onTertiaryFixedVariant,

  // error
  'error': (ds: DynamicScheme) => ds.error,
  'error-container': (ds: DynamicScheme) => ds.errorContainer,
  // on-error
  'on-error': (ds: DynamicScheme) => ds.onError,
  'on-error-container': (ds: DynamicScheme) => ds.onErrorContainer,

  // special
  'outline': (ds: DynamicScheme) => ds.outline,
  'outline-variant': (ds: DynamicScheme) => ds.outlineVariant,
  'shadow': (ds: DynamicScheme) => ds.shadow,
  'scrim': (ds: DynamicScheme) => ds.scrim,
} satisfies Record<string, (ds: DynamicScheme) => number>;

/** contentAccentToneDelta is re-exported from MaterialDynamicColors for completeness */
export const contentAccentToneDelta = MaterialDynamicColors.contentAccentToneDelta;

/** StandardDynamicColorKey is a type representing all fields in standardDynamicColors */
export type StandardDynamicColorKey = keyof typeof standardDynamicColors;

/** standardDynamicColorKeys is an array of all StandardDynamicColorKey values */
export const standardDynamicColorKeys = Object.keys(standardDynamicColors) as StandardDynamicColorKey[];

/** standardPaletteKeyColors are all palette key colors defined by MaterialDynamicColors */
export const standardPalettes = {
  primary: (ds: DynamicScheme) => ds.primaryPalette,
  secondary: (ds: DynamicScheme) => ds.secondaryPalette,
  tertiary: (ds: DynamicScheme) => ds.tertiaryPalette,
  neutral: (ds: DynamicScheme) => ds.neutralPalette,
  neutralVariant: (ds: DynamicScheme) => ds.neutralVariantPalette,
} satisfies Record<string, (ds: DynamicScheme) => TonalPalette>;

/** StandardPaletteKey is a type representing all core palettes in standardPalettes */
export type StandardPaletteKey = keyof typeof standardPalettes;

/** standardPaletteKeys is an array of all StandardPaletteKey values */
export const standardPaletteKeys = Object.keys(standardPalettes) as StandardPaletteKey[];

// DynamicScheme
//
export const standardDynamicSchemes = {
  content: Variant.CONTENT,
  expressive: Variant.EXPRESSIVE,
  fidelity: Variant.FIDELITY,
  monochrome: Variant.MONOCHROME,
  neutral: Variant.NEUTRAL,
  tonalSpot: Variant.TONAL_SPOT,
  vibrant: Variant.VIBRANT,
  rainbow: Variant.RAINBOW,
  fruitSalad: Variant.FRUIT_SALAD,
} satisfies Record<string, Variant>;

export type StandardDynamicSchemeKey = keyof typeof standardDynamicSchemes;
