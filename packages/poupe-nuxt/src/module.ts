import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit';

import {
  type ModuleOptions,
  type Nuxt,

  defaultModuleOptions,
} from './config';

import { setupComponents } from './components';

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@poupe/nuxt',
    configKey: 'poupe',
  },
  defaults: defaultModuleOptions,

  setup(options: ModuleOptions, _nuxt: Nuxt) {
    const { resolve } = createResolver(import.meta.url);

    setupComponents(options);

    addPlugin(resolve('./runtime/plugin'));
  },
});
