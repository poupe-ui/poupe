import { addComponent } from '@nuxt/kit';

import { components, themeComponents, DEFAULT_PREFIX, normalizedComponentPrefix } from '@poupe/vue/resolver';

import type { SetupContext } from './types';
import { DEBUG } from './utils';

export const COMPONENTS_PACKAGE = '@poupe/vue';
export const THEME_COMPONENTS_PACKAGE = '@poupe/vue/theme-scheme';

export const setupComponents = <K extends string>(context: SetupContext<K>): void => {
  const { logger } = context;
  const { prefix: $prefix = DEFAULT_PREFIX } = context.options;
  const prefix = normalizedComponentPrefix($prefix);

  const start = Date.now();
  if (DEBUG) logger.info(`Registering \`${COMPONENTS_PACKAGE}\` components using prefix \`${prefix}\``);

  let count = 0;

  const registerComponents = (componentList: readonly string[], packagePath: string, suffix = '') => {
    for (const name of componentList) {
      const fullName = `${prefix}${name}`;

      try {
        addComponent({
          name: fullName,
          export: name,
          filePath: packagePath,
        });
        count++;
        if (DEBUG) logger.log(` - \`${fullName}\` registered${suffix}.`);
      } catch (error) {
        logger.error(`   \`${fullName}\` failed to register:`, error);
      }
    }
  };

  // Register regular components
  registerComponents(components, COMPONENTS_PACKAGE);

  // Register theme components from separate export
  registerComponents(themeComponents, THEME_COMPONENTS_PACKAGE, ' from theme-scheme export');

  logger.success(`Poupe registered ${count} components in ${Date.now() - start}ms`);
};
