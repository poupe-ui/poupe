import {
  type Config,
  type PluginsConfig,
  type SafelistConfig,
  type ThemeConfig,

  defaultColors,
  plugin,
} from './tailwind/common';

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

export * from './tailwind/index';

// helpers
//
/** withColorConfig adds the colors to the TailwindCSS Config */
function withColorConfig<K extends string>(config: Partial<Config>,
  colors: ThemeColors<K> | ThemeColorOptions<K>,
  options: TailwindThemeOptions = {},
): Partial<Config> {
  //
  const { extend = true } = options;
  const tailwindColors = makeColorConfig(colors, options);
  const theme: ThemeConfig = {
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
  const safelist: SafelistConfig = [];
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

  const plugins: PluginsConfig = [
    ...(config.plugins || []),
    plugin(({ addBase }) => addBase(styles)),
  ];

  const safelist: SafelistConfig = [
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
