// dependencies
//
import {
  type CustomColor,
  Hct,

  customColor as customColorFromArgb,
} from '@poupe/material-color-utilities';

// re-export
//
export {
  customColor as customColorFromArgb,
} from '@poupe/material-color-utilities';

export {
  formatCSSRules,
  formatCSSRulesArray,
} from '@poupe/css';

export * from './colors';
export * from './default-colors';
export * from './formatter';
export * from './mix';
export * from './types';

// tools
//
export const customColorFromHct = (source: Hct, color: CustomColor) => customColorFromArgb(source.toInt(), color);

export const hexColorPattern = /^#([\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/i;
export const isHexColor = (s: string = '') => !!hexColorPattern.test(s || '');
