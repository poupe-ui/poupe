import {
  type Config,
  type PluginsConfig,
  type PluginFn,
  type PluginConfigAPI,
  type PluginThemeAPI,

  defaultColors,
} from './common';

import {
  type CSSRuleObject,
} from '../core/css';

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

export function surfaceComponentsPlugin(options: Partial<SurfaceComponentsOptions> = {}): PluginFn {
  return function ({ addComponents, config, theme }) {
    const components = makeSurfaceComponents(options, config, theme);
    addComponents(components);
  };
}

function makeSurfaceComponents(options: Partial<SurfaceComponentsOptions>, config: PluginConfigAPI, theme: PluginThemeAPI) {
  const $options = defaultSurfaceComponentsOptions(options, config);

  const components: Record<string, CSSRuleObject> = {};

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
    const { key, value } = assembleSurfaceComponent($options, colorName, pairs[colorName]);
    components[key] = value;
  }

  return components;
}

function assembleSurfaceComponent(options: SurfaceComponentsOptions, colorName: string, onColorName: string): { key: string; value: CSSRuleObject } {
  const { bgPrefix, textPrefix, surfacePrefix } = options;

  if (surfacePrefix === bgPrefix) {
    // extend bg- with text-on-
    return { key: `.${bgPrefix}${colorName}`, value: {
      [`@apply ${textPrefix}${onColorName}`]: {},
    },
    };
  }

  // combine bg- and text-on-
  const surfaceName = makeSurfaceName(colorName, surfacePrefix);
  return { key: `.${surfaceName}`, value: {
    [`@apply ${bgPrefix}${colorName} ${textPrefix}${onColorName}`]: {},
  } };
}

function makeSurfaceName(colorName: string, prefix: string): string {
  if (colorName.startsWith(prefix) || `${colorName}-` === prefix) {
    return colorName;
  }
  return `${prefix}${colorName}`;
}

function defaultSurfaceComponentsOptions(options: Partial<SurfaceComponentsOptions>, config: PluginConfigAPI): SurfaceComponentsOptions {
  const tw: string = config('prefix', '');
  return {
    surfacePrefix: options.surfacePrefix ?? 'surface-',
    bgPrefix: options.bgPrefix ?? `${tw}bg-`,
    textPrefix: options.textPrefix ?? `${tw}text-`,
  };
}
