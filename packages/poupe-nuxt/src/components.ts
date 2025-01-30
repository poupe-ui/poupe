import { addComponent } from '@nuxt/kit';

import { components } from '@poupe/vue/resolver';

import { type ModuleOptions, DEFAULT_PREFIX } from './config';

export const COMPONENTS_PACKAGE = '@poupe/vue';

export const setupComponents = (options: ModuleOptions): void => {
  const { prefix = DEFAULT_PREFIX } = options;

  for (const name of components) {
    addComponent({
      name: `${prefix}${name}`,
      export: name,
      filePath: COMPONENTS_PACKAGE,
    });
  }
};
