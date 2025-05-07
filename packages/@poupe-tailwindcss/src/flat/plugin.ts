import {
  type PluginAPI,
  type PluginWithOptions,
  pluginWithOptions,
} from '../utils/plugin';

export type FlatOptions = unknown & {};

/** poupe plugin for tailwindcss v4 embedded in the default CSS */
export const flatPlugin: PluginWithOptions<FlatOptions> = pluginWithOptions(
  pluginFunction,
  configFunction,
  defaultsFunction,
);

function pluginFunction(api: PluginAPI, options: FlatOptions): void {
  console.log(`${logPrefix}:pluginFunction`, options, api);
};

function configFunction(options: FlatOptions): FlatOptions {
  console.log(`${logPrefix}:configFunction`, options);
  return options;
}

function defaultsFunction(options: FlatOptions = {}): FlatOptions {
  console.log(`${logPrefix}:defaultsFunction`, options);
  return options;
}

const logPrefix = '@poupe/tailwindcss/flat';
