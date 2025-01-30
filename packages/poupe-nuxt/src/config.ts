import type { StandardDynamicSchemeKey } from '@poupe/theme-builder';

export type { Nuxt } from '@nuxt/schema';

export interface ModuleOptions {
  scheme: StandardDynamicSchemeKey
};

export const DEFAULT_SCHEME: StandardDynamicSchemeKey = 'content';

export const defaultModuleOptions: Readonly<ModuleOptions> = {
  scheme: DEFAULT_SCHEME,
};
