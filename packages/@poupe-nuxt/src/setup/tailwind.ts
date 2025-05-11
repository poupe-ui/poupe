import { defu } from 'defu';
import { addTemplate, installModule } from '@nuxt/kit';
import type { ModuleOptions as TailwindModuleOptions } from '@nuxtjs/tailwindcss';

import { contentGlobs } from '@poupe/vue/config';

import type { SetupContext } from './types';

import { stringify } from './utils';

const POUPE_TAILWIND_CONFIG_FILENAME = 'poupe-tailwind.config.ts';

const getConfigContents = (
  context: SetupContext,
): string => {
  const { options } = context;
  const { colors, prefix: _prefix, ...extra } = options;
  const content = [
    ...contentGlobs(),
  ];

  return /* ts */`import { withMaterialColors, withPrintMode } from '@poupe/theme-builder/tailwind';

  import ScrollbarPlugin from 'tailwind-scrollbar';

  const content = ${stringify(content)};

  const plugins = [
    ScrollbarPlugin,
  ];

  export default withMaterialColors(withPrintMode({
    content,
    plugins,
  }), ${stringify(colors)}, ${stringify(extra)});
  `;
};

export const setupTailwind = async <K extends string>(context: SetupContext<K>) => {
  const { nuxt, resolve } = context;
  // original @nuxtjs/tailwindcss' ModuleOptions
  const { config: userConfig = [], ...tailwindModuleOptions } = nuxt.options.tailwindcss ?? {};

  // template
  const generatedConfig = addTemplate({
    filename: POUPE_TAILWIND_CONFIG_FILENAME,
    write: true,
    getContents: () => getConfigContents(context),
  });

  // config files
  const config: TailwindModuleOptions['config'] = [
    generatedConfig.dst,
    resolve(nuxt.options.rootDir, 'tailwind.config'),
    ...(Array.isArray(userConfig) ? userConfig : [userConfig]),
  ];

  // install tailwindcss Module
  await installModule('@nuxtjs/tailwindcss', defu({
    exposeConfig: true,
    config,
  }, tailwindModuleOptions));
};
