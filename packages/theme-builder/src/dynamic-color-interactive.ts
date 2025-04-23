import { Hct } from './core';
import { makeColorMix } from './dynamic-color-mix';

export const interactiveStateColors = {
  '{}-hover': (fg: Hct, bg: Hct): Hct => makeColorMix(fg, bg, 12) as Hct,
  '{}-focus': (fg: Hct, bg: Hct): Hct => makeColorMix(fg, bg, 12) as Hct,
  '{}-dragged': (fg: Hct, bg: Hct): Hct => makeColorMix(fg, bg, 12) as Hct,
  '{}-disabled': (fg: Hct, bg: Hct): Hct => makeColorMix(fg, bg, 12) as Hct,
};

export type InteractiveStateKey<T extends string> =
  `${T}-hover` |
  `${T}-focus` |
  `${T}-dragged` |
  `${T}-disabled`;

// Define a type to represent surface keys (keys that have a corresponding "on-" version)
export type SurfaceKey<K extends string> = K extends string
  ? (`on-${K}` extends K ? K : never)
  : never;

export function makeSurfaceKeys<K extends string>(keys: Array<K>): Array<SurfaceKey<K>> {
  return keys.filter((key) => {
    // Check if there's a corresponding "on-" version of this key in the array
    const onKey = `on-${key}` as K;
    return keys.includes(onKey);
  }) as Array<SurfaceKey<K>>;
}

export function makeInteractiveKeys<K extends string>(keys: Array<K>) {
  const surfaceKeys = makeSurfaceKeys(keys);

  // Create an array to hold all interactive key variants
  const interactiveKeys: Array<InteractiveStateKey<SurfaceKey<K>>> = [];

  // For each surface key, create variants with all interactive suffixes
  for (const key of surfaceKeys) {
    // Extract the suffixes from interactiveColors by removing the template brackets
    const suffixes = Object.keys(interactiveStateColors).map(
      template => template.replace('{}', key),
    ) as Array<InteractiveStateKey<SurfaceKey<K>>>;

    // Add all the generated keys to our result array
    interactiveKeys.push(...suffixes);
  }

  return interactiveKeys;
}

/**
 * Generates interactive color variants (hover, focus, dragged, disabled) for all surface colors
 * @param colors - A map of color names to their Hct color values
 * @returns A map containing only the generated interactive color variants
 */
export function makeInteractiveColors<K extends string>(
  colors: Record<K, Hct>,
): Record<InteractiveStateKey<SurfaceKey<K>>, Hct> {
  // Get surface keys from the input colors
  const surfaceKeys = makeSurfaceKeys(Object.keys(colors) as K[]);

  // Create an empty object to hold only the interactive variants
  const result: Record<string, Hct> = {};

  // For each surface key, generate its interactive variants
  for (const key of surfaceKeys) {
    const fg = colors[`on-${key}` as K]; // Foreground color (text on the surface)
    const bg = colors[key as K]; // Background color (the surface itself)

    // Skip if either color is missing
    if (!fg || !bg) continue;

    // Generate each interactive variant using the functions in interactiveColors
    for (const [template, colorFn] of Object.entries(interactiveStateColors)) {
      const interactiveKey = template.replace('{}', key);
      result[interactiveKey] = colorFn(fg, bg);
    }
  }

  return result as Record<InteractiveStateKey<SurfaceKey<K>>, Hct>;
}
