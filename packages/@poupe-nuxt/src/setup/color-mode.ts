import { hasNuxtModule, installModule } from '@nuxt/kit';

import type { ModuleOptions as ColorModeModuleOptions } from '@nuxtjs/color-mode';

import type { SetupContext } from './types';

/**
 * installs `@nuxtjs/color-mode` module if it wasn't already,
 * and forces removal of classPrefix/classSuffix
 */
export async function setupColorMode<K extends string>(context: SetupContext<K>) {
  const { nuxt } = context;

  if (hasNuxtModule('@nuxtjs/color-mode', nuxt)) {
    if (nuxt.options.colorMode && typeof nuxt.options.colorMode === 'object') {
      nuxt.options.colorMode.classPrefix = '';
      nuxt.options.colorMode.classSuffix = '';
    }
  } else {
    const baseOptions = (nuxt.options.colorMode && typeof nuxt.options.colorMode === 'object' ? nuxt.options.colorMode : {}) as Partial<ColorModeModuleOptions>;
    const colorModeModuleOptions: ColorModeModuleOptions = {
      preference: baseOptions.preference || 'system',
      fallback: baseOptions.fallback || 'light',
      globalName: baseOptions.globalName || 'nuxt-color-mode',
      componentName: baseOptions.componentName || 'ColorScheme',
      classPrefix: '',
      classSuffix: '',
      dataValue: baseOptions.dataValue || 'theme',
      storageKey: baseOptions.storageKey || 'nuxt-color-mode',
      storage: baseOptions.storage || 'localStorage',
      script: baseOptions.script || '',
      disableTransition: baseOptions.disableTransition ?? false,
    };

    await installModule('@nuxtjs/color-mode', colorModeModuleOptions, nuxt);
  }
};
