import { defineNuxtModule, addPlugin } from '@nuxt/kit';

import {
  type ModuleOptions,
  type Nuxt,

  defaultModuleOptions,
} from './config';

import { setupComponents } from './components';
import { createDefaultResolver } from './utils';

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@poupe/nuxt',
    configKey: 'poupe',
  },
  defaults: defaultModuleOptions,

  setup(options: ModuleOptions, _nuxt: Nuxt) {
    const resolve = createDefaultResolver();

    setupComponents(options);

    addPlugin(resolve('./runtime/plugin'));
  },
});
