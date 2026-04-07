import type { ConsolaInstance } from 'consola';

import {
  type CSSProperties,
  type Nuxt,
  type ThemeOptions,

  defaultComponentPrefix,
  defaultPrimaryColor,
} from './utils';

export type TailwindPlugin = [ string, CSSProperties ] | string;

export interface TailwindOptions {
  plugins?: TailwindPlugin[]
  sources?: string[]
}

export interface ModuleOptions<K extends string = string> {
  /** @defaultValue 'P' */
  prefix?: string

  /**
   * options for the theme builder
   * @defaultValue `{ color: { primary: '#2a364b' }}`
   */
  theme?: Partial<ThemeOptions<K>>

  /**
   * options to setup tailwind integration
   */
  tailwind?: TailwindOptions
}

/** Default configuration options for the module */
export const defaultModuleOptions: Readonly<ModuleOptions> = {
  prefix: defaultComponentPrefix,
  theme: {
    colors: {
      primary: defaultPrimaryColor,
    },
  },
};

/** Context for module setup */
export type SetupContext<K extends string = string> = {
  nuxt: Nuxt
  options: ModuleOptions<K>

  logger: ConsolaInstance
  resolve: (...path: string[]) => string
};
