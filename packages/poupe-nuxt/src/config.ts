import type { ThemeColors } from '@poupe/theme-builder';
import type { TailwindThemeOptions } from '@poupe/theme-builder/tailwind';

export type { Nuxt } from '@nuxt/schema';

export interface ModuleOptions<K extends string = string> extends TailwindThemeOptions {
  /** @defaultValue 'P' */
  prefix?: string
  /** @defaultValue `{ primary: '#2a364b' }` */
  colors: ThemeColors<K>
}

export const DEFAULT_PREFIX = 'P';
export const DEFAULT_PRIMARY_COLOR = '#2a364b';

export const defaultModuleOptions: Readonly<ModuleOptions> = {
  prefix: DEFAULT_PREFIX,
  colors: {
    primary: DEFAULT_PRIMARY_COLOR,
  },
};
