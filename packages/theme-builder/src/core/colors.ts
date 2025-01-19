import {
  uint32,
  uint8,
} from './utils';

/*
 * colord
 */
import {
  type AnyColor,
  type RgbColor,
  type HslaColor,
  Colord,

  extend,
  colord as origColord,
} from 'colord';

// extend colord with the mix plugin
import mixPlugin from 'colord/plugins/mix';
extend([mixPlugin]);

/*
 * MCU
 */
import {
  Hct,

  alphaFromArgb,
  redFromArgb,
  greenFromArgb,
  blueFromArgb,
} from '@material/material-color-utilities';

/*
 * types
 */
export {
  type RgbColor,
  type HslColor,
  type HslaColor,

  Colord,
} from 'colord';

export {
  type CustomColor,
  DynamicScheme,
  Hct,

  alphaFromArgb,
  redFromArgb,
  greenFromArgb,
  blueFromArgb,
} from '@material/material-color-utilities';

export type HexColor = `#${string}`;

/** {@link RgbColor} variant with optional alpha value */
export type RgbaColor = RgbColor & { a?: number };

/** destructured {@link Hct} color with optional alpha value */
export interface HctColor {
  h: number
  c: number
  t: number
  a?: number
};

/** Color is any accepted color representation */
export type Color = Hct | Colord | number | AnyColor | HctColor;

/*
 * ARGB factories
 */

/** @returns the ARGB number corresponding to the given {@link Hct} */
export const argbFromHct = (c: Hct) => c.toInt();

/** @returns the ARGB number corresponding to the given {@link RgbaColor} */
export const argbFromRgbaColor = (c: RgbaColor): number => {
  const a = c.a === undefined ? 1 : (c.a > 1 ? c.a / 255 : c.a);
  const a255 = uint8(Math.round(a * 255));
  const r255 = uint8(c.r);
  const g255 = uint8(c.g);
  const b255 = uint8(c.b);

  return uint32(a255 << 24 | r255 << 16 | g255 << 8 | b255);
};

/** @returns the ARGB number corresponding to the given {@link HctColor} */
export const argbFromHctColor = (c: HctColor): number => {
  const argb = argbFromHct(Hct.from(c.h, c.c, c.t));
  if (c.a === undefined) {
    return argb;
  }

  const a255 = uint8(c.a > 1 ? c.a : Math.round(c.a * 255));
  return uint32(a255 << 24 | (argb & 0xFF_FF_FF));
};

/** @returns the ARGB number corresponding to the given {@link Colord} */
export const argbFromColord = (c: Colord) => argbFromRgbaColor(c.rgba);

/** @returns the ARGB number corresponding to the color string */
export const argbFromString = (s: string) => argbFromColord(origColord(s));

/** @returns the the decomposed {@link RgbaColor} corresponding to the given ARGB number */
export const splitArgb = (argb: number): RgbaColor => {
  const a255 = alphaFromArgb(argb);
  return {
    a: a255 > 0 ? a255 / 255 : undefined,
    r: redFromArgb(argb),
    g: greenFromArgb(argb),
    b: blueFromArgb(argb),
  };
};

/** @returns ARGB representation of the given {@link Color}. */
export const argb = (c: Color): number => {
  if (c instanceof Hct) {
    return argbFromHct(c);
  } else if (c instanceof Colord) {
    return argbFromRgbaColor(c.rgba);
  } else if (typeof c === 'number') {
    return c;
  } else if (typeof c === 'object' && 't' in c) {
    return argbFromHctColor(c);
  } else {
    return argbFromColord(origColord(c));
  }
};

/*
 * Colord factories
 */

/** @returns {@link Colord} from an ARGB number */
export const colordFromArgb = (argb: number) => origColord(splitArgb(argb));

/** @returns {@link Colord} from a {@link Hct} color */
export const colordFromHct = (c: Hct) => colordFromArgb(argbFromHct(c));

/** @returns {@link Colord} from the given {@link Color}. */
export const colord = (c: Color): Colord => {
  if (c instanceof Colord) {
    return c;
  } else if (c instanceof Hct) {
    return colordFromHct(c);
  } else if (typeof c === 'number') {
    return colordFromArgb(c);
  } else if (typeof c === 'object' && 't' in c) {
    return colordFromArgb(argbFromHctColor(c));
  } else {
    return origColord(c);
  }
};

/*
 * Hct factories
 */

/** @returns {@link Hct} from an ARGB number */
export const hctFromArgb = (argb: number) => Hct.fromInt(argb);

/** @returns {@link Hct} from an {@link RgbaColor} object */
export const hctFromRgbaColor = (c: RgbaColor): Hct => Hct.fromInt(argbFromRgbaColor(c));

/** @returns {@link Hct} from a {@link Colord} object */
export const hctFromColord = (c: Colord) => hctFromRgbaColor(c.rgba);

/** @returns {@link Hct} from a valid CSS color string */
export const hctFromString = (s: string): Hct => hctFromColord(origColord(s));

/** @returns {@link HctColor} decomposing the given {@link Hct} color. */
export const splitHct = (c: Hct): HctColor => {
  return { h: c.hue, c: c.chroma, t: c.tone };
};

/** @returns {@link Hct} representation of the given {@link Color}. */
export const hct = (c: Color): Hct => {
  if (c instanceof Hct) {
    return c;
  } else if (c instanceof Colord) {
    return hctFromColord(c);
  } else if (typeof c === 'number') {
    return hctFromArgb(c);
  } else if (typeof c === 'object' && 't' in c) {
    return Hct.from(c.h, c.c, c.t);
  } else {
    return hctFromColord(origColord(c));
  }
};

/*
 * HSL factories
 */

/** @returns the {@link HslaColor} for the given {@link Colord} */
export const hslFromColord = (c: Colord) => c.toHsl();

/** @returns the {@link HslaColor} for the given ARGB number */
export const hslFromArgb = (argb: number) => hslFromColord(colord(splitArgb(argb)));

/** @returns the {@link HslaColor} for the given {@link Hct} */
export const hslFromHct = (c: Hct): HslaColor => hslFromArgb(argbFromHct(c));

/*
 * Hex factories
 */

/** @returns the Hex RGB Color string for the given {@link Colord} */
export const hexFromColord = (c: Colord) => c.toHex() as HexColor;

/** @returns the Hex RGB Color string for the given ARGB number */
export const hexFromArgb = (argb: number) => hexFromColord(colord(splitArgb(argb)));

/** @returns the Hex RGB Color string for the given {@link Hct} */
export const hexFromHct = (c: Hct) => hexFromArgb(argbFromHct(c));

/** @returns the Hex RGB Color string for the given {@link Color} */
export const hex = (c: Color): HexColor => {
  if (c instanceof Hct) {
    return hexFromHct(c);
  } else if (c instanceof Colord) {
    return hexFromColord(c);
  } else if (typeof c === 'number') {
    return hexFromArgb(c);
  } else if (typeof c === 'object' && 't' in c) {
    return hexFromHct(Hct.from(c.h, c.c, c.t));
  } else {
    return hexFromColord(origColord(c));
  }
};
