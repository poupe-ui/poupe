import {
  type Color,
  type ColorMap,
  CSSRuleObject,
  type Hct,

  rgbFromHct,
} from './core';

import {
  type StandardDynamicSchemeKey,
} from './dynamic-color-data';

import {
  type ColorOption,

  makeColors,
} from './dynamic-color';

export interface CSSColorOptions {
  prefix: string // default: 'md-'
  darkSuffix: string // default: '-dark'
  lightSuffix: string // default: '-light'
  stringify: (c: Hct) => string // default: rgb('{r} {g} {b}')
};

export function assembleCSSColors<K extends string>(dark: ColorMap<K>, light: ColorMap<K>, options: Partial<CSSColorOptions> = {}) {
  const keys = Object.keys(dark).filter((key): boolean => !key.endsWith('-palette-key')) as K[];
  const { prefix, darkSuffix, lightSuffix, stringify } = {
    prefix: 'md-',
    darkSuffix: '-dark',
    lightSuffix: '-light',
    stringify: rgbFromHct,
    ...options,
  };

  const darkValues: CSSRuleObject = {};
  const lightValues: CSSRuleObject = {};
  const darkVars: CSSRuleObject = {};
  const lightVars: CSSRuleObject = {};
  const vars: Record<K, string> = {} as Record<K, string>;

  for (const k of keys) {
    const k0 = `--${prefix}${k}`;
    const k1 = `${k0}${darkSuffix}`;
    const k2 = `${k0}${lightSuffix}`;
    const v1 = stringify(dark[k]);
    const v2 = stringify(light[k]);

    darkValues[k1] = v1;
    lightValues[k2] = v2;
    vars[k] = k0;

    if (k1 !== k0) {
      darkVars[k0] = `var(${k1})`;
    }

    if (k2 !== k0) {
      lightVars[k0] = `var(${k2})`;
    }
  }

  return { vars, darkValues, lightValues, darkVars, lightVars };
}

export function makeCSSColors<CustomColors extends Record<string, ColorOption>>(primary: Color,
  customColors: CustomColors = {} as CustomColors,
  scheme: StandardDynamicSchemeKey = 'content',
  contrastLevel: number = 0,
  options: Partial<CSSColorOptions> = {},
) {
  const { dark, light } = makeColors(primary, customColors, scheme, contrastLevel);
  return assembleCSSColors(dark, light, options);
}
