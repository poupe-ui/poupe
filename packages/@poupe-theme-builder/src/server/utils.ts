// dependencies
import { random } from 'colord';

import {
  type Color,
  type HexColor,

  hexString,
} from '../core';

import {
  type StandardDynamicSchemeKey,

  standardDynamicSchemes,
} from '../dynamic-color-data';

const reHexValue = /^#?(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

/** @returns if the value is a string suitable for {@link hct} */
export const isHexValue = (s: string | HexColor): boolean => reHexValue.test(s);

/** @returns if the value is a valid {@link StandardDynamicSchemeKey} */
export const isThemeSchemeKey = (s?: string): boolean => !!s && s in standardDynamicSchemes;

/** @returns the given string as a valid StandardDynamicSchemeKey, or undefined if it is not a valid key */
export const asThemeSchemeKey = (key?: string): StandardDynamicSchemeKey | undefined => {
  if (isThemeSchemeKey(key)) {
    return key as StandardDynamicSchemeKey;
  }

  return undefined;
};

/** Extracts the first parameter from a potentially undefined or array-like parameter, returning a single string or undefined. */
export const getParam = (param?: string | string[]): (string | undefined) => {
  if (param === undefined) {
    return undefined;
  } else if (!Array.isArray(param)) {
    return param;
  } else if (param.length > 0) {
    return param[0];
  } else {
    return undefined;
  }
};

/**
 * @returns a random hex color value, throwing an error if generation fails
 * It uses `colord` to generate the random color.
 * */
export const getRandomColor = (): HexColor => {
  const c = random();

  if (!c.isValid()) {
    throw new Error('Failed to generate random color');
  }

  return c.toHex() as HexColor;
};

/** Converts a color to a URL-friendly hex string, generating a random color if none is provided.
 * It uses `colord` to generate the random color.
 * @param c - Optional color to convert
 * @returns A hex color string without the leading '#'
 */
export const colorToURL = (c?: Color): string => {
  const s = c ? hexString(c) : getRandomColor();
  return s.slice(1);
};
