import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit';

import {
  type ModuleOptions,
  type Nuxt,

  defaultModuleOptions,
} from './config';

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@poupe/nuxt',
    configKey: 'poupe',
  },
  defaults: defaultModuleOptions,

  setup(_options: ModuleOptions, _nuxt: Nuxt) {
    const { resolve } = createResolver(import.meta.url);

    addPlugin(resolve('./runtime/plugin'));
  },
});
