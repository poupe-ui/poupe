import {
  type DarkModeStrategy,
  type PluginAPI,
  type PluginWithOptions,
  pluginWithOptions,
} from '../utils';

import {
  type ThemeOptions,
  withDefaultThemeOptions,
} from './options';

import {
  type Theme,
  makeTheme,
  makeThemeBases,
  makeThemeComponents,
} from './theme';

import {
  makeConfig,
} from './config';

/** poupe plugin for tailwindcss v4 for config use */
export const themePlugin: PluginWithOptions<Partial<ThemeOptions>> = pluginWithOptions(
  themePluginFunction,
  makeConfig,
  makeThemeFromPartialOptions,
);

/** uses Tailwind CSS's PluginAPI to apply a Theme */
export function themePluginFunction(api: PluginAPI, theme: Theme): void {
  const darkMode = api.config('darkMode', 'class') as DarkModeStrategy;

  debugLog(theme.options.debug, 'plugin', `darkMode:${darkMode}`, theme.paletteKeys);

  for (const base of makeThemeBases(theme, darkMode)) {
    api.addBase(base);
  }

  for (const components of makeThemeComponents(theme, api.config('prefix', ''))) {
    debugLog(theme.options.debug, 'plugin', components);
    api.addComponents(components);
  }
}

/** alias of makeConfig as companion for themePluginFunction */
export { makeConfig as themeConfigFunction } from './config';

/** @returns a Theme built using the provided ThemeOptions. defaults are automatically applied */
export function makeThemeFromPartialOptions(options: Partial<ThemeOptions> = {}): Theme {
  debugLog(options.debug, 'makeThemeFromPartialOptions', options);

  return makeTheme(withDefaultThemeOptions(options));
};

import { debugLog } from './utils';
