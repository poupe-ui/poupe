import type { KebabCase } from 'type-fest';
import { Hct } from '@poupe/material-color-utilities';

import { makeStateLayerColors } from '../core';

import type { StandardDynamicColors, CustomDynamicColors } from './colors';

/**
 * Base color keys that support state variants
 */
type StandardInteractiveColorKey =
  | 'primary' | 'secondary' | 'tertiary' | 'error'
  | 'surface' | 'surface-variant'
  | 'primary-container' | 'secondary-container' | 'tertiary-container' | 'error-container';

/**
 * State variant types for standard Material Design 3 colors
 */
type StandardStateVariants = {
  [K in StandardInteractiveColorKey as `${K}-hover` | `${K}-focus` | `${K}-pressed` | `${K}-dragged` | `${K}-disabled`]: Hct;
};

/**
 * Generates Material Design 3 state layer variants for standard theme colors
 *
 * @param colors - Standard theme colors generated from scheme
 * @returns Object with state variants for interactive colors
 */
export function makeStandardStateVariants(colors: StandardDynamicColors): StandardStateVariants {
  const variants: Record<string, Hct> = {};

  // Define color pairs that need state variants
  const colorPairs: Array<[keyof StandardDynamicColors, keyof StandardDynamicColors]> = [
    ['primary', 'on-primary'],
    ['secondary', 'on-secondary'],
    ['tertiary', 'on-tertiary'],
    ['error', 'on-error'],
    ['surface', 'on-surface'],
    ['surface-variant', 'on-surface-variant'],
    ['primary-container', 'on-primary-container'],
    ['secondary-container', 'on-secondary-container'],
    ['tertiary-container', 'on-tertiary-container'],
    ['error-container', 'on-error-container'],
  ];

  for (const [baseKey, onKey] of colorPairs) {
    const baseColor = colors[baseKey];
    const onColor = colors[onKey];

    if (baseColor && onColor) {
      const states = makeStateLayerColors(baseColor, onColor);

      variants[`${baseKey}-hover`] = states.hover;
      variants[`${baseKey}-focus`] = states.focus;
      variants[`${baseKey}-pressed`] = states.pressed;
      variants[`${baseKey}-dragged`] = states.dragged;
      variants[`${baseKey}-disabled`] = states.disabled;
    }
  }

  return variants as StandardStateVariants;
}

/**
 * Custom color state variant type
 */
type CustomStateVariantKey<T extends string> =
  | `${T}-hover` | `${T}-focus` | `${T}-pressed` | `${T}-dragged` | `${T}-disabled`
  | `${T}-container-hover` | `${T}-container-focus` | `${T}-container-pressed` | `${T}-container-dragged` | `${T}-container-disabled`;

type CustomStateVariants<T extends string> = { [K in CustomStateVariantKey<KebabCase<T>>]: Hct };

/**
 * Generates Material Design 3 state layer variants for custom colors
 *
 * @param customColors - Custom colors with their on-colors
 * @returns Object with state variants for custom colors
 */
export function makeCustomStateVariants<K extends string>(
  customColors: CustomDynamicColors<K>,
): CustomStateVariants<K> {
  const variants: Record<string, Hct> = {};

  // Extract base color names from the custom colors
  const colorNames = new Set<KebabCase<K>>();
  for (const key in customColors) {
    // Extract base name from patterns like "color", "color-container", "on-color", "on-color-container"
    const match = key.match(/^(?:on-)?([^-]+(?:-[^-]+)*)(?:-container)?$/);
    if (match) {
      colorNames.add(match[1] as KebabCase<K>);
    }
  }

  // Generate state variants for each color and its container variant
  for (const colorName of colorNames) {
    const baseKey = colorName as keyof CustomDynamicColors<K>;
    const onKey = `on-${colorName}` as keyof CustomDynamicColors<K>;
    const containerKey = `${colorName}-container` as keyof CustomDynamicColors<K>;
    const onContainerKey = `on-${colorName}-container` as keyof CustomDynamicColors<K>;

    // Base color states
    if (customColors[baseKey] && customColors[onKey]) {
      const states = makeStateLayerColors(customColors[baseKey], customColors[onKey]);

      variants[`${colorName}-hover`] = states.hover;
      variants[`${colorName}-focus`] = states.focus;
      variants[`${colorName}-pressed`] = states.pressed;
      variants[`${colorName}-dragged`] = states.dragged;
      variants[`${colorName}-disabled`] = states.disabled;
    }

    // Container color states
    if (customColors[containerKey] && customColors[onContainerKey]) {
      const states = makeStateLayerColors(customColors[containerKey], customColors[onContainerKey]);

      variants[`${colorName}-container-hover`] = states.hover;
      variants[`${colorName}-container-focus`] = states.focus;
      variants[`${colorName}-container-pressed`] = states.pressed;
      variants[`${colorName}-container-dragged`] = states.dragged;
      variants[`${colorName}-container-disabled`] = states.disabled;
    }
  }

  return variants as CustomStateVariants<K>;
}
