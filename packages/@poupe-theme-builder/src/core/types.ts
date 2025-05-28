import {
  Hct,
} from '@poupe/material-color-utilities';

import {
  type AnyColor,
  type RgbColor,
  Colord,
} from 'colord';

export {
  type CustomColor,
  DynamicScheme,
  Hct,
} from '@poupe/material-color-utilities';

export {
  type AnyColor,
  type RgbColor,
  type HslColor,
  type HslaColor,
  Colord,
} from 'colord';

export type ColorMap<K extends string> = Record<K, Hct>;

export type HexColor = `#${string}`;

/** {@link RgbColor} variant with optional alpha value */
export type RgbaColor = RgbColor & { a?: number };

/** destructured {@link Hct} color with optional alpha value */
export interface HctColor {
  h: number
  c: number
  t: number
  a?: number
}

/** ObjectColor represents a destructured Color object */
export type ObjectColor = HctColor | Exclude<AnyColor, string>;

/** Color is any accepted color representation */
export type Color = Hct | Colord | ObjectColor | number | string;
