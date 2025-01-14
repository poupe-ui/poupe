// imports
//
import {
  type CustomColor,
  DynamicScheme,
  Hct as HCT,

  customColor as customColorFromArgb,

  alphaFromArgb,
  redFromArgb,
  greenFromArgb,
  blueFromArgb,

  argbFromHex as mcuArgbFromHex,
  hexFromArgb as mcuHexFromArgb,
} from '@material/material-color-utilities';

// re-export
//
export {
  type CSSRuleObject,

  formatCSSRuleObjects,
} from './utils';

export {
  type CustomColor,
  DynamicScheme,
  Hct as HCT,

  customColor as customColorFromArgb,

  alphaFromArgb,
  redFromArgb,
  greenFromArgb,
  blueFromArgb,
} from '@material/material-color-utilities';

// DynamicScheme
//
export type standardDynamicSchemeFactory = (primary: Color, isDark: boolean, contrastLevel: number) => DynamicScheme;

// types
//
export type HexColor = `#${string}`;
export type Color = HCT | HexColor | number;
export type ColorMap<K extends string> = Record<K, HCT>;

// tools
//
export const customColorFromHCT = (source: HCT, color: CustomColor) => customColorFromArgb(source.toInt(), color);

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

export const argbFromHCT = (c: HCT) => {
  if (c instanceof HCT) {
    return c.toInt();
  }
  throw new TypeError('not HCT object');
};

export const argbFromHex = (hex: string) => mcuArgbFromHex(hexFromString(hex));
export const hexFromArgb = (argb: number) => mcuHexFromArgb(argb) as HexColor;
export const hexFromHCT = (c: HCT) => hexFromArgb(argbFromHCT(c));
export const hctFromHex = (hex: string) => HCT.fromInt(argbFromHex(hex));
export const hctFromArgb = (argb: number) => HCT.fromInt(argb);

export type ARGB = {
  a?: number
  r: number
  g: number
  b: number
};

export const splitArgb = (argb: number): ARGB => {
  return {
    a: alphaFromArgb(argb),
    r: redFromArgb(argb),
    g: greenFromArgb(argb),
    b: blueFromArgb(argb),
  };
};

export const rgbFromArgb = (argb: number) => {
  const { r, g, b } = splitArgb(argb);
  return `rgb(${r} ${g} ${b})`;
};

export const rgbFromHCT = (c: HCT) => rgbFromArgb(argbFromHCT(c));

export type HSL = {
  a?: number
  h: number
  s: number
  l: number
};

export const hslFromArgb = (argb: number): HSL => {
  const { a: a255 = 0, r: r255, g: g255, b: b255 } = splitArgb(argb);
  const a = a255 / 255;
  const r = r255 / 255;
  const g = g255 / 255;
  const b = b255 / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const sum = max + min;
  const diff = max - min;

  let h = 0;
  let s = 0;
  const l = sum / 2;

  if (diff !== 0) {
    s = l >= 0.5 ? diff / (2 - sum) : diff / sum;
    if (max === r) {
      h = 0 + ((g - b) / diff);
    } else if (max === g) {
      h = 2 + ((b - r) / diff);
    } else {
      h = 4 + ((r - g) / diff);
    }
  }

  return {
    a: a * 100,
    h: h * 60,
    s: s * 100,
    l: l * 100,
  };
};

export const hslFromHCT = (c: HCT): HSL => hslFromArgb(argbFromHCT(c));

/**
 * @param value - color to convert to HCT.
 * @returns HCT representation of the given color.
 */
export const hct = (value: string | HCT | number): HCT => {
  if (value instanceof HCT) {
    return value;
  } else if (typeof value === 'number') {
    return hctFromArgb(value);
  } else {
    return hctFromHex(value);
  }
};

/**
 * @param value - color to convert to ARGB
 * @returns ARGB representation of the given color.
 */
export const argb = (value: string | HCT | number): number => {
  if (value instanceof HCT) {
    return argbFromHCT(value);
  } else if (typeof value === 'number') {
    return value;
  } else {
    return argbFromHex(value);
  }
};

/**
 * @param value - color to convert to HexColor
 * @returns HexColor representation of the given Color.
 */
export const hex = (value: string | HCT | number): HexColor => {
  if (value instanceof HCT) {
    return hexFromHCT(value);
  } else if (typeof value === 'number') {
    return hexFromArgb(value);
  } else {
    return hexFromString(value);
  }
};
