import stringifyObject from 'stringify-object';
import { env } from 'std-env';

export {
  type Nuxt,
  type NuxtOptions,
} from '@nuxt/schema';

export type { ThemeColors } from '@poupe/theme-builder';
export type { TailwindThemeOptions } from '@poupe/theme-builder/tailwind';

export const stringify = (input: unknown): string => stringifyObject(input, {
  indent: '  ',
  singleQuotes: true,
});

export const DEBUG: boolean = env.DEBUG === 'true';
