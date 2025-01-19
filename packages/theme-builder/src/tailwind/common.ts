import {
  type PropType,
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

export type PluginsConfig = PropType<Config, 'plugins'>;
export type SafelistConfig = PropType<Config, 'safelist'>;
export type ThemeConfig = PropType<Config, 'theme'>;

export type PluginThemeAPI = PropType<PluginAPI, 'theme'>;
export type PluginConfigAPI = PropType<PluginAPI, 'config'>;

/*
 * Data
 */
export { default as defaultColors } from 'tailwindcss/colors.js';

/*
 * Functions
 */
export { default as plugin } from 'tailwindcss/plugin.js';
