import { makeShadows } from './shadows';

import {
  getInteractiveColors,
  stateSuffixes,
} from './theme';

import {
  type Theme,
} from './types';

import {
  type Config,
  debugLog,
  keys,
} from './utils';

import tailwindColors from 'tailwindcss/colors';

export {
  type Config,
} from './utils';

/**
 * Generates a Tailwind CSS colors configuration based on a theme definition.
 *
 * @param theme - The theme configuration containing color definitions and options
 * @returns A partial Tailwind CSS configuration with processed colors
 *
 * @remarks
 * This function transforms creates Tailwind CSS colors using
 * the theme's CSS variables.
 * It includes definitions for inherit, current, transparent, white and black
 * in addition to the dynamically generated color variations.
 */
export function makeConfig(
  theme: Theme,
  persistentColors: Record<string, string> = defaultPersistentColors,
): Partial<Config> {
  debugLog(theme.options.debug, 'makeConfig', theme);

  type ColorKey = keyof typeof theme.colors | keyof typeof persistentColors;

  type ColorValue = string | Record<'DEFAULT' | number, string>;

  const { extendColors = false } = theme.options;

  const colors: Record<ColorKey, ColorValue> = {
    ...(extendColors ? persistentColors : {}),
  };

  for (const key of theme.keys) {
    const c = theme.colors[key];
    colors[key] = makeConfigColor(key, c.value, c.shades);
  }

  // Generate state color configs for interactive colors
  const { themePrefix } = theme.options;
  const interactiveColors = getInteractiveColors(theme);

  for (const baseColor of interactiveColors) {
    // Only add state colors if the base color exists
    if (baseColor in colors) {
      for (const state of stateSuffixes) {
        const stateKey = `${baseColor}-${state}`;
        // Only add if not already defined (in case it has custom shades)
        if (!(stateKey in colors)) {
          colors[stateKey] = `var(--${themePrefix}${stateKey})`;
        }
      }
    }
  }

  const { boxShadow, dropShadow } = makeConfigShadows(theme);

  return {
    theme: {
      ...(extendColors
        ? { extend: { colors } }
        : { colors }),
      boxShadow,
      dropShadow,
    },
  };
}

export function makeConfigColor<N extends number>(key: string, value: string, shades?: Record<N, string>): (string | Record<'DEFAULT' | N, string>) {
  if (shades) {
    const out = {
      DEFAULT: `var(${value})`,
    } as Record<'DEFAULT' | N, string>;

    for (const shade of keys(shades)) {
      out[shade] = `var(${shades[shade]})`;
    }

    return out;
  }

  return `var(${value})`;
}

export function makeConfigShadows(theme: Theme) {
  const [shadows, insetShadows] = makeShadows(theme, false);
  return {
    boxShadow: {
      ...shadows,
      inner: insetShadows.DEFAULT,
    },
    dropShadow: shadows,
  };
}

export const defaultPersistentColors = {
  inherit: tailwindColors.inherit,
  current: tailwindColors.current,
  transparent: tailwindColors.transparent,
  black: tailwindColors.black,
  white: tailwindColors.white,
};
