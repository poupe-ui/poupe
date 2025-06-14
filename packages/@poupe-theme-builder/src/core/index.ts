// re-export
//
export {
  formatCSSRules,
  formatCSSRulesArray,
  generateCSSRules,
  generateCSSRulesArray,
} from '@poupe/css';

export * from './colors';
export * from './default-colors';
export * from './formatter';
export * from './mix';
export * from './palettes';
export * from './states';
export * from './types';

// tools
//
export const hexColorPattern = /^#([\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/i;
export const isHexColor = (s: string = '') => !!hexColorPattern.test(s || '');
