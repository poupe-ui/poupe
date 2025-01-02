import {
  type ColorMap,
  type CSSRuleObject,
  type Hct,

  rgbFromHct,
} from './core';

import {
  type StandardDynamicSchemeKey,
} from './dynamic-color-data';

import {
  type ThemeColors,

  makeTheme,
} from './dynamic-theme';

export interface CSSThemeOptions {
  /** @defaultValue `'md-'` */
  prefix: string
  /** @defaultValue `'-dark'` */
  darkSuffix: string
  /** @defaultValue `'-light'` */
  lightSuffix: string
  /** @defaultValue `rgb('{r} {g} {b}')` */
  stringify: (c: Hct) => string
};

export function assembleCSSColors<K extends string>(dark: ColorMap<K>, light: ColorMap<K>, options: Partial<CSSThemeOptions> = {}) {
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

export interface MakeCSSThemeOptions extends CSSThemeOptions {
  /** default: 'content' */
  scheme?: StandardDynamicSchemeKey
  /** default: 0 */
  contrastLevel?: number
}

export function makeCSSTheme<K extends string>(colors: ThemeColors<K>,
  options: Partial<MakeCSSThemeOptions> = {},
) {
  const { dark, light } = makeTheme(colors, options.scheme, options.contrastLevel);
  return assembleCSSColors(dark, light, options);
}
