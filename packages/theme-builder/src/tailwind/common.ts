import {
  type PropType,
} from '../utils';

import {
  type Config,
} from 'tailwindcss/types/config';

/*
 * Types
 */
export type {
  Config,
  PluginCreator,
} from 'tailwindcss/types/config';

export type PluginsConfig = PropType<Config, 'plugins'>;
export type SafelistConfig = PropType<Config, 'safelist'>;
export type ThemeConfig = PropType<Config, 'theme'>;

/*
 * Data
 */
export { default as defaultColors } from 'tailwindcss/colors.js';

/*
 * Functions
 */
export { default as plugin } from 'tailwindcss/plugin.js';
