import { addComponent } from '@nuxt/kit';

import { components, DEFAULT_PREFIX, normalizedComponentPrefix } from '@poupe/vue/resolver';

import type { ModuleOptions } from './config';

export const COMPONENTS_PACKAGE = '@poupe/vue';

export { contentGlobs } from '@poupe/vue/resolver';

export const setupComponents = (options: ModuleOptions): void => {
  const { prefix: $prefix = DEFAULT_PREFIX } = options;
  const prefix = normalizedComponentPrefix($prefix);

  for (const name of components) {
    addComponent({
      name: `${prefix}${name}`,
      export: name,
      filePath: COMPONENTS_PACKAGE,
    });
  }
};
