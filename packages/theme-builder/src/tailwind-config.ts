import defaultColors from 'tailwindcss/colors.js';
import plugin from 'tailwindcss/plugin.js';

import {
  type PropType,
} from './utils';

import {
  defaultDarkSelector,
  defaultLightSelector,
} from './dynamic-color-css';

import {
  type ThemeColors,
  type ThemeColorOptions,
  flattenThemeColors,
} from './dynamic-theme';

import {
  type TailwindThemeOptions,

  makeCSSTheme,
  makeColorConfig,
} from './tailwind-theme';

import type { Config, PluginCreator } from 'tailwindcss/types/config';

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
  options: TailwindThemeOptions = {},
): Partial<Config> {
  //
  const { extend = true } = options;
  const tailwindColors = makeColorConfig(colors, options);
  const theme: PropType<Config, 'theme'> = {
    ...config?.theme,
  };

  if (extend) {
    // extend colors
    theme.extend = {
      ...theme.extend,
      colors: {
        ...theme.extend?.colors,
        ...tailwindColors,
      },
    };
  } else {
    // replace colors
    theme.colors = {
      inherit: defaultColors.inherit,
      current: defaultColors.current,
      transparent: defaultColors.transparent,
      black: defaultColors.black,
      white: defaultColors.white,
      ...tailwindColors,
    };
  }

  return {
    ...config,
    theme,
  };
}

function generateSafeList(options: TailwindThemeOptions) {
  const safelist: PropType<Config, 'safelist'> = [];
  const darkSelector = defaultDarkSelector(options);
  const lightSelector = defaultLightSelector(options);

  if (darkSelector.charAt(0) === '.')
    safelist.push(darkSelector.slice(1));
  if (lightSelector?.charAt(0) === '.')
    safelist.push(lightSelector.slice(1));

  return safelist;
}

function withCSSTheme<K extends string>(config: Partial<Config>,
  colors: ThemeColors<K>,
  options: TailwindThemeOptions = {},
): Partial<Config> {
  const { styles } = makeCSSTheme(colors, options);

  const plugins: PropType<Config, 'plugin'> = [
    ...(config.plugins || []),
    plugin(({ addBase }) => addBase(styles)),
  ];

  const safelist: PropType<Config, 'safelist'> = [
    ...(config?.safelist || []),
    ...generateSafeList(options),
  ];

  config = {
    ...config,
    plugins,
    safelist,
  };

  return config;
}

interface MaterialColorOptions extends TailwindThemeOptions {
  /** @defaultValue `false` */
  omitTheme?: boolean
}

export function withMaterialColors<K extends string>(config: Partial<Config>,
  colors: ThemeColors<K> | ThemeColorOptions<K>,
  options: MaterialColorOptions = {},
): Partial<Config> {
  const { omitTheme = false } = options;
  if (!omitTheme) {
    const $colors = flattenThemeColors<K>(colors);
    config = withCSSTheme(config, $colors, options);
  }

  config = withColorConfig(config, colors, options);
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
