import {
  type MakeCSSThemeOptions,

  assembleCSSColors,
} from './dynamic-color-css';
import {
  type ThemeColors,

  makeTheme,
} from './dynamic-theme';

import {
  rgbFromHct,
} from './tailwind-common';

/**
 *  makeCSSTheme assembles CSS variables to use in M3 dark/light TailwindCSS themes.
 *
 * @param colors - base colors of the theme.
 * @param options - configuration options.
 * @returns  CSSRuleObjects to set up dark/light themes.
 */
export function makeCSSTheme<K extends string>(colors: ThemeColors<K>,
  options: Partial<MakeCSSThemeOptions> = {},
) {
  const { dark, light } = makeTheme(colors, options.scheme, options.contrastLevel);
  return assembleCSSColors(dark, light, {
    stringify: rgbFromHct,
    ...options,
  });
}
