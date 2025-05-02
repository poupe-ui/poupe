import { defineNuxtModule } from '@nuxt/kit';

import {
  type ModuleOptions,

  defaultModuleOptions,
} from './config';

import { setup } from './setup';

export {
  type ModuleOptions,
} from './config';

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@poupe/nuxt',
    configKey: 'poupe',
  },
  defaults: defaultModuleOptions,
  setup: setup,
});
