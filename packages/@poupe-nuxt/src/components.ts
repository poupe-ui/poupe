import { addComponent } from '@nuxt/kit';

import { components, DEFAULT_PREFIX, normalizedComponentPrefix } from '@poupe/vue/resolver';

import type { ModuleOptions } from './config';

export const COMPONENTS_PACKAGE = '@poupe/vue';

export const setupComponents = (options: ModuleOptions): void => {
  const { prefix: $prefix = DEFAULT_PREFIX } = options;
  const prefix = normalizedComponentPrefix($prefix);

  for (const name of components) {
    const fullName = `${prefix}${name}`;

    try {
      addComponent({
        name: fullName,
        export: name,
        filePath: COMPONENTS_PACKAGE,
      });
    } catch (error) {
      console.error(COMPONENTS_PACKAGE, fullName, error);
    }
  }
};
