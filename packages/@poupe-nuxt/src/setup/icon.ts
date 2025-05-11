import { installModule, hasNuxtModule } from '@nuxt/kit';

import type { SetupContext } from './types';

export const setupIcon = async (context: SetupContext) => {
  const { nuxt } = context;

  if (!hasNuxtModule('@nuxt/icon', nuxt)) {
    await installModule('@nuxt/icon', nuxt.options.icon, nuxt);
  }
};
