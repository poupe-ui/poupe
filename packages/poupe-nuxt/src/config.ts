import type { StandardDynamicSchemeKey } from '@poupe/theme-builder';
import type { ResolverOptions } from '@poupe/vue/resolver';

export type { Nuxt } from '@nuxt/schema';

export interface ModuleOptions extends ResolverOptions {
  scheme: StandardDynamicSchemeKey
};

export const DEFAULT_PREFIX = 'P';
export const DEFAULT_SCHEME: StandardDynamicSchemeKey = 'content';

export const defaultModuleOptions: Readonly<Required<ModuleOptions>> = {
  prefix: DEFAULT_PREFIX,
  scheme: DEFAULT_SCHEME,
};
