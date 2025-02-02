import { defu } from 'defu';
import { addTemplate, installModule } from '@nuxt/kit';
import type { ModuleOptions as TailwindModuleOptions } from '@nuxtjs/tailwindcss';

import type { ModuleOptions, Nuxt } from './config';
import { createDefaultResolver, resolvePackage, stringify } from './utils';
import { COMPONENTS_PACKAGE } from './components';

const POUPE_TAILWIND_CONFIG_FILENAME = 'poupe-tailwind.config.ts';

const vueComponents = resolvePackage(COMPONENTS_PACKAGE);

const getConfigContents = (
  options: ModuleOptions,
  resolve: (...path: string[]) => string = createDefaultResolver(),
): string => {
  const { colors, prefix: _prefix, ...extra } = options;
  const content = [
    resolve(vueComponents),
    resolve('runtime/components/**/*.{vue,mjs,cjs,ts,js}'),
  ];

  return /* ts */`import { withMaterialColors, withPrintMode } from '@poupe/theme-builder/tailwind';

const content = ${stringify(content)};

export default withMaterialColors(withPrintMode({
  content,
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
    getContents: () => getConfigContents(options, resolve),
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
