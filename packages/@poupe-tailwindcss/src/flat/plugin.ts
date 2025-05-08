import {
  type ThemeOptions,
  type ThemeColorOptions,

  themePluginFunction,
  themeConfigFunction,
  makeThemeFromPartialOptions,

  defaultShades,
} from '../theme/index';

import {
  flattenColorOptions,
} from '../theme/options';

import {
  type PluginWithOptions,
  pluginWithOptions,

  validThemePrefix,
  validThemeSuffix,
  validColorName,
  validColorOptions,
} from '../theme/utils';

import {
  getBooleanValue,
  getStringValue,
  kebabCase,
} from './utils';

export type FlatOptions = {
  /** Enables options parser logs */
  debug?: boolean

  /**
   * Prefix used for color CSS variables
   * @defaultValue 'md-'
   */
  themePrefix?: string

  /**
   * When true, only generates variable references without color values
   * @defaultValue false
   **/
  omitTheme?: boolean

  /** @defaultValue `''` */
  darkSuffix?: string

  /** @defaultValue `''` */
  lightSuffix?: string

  /** @defaultValue [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] */
  shades?: number[] | false
} & {
  /**
   * Color configuration options. Supported formats:
   *
   * - `string`: Define color using colord-compatible value or name
   * - `boolean`: Whether to harmonize known-color with primary
   * - `number[]`: Custom shades (0 disables, negative adds to defaults)
   * - `[boolean, ...number[]]`: Harmonize flag with custom shades
   * - `[string, ...number[]]`: Custom color with custom shades
   * - `[string, boolean, ...number[]]`: Custom color with harmonize flag
   *   and custom shades
   *
   * Colors are harmonized by default using colord for parsing.
   */
  [color: string]: PluginColorOptions
};

export type PluginColorOptions = string | boolean |
  [ ...number[] ] |
  [boolean, ...number[]] |
  [string, boolean] |
  [string, boolean, ...number[]] |
  [string, ...number[]];

/** poupe plugin for tailwindcss v4 embedded in the default CSS */
export const flatPlugin: PluginWithOptions<FlatOptions> = pluginWithOptions(
  themePluginFunction,
  themeConfigFunction,
  (params?: FlatOptions) => makeThemeFromPartialOptions(makeOptions(params)),
);

/** @returns a partial {@link ThemeOptions} pre-populated from the
 * parameters given to the {@link defaultPlugin}
 * */
export function makeOptions(params: FlatOptions = {}): Partial<ThemeOptions> {
  const debug = params.debug ?? false;

  debugLog(debug, 'params', params);

  const options: Partial<ThemeOptions> = {};

  for (const [key, value] of Object.entries(params)) {
    if (!(processParam(options, debug, key, value))) {
      warnLog('invalid param:', key, value);
    }
  }

  debugLog(debug, 'options', options);

  return options;
}

/** @returns true if the value was accepted for the specified key */
export function processParam(options: Partial<ThemeOptions>, debug: boolean, key: string, value: unknown): boolean {
  switch (key) {
    case 'debug': {
      const v = getBooleanValue(value);
      if (v === undefined) {
        return false;
      }
      options.debug = v;
      debugLog(debug, 'debug', v);
      return true;
    }

    case 'themePrefix':
    case 'theme-prefix': {
      const v = getStringValue(value);
      if (v === undefined || !validThemePrefix(v)) {
        return false;
      }
      options.themePrefix = v;
      debugLog(debug, 'theme-prefix', v);
      return true;
    }

    case 'omitTheme':
    case 'omit-theme': {
      const v = getBooleanValue(value);
      if (v === undefined) {
        return false;
      }
      options.omitTheme = v;
      debugLog(debug, 'omit-theme', v);
      return true;
    }

    case 'darkSuffix':
    case 'dark-suffix': {
      const v = getStringValue(value);
      if (v === undefined || !validThemeSuffix(v)) {
        return false;
      }
      options.darkSuffix = v;
      debugLog(debug, 'dark-suffix', v);
      return true;
    }

    case 'lightSuffix':
    case 'light-suffix': {
      const v = getStringValue(value);
      if (v === undefined || !validThemeSuffix(v)) {
        return false;
      }
      options.lightSuffix = v;
      debugLog(debug, 'light-suffix', v);
      return true;
    }

    case 'shades':
      return processShadesParam(options, debug, value);
    default:
      return processColorParam(options, debug, key, value);
  }
}

