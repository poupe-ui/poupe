import { installModule, hasNuxtModule } from '@nuxt/kit';

import type { ModuleOptions as ColorModeModuleOptions } from '@nuxtjs/color-mode';

import type { SetupContext } from './types';

/**
 * installs `@nuxtjs/color-mode` module if it wasn't already,
 * and forces removal of classPrefix/classSuffix
 */
export async function setupColorMode<K extends string>(context: SetupContext<K>) {
  const { nuxt } = context;

  if (hasNuxtModule('@nuxtjs/color-mode', nuxt)) {
    nuxt.options.colorMode.classPrefix = '';
    nuxt.options.colorMode.classSuffix = '';
  } else {
    const colorModeModuleOptions: ColorModeModuleOptions = {
      ...nuxt.options.colorMode,
      classPrefix: '',
      classSuffix: '',
    };

    await installModule('@nuxtjs/color-mode', colorModeModuleOptions, nuxt);
  }
};
