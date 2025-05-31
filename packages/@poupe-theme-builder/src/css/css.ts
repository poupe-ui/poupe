import {
  defu,
} from 'defu';

import {
  type CSSRuleObject,
  unsafeKeys,
  setDeepRule,
  processCSSSelectors,
} from '@poupe/css';

import {
  type ColorMap,
  type Hct,

  rgbaString,
} from '../core';

import {
  type StandardDynamicSchemeKey,
  type ThemeColors,

  makeTheme,
} from '../theme';

export interface CSSThemeOptions {
  /** @defaultValue `'.dark'` */
  darkMode: boolean | string | string[]
  /** @defaultValue `'.light'` */
  lightMode: boolean | string | string[]
  /** @defaultValue `'md-'` */
  prefix: string
  /** @defaultValue `'-dark'` */
  darkSuffix: string
  /** @defaultValue `'-light'` */
  lightSuffix: string
  /** @defaultValue `rgb('{r} {g} {b}')` */
  stringify: (c: Hct) => string
  /** @defaultValue `true` */
  addStarVariantsToDark?: boolean
  /** @defaultValue `true` */
  addStarVariantsToLight?: boolean
};

/** apply defaults to {@link CSSThemeOptions} */
export function defaultCSSThemeOptions(options: Partial<CSSThemeOptions> = {}): CSSThemeOptions {
  return defu(options, {
    darkMode: '.dark',
    lightMode: '.light',
    prefix: 'md-',
    darkSuffix: '-dark',
    lightSuffix: '-light',
    stringify: rgbaString,
  });
}

/** @returns the dark mode selector or media rule */
export function defaultDarkSelector(options: Partial<CSSThemeOptions>): string[] {
  const { addStarVariantsToDark = true } = options;
  let { darkMode = true } = options;

  if (darkMode === true)
    darkMode = '.dark';
  else if (darkMode === false || darkMode === '')
    darkMode = 'media';

  const result = processCSSSelectors(darkMode, {
    addStarVariants: addStarVariantsToDark,
  });
  return result ?? ['.dark, .dark *'];
}

/** @returns the light mode selector, or undefined if disabled */
export function defaultLightSelector(options: Partial<CSSThemeOptions>): string[] | undefined {
  const { addStarVariantsToLight = true } = options;
  let { lightMode = true } = options;

  if (lightMode === true)
    lightMode = '.light';
  else if (lightMode === false || lightMode === '')
    return undefined;

  const result = processCSSSelectors(lightMode, {
    addStarVariants: addStarVariantsToLight,
  });
  return result ?? ['.light, .light *'];
}

export function defaultRootLightSelector(options: Partial<CSSThemeOptions>): string[] {
  const rootSelector = [':root'];
  const lightSelector = defaultLightSelector(options);

  if (lightSelector) {
    const combined = processCSSSelectors([
      ...rootSelector,
      ...lightSelector,
    ], {
      addStarVariants: false, // already added.
    });

    if (combined) { // always true
      return combined;
    }
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

  const combinedRules: CSSRuleObject = {};

  // Set light mode rules
  setDeepRule(combinedRules, rootLightSelector, light);

  // Set dark mode rules
  setDeepRule(combinedRules, darkSelector, dark);

  styles.push(combinedRules);

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
