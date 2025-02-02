import { addPlugin, installModule } from '@nuxt/kit';

import { setupComponents } from './components';
import type { ModuleOptions, Nuxt } from './config';
import { installTailwindModule } from './tailwind';
import { createDefaultResolver } from './utils';

export const setup = async (options: ModuleOptions, nuxt: Nuxt) => {
  const resolve = createDefaultResolver();

  // Modules
  await installModule('@nuxt/icon');
  await installModule('@nuxtjs/color-mode', {
    classSuffix: '',
  });
  await installTailwindModule(options, nuxt, resolve);

  // Components
  setupComponents(options);

  // Plugins
  addPlugin(resolve('./runtime/plugin'));
};
