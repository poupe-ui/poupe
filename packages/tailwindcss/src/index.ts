import {
  type Config,
  type PluginAPI,
  plugin,
} from './types';

import {
  type PluginOptions,
  withDefaultOptions,
} from './options';

function poupePlugin(api: PluginAPI, options: Partial<PluginOptions> = {}) {
  console.log('plugin:options', options);
}

function poupeConfig(options: Partial<PluginOptions> = {}): Partial<Config> {
  console.log('config:options', options);

  const { darkMode } = withDefaultOptions(options);

  return {
    darkMode,
  };
}

/**
 * Creates a Tailwind CSS plugin with configurable options for the Poupe library.
 *
 * @param options - Optional configuration options for customizing the plugin behavior
 * @returns A Tailwind CSS plugin with the specified configuration
 */
export default plugin.withOptions((options: Partial<PluginOptions> = {}) => {
  return (api: PluginAPI): void => poupePlugin(api, options);
}, poupeConfig);
