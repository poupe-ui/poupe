import {
  type Config,
  type PluginAPI,
} from 'tailwindcss/types/config';

/*
 * Types
 */
export {
  type Config,
  type PluginAPI,
} from 'tailwindcss/types/config';

export type PluginsConfig = Config['plugins'] & {};
export type ThemeConfig = Config['theme'] & {};

export type PluginThemeAPI = PluginAPI['theme'];
export type PluginConfigAPI = PluginAPI['config'];

/*
 * Data
 */
export { default as defaultColors } from 'tailwindcss/colors.js';
export { default as defaultTheme } from 'tailwindcss/defaultTheme.js';

/*
 * Functions
 */
export { default as plugin } from 'tailwindcss/plugin.js';

/** @returns a Tailwind config object */
export const defineConfig = (c: Partial<Config> = {}): Config => {
  return {
    content: [],
    ...c,
  };
};
