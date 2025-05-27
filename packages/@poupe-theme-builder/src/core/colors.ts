import {
  uint32,
  uint8,

  alphaFromArgb,
  redFromArgb,
  greenFromArgb,
  blueFromArgb,
} from './utils';

import {
  type AnyColor,
  type Color,
  type HctColor,
  type HexColor,
  type HslaColor,
  type RgbaColor,
  Colord,
  Hct,
} from './types';

/*
 * colord
 */
import {
  extend,
  colord as origColord,
} from 'colord';

// extend colord with the mix plugin
import mixPlugin from 'colord/plugins/mix';
extend([mixPlugin]);

/**
 * Normalizes an alpha value to a consistent representation between 0 and 1.
 * @param a - Optional alpha value to normalize
 * @returns Normalized alpha value or undefined if input is undefined
 */
export function normalizeAlpha(a: number): number;
export function normalizeAlpha(a?: number): number | undefined;
export function normalizeAlpha(a?: number): number | undefined {
  if (a === undefined) {
    return undefined;
  }
  // Convert 0..255 to 0..1
  const n = a > 1 ? a / 255 : a;
  // Ensure the value is in range [0, 1]
  return Math.min(Math.max(n, 0), 1);
}

/**
 * Normalizes any Color input, especially handling alpha values consistently.
 * @returns Normalized color object that can be safely used in other factory functions
 */
export function normalizeColor(argb: number): number;
export function normalizeColor(s: string): string;
export function normalizeColor(c: Colord): Colord;
export function normalizeColor(c: Hct): Hct;
export function normalizeColor(c: HctColor): HctColor;
export function normalizeColor<T = Exclude<AnyColor, string>>(c: T): T;
export function normalizeColor(c: Color): Color {
  // Already normalized types (pass through)
  if (c instanceof Hct || c instanceof Colord) {
    return c;
  }

  // Object types that may need alpha normalization
  if (typeof c === 'object' && 'a' in c && c.a !== undefined) {
    return {
      ...c,
      a: normalizeAlpha(c.a),
    };
  }

  // String or number (pass through)
  return c;
};

/**
 * Converts an input color to a Colord color object after normalization.
 * @param c - The color to convert, which can be of various color representations
 * @returns A normalized Colord color object
 */
function toColord(c: AnyColor | Colord): Colord {
  return origColord(normalizeColor(c));
}

/*
 * RGB factories
 */

/** @returns the RGB number corresponding to the given {@link RgbaColor} */
export const rgbFromRgbaColor = (c: RgbaColor): number => {
  const r255 = uint8(c.r);
  const g255 = uint8(c.g);
  const b255 = uint8(c.b);

  return uint32(r255 << 16 | g255 << 8 | b255);
};

/** @returns the decomposed {@link RgbaColor} corresponding to the given {@link HctColor} */
export const rgbaFromHctColor = (c: HctColor): RgbaColor => splitArgb(argbFromHctColor(c));

/** @returns the decomposed {@link RgbaColor} corresponding to the given color */
/**
 * Returns the decomposed RGBA components for any color type.
 * @param c - The color to decompose
 * @returns The RGBA color object with r, g, b, and optional a components
 */
export const rgba = (c: Color): RgbaColor => splitArgb(argb(c));

/*
 * ARGB factories
 */

/** @returns the ARGB number corresponding to the given {@link Hct} */
export const argbFromHct = (c: Hct) => c.toInt();

/** @returns the ARGB number corresponding to the given {@link RgbaColor} */
export const argbFromRgbaColor = (c: RgbaColor): number => {
  const a = normalizeAlpha(c.a) ?? 1;
  const a255 = uint8(Math.round(a * 255));

  return uint32(a255 << 24 | rgbFromRgbaColor(c));
};

/** @returns the ARGB number corresponding to the given {@link HctColor} */
export const argbFromHctColor = (c: HctColor): number => {
  const argb = argbFromHct(Hct.from(c.h, c.c, c.t));
  if (c.a === undefined) {
    return argb;
  }

  const a = normalizeAlpha(c.a);
  const a255 = uint8(Math.round(a * 255));
  return uint32(a255 << 24 | (argb & 0xFF_FF_FF));
};

/** @returns the ARGB number corresponding to the given {@link Colord} */
export const argbFromColord = (c: Colord) => {
  if (!c.isValid()) {
    throw new Error('Invalid color');
  }
  return argbFromRgbaColor(c.rgba);
};

/** @returns the ARGB number corresponding to the color string */
export const argbFromString = (s: string) => argbFromColord(origColord(s));

/** @returns the the decomposed {@link RgbaColor} corresponding to the given ARGB number */
export const splitArgb = (argb: number): RgbaColor => {
  const a255 = alphaFromArgb(argb);
  return {
    r: redFromArgb(argb),
    g: greenFromArgb(argb),
    b: blueFromArgb(argb),
    ...(a255 > 0 ? { a: a255 / 255 } : {}),
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
    return argbFromColord(toColord(c));
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
    const c1 = argbFromHctColor(c);
    return colordFromArgb(c1);
  } else {
    return toColord(c);
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
export const hctFromColord = (c: Colord): Hct => {
  if (!c.isValid()) {
    throw new Error('Invalid color');
  }
  return hctFromRgbaColor(c.rgba);
};

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
    const c1 = origColord(normalizeColor(c));
    return hctFromColord(c1);
  }
};

/*
 * HSL factories
 */

/** @returns the {@link HslaColor} for the given {@link Colord} */
export const hslFromColord = (c: Colord): HslaColor => {
  if (!c.isValid()) {
    throw new Error('Invalid color');
  }
  return c.toHsl();
};

/** @returns the {@link HslaColor} for the given ARGB number */
export const hslFromArgb = (argb: number) => hslFromColord(colord(splitArgb(argb)));

/** @returns the {@link HslaColor} for the given {@link Hct} */
export const hslFromHct = (c: Hct): HslaColor => hslFromArgb(argbFromHct(c));

/** @returns the {@link HslaColor} for the given {@link HctColor} */
export const hslFromHctColor = (c: HctColor): HslaColor => hslFromColord(toColord(rgbaFromHctColor(c)));

/** @returns the {@link HslaColor} for the given {@link Color} */
export const hsl = (c: Color): HslaColor => {
  if (c instanceof Hct) {
    return hslFromHct(c);
  } else if (c instanceof Colord) {
    return hslFromColord(c);
  } else if (typeof c === 'number') {
    return hslFromArgb(c);
  } else if (typeof c === 'object' && 't' in c) {
    return hslFromHctColor(c);
  } else {
    return hslFromColord(toColord(c));
  }
};

/*
 * Hex factories
 */

/** @returns the Hex RGB Color string for the given {@link Colord} */
export const hexFromColord = (c: Colord): HexColor => {
  if (!c.isValid()) {
    throw new Error('Invalid color');
  }
  return c.toHex() as HexColor;
};

/** @returns the Hex RGB Color string for the given ARGB number */
export const hexFromArgb = (argb: number) => hexFromColord(colord(splitArgb(argb)));

/** @returns the Hex RGB Color string for the given {@link Hct} */
export const hexFromHct = (c: Hct) => hexFromArgb(argbFromHct(c));

/** @returns the Hex RGB Color string for the given {@link HctColor} */
export const hexFromHctColor = (c: HctColor): HexColor => hexFromColord(toColord(rgbaFromHctColor(c)));
