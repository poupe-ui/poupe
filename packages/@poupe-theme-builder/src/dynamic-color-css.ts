import {
  defu,
} from 'defu';

import {
  unsafeKeys,
} from './core/utils';

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
  /** @defaultValue `'.dark'` */
  darkMode: boolean | string
  /** @defaultValue `'.light'` */
  lightMode: boolean | string
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
  return defu(options, {
    darkMode: '.dark',
    lightMode: '.light',
    prefix: 'md-',
    darkSuffix: '-dark',
    lightSuffix: '-light',
    stringify: rgbFromHct,
  });
}

/** @returns the dark mode selector or media rule */
export function defaultDarkSelector(options: Partial<CSSThemeOptions>) {
  const { darkMode = true } = options;
  if (darkMode === true || darkMode === '.dark')
    return '.dark';
  else if (darkMode === false || darkMode === '' || darkMode === 'media')
    return '@media not print and (prefers-color-scheme: dark)';
  else
    return darkMode;
}

/** @returns the light mode selector, or undefined if disabled */
export function defaultLightSelector(options: Partial<CSSThemeOptions>) {
  const { lightMode = true } = options;
  if (lightMode === true || lightMode === '.light')
    return '.light';
  else if (lightMode === false || lightMode === '')
    return undefined;
  else
    return lightMode;
}

export function defaultRootLightSelector(options: Partial<CSSThemeOptions>) {
  const rootSelector = ':root';
  const lightSelector = defaultLightSelector(options);
  if (lightSelector) {
    return `${rootSelector}, ${lightSelector}`;
  }
  return rootSelector;
}

/** creates resulting {@link CSSRuleObject} array */
export function assembleCSSRules(root: CSSRuleObject | undefined,
  light: CSSRuleObject, dark: CSSRuleObject,
  options: CSSThemeOptions): CSSRuleObject[] {
  /*
   * options
   */
  const rootSelector = ':root';
  const darkSelector = defaultDarkSelector(options);
  const rootLightSelector = defaultRootLightSelector(options);

  const styles: CSSRuleObject[] = [];

  if (root) {
    styles.push({
      [rootSelector]: root,
    });
  }

  styles.push({
    [rootLightSelector]: light,
    [darkSelector]: dark,
  });

  return styles;
}

export function generateCSSColorVariables<K extends string>(dark: ColorMap<K>, light: ColorMap<K>, options: CSSThemeOptions) {
  const {
    prefix,
    darkSuffix,
    lightSuffix,
    stringify,
  } = options;

  let darkVars: CSSRuleObject | undefined = {};
  let lightVars: CSSRuleObject | undefined = {};
  const darkValues: CSSRuleObject = {};
  const lightValues: CSSRuleObject = {};
  const vars: Record<K, string> = {} as Record<K, string>;

  for (const k of unsafeKeys(dark)) {
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

  if (darkSuffix === lightSuffix) {
    // deduplicate
    for (const key of Object.keys(darkValues)) {
      if (key in lightValues && darkValues[key] === lightValues[key]) {
        delete darkValues[key];
      }
    }

    for (const key of Object.keys(darkVars)) {
      if (key in lightVars && darkVars[key] === lightVars[key]) {
        delete darkVars[key];
      }
    }
  }

  if (unsafeKeys(darkVars).length === 0) {
    darkVars = undefined;
  }
  if (unsafeKeys(lightVars).length === 0) {
    lightVars = undefined;
  }

  return { vars, darkValues, lightValues, darkVars, lightVars };
}

/** generates CSS color tables */
export function assembleCSSColors<K extends string>(dark: ColorMap<K>, light: ColorMap<K>, options: Partial<CSSThemeOptions> = {}) {
  /*
   * options
   */
  const $options = defaultCSSThemeOptions(options);

  /*
   * color variables
   */
  const { vars, darkValues, lightValues, darkVars, lightVars } = generateCSSColorVariables(dark, light, $options);

  /*
   * styles
   */
  let rootStyles: CSSRuleObject | undefined;
  let lightStyles: CSSRuleObject;
  let darkStyles: CSSRuleObject;

  if (darkVars) {
    rootStyles = {
      ...darkValues,
    };
    darkStyles = darkVars;
  } else {
    darkStyles = darkValues;
  }

  if (lightVars) {
    rootStyles = {
      ...rootStyles,
      ...lightValues,
    };
    lightStyles = lightVars;
  } else {
    lightStyles = lightValues;
  }

  /*
   * CSS Rules
   */
  const styles: CSSRuleObject[] = assembleCSSRules(rootStyles, lightStyles, darkStyles, $options);

  return { vars, darkValues, lightValues, darkVars, lightVars, styles, options: $options };
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
