import { hasNuxtModule, installModule } from '@nuxt/kit';

import type { SetupContext } from './types';

export const setupIcon = async (context: SetupContext) => {
  const { nuxt } = context;

  if (nuxt.options.icon === false) return;

  if (!hasNuxtModule('@nuxt/icon', nuxt)) {
    await installModule('@nuxt/icon', nuxt.options.icon ?? {}, nuxt);
  }
};
