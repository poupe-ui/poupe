// imports
//
import {
  ColorGroup,
  CustomColor,
  Hct,
  MaterialDynamicColors,

  customColor as customColorFromArgb,

  argbFromHex as mcuArgbFromHex,
  hexFromArgb as mcuHexFromArgb,
} from '@material/material-color-utilities';

// re-export
//
export {
  CustomColor,
  Hct,

  customColor as customColorFromArgb,

} from '@material/material-color-utilities';

// types
//
export type HexColor = `#${string}`;
export type Color = Hct | HexColor | number;

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

// tools
//
export const customColorFromHct = (source: Hct, color: CustomColor) => customColorFromArgb(source.toInt(), color);

export const hexColorPattern = /^#([\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/i;
export const isHexColor = (s: string = '') => !!hexColorPattern.test(s || '');

export function hexFromString(value: string): HexColor {
  if (isHexColor(value))
    return value as HexColor;
  else if (isHexColor('#' + value))
    return '#' + value as HexColor;
  else
    throw new TypeError('not HexColor string');
}

export const argbFromHct = (c: Hct) => c.toInt();
export const argbFromHex = (hex: string) => mcuArgbFromHex(hexFromString(hex));
export const hexFromArgb = (argb: number) => mcuHexFromArgb(argb) as HexColor;
export const hexFromHct = (c: Hct) => hexFromArgb(argbFromHct(c));
export const hctFromHex = (hex: string) => Hct.fromInt(argbFromHex(hex));
export const hctFromArgb = (argb: number) => Hct.fromInt(argb);

export const hct = (value: string | Hct | number): Hct => {
  if (typeof value === 'object')
    return value;
  return typeof value === 'number' ? hctFromArgb(value) : hctFromHex(value);
};

export const argb = (value: string | Hct | number): number => {
  if (typeof value === 'number')
    return value;
  return typeof value === 'object' ? argbFromHct(value) : argbFromHex(value);
};

export const hex = (value: string | Hct | number): HexColor => {
  if (typeof value === 'number')
    return hexFromArgb(value) as HexColor;
  else if (typeof value === 'object')
    return hexFromHct(value) as HexColor;
  else
    return hexFromString(value);
};
