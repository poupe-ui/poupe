import plugin from 'tailwindcss/plugin';

import {
  makeColors,
} from './colors';

import type {
  StandardDynamicSchemeKey,
} from './colors-data';

import {
  Hct,
  HexColor,
  rgbFromHct,
  hct,
} from './dynamic-color';

import type { CSSRuleObject, Config } from 'tailwindcss/types/config';

import type { PropType } from './utils';

// types
//
type ColorMap<K extends string> = Record<K, Hct>;

interface ColorConfig {
  value: HexColor
  harmonize?: boolean // default: true
}

interface MaterialColorConfig {
  primary: HexColor | ColorConfig
  [name: string]: HexColor | ColorConfig
}

export interface TailwindConfigOptions {
  prefix?: string // default: 'md-'
  darkSuffix?: string // default: '-dark'
  lightSuffix?: string // default: '-light'
  darkMode?: string // default: '.dark'
  omitValues?: boolean // default: false
  omitVariables?: boolean // default: false
  omitColors?: boolean // default: false
};

function defaultsTailwindConfigOptions(options: TailwindConfigOptions): Required<TailwindConfigOptions> {
  return {
    prefix: 'md-',
    darkSuffix: '-dark',
    lightSuffix: '-light',
    darkMode: '.dark',
    omitValues: false,
    omitVariables: false,
    omitColors: false,
    ...options,
  };
}

export interface MaterialColorOptions extends TailwindConfigOptions {
  scheme?: StandardDynamicSchemeKey // default: 'content'
  contrastLevel?: number // default: 0
};

function defaultsMaterialColorOptions(options: MaterialColorOptions): Required<MaterialColorOptions> {
  return {
    scheme: 'content',
    contrastLevel: 0,
    ...defaultsTailwindConfigOptions(options),
  };
}

// helpers
//
interface TColorData {
  value: Hct
  harmonize: boolean
}

function flattenColorConfig(c: HexColor | ColorConfig): TColorData {
  if (typeof c !== 'string') return {
    value: hct(c.value),
    harmonize: c.harmonize === undefined ? true : c.harmonize,
  };

  return {
    value: hct(c),
    harmonize: true,
  };
}

function flattenColorConfigTable(colors: { [name: string]: HexColor | ColorConfig }) {
  const out: Partial<{
    [K in keyof typeof colors]: TColorData
  }> = {};

  for (const [name, value] of Object.entries(colors)) {
    out[name] = flattenColorConfig(value);
  }

  return out as {
    [K in keyof typeof colors]: TColorData
  };
}

function buildTailwindConfig<K extends string>(dark: ColorMap<K>, light: ColorMap<K>, options: TailwindConfigOptions) {
  // output
  const theme: PropType<Config, 'theme'> = {};
  const styles: CSSRuleObject = {};

  // options
  const { prefix, darkSuffix, lightSuffix, darkMode,
    omitValues, omitVariables, omitColors,
  } = defaultsTailwindConfigOptions(options);

  if (omitValues && omitVariables && omitColors) {
    // omit everything
    return { styles, theme };
  }

  const keys = Object.keys(dark) as K[];
  const colors: Record<string, string> = {};
  const rootValues: CSSRuleObject = {};
  const darkValues: CSSRuleObject = {};
  const rootVars: CSSRuleObject = {};
  const darkVars: CSSRuleObject = {};

  for (const k of keys) {
    const k0 = `--${prefix}${k}`;
    const v1 = omitValues ? '' : rgbFromHct(light[k]);
    const v2 = omitValues ? '' : rgbFromHct(dark[k]);

    if (omitValues && omitVariables) {
      // MODE 0: only colors
      ;
    } else if (darkSuffix === '' && lightSuffix === '') {
      // MODE 1: direct rgb.
      if (!omitValues) {
        rootValues[k0] = v1;
        darkValues[k0] = v2;
      }
    } else if (darkSuffix !== '' && lightSuffix !== '') {
      // MODE 2: dark and light variables.
      const k1 = `${k0}${lightSuffix}`;
      const k2 = `${k0}${darkSuffix}`;

      if (!omitValues) {
        rootValues[k1] = v1;
        rootValues[k2] = v2;
      }

      if (!omitVariables) {
        rootVars[k0] = `var(${k1})`;
        darkVars[k0] = `var(${k2})`;
      }
    } else if (darkSuffix === '') {
      // MODE 4: dark direct, light variable.
      const k1 = `${k0}${lightSuffix}`;

      if (!omitValues) {
        rootValues[k1] = v1;
        darkValues[k0] = v2;
      }

      if (!omitVariables) {
        rootVars[k0] = `var(${k1})`;
      }
    } else {
      // MODE 3: dark variables, light direct.
      const k2 = `${k0}${darkSuffix}`;

      if (!omitValues) {
        rootValues[k0] = v1;
        rootValues[k2] = v2;
      }

      if (!omitVariables) {
        darkVars[k0] = `var(${k2})`;
      }
    }

    if (!omitColors) {
      // register colors
      colors[k] = `rgb(var(${k0}) / <alpha-value>)`;
    }
  }

  // assemble return values
  if (!omitValues || !omitVariables) {
    styles['root'] = {
      ...rootValues,
      ...rootVars,
    };
    styles[darkMode] = {
      ...darkValues,
      ...darkVars,
    };
  }

  if (!omitColors) {
    theme.extend = {
      colors,
    };
  }

  return { styles, theme };
}

export function withMaterialColors(config: Partial<Config>,
  colors: MaterialColorConfig,
  options: MaterialColorOptions = {},
): Partial<Config> {
  // build themes
  const { primary, ...extraColors } = { ...colors };
  const source = flattenColorConfig(primary);
  const customColors = flattenColorConfigTable(extraColors);

  // options
  const {
    scheme, contrastLevel,
    omitValues, omitVariables, omitColors,
  } = defaultsMaterialColorOptions(options);

  // build
  const { dark, light } = makeColors(source.value, customColors, scheme, contrastLevel);
  const { styles, theme } = buildTailwindConfig(dark, light, options);

  // output
  if (!omitColors) {
    config = {
      ...config,
      theme: {
        ...config?.theme,
        ...theme,
        extend: {
          ...config?.theme?.extend,
          ...theme?.extend,
          colors: {
            ...config?.theme?.extend?.colors,
            ...theme?.extend?.colors,
          },
        },
      },
    };
  }

  if (!omitValues || !omitVariables) {
    config = {
      ...config,
      plugins: [
        ...(config.plugins || []),
        plugin(({ addBase }) => addBase(styles)),
      ],
    };
  }

  return config;
}
