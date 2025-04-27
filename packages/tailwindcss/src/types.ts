import {
  PluginAPI,
  type Config,
} from 'tailwindcss/plugin';

export {
  type Config,
  type PluginAPI,
  default as plugin,
} from 'tailwindcss/plugin';

/**
 * Represents the theme configuration for Tailwind CSS.
 */
export type ThemeConfig = Exclude<Config['theme'], undefined>;

/**
 * Represents the dark mode configuration strategy for Tailwind CSS.
 */
export type DarkModeStrategy = Exclude<Required<Config['darkMode']>, undefined>;

/**
 * Represents the CSS-in-JS object type used for adding base styles through the Tailwind CSS plugin API.
 */
export type CssInJs = Parameters<PluginAPI['addBase']>[0];
