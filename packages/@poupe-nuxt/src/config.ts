import type { ThemeOptions } from '@poupe/tailwindcss/theme';

import { DEFAULT_PREFIX } from '@poupe/vue/resolver';

export type { Nuxt } from '@nuxt/schema';

export interface ModuleOptions<K extends string = string> {
  /** @defaultValue 'P' */
  prefix?: string

  /** @defaultValue `{ color: { primary: '#2a364b' }}` */
  theme?: Partial<ThemeOptions<K>>
}

export const DEFAULT_PRIMARY_COLOR = '#2a364b';

export const defaultModuleOptions: Readonly<ModuleOptions> = {
  prefix: DEFAULT_PREFIX,
  theme: {
    colors: {
      primary: DEFAULT_PRIMARY_COLOR,
    },
  },
};
