import {
  type Config,
  type PluginsConfig,
  type PluginCreator,
  type PluginThemeAPI,

  defaultColors,
  plugin,
} from './common';

import {
  type CSSRuleObject,
} from 'tailwindcss/types/config';

/** options for {@link surfaceComponentsPlugin} */
export type SurfaceComponentsOptions = {
  /** @defaultValue `'surface-'` */
  surfacePrefix: string

  /** @defaultValue `'bg-'` */
  bgPrefix: string

  /** @defaultValue `'text-'` */
  textPrefix: string
};

/** @returns {@link Config} extended to include plugin to generate surface components. */
export function withSurfaceComponents(config: Partial<Config> = {}, options: Partial<SurfaceComponentsOptions> = {}): Partial<Config> {
  const plugins: PluginsConfig = [
    ...(config.plugins || []),
    surfaceComponentsPlugin(options),
  ];

  return {
    ...config,
    plugins,
  };
}

export function surfaceComponentsPlugin(options: Partial<SurfaceComponentsOptions> = {}) {
  return plugin(function ({ addComponents, theme }) {
    const components: CSSRuleObject[] = makeSurfaceComponents(options, theme);
    addComponents(components);
  } as PluginCreator);
}

function makeSurfaceComponents(options: Partial<SurfaceComponentsOptions>, theme: PluginThemeAPI): CSSRuleObject[] {
  // TODO: consider tailwindcss prefix
  const $options = defaultSurfaceComponentsOptions(options);

  const components: CSSRuleObject[] = [];

  // all colors
  const allColors: Record<string, boolean> = {};
  for (const name of Object.keys(theme('colors', defaultColors))) {
    allColors[name] = true;
  }
  for (const name of Object.keys(theme('extend.colors', defaultColors))) {
    allColors[name] = true;
  }

  // color pairs
  const pairs: Record<string, string> = {};
  for (const name of Object.keys(allColors)) {
    if (allColors[name] && allColors[`on-${name}`]) {
      pairs[name] = `on-${name}`;
    }
  }

  // TODO: determine pair of special colors
  // - primary-fixed-dim
  // - on-primary-fixed-variant
  // - secondary-fixed-dim
  // - on-secondary-fixed-variant
  // - tertiary-fixed-dim
  // - on-tertiary-fixed-variant

  for (const colorName of Object.keys(pairs)) {
    components.push(assembleSurfaceComponent($options, colorName, pairs[colorName]));
  }

  return components;
}

function assembleSurfaceComponent(options: SurfaceComponentsOptions, colorName: string, onColorName: string): CSSRuleObject {
  const { bgPrefix, textPrefix, surfacePrefix } = options;

  if (surfacePrefix === bgPrefix) {
    // extend bg- with text-on-
    return {
      [`.${bgPrefix}${colorName}`]: {
        [`@apply ${textPrefix}${onColorName}`]: {},
      },
    };
  }

  // combine bg- and text-on-
  const surfaceName = makeSurfaceName(colorName, surfacePrefix);
  return {
    [`.${surfaceName}`]: {
      [`@apply ${bgPrefix}${colorName} ${textPrefix}${onColorName}`]: {},
    },
  };
}

function makeSurfaceName(colorName: string, prefix: string): string {
  if (colorName.startsWith(prefix) || `${colorName}-` === prefix) {
    return colorName;
  }
  return `${prefix}${colorName}`;
}

function defaultSurfaceComponentsOptions(options: Partial<SurfaceComponentsOptions>): SurfaceComponentsOptions {
  return {
    surfacePrefix: options.surfacePrefix ?? 'surface-',
    bgPrefix: options.bgPrefix ?? 'bg-',
    textPrefix: options.textPrefix ?? 'text-',
  };
}
