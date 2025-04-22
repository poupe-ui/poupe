// dependencies

import { defineNuxtModule } from '@nuxt/kit';

import {
  type ModuleOptions,

  defaultModuleOptions,
} from './config';

import { setup } from './setup';

// re-export
export type { ModuleOptions } from './config';

// module
export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@poupe/nuxt',
    configKey: 'poupe',
  },
  defaults: defaultModuleOptions,
  setup: setup,
});
