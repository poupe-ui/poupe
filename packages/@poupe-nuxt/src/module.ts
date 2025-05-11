import {
  createResolver,
  defineNuxtModule,
  useLogger,
} from '@nuxt/kit';

import {
  type ModuleOptions,
  type Nuxt,
  type SetupContext,

  defaultModuleOptions,
  setupColorMode,
  setupComponents,
  setupIcon,
  setupPlugins,
  setupTailwind,
} from './setup/index';

async function setup<K extends string = string>(options: ModuleOptions<K>, nuxt: Nuxt) {
  const { resolve } = createResolver(import.meta.url);

  const setupContext: SetupContext<K> = {
    options,
    nuxt,
    resolve,
    logger: useLogger('poupe'),
  };

  // Modules
  await setupIcon(setupContext);
  await setupColorMode(setupContext);
  await setupTailwind(setupContext);

  // Components & Plugins
  setupComponents(setupContext);
  setupPlugins(setupContext);
}

export { type ModuleOptions } from './setup/types';

export default defineNuxtModule({
  meta: {
    name: '@poupe/nuxt',
    configKey: 'poupe',
  },
  defaults: defaultModuleOptions,
  setup,
});
