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
  // surface-container-{}
  'surface-container-lowest': MaterialDynamicColors.surfaceContainerLowest,
  'surface-container-low': MaterialDynamicColors.surfaceContainerLow,
  'surface-container': MaterialDynamicColors.surfaceContainer,
  'surface-container-high': MaterialDynamicColors.surfaceContainerHigh,
  'surface-container-highest': MaterialDynamicColors.surfaceContainerHighest,

  // on-surface-{}
  'on-surface': MaterialDynamicColors.onSurface,
  'on-surface-dim': MaterialDynamicColors.onSurface,
  'on-surface-bright': MaterialDynamicColors.onSurface,
  'on-surface-variant': MaterialDynamicColors.onSurfaceVariant,
  // on-surface-container-{}
  'on-surface-container-lowest': MaterialDynamicColors.onSurface,
  'on-surface-container-low': MaterialDynamicColors.onSurface,
  'on-surface-container': MaterialDynamicColors.onSurface,
  'on-surface-container-high': MaterialDynamicColors.onSurface,
  'on-surface-container-highest': MaterialDynamicColors.onSurface,

  // {}
  'primary': MaterialDynamicColors.primary,
  'secondary': MaterialDynamicColors.secondary,
  'tertiary': MaterialDynamicColors.tertiary,
  'error': MaterialDynamicColors.error,

  // {}-container
  'primary-container': MaterialDynamicColors.primaryContainer,
  'secondary-container': MaterialDynamicColors.secondaryContainer,
  'tertiary-container': MaterialDynamicColors.tertiaryContainer,
  'error-container': MaterialDynamicColors.errorContainer,

  // on-{}
  'on-primary': MaterialDynamicColors.onPrimary,
  'on-secondary': MaterialDynamicColors.onSecondary,
  'on-tertiary': MaterialDynamicColors.onTertiary,
  'on-error': MaterialDynamicColors.onError,

  // on-{}-container
  'on-primary-container': MaterialDynamicColors.onPrimaryContainer,
  'on-secondary-container': MaterialDynamicColors.onSecondaryContainer,
  'on-tertiary-container': MaterialDynamicColors.onTertiaryContainer,
  'on-error-container': MaterialDynamicColors.onErrorContainer,

  // inverse
  'inverse-primary': MaterialDynamicColors.inversePrimary,
  'inverse-surface': MaterialDynamicColors.inverseSurface,
  'on-inverse-surface': MaterialDynamicColors.inverseOnSurface,

  // outline
  'outline': MaterialDynamicColors.outline,
  'outline-variant': MaterialDynamicColors.outlineVariant,

  // legacy
  'background': MaterialDynamicColors.surface,
  'on-background': MaterialDynamicColors.onSurface,
  'surface-tint': MaterialDynamicColors.surfaceTint,
  'on-surface-tint': MaterialDynamicColors.onSurface,
};
