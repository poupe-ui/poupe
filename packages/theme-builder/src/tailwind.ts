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
interface ColorConfig {
  value: HexColor
  harmonize?: boolean // default: true
}

interface MaterialColorConfig {
  primary: HexColor | ColorConfig
  [name: string]: HexColor | ColorConfig
}

export interface MaterialColorOptions {
  scheme?: StandardDynamicSchemeKey // default: 'content'
  contrastLevel?: number // default: 0
  prefix?: string // default: 'md-'
  darkSuffix?: string // default: '-dark'
  lightSuffix?: string // default: '-light'
  darkMode?: string // default: '.dark'
};

function defaultsMaterialColorOptions(options: MaterialColorOptions): MaterialColorOptions {
  return {
    scheme: 'content',
    contrastLevel: 0,
    prefix: 'md-',
    darkSuffix: '-dark',
    lightSuffix: '-light',
    darkMode: '.dark',
    ...options,
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

type colorMap<K extends string> = Record<K, Hct>;
function buildTailwindConfig<K extends string>(dark: colorMap<K>, light: colorMap<K>, options: MaterialColorOptions) {
  // apply defaults
  options = defaultsMaterialColorOptions(options);

  const keys = Object.keys(dark) as K[];
  const rootVars: CSSRuleObject = {};
  const darkVars: CSSRuleObject = {};
  const colors: Record<string, string> = {};

  const { prefix, darkSuffix, lightSuffix } = options;

  for (const k of keys) {
    const k0 = `--${prefix}${k}`;
    const v1 = rgbFromHct(light[k]);
    const v2 = rgbFromHct(dark[k]);

    if (darkSuffix === '' && lightSuffix === '') {
      // MODE 1: direct rgb.
      rootVars[k0] = v1;
      darkVars[k0] = v2;
    } else if (darkSuffix !== '' && lightSuffix !== '') {
      // MODE 2: dark and light variables.
      const k1 = `${k0}${lightSuffix}`;
      const k2 = `${k0}${darkSuffix}`;

      rootVars[k1] = v1;
      rootVars[k2] = v2;
      rootVars[k0] = `var(${k1})`;
      darkVars[k0] = `var(${k2})`;
    } else if (darkSuffix === '') {
      // MODE 4: dark direct, light variable.
      const k1 = `${k0}${lightSuffix}`;

      rootVars[k1] = v1;
      rootVars[k0] = `var(${k1})`;
      darkVars[k0] = v2;
    } else {
      // MODE 3: dark variables, light direct.
      const k2 = `${k0}${darkSuffix}`;

      rootVars[k0] = v1;
      rootVars[k2] = v2;
      darkVars[k0] = `var(${k2})`;
    }

    // register colors
    colors[k] = `rgb(var(${k0}) / <alpha-value>)`;
  }

  // assemble return values
  const styles: CSSRuleObject = {
    ':root': rootVars,
    [options?.darkMode || '.dark']: darkVars,
  };

  const theme: PropType<Config, 'theme'> = {
    extend: {
      colors,
    },
  };

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

  options = defaultsMaterialColorOptions(options);

  // build
  const { dark, light } = makeColors(source.value, customColors, options.scheme, options.contrastLevel);

  type K = keyof typeof dark;
  const { styles, theme } = buildTailwindConfig<K>(dark, light, options);

  return <Partial<Config>>{
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
    plugins: [
      ...(config.plugins || []),
      plugin(({ addBase }) => addBase(styles)),
    ],
  };
}
