// imports
//
import {
  type CustomColor,
  DynamicScheme,
  Hct,

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
  Hct,

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
export type Color = Hct | HexColor | number;
export type ColorMap<K extends string> = Record<K, Hct>;

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

export const argbFromHct = (c: Hct) => {
  if (c instanceof Hct) {
    return c.toInt();
  }
  throw new TypeError('not Hct object');
};

export const argbFromHex = (hex: string) => mcuArgbFromHex(hexFromString(hex));
export const hexFromArgb = (argb: number) => mcuHexFromArgb(argb) as HexColor;
export const hexFromHct = (c: Hct) => hexFromArgb(argbFromHct(c));
export const hctFromHex = (hex: string) => Hct.fromInt(argbFromHex(hex));
export const hctFromArgb = (argb: number) => Hct.fromInt(argb);

export const arrayFromArgb = (argb: number): number[] => [
  alphaFromArgb(argb),
  redFromArgb(argb),
  greenFromArgb(argb),
  blueFromArgb(argb),
];

export const rgbFromArgb = (argb: number) => {
  const [, r, g, b] = arrayFromArgb(argb);
  return `rgb(${r} ${g} ${b})`;
};

export const rgbFromHct = (c: Hct) => rgbFromArgb(argbFromHct(c));

/**
 * @param value - color to convert to Hct.
 * @returns Hct representation of the given color.
 */
export const hct = (value: string | Hct | number): Hct => {
  if (value instanceof Hct) {
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
export const argb = (value: string | Hct | number): number => {
  if (value instanceof Hct) {
    return argbFromHct(value);
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
export const hex = (value: string | Hct | number): HexColor => {
  if (value instanceof Hct) {
    return hexFromHct(value);
  } else if (typeof value === 'number') {
    return hexFromArgb(value);
  } else {
    return hexFromString(value);
  }
};
