import { hasNuxtModule, installModule } from '@nuxt/kit';

import type { SetupContext } from './types';

/**
 * installs `@nuxtjs/color-mode` module if it wasn't already,
 * and forces removal of classPrefix/classSuffix
 */
export async function setupColorMode<K extends string>(context: SetupContext<K>) {
  const { nuxt } = context;

  if (hasNuxtModule('@nuxtjs/color-mode', nuxt)) {
    if (nuxt.options.colorMode) {
      nuxt.options.colorMode.classPrefix = '';
      nuxt.options.colorMode.classSuffix = '';
    }
  } else {
    await installModule('@nuxtjs/color-mode', {
      ...(nuxt.options.colorMode ?? undefined),
      classPrefix: '',
      classSuffix: '',
    }, nuxt);
  }
};
