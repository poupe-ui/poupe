import {
  type PropertyType,
} from '../core/utils';

import {
  type Config,
  type PluginAPI,
} from 'tailwindcss/types/config';

/*
 * Types
 */
export {
  type Config,
  type PluginCreator,
} from 'tailwindcss/types/config';

export type PluginsConfig = PropertyType<Config, 'plugins'>;
export type SafelistConfig = PropertyType<Config, 'safelist'>;
export type ThemeConfig = PropertyType<Config, 'theme'>;

export type PluginThemeAPI = PropertyType<PluginAPI, 'theme'>;
export type PluginConfigAPI = PropertyType<PluginAPI, 'config'>;

/*
 * Data
 */
export { default as defaultColors } from 'tailwindcss/colors.js';

/*
 * Functions
 */
export { default as plugin } from 'tailwindcss/plugin.js';
