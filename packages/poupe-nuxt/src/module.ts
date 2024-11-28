import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit';
import type { StandardDynamicSchemeKey } from '@poupe/theme-builder';

// Module options TypeScript interface definition
export interface ModuleOptions {
  scheme: StandardDynamicSchemeKey
};

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@poupe/nuxt',
    configKey: 'poupe',
  },
  // Default configuration options of the Nuxt module
  defaults: {
    scheme: 'content',
  },

  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url);

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'));
  },
});
