import plugin from 'tailwindcss/plugin.js';

import {
  type CSSRuleObject,
  type PropType,
} from './utils';

import {
  type ThemeColors,
  type ThemeColorOptions,
} from './dynamic-theme';

import {
  MakeCSSThemeOptions,
} from './dynamic-color-css';

import {
  rgbFromHct,
} from './tailwind-common';

import {
  makeCSSTheme,
  makeColorConfig,
} from './tailwind-theme';

import type { Config, PluginCreator } from 'tailwindcss/types/config';

type MaterialColorOptions = Partial<MakeCSSThemeOptions>;

function defaultMaterialColorOptions(options: MaterialColorOptions = {}): MakeCSSThemeOptions {
  return {
    prefix: 'md-',
    darkSuffix: '-dark',
    lightSuffix: '-light',
    stringify: rgbFromHct,
    ...options,
  };
}

// helpers
//
function darkStyleNotPrint(darkMode: string = '.dark') {
  return `@media not print { ${darkMode} & }`;
}

function darkStyleNotPrintPlugin(darkMode: string = '.dark') {
  return plugin(function ({ addVariant }) {
    addVariant('dark', darkStyleNotPrint(darkMode));
  } as PluginCreator);
}

/** withColorConfig adds the colors to the TailwindCSS Config */
function withColorConfig<K extends string>(config: Partial<Config>,
  colors: ThemeColors<K> | ThemeColorOptions<K>,
  prefix?: string): Partial<Config> {
  //
  const theme: PropType<Config, 'theme'> = {
    extend: {
      colors: makeColorConfig(colors, prefix),
    },
  };

  return {
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

function withCSSTheme<K extends string>(config: Partial<Config>,
  colors: ThemeColors<K>,
  options: MakeCSSThemeOptions = {} as MakeCSSThemeOptions,
): Partial<Config> {
  const theme = makeCSSTheme(colors, options);
  const styles: CSSRuleObject[] = [];

  let root: CSSRuleObject | undefined;
  let light: CSSRuleObject | undefined;
  let dark: CSSRuleObject | undefined;

  if (theme.darkVars) {
    root = {
      ...root,
      ...theme.darkValues,
    };
    dark = theme.darkVars;
  } else {
    dark = theme.darkValues;
  }

  if (theme.lightVars) {
    root = {
      ...root,
      ...theme.lightValues,
    };
    light = theme.lightVars;
  } else {
    light = theme.lightValues;
  }

  if (root) {
    styles.push({
      ':root': root,
    });
  }

  styles.push({
    ':root, .light': light,
    '@media not print': {
      '.dark': dark,
    },
  });

  const plugins: PropType<Config, 'plugin'> = [
    ...(config.plugins || []),
    plugin(({ addBase }) => addBase(styles)),
  ];

  config = {
    ...config,
    plugins,
  };

  return config;
}

export function withMaterialColors<K extends string>(config: Partial<Config>,
  colors: ThemeColors<K>,
  options: MaterialColorOptions = {},
): Partial<Config> {
  const $options = defaultMaterialColorOptions(options);
  config = withCSSTheme(config, colors, $options);
  config = withColorConfig(config, colors, $options.prefix);
  return config;
}

/** withPrintMode disable dark mode when printing and introduce 'print' and 'screen' variants. */
export function withPrintMode(config: Partial<Config>, darkMode: string = '.dark'): Partial<Config> {
  const theme: PropType<Config, 'theme'> = {
    ...config?.theme,
    extend: {
      ...config?.theme?.extend,
      screens: {
        ...config?.theme?.extend?.screens,
        print: { raw: 'print' },
        screen: { raw: 'screen' },
      },
    },
  };

  const plugins: PropType<Config, 'plugins'> = [
    ...(config.plugins || []),
    darkStyleNotPrintPlugin(darkMode),
  ];

  return {
    ...config,
    theme,
    plugins,
  };
};