function processColorParam(options: Partial<ThemeOptions>, debug: boolean, key: string, value: unknown): boolean {
  const colorName = kebabCase(key);
  const colorOptions: ThemeColorOptions = {};

  if (!validColorName(colorName)) {
    return false;
  } else if (typeof value === 'string') {
    if (value === '') {
      return false;
    }
    colorOptions.value = value;
  } else if (typeof value === 'boolean') {
    colorOptions.harmonized = value;
  } else if (!Array.isArray(value)) {
    return false;
  } else if (!processColorParamArray(colorOptions, debug, value)) {
    return false;
  }

  if (options.colors === undefined) {
    options.colors = { primary: {} };
  }

  const mergedOptions: ThemeColorOptions = {
    ...flattenColorOptions(options.colors[colorName]),
    ...colorOptions,
  };

  if (!validColorOptions(colorName, mergedOptions)) {
    return false;
  }

  options.colors[colorName] = mergedOptions;

  debugLog(debug, 'color', colorName, mergedOptions);
  return true;
}

function processColorParamArray(options: ThemeColorOptions, debug: boolean, values: unknown[]): boolean {
  if (values.length === 0) {
    // empty, invalid.
    return false;
  } else if (typeof values[0] === 'boolean') {
    // [boolean, ...number[]]
    options.harmonized = values[0];
    return processColorParamShades(options, debug, values.slice(1));
  } else if (typeof values[0] === 'number') {
    // [...number[]]
    return processColorParamShades(options, debug, values);
  } else if (typeof values[0] !== 'string') {
    // invalid.
    return false;
  }

  options.value = values[0];
  values = values.slice(1);
  if (values.length === 0) {
    // [string]
    return true;
  }

  if (typeof values[0] === 'boolean') {
    options.harmonized = values[0];
    values = values.slice(1);
    if (values.length === 0) {
      // [string, boolean]
      return true;
    }

    // [string, boolean, ...number[]]
    // fallthrough
  }

  // [string, ...number[]]
  return processColorParamShades(options, debug, values);
}

function processColorParamShades(options: ThemeColorOptions, debug: boolean, values: unknown[]): boolean {
  if (values.length === 0) {
    // empty, invalid.
    return false;
  } else if (values.length === 1 && values[0] === 0) {
    // disable.
    options.shades = false;
    return true;
  }

  const shades = new Set<number>();
  let append = false;

  for (const v of values) {
    let shade = getShadeValue(v, true); // allow negatives

    if (shade === undefined) {
      // invalid shade value
      return false;
    } else if (shade < 0) {
      // append to defaults
      append = true;
      shade = -shade;
    }

    shades.add(shade);
  }

  // unique and sorted
  if (append) {
    for (const shade of defaultShades) {
      shades.add(shade);
    }
  }
  options.shades = [...shades].sort((a, b) => a - b);
  return true;
}

function processShadesParam(options: Partial<ThemeOptions>, debug: boolean, value: unknown): boolean {
  if (value === false || value === 0) {
    // disable shades
    options.shades = false;
  } else if (value === true) {
    // default shades
    options.shades = defaultShades;
  } else if (Array.isArray(value)) {
    // use given shades array
    const shades = new Set<number>();

    for (const v of value) {
      const shade = getShadeValue(v);
      if (shade === undefined) {
        // invalid shade value
        return false;
      }
      shades.add(shade);
    }

    // unique and sorted
    options.shades = [...shades].sort((a, b) => a - b);
  } else {
    // single shade?
    const v = getShadeValue(value);
    if (v === undefined) {
      // invalid shade value
      return false;
    }
    options.shades = [v];
  }

  debugLog(debug, 'shades', options.shades);
  return true;
}

import {
  debugLog,
  warnLog,

  getShadeValue,
} from './utils';
