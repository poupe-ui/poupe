import { defu } from 'defu';
import { addTemplate, installModule } from '@nuxt/kit';
import type { ModuleOptions as TailwindModuleOptions } from '@nuxtjs/tailwindcss';

import { contentGlobs } from '@poupe/vue/config';

import type { ModuleOptions, Nuxt } from './config';
import { createDefaultResolver, stringify } from './utils';

const POUPE_TAILWIND_CONFIG_FILENAME = 'poupe-tailwind.config.ts';

const getConfigContents = (
  options: ModuleOptions,
): string => {
  const { colors, prefix: _prefix, ...extra } = options;
  const content = [
    ...contentGlobs(),
  ];

  return /* ts */`import { withMaterialColors, withPrintMode } from '@poupe/theme-builder/tailwind';

import FormsPlugin from '@tailwindcss/forms';
import ScrollbarPlugin from 'tailwind-scrollbar';

const content = ${stringify(content)};

const plugins = [
  FormsPlugin,
  ScrollbarPlugin,
];

export default withMaterialColors(withPrintMode({
  content,
  plugins,
}), ${stringify(colors)}, ${stringify(extra)});
`;
};

export const installTailwindModule = async (
  options: ModuleOptions,
  nuxt: Nuxt,
  resolve: (...path: string[]) => string = createDefaultResolver(),
) => {
  // original @nuxtjs/tailwindcss' ModuleOptions
  const { config: userConfig = [], ...tailwindModuleOptions } = nuxt.options.tailwindcss ?? {};

  // template
  const generatedConfig = addTemplate({
    filename: POUPE_TAILWIND_CONFIG_FILENAME,
    write: true,
    getContents: () => getConfigContents(options),
  });

  // config files
  const config: TailwindModuleOptions['config'] = [
    generatedConfig.dst,
    resolve(nuxt.options.rootDir, 'tailwind.config'),
    ...(Array.isArray(userConfig) ? userConfig : [userConfig]),
  ];

  // install tailwindcss module
  await installModule('@nuxtjs/tailwindcss', defu({
    exposeConfig: true,
    config,
  }, tailwindModuleOptions));
};
