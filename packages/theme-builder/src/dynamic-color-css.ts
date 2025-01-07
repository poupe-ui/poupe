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

/** apply defaults to {@link CSSThemeOptions} */
export function defaultCSSThemeOptions(options: Partial<CSSThemeOptions> = {}): CSSThemeOptions {
  return {
    prefix: 'md-',
    darkSuffix: '-dark',
    lightSuffix: '-light',
    stringify: rgbFromHct,
    ...options,
  };
}

/** generates CSS color tables */
export function assembleCSSColors<K extends string>(dark: ColorMap<K>, light: ColorMap<K>, options: Partial<CSSThemeOptions> = {}) {
  const keys = Object.keys(dark) as K[];
  const $options = defaultCSSThemeOptions(options);
  const { prefix, darkSuffix, lightSuffix, stringify } = $options;

  const darkValues: CSSRuleObject = {};
  const lightValues: CSSRuleObject = {};
  const vars: Record<K, string> = {} as Record<K, string>;

  let darkVars: CSSRuleObject | undefined = {};
  let lightVars: CSSRuleObject | undefined = {};

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

  if (Object.keys(darkVars).length === 0) {
    darkVars = undefined;
  }
  if (Object.keys(lightVars).length === 0) {
    lightVars = undefined;
  }

  return { vars, darkValues, lightValues, darkVars, lightVars, options: $options };
}

export interface MakeCSSThemeOptions extends CSSThemeOptions {
  /** @defaultValue `'content'` */
  scheme?: StandardDynamicSchemeKey
  /** @defaultValue `0` */
  contrastLevel?: number
}

/**
 *  makeCSSTheme assembles CSS variables to use in M3 dark/light themes.
 *
 * @param colors - base colors of the theme.
 * @param options - configuration options.
 * @returns  CSSRuleObjects to set up dark/light themes.
 */
export function makeCSSTheme<K extends string>(colors: ThemeColors<K>,
  options: Partial<MakeCSSThemeOptions> = {},
) {
  const { dark, light } = makeTheme(colors, options.scheme, options.contrastLevel);
  return assembleCSSColors(dark, light, options);
}
