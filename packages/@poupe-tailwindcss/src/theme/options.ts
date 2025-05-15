import {
  type ThemeColorOptions,
  type ThemeColors,
  type ThemeOptions,
  defaultPrimaryColor,
  defaultSurfacePrefix,
  defaultThemeContrastLevel,
  defaultThemeDarkSuffix,
  defaultThemeLightSuffix,
  defaultThemePrefix,
  defaultThemeScheme,
} from './types';

import {
  getColor,
  keys,
  toKebabCase,
} from './utils';

import {
  type Shades,
  defaultShades,
  getShades,
} from './shades';

export {
  type ThemeOptions,
} from './types';

export function withDefaultThemeOptions<K extends string = string>(options: Partial<ThemeOptions<K>> = {}): ThemeOptions<K> {
  const { shades, ok } = getShades(options.shades, defaultShades);
  if (!ok) {
    throw new Error('Invalid shades configuration');
  }

  const colors = withDefaultThemeColorOptions(
    { ...(options.colors ?? { primary: {} }) } as ThemeColors<K>,
    shades,
  );

  return {
    debug: options.debug ?? false,
    themePrefix: options.themePrefix ?? defaultThemePrefix,
    surfacePrefix: options.surfacePrefix ?? defaultSurfacePrefix,
    omitTheme: options.omitTheme ?? false,
    extendColors: options.extendColors ?? false,

    darkSuffix: options.darkSuffix ?? defaultThemeDarkSuffix,
    lightSuffix: options.lightSuffix ?? defaultThemeLightSuffix,
    scheme: options.scheme ?? defaultThemeScheme,
    contrastLevel: options.contrastLevel ?? defaultThemeContrastLevel,

    shades,
    colors,
  };
}

export function withDefaultThemeColorOptions<K extends string = string>(
  colors: ThemeColors<K>,
  defaultShades: Shades,
): ThemeColors<K> {
  const out: Record<string, ThemeColorOptions> = {};

  for (const key of keys(colors)) {
    const name = toKebabCase(key);
    if (name in out) {
      throw new Error(`Duplicate normalized color name: ${key}/${name}`);
    }

    const color = flattenColorOptions(colors[key]);
    out[name] = cookColor(name, color, defaultShades);
  }

  return out as ThemeColors<K>;
}

/**
 * Processes and validates color configuration for a theme color.
 *
 * @param name - The name of the color (e.g., 'primary', 'secondary')
 * @param options - Color configuration options
 * @param defaultShades - Default shades to use if not specified
 * @returns Processed and validated theme color options
 * @throws an Error if color value or shades are invalid.
 */
const cookColor = (name: string, options: ThemeColorOptions | undefined, defaultShades: Shades): ThemeColorOptions => {
  // primary can't be harmonized, for all others it defaults to true.
  const { color: value, ok: colorOK } = getColor(name, options?.value);
  if (!colorOK) {
    throw new Error(`Invalid color value for ${name}: ${options?.value}`);
  }

  let shades: Shades = false;
  if (options?.shades !== false) {
    const { shades: colorShades, ok: shadesOK } = getShades(options?.shades, defaultShades);
    if (!shadesOK) {
      throw new Error(`Invalid shades for ${name}: ${options?.shades}`);
    }

    shades = colorShades;
  }

  return {
    value: value ?? (name === 'primary' ? defaultPrimaryColor : undefined),
    ...(name === 'primary' ? {} : { harmonized: options?.harmonized ?? true }),
    shades,
  };
};

export function flattenColorOptions(color?: boolean | string | ThemeColorOptions): ThemeColorOptions | undefined {
  if (color === undefined) {
    return undefined;
  } else if (typeof color === 'boolean') {
    return { harmonized: color };
  } else if (typeof color === 'string') {
    return { value: color };
  } else {
    return color;
  }
}
