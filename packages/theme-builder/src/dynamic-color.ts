// imports
//
import {
  CustomColor,
  Hct,

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
