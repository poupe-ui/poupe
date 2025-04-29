import {
  type Config,
  type PluginAPI,

  default as plugin,
} from 'tailwindcss/plugin';

/*
 * Types
 */
export {
  type Config,
  type PluginAPI,
  type PluginCreator as PluginFn,
} from 'tailwindcss/plugin';

export type PluginsConfig = Config['plugins'] & {};
export type ThemeConfig = Config['theme'] & {};

export type PluginThemeAPI = PluginAPI['theme'];
export type PluginConfigAPI = PluginAPI['config'];

export type PluginWithConfig = ReturnType<typeof plugin>;

/*
 * Data
 */
export { default as defaultColors } from 'tailwindcss/colors';
export { default as defaultTheme } from 'tailwindcss/defaultTheme';

/*
 * Functions
 */
export { default as plugin } from 'tailwindcss/plugin';

/** @returns a Tailwind config object */
export const defineConfig = (c: Partial<Config> = {}): Config => {
  return {
    content: [],
    ...c,
  };
};
