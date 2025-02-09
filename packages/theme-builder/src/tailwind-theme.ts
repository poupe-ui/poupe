import {
  unsafeKeys,
  type Prettify,
} from './core/utils';

import {
  Hct,
} from './core/colors';

import {
  type ColorOptions,

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
} from './tailwind/index';

import {
  type Shade,
  type Shades,

  defaultShades,
  makeShades,
} from './tailwind-shades';

/** ColorOptions extended for Tailwind configuration */
export interface TailwindColorOptions extends ColorOptions {
  /** @defaultValue `true` */
  shades?: Shades
};

function getColorShadesOption<K extends string>(color: K, fallback: Shades = true, options?: Record<K, Partial<TailwindColorOptions>>): number[] {
  if (fallback === false)
    fallback = [];
  else if (fallback === true)
    fallback = defaultShades;

  const $opt = options ? options[color] : undefined;
  if ($opt === undefined || $opt.shades === undefined || $opt.shades === true)
    return fallback;
  else if ($opt.shades === false) {
    return [];
  } else {
    return $opt.shades;
  }
}

/** options for {@link makeCSSTheme} */
export interface TailwindThemeOptions extends Partial<MakeCSSThemeOptions> {
  /** @defaultValue `true` */
  shades?: Shades

  /** @defaultValue `true` */
  extend?: boolean
}

/**
 *  makeCSSTheme assembles CSS variables to use in M3 dark/light TailwindCSS themes.
 *
 * @param colors - base colors of the theme.
 * @param options - configuration options.
 * @returns  CSSRuleObjects to set up dark/light themes.
 */
export function makeCSSTheme<K extends string>(colors: ThemeColors<K>,
  options: TailwindThemeOptions = {},
) {
  const { dark, light, darkPalette, lightPalette, colorOptions } = makeTheme(colors, options.scheme, options.contrastLevel);

  // shades
  const darkColors: Record<string, Hct> = {
    ...dark,
  };

  const lightColors: Record<string, Hct> = {
    ...light,
  };

  for (const key of unsafeKeys(darkPalette)) {
    const $shades = getColorShadesOption(key, options.shades, colorOptions);

    const darkShades = makeShades(darkPalette[key], $shades);
    const lightShades = makeShades(lightPalette[key], $shades);

    for (const shade of unsafeKeys(darkShades)) {
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
  options: TailwindThemeOptions = {},
) {
  const { prefix = 'md-' } = options;
  const { keys, paletteKeys, colorOptions } = makeThemeKeys(colors);
  const theme = {} as Record<string, string | Record<Shade, string>>;

  // palette colors with shades
  for (const color of paletteKeys) {
    const colorName = getColorNameOption(color, colorOptions);

    if (colorName === undefined)
      continue;

    const k0 = `--${prefix}${color}`;
    const colorShades = {} as Record<Shade, string>;
    const shades = getColorShadesOption(color, options.shades, colorOptions);

    for (const shade of shades) {
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
