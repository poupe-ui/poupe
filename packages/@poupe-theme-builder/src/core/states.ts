import type { Color, Hct } from './types';
import { makeColorMix } from './mix';
import { hct } from './colors';

/**
 * Material Design 3 state layer opacity values
 * @see https://m3.material.io/foundations/interaction/states/state-layers
 */
export const stateLayerOpacities = {
  hover: 0.08,
  focus: 0.12,
  pressed: 0.12,
  dragged: 0.16,
  disabled: 0.12,
  onDisabled: 0.38,
} as const;

export type StateLayerOpacity = typeof stateLayerOpacities;
export type InteractionState = keyof Omit<StateLayerOpacity, 'disabled' | 'onDisabled'>;
export type StateVariants<T extends string> = {
  [K in T as `${K}-hover` | `${K}-focus` | `${K}-pressed` | `${K}-dragged` | `${K}-disabled`]: Hct;
} & {
  [K in T as `on-${K}-disabled`]: Hct;
};

/**
 * Creates state layer colors by mixing the on-color with the base color at specified opacities
 * Following Material Design 3 state layer principles
 *
 * @param baseColor - The base/background color
 * @param onColor - The on-color (content color that goes on top of the base)
 * @returns Object with state layer colors for each interaction state
 */
export function makeStateLayerColors(baseColor: Color, onColor: Color) {
  const base = hct(baseColor);
  const on = hct(onColor);

  return makeColorMix(base, on, {
    hover: stateLayerOpacities.hover,
    focus: stateLayerOpacities.focus,
    pressed: stateLayerOpacities.pressed,
    dragged: stateLayerOpacities.dragged,
    disabled: stateLayerOpacities.disabled,
    onDisabled: stateLayerOpacities.onDisabled,
  });
}

/**
 * Generates state variants for a set of color pairs
 * Each color should have a corresponding on-color
 *
 * @param colors - Object with base colors and their on-colors
 * @returns Object with state variants for each color
 */
export function makeStateVariants<K extends string>(
  colors: Record<K, Color>,
  onColors: Record<`on-${K}`, Color>,
): StateVariants<K> {
  const result: Record<string, Hct> = {};

  for (const colorName in colors) {
    const baseColor = colors[colorName];
    const onColorKey = `on-${colorName}` as `on-${K}`;
    const onColor = onColors[onColorKey];

    if (!onColor) {
      throw new Error(`Missing on-color for ${colorName}. Expected key: ${onColorKey}`);
    }

    const states = makeStateLayerColors(baseColor, onColor);

    result[`${colorName}-hover`] = states.hover;
    result[`${colorName}-focus`] = states.focus;
    result[`${colorName}-pressed`] = states.pressed;
    result[`${colorName}-dragged`] = states.dragged;
    result[`${colorName}-disabled`] = states.disabled;
    result[`on-${colorName}-disabled`] = states.onDisabled;
  }

  return result as StateVariants<K>;
}
