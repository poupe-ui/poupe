import type { ConsolaInstance } from 'consola';

import { DEFAULT_PREFIX } from '@poupe/vue/resolver';

import type {
  Nuxt,
  ThemeColors,
  TailwindThemeOptions,
} from './utils';

export interface ModuleOptions<K extends string = string> extends TailwindThemeOptions {
  /** @defaultValue 'P' */
  prefix?: string

  /** @defaultValue `{ primary: '#2a364b' }` */
  colors: ThemeColors<K>
}

export const DEFAULT_PRIMARY_COLOR = '#2a364b';

export const defaultModuleOptions: Readonly<ModuleOptions> = {
  prefix: DEFAULT_PREFIX,
  colors: {
    primary: DEFAULT_PRIMARY_COLOR,
  },
  darkSuffix: '',
  lightSuffix: '',
  extend: false,
};

export type SetupContext<K extends string = string> = {
  options: ModuleOptions<K>
  nuxt: Nuxt

  resolve: (...path: string[]) => string
  logger: ConsolaInstance
};
