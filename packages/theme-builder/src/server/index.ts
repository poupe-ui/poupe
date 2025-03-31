// dependencies
import {
  colord,
  random,
} from 'colord';

import {
  type HexColor,
} from '../core';

import {
  type StandardDynamicSchemeKey,
} from '../dynamic-color-data';

import {
  getParam,
  isHexValue,
  asThemeSchemeKey,
} from './utils';

// re-export
//
export {
  type Color,
  type Hct,
  type Colord,
  type HexColor,
  hex,
  hct,
  colord,
} from '../core';

export {
  type StandardDynamicSchemeKey,
} from '../dynamic-color-data';

// normalization utils and type checking
export * from './utils';

/**
+ * @returns the color and hex value from the given string, if it is a valid color
+ * @remarks Supports hex values directly, as well as other color formats supported by colord
+ * (including RGB, HSL, HSV, LAB, LCH, CMYK and color names if the colord plugin has been enabled)
+ */
export const getColorParam = (param?: string | string[]): {
  param?: string
  color?: HexColor
} => {
  const s = getParam(param);
  if (s === undefined || s === '') {
    return { param: s };
  }

  if (isHexValue(s)) {
    const hex = (s.startsWith('#') ? s : `#${s}`).toLowerCase() as HexColor;
    return { param: s, color: hex };
  }

  const c = colord(s);
  if (c.isValid()) {
    const hex = c.toHex() as HexColor;
    return { param: s, color: hex };
  }

  return { param: s };
};

/** @returns a random hex color value, throwing an error if generation fails */
export const getRandomColor = (): {
  color: HexColor
} => {
  const c = random();

  if (!c.isValid()) {
    throw new Error('Failed to generate random color');
  }

  return { color: c.toHex() as HexColor };
};

/** Attempts to convert a parameter to a valid StandardDynamicSchemeKey.
 * @param param - An optional string or string array representing a theme scheme key
 * @returns An object containing the original parameter and a validated theme scheme key, if applicable
 */
export const getThemeSchemeParam = (param?: string | string[]): {
  param?: string
  scheme?: StandardDynamicSchemeKey
} => {
  const key = getParam(param);

  return {
    param: key,
    scheme: asThemeSchemeKey(key),
  };
};
