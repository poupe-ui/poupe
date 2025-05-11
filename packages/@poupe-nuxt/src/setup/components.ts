import { addComponent } from '@nuxt/kit';

import { components, DEFAULT_PREFIX, normalizedComponentPrefix } from '@poupe/vue/resolver';

import type { SetupContext } from './types';
import { DEBUG } from './utils';

export const COMPONENTS_PACKAGE = '@poupe/vue';

export const setupComponents = <K extends string>(context: SetupContext<K>): void => {
  const { logger } = context;
  const { prefix: $prefix = DEFAULT_PREFIX } = context.options;
  const prefix = normalizedComponentPrefix($prefix);

  const start = Date.now();
  if (DEBUG) logger.info(`Registering \`${COMPONENTS_PACKAGE}\` components using prefix \`${prefix}\``);

  let count = 0;
  for (const name of components) {
    const fullName = `${prefix}${name}`;

    try {
      addComponent({
        name: fullName,
        export: name,
        filePath: COMPONENTS_PACKAGE,
      });
      count++;
      if (DEBUG) logger.log(` - \`${fullName}\` registered.`);
    } catch (error) {
      logger.error(`   \`${fullName}\` failed to register:`, error);
    }
  }

  logger.success(`Poupe registered ${count} components in ${Date.now() - start}ms`);
};
