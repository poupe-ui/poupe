import {
  type PluginAPI,
  type PluginWithOptions,
  pluginWithPartialOptions,
} from '../utils/plugin';

export type ThemeOptions = unknown & {};

/** poupe plugin for tailwindcss v4 for config use */
export const themePlugin: PluginWithOptions<ThemeOptions> = pluginWithPartialOptions(
  pluginFunction,
  configFunction,
  defaultsFunction,
);

function pluginFunction(api: PluginAPI, options: ThemeOptions): void {
  console.log(`${logPrefix}:pluginFunction`, options, api);
};

function configFunction(options: ThemeOptions): ThemeOptions {
  console.log(`${logPrefix}:configFunction`, options);
  return options;
}

function defaultsFunction(options: Partial<ThemeOptions> = {}): ThemeOptions {
  console.log(`${logPrefix}:defaultsFunction`, options);
  return options;
}

const logPrefix = '@poupe/tailwindcss';
