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
  type ThemeOptions,
  type Theme,
  defaultPrimaryColor,
  formatTheme,
  makeThemeFromPartialOptions,
} from '@poupe/tailwindcss/theme';

export {
  DEFAULT_PREFIX as defaultComponentPrefix,
} from '@poupe/vue/resolver';

export const DEBUG: boolean = env.DEBUG === 'true';
