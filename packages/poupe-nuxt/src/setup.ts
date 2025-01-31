import { addPlugin } from '@nuxt/kit';

import { setupComponents } from './components';
import type { ModuleOptions, Nuxt } from './config';
import { createDefaultResolver } from './utils';

export const setup = (options: ModuleOptions, _nuxt: Nuxt) => {
  const resolve = createDefaultResolver();

  setupComponents(options);

  addPlugin(resolve('./runtime/plugin'));
};
