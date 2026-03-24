import { env } from 'std-env';

export {
  type Nuxt,
  type NuxtOptions,
} from '@nuxt/schema';

export {
  type CSSProperties,
  formatCSSProperties,
} from '@poupe/css';

export {
  defaultPrimaryColor,
  formatTheme,
  makeThemeFromPartialOptions,
  type Theme,
  type ThemeOptions,
} from '@poupe/tailwindcss/theme';

export {
  DEFAULT_PREFIX as defaultComponentPrefix,
} from '@poupe/vue/resolver';

export const DEBUG: boolean = env.DEBUG === 'true';
