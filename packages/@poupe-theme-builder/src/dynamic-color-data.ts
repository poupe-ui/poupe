import {
  type ColorGroup,
  MaterialDynamicColors,
  SchemeContent,
  SchemeExpressive,
  SchemeFidelity,
  SchemeMonochrome,
  SchemeNeutral,
  SchemeTonalSpot,
  SchemeVibrant,
} from '@poupe/material-color-utilities';

import {
  type standardDynamicSchemeFactory,
  hct,
} from './core';

// CustomDynamicColor
//
export const customDynamicColors = {
  '{}': (cc: ColorGroup) => cc.color,
  '{}-container': (cc: ColorGroup) => cc.colorContainer,
  'on-{}': (cc: ColorGroup) => cc.onColor,
  'on-{}-container': (cc: ColorGroup) => cc.onColorContainer,
} satisfies Record<string, (cc: ColorGroup) => number>;

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
  'surface': MaterialDynamicColors.surface,
  'surface-dim': MaterialDynamicColors.surfaceDim,
  'surface-bright': MaterialDynamicColors.surfaceBright,
  'surface-variant': MaterialDynamicColors.surfaceVariant,
  'surface-container-lowest': MaterialDynamicColors.surfaceContainerLowest,
  'surface-container-low': MaterialDynamicColors.surfaceContainerLow,
  'surface-container': MaterialDynamicColors.surfaceContainer,
  'surface-container-high': MaterialDynamicColors.surfaceContainerHigh,
  'surface-container-highest': MaterialDynamicColors.surfaceContainerHighest,
  'inverse-surface': MaterialDynamicColors.inverseSurface,

  // on-surface-{}
  'on-surface': MaterialDynamicColors.onSurface,
  'on-surface-dim': MaterialDynamicColors.onSurface,
  'on-surface-bright': MaterialDynamicColors.onSurface,
  'on-surface-variant': MaterialDynamicColors.onSurfaceVariant,
  'on-surface-container-lowest': MaterialDynamicColors.onSurface,
  'on-surface-container-low': MaterialDynamicColors.onSurface,
  'on-surface-container': MaterialDynamicColors.onSurface,
  'on-surface-container-high': MaterialDynamicColors.onSurface,
  'on-surface-container-highest': MaterialDynamicColors.onSurface,
  'on-inverse-surface': MaterialDynamicColors.inverseOnSurface,

  // primary
  'primary': MaterialDynamicColors.primary,
  'primary-container': MaterialDynamicColors.primaryContainer,
  'primary-fixed': MaterialDynamicColors.secondaryFixed,
  'primary-fixed-dim': MaterialDynamicColors.secondaryFixedDim,
  'inverse-primary': MaterialDynamicColors.inversePrimary,
  // on-primary
  'on-primary': MaterialDynamicColors.onPrimary,
  'on-primary-container': MaterialDynamicColors.onPrimaryContainer,
  'on-primary-fixed': MaterialDynamicColors.onSecondaryFixed,
  'on-primary-fixed-variant': MaterialDynamicColors.onSecondaryFixedVariant,

  // secondary
  'secondary': MaterialDynamicColors.secondary,
  'secondary-container': MaterialDynamicColors.secondaryContainer,
  'secondary-fixed': MaterialDynamicColors.secondaryFixed,
  'secondary-fixed-dim': MaterialDynamicColors.secondaryFixedDim,
  // on-secondary
  'on-secondary': MaterialDynamicColors.onSecondary,
  'on-secondary-container': MaterialDynamicColors.onSecondaryContainer,
  'on-secondary-fixed': MaterialDynamicColors.onSecondaryFixed,
  'on-secondary-fixed-variant': MaterialDynamicColors.onSecondaryFixedVariant,

  // tertiary
  'tertiary': MaterialDynamicColors.tertiary,
  'tertiary-container': MaterialDynamicColors.tertiaryContainer,
  'tertiary-fixed': MaterialDynamicColors.tertiaryFixed,
  'tertiary-fixed-dim': MaterialDynamicColors.tertiaryFixedDim,
  // on-tertiary
  'on-tertiary': MaterialDynamicColors.onTertiary,
  'on-tertiary-container': MaterialDynamicColors.onTertiaryContainer,
  'on-tertiary-fixed': MaterialDynamicColors.onTertiaryFixed,
  'on-tertiary-fixed-variant': MaterialDynamicColors.onTertiaryFixedVariant,

  // error
  'error': MaterialDynamicColors.error,
  'error-container': MaterialDynamicColors.errorContainer,
  // on-error
  'on-error': MaterialDynamicColors.onError,
  'on-error-container': MaterialDynamicColors.onErrorContainer,

  // special
  'outline': MaterialDynamicColors.outline,
  'outline-variant': MaterialDynamicColors.outlineVariant,
  'shadow': MaterialDynamicColors.shadow,
  'scrim': MaterialDynamicColors.scrim,
};

/** contentAccentToneDelta is re-exported from MaterialDynamicColors for completeness */
export const contentAccentToneDelta = MaterialDynamicColors.contentAccentToneDelta;

/** StandardDynamicColorKey is a type representing all fields in standardDynamicColors */
export type StandardDynamicColorKey = keyof typeof standardDynamicColors;

/** standardDynamicColorKeys is an array of all StandardDynamicColorKey values */
export const standardDynamicColorKeys = Object.keys(standardDynamicColors) as StandardDynamicColorKey[];

/** standardPaletteKeyColors are all palette key colors defined by MaterialDynamicColors */
export const standardPaletteKeyColors = {
  'primary': MaterialDynamicColors.primaryPaletteKeyColor,
  'secondary': MaterialDynamicColors.secondaryPaletteKeyColor,
  'tertiary': MaterialDynamicColors.tertiaryPaletteKeyColor,
  'neutral': MaterialDynamicColors.neutralPaletteKeyColor,
  'neutral-variant': MaterialDynamicColors.neutralVariantPaletteKeyColor,
};

/** StandardPaletteKey is a type representing all palette key colors is standardPaletteKeyColors */
export type StandardPaletteKey = keyof typeof standardPaletteKeyColors;

/** standardPaletteKeys is an array of all StandardPaletteKey values */
export const standardPaletteKeys = Object.keys(standardPaletteKeyColors) as StandardPaletteKey[];

// DynamicScheme
//
export const standardDynamicSchemes = {
  content: (primary, isDark = false, contrastLevel = 0) => new SchemeContent(hct(primary), isDark, contrastLevel),
  expressive: (primary, isDark = false, contrastLevel = 0) => new SchemeExpressive(hct(primary), isDark, contrastLevel),
  fidelity: (primary, isDark = false, contrastLevel = 0) => new SchemeFidelity(hct(primary), isDark, contrastLevel),
  monochrome: (primary, isDark = false, contrastLevel = 0) => new SchemeMonochrome(hct(primary), isDark, contrastLevel),
  neutral: (primary, isDark = false, contrastLevel = 0) => new SchemeNeutral(hct(primary), isDark, contrastLevel),
  tonalSpot: (primary, isDark = false, contrastLevel = 0) => new SchemeTonalSpot(hct(primary), isDark, contrastLevel),
  vibrant: (primary, isDark = false, contrastLevel = 0) => new SchemeVibrant(hct(primary), isDark, contrastLevel),
} satisfies Record<string, standardDynamicSchemeFactory>;

export type StandardDynamicSchemeKey = keyof typeof standardDynamicSchemes;
