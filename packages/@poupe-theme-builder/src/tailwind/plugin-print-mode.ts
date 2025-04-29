import {
  type Config,
  type PluginFn,
  type PluginsConfig,
  type ThemeConfig,
} from './common';

// TODO: enhance to support other darkMode methods

function darkStyleNotPrint(darkMode: string = '.dark') {
  return `@media not print { ${darkMode} & }`;
}

export function darkStyleNotPrintPlugin(darkMode: string = '.dark'): PluginFn {
  return function ({ addVariant }) {
    addVariant('dark', darkStyleNotPrint(darkMode));
  };
}

/** withPrintMode disable dark mode when printing and introduce 'print' and 'screen' variants. */
export function withPrintMode(config: Partial<Config>, darkMode: string = '.dark'): Partial<Config> {
  const theme: ThemeConfig = {
    ...config?.theme,
    extend: {
      ...config?.theme?.extend,
      screens: {
        ...config?.theme?.extend?.screens,
        print: { raw: 'print' },
        screen: { raw: 'screen' },
      },
    },
  };

  const plugins: PluginsConfig = [
    ...(config?.plugins || []),
    darkStyleNotPrintPlugin(darkMode),
  ];

  return {
    ...config,
    theme,
    plugins,
  };
};
