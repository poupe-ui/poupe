import {
  Hct,
} from './core';

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

import {
  makeShades,
} from './tailwind-shades';

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
  const { dark, light, darkPalette, lightPalette } = makeTheme(colors, options.scheme, options.contrastLevel);

  // shades
  const darkColors: Record<string, Hct> = {
    ...dark,
  };

  const lightColors: Record<string, Hct> = {
    ...light,
  };

  const keys = Object.keys(darkPalette) as Array<keyof typeof darkPalette>;
  for (const key of keys) {
    const darkShades = makeShades(darkPalette[key]);
    const lightShades = makeShades(lightPalette[key]);

    const shades = Object.keys(darkShades) as Array<keyof typeof darkShades>;
    for (const shade of shades) {
      if (shade !== 'DEFAULT') {
        darkColors[`${key}-${shade}`] = darkShades[shade];
        lightColors[`${key}-${shade}`] = lightShades[shade];
      } else if (!(key in dark)) {
        darkColors[key] = darkPalette[key];
        lightColors[key] = lightPalette[key];
      }
    };
  }

  return assembleCSSColors(darkColors, lightColors, {
    stringify: rgbFromHct,
    ...options,
  });
}
