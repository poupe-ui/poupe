import {
  type Config,
  type PluginAPI,
  type PluginCreator as PluginFn,

  default as origPlugin,
} from 'tailwindcss/plugin';

/** re-export standard plugin types */
export {
  type Config,
  type PluginAPI,
  type PluginCreator as PluginFn,
} from 'tailwindcss/plugin';

export type PluginWithConfig = ReturnType<typeof origPlugin>;
export type PluginWithOptions<O> = ReturnType<typeof origPlugin.withOptions<O>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PluginsConfig = (PluginFn | PluginWithConfig | PluginWithOptions<any>)[];

/**
 * Wraps the original Tailwind plugin function providing a type-safe
 * signature alias for the function.
 *
 * @param pluginFunction - A function that defines the Tailwind plugin's behavior using the PluginAPI
 * @param config - Optional partial configuration for Tailwind as
 *   companion of what's added using the `pluginFunction`.
 * @returns A configured Tailwind plugin with the specified function and optional configuration
 */
export const plugin = origPlugin as (
  pluginFunction: (api: PluginAPI) => void,
  config?: Partial<Config>
) => PluginWithConfig;

/**
 * Creates a Tailwind plugin with configurable options.
 *
 * @typeParam O - The type of input configuration options (user-provided)
 * @typeParam T - The type of processed options used by the plugin functions (internal)
 * @param pluginFunction - Handles the plugin's core logic (addUtilities, etc.) using processed options T.
 * @param configFunction - Generates partial Tailwind config using processed options T.
 * @param processOptions - Processes user input O into the internal options T
 * @returns A plugin function expecting user options O.
 */
export function pluginWithOptions<O, T>(
  pluginFunction: (api: PluginAPI, options: T) => void,
  configFunction?: (options: T) => Partial<Config>,
  processOptions?: (options?: O) => T,
): PluginWithOptions<O> {
  function optionsFunction(options?: O): PluginWithConfig {
    const $options = processOptions ? processOptions(options) : options as T;

    return {
      handler: (api: PluginAPI): void => pluginFunction(api, $options),
      config: configFunction ? configFunction($options) : undefined,
    };
  };

  optionsFunction.__isOptionsFunction = true as const;
  return optionsFunction;
};

/**
 * Creates a Tailwind plugin with partial configuration options.
 *
 * @typeParam T - The type of configuration options for the plugin
 * @param pluginFunction - A function that generates the Tailwind plugin
 * @param configFunction - A function that generates partial Tailwind configuration based on options
 * @param defaultsFunction - A function that provides default options with partial configuration
 * @returns A plugin function with partial configurable options
 */
export function pluginWithPartialOptions<T>(
  pluginFunction: (api: PluginAPI, options: T) => void,
  configFunction?: (options: T) => Partial<Config>,
  defaultsFunction?: (options?: Partial<T>) => T,
): PluginWithOptions<Partial<T>> {
  return pluginWithOptions(pluginFunction, configFunction, defaultsFunction);
};
