import {
  makeConfig,
} from './config';

import {
  asMatchUtility,
} from './match-utilities';

import {
  type ThemeOptions,
  withDefaultThemeOptions,
} from './options';

import {
  makeTheme,
  makeThemeBases,
  makeThemeComponents,
  type Theme,
} from './theme';

import {
  type CSSRuleObject,
  type PluginAPI,
  type PluginWithOptions,
  debugLog,
  pairs,
  pluginWithOptions,
  warnLog,
} from './utils';

import {
  type DarkModeStrategy,
  makeThemeVariants,
} from './variants';

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

  for (const variant of makeThemeVariants(theme, darkMode)) {
    for (const name of Object.keys(variant)) {
      api.addVariant(name, variant[name]);
    }
  }

  for (const base of makeThemeBases(theme, darkMode)) {
    api.addBase(base);
  }

  for (const components of makeThemeComponents(theme, api.config('prefix', ''))) {
    debugLog(theme.options.debug, 'plugin:components', components);
    addComponents(api, components);
  }
}

function addComponents(api: PluginAPI, components: Record<string, CSSRuleObject>) {
  for (const [name, value] of pairs(components)) {
    if (!doAddUtility(api, name, value) && !doMatchUtility(api, name, value))
      warnLog('skipping component', name);
  }
}

function doAddUtility(api: PluginAPI, name: string, value: CSSRuleObject): boolean {
  if (!name.includes('*')) {
    api.addUtilities({
      [name.startsWith('.') ? name : `.${name}`]: value,
    });
    return true;
  }

  return false;
}

export function doMatchUtility(api: PluginAPI, name: string, value: CSSRuleObject): boolean {
  const u = asMatchUtility(name, value);
  if (u?.name && u?.value) {
    api.matchUtilities({ [u.name]: u.value }, u.options);
    return true;
  }

  return false;
}

/** alias of makeConfig as companion for themePluginFunction */
export { makeConfig as themeConfigFunction } from './config';

/** @returns a Theme built using the provided ThemeOptions. defaults are automatically applied */
export function makeThemeFromPartialOptions(options: Partial<ThemeOptions> = {}): Theme {
  debugLog(options.debug, 'makeThemeFromPartialOptions', options);

  return makeTheme(withDefaultThemeOptions(options));
};
