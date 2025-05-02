import { defu } from 'defu';
import { addTemplate, installModule } from '@nuxt/kit';
import type { ModuleOptions as TailwindModuleOptions } from '@nuxtjs/tailwindcss';

import { contentGlobs } from '@poupe/vue/config';

import type { ModuleOptions, Nuxt } from './config';
import { createDefaultResolver, stringify } from './utils';

const POUPE_TAILWIND_CSS_FILENAME = 'poupe-nuxt.css';

const getConfigContents = (
  options: ModuleOptions,
  cssPath: TailwindModuleOptions['cssPath'],
  resolve: (...path: string[]) => string = createDefaultResolver(),
): string => {
  const content = [
    ...contentGlobs(),
  ];
  const prelude: string = '@import \'tailwindcss\';';

  if (cssPath) {
    console.log('cssPath', cssPath, typeof cssPath === 'string' ? resolve(cssPath) : cssPath);
  }

  return /* css */`${prelude}

@plugin 'tailwind-scrollbar';
@plugin '@poupe/tailwindcss' {
  ${stringify(options)}
}

@source ${stringify(content)};
`;
};

export const installTailwindModule = async (
  options: ModuleOptions,
  nuxt: Nuxt,
  resolve: (...path: string[]) => string = createDefaultResolver(),
) => {
  // original @nuxtjs/tailwindcss' ModuleOptions
  const { cssPath, ...tailwindModuleOptions } = nuxt.options.tailwindcss ?? {};

  // template
  const generatedCSS = addTemplate({
    filename: POUPE_TAILWIND_CSS_FILENAME,
    write: true,
    getContents: () => getConfigContents(options, cssPath, resolve),
  });

  // install tailwindcss module
  await installModule('@nuxtjs/tailwindcss', defu({
    exposeConfig: true,
    cssPath: generatedCSS.dst,
  }, tailwindModuleOptions));
};
