// dependencies
//
import {
  type CustomColor,
  DynamicScheme,
  Hct,

  customColor as customColorFromArgb,
} from '@material/material-color-utilities';

import {
  type Color,

  argb,
  argbFromHct,
  splitArgb,
} from './core/colors';

// re-export
//
export {
  customColor as customColorFromArgb,
} from '@material/material-color-utilities';

export {
  formatCSSRules,
  formatCSSRulesArray,
} from '@poupe/css';

export * from './core/colors';

// DynamicScheme
//
export type standardDynamicSchemeFactory = (primary: Color, isDark: boolean, contrastLevel: number) => DynamicScheme;

// types
//
export type ColorMap<K extends string> = Record<K, Hct>;

// tools
//
export const customColorFromHct = (source: Hct, color: CustomColor) => customColorFromArgb(source.toInt(), color);

export const hexColorPattern = /^#([\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/i;
export const isHexColor = (s: string = '') => !!hexColorPattern.test(s || '');

export const rgbFromArgb = (argb: number) => {
  const { r, g, b } = splitArgb(argb);
  return `rgb(${r} ${g} ${b})`;
};

export const rgbFromHct = (c: Hct) => rgbFromArgb(argbFromHct(c));
export const rgb = (c: Color) => rgbFromArgb(argb(c));
