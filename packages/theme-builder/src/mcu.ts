import {
  ColorGroup,
  DynamicScheme,
  MaterialDynamicColors,
  Hct,
  SchemeContent,
  SchemeExpressive,
  SchemeFidelity,
  SchemeMonochrome,
  SchemeNeutral,
  SchemeTonalSpot,
  SchemeVibrant,
} from '@material/material-color-utilities';

// DynamicScheme
//
export { DynamicScheme } from '@material/material-color-utilities';

export type DynamicSchemeFactory = (source: Hct, isDark: boolean, contrastLevel: number) => DynamicScheme;

export const standardDynamicSchemes = {
  content: SchemeContent.constructor as DynamicSchemeFactory,
  expressive: SchemeExpressive.constructor as DynamicSchemeFactory,
  fidelity: SchemeFidelity.constructor as DynamicSchemeFactory,
  monochrome: SchemeMonochrome.constructor as DynamicSchemeFactory,
  neutral: SchemeNeutral.constructor as DynamicSchemeFactory,
  tonalSport: SchemeTonalSpot.constructor as DynamicSchemeFactory,
  vibrant: SchemeVibrant.constructor as DynamicSchemeFactory,
};

export type standardDynamicSchemeKey = keyof typeof standardDynamicSchemes;

// DynamicColor
//
export const customDynamicColors: { [pattern: string]: (cc: ColorGroup) => number } = {
  '{}': (cc: ColorGroup) => cc.color,
  '{}-container': (cc: ColorGroup) => cc.colorContainer,
  'on-{}': (cc: ColorGroup) => cc.onColor,
  'on-{}-container': (cc: ColorGroup) => cc.onColorContainer,
};

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

  // palettes
  'primary-palette-key': MaterialDynamicColors.primaryPaletteKeyColor,
  'secondary-palette-key': MaterialDynamicColors.secondaryPaletteKeyColor,
  'tertiary-palette-key': MaterialDynamicColors.tertiaryPaletteKeyColor,
  'neutral-palette-key': MaterialDynamicColors.neutralPaletteKeyColor,
  'neutral-variant-palette-key': MaterialDynamicColors.neutralVariantPaletteKeyColor,

  // special
  'outline': MaterialDynamicColors.outline,
  'outline-variant': MaterialDynamicColors.outlineVariant,
  'shadow': MaterialDynamicColors.shadow,
  'scrim': MaterialDynamicColors.scrim,
};

export const contentAccentToneDelta = MaterialDynamicColors.contentAccentToneDelta;
