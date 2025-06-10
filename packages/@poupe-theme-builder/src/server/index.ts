// dependencies
import {
  type HexColor,

  colord,
} from '../core';

import {
  type StandardDynamicSchemeKey,
} from '../theme';

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
  hexString,
  hct,
  colord,
} from '../core';

export {
  type StandardDynamicSchemeKey,
} from '../theme';

// normalization utils and type checking
export * from './utils';

// CSS stringification utilities
export * from './stringify';

/** Attempts to convert a parameter to a valid hex color.
 * @param param - An optional string or string array representing a color
 * @param filter - Optional function to pre-process the parameter before validation
 * @returns An object containing the original parameter and a validated hex color, if applicable
 * @remarks Supports hex values directly, as well as other color formats supported by colord
 * (including RGB, HSL, HSV, LAB, LCH, CMYK and color names if the colord plugin has been enabled)
 */
export const getColorParam = (param?: string | string[], filter?: (s?: string)=>(string | undefined)): {
  param?: string
  color?: HexColor
} => {
  const s = filter ? filter(getParam(param)) : getParam(param);
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

/** Attempts to convert a parameter to a valid StandardDynamicSchemeKey.
 * @param param - An optional string or string array representing a theme scheme key
 * @param filter - Optional function to pre-process the parameter before validation
 * @returns An object containing the original parameter and a validated theme scheme key, if applicable
 */
export const getThemeSchemeParam = (param?: string | string[], filter?: (s?: string)=>(string | undefined)): {
  param?: string
  scheme?: StandardDynamicSchemeKey
} => {
  const key = filter ? filter(getParam(param)) : getParam(param);

  return {
    param: key,
    scheme: asThemeSchemeKey(key),
  };
};
