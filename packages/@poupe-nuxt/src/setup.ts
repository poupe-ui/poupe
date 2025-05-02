import { addPlugin, installModule } from '@nuxt/kit';

import type { ModuleOptions as ColorModeModuleOptions } from '@nuxtjs/color-mode';

import { setupComponents } from './components';
import type { ModuleOptions, Nuxt } from './config';
import { installTailwindPlugin } from './tailwind';
import { createDefaultResolver } from './utils';

const installIconModule = async (nuxt: Nuxt) => {
  await installModule('@nuxt/icon', nuxt.options.icon);
};

const installColorModeModule = async (nuxt: Nuxt) => {
  // force removal of classPrefix/classPrefix
  const colorModeModuleOptions: ColorModeModuleOptions = {
    ...nuxt.options.colorMode,
    classPrefix: '',
    classSuffix: '',
  };

  await installModule('@nuxtjs/color-mode', colorModeModuleOptions);
};

export const setup = async (options: ModuleOptions, nuxt: Nuxt) => {
  const resolve = createDefaultResolver();

  // Modules
  await installIconModule(nuxt);
  await installColorModeModule(nuxt);
  await installTailwindPlugin(options, [], [], resolve);

  // Components
  setupComponents(options);

  // Plugins
  addPlugin(resolve('./runtime/plugin'));
};
