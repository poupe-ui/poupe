import {
  type Config,
  type PluginsConfig,
  type ThemeConfig,

  defaultColors,
  plugin,
} from './tailwind/common';

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

import {
  type SurfaceComponentsOptions,

  withSurfaceComponents,
} from './tailwind/index';

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
  const tailwindColors = makeColorConfig(colors, { forV3: true, ...options });
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

function withCSSTheme<K extends string>(config: Partial<Config>,
  colors: ThemeColors<K>,
  options: TailwindThemeOptions = {},
): Partial<Config> {
  const { styles } = makeCSSTheme(colors, options);

  const plugins: PluginsConfig = [
    ...(config.plugins || []),
    plugin(({ addBase }) => addBase(styles)),
  ];

  config = {
    ...config,
    plugins,
  };

  return config;
}

interface MaterialColorOptions extends TailwindThemeOptions {
  /** @defaultValue `false` */
  omitTheme?: boolean

  /** @defaultValue `true` */
  surfaceComponents?: boolean | Partial<SurfaceComponentsOptions>
}

export function withMaterialColors<K extends string>(config: Partial<Config>,
  colors: ThemeColors<K> | ThemeColorOptions<K>,
  options: MaterialColorOptions = {},
): Partial<Config> {
  const {
    omitTheme = false,
    surfaceComponents = true,
  } = options;

  if (!omitTheme) {
    const $colors = flattenThemeColors<K>(colors);
    config = withCSSTheme(config, $colors, options);
  }

  config = withColorConfig(config, colors, options);

  if (surfaceComponents !== false) {
    const $options = typeof surfaceComponents === 'object' ? surfaceComponents : {};
    config = withSurfaceComponents(config, $options);
  }

  return config;
}
