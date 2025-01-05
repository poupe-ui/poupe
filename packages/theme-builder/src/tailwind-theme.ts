import {
  type Prettify,
} from './utils';

import {
  Hct,
} from './core';

import {
  getColorNameOption,
} from './dynamic-color';

import {
  type MakeCSSThemeOptions,

  assembleCSSColors,
} from './dynamic-color-css';

import {
  type ThemeColors,
  type ThemeColorOptions,

  makeTheme,
  makeThemeKeys,
} from './dynamic-theme';

import {
  rgbFromHct,
} from './tailwind-common';

import {
  type Shade,

  defaultShades,
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

/**
 * @param colors - describes the colors of the theme.
 * @param prefix - indicates the prefix used for the CSS variables.
 * @returns tailwindcss Config theme colors using the CSS variables associated with the theme.
 */
export function makeColorConfig<K extends string>(colors: ThemeColorOptions<K> | ThemeColors<K>,
  prefix: string = 'md-',
) {
  const { keys, paletteKeys, configOptions } = makeThemeKeys(colors);
  const theme = {} as Record<string, string | Record<Shade, string>>;

  // palette colors with shades
  for (const color of paletteKeys) {
    const colorName = getColorNameOption(color, configOptions);

    if (colorName === undefined)
      continue;

    const k0 = `--${prefix}${color}`;
    const colorShades = {} as Record<Shade, string>;

    for (const shade of defaultShades) {
      const k1 = `${k0}-${shade}`;
      colorShades[shade] = `rgb(var(${k1}) / <alpha-value>)`;
    }

    colorShades['DEFAULT'] = `rgb(var(${k0}) / <alpha-value>)`;
    theme[colorName] = colorShades;
  }

  // the rest directly
  for (const color of keys) {
    if (!(color in theme)) {
      const k0 = `--${prefix}${color}`;
      theme[color] = `rgb(var(${k0}) / <alpha-value>)`;
    }
  }

  return theme as Prettify<typeof theme>;
}
