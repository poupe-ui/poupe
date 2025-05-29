import {
  Blend,
} from '@poupe/material-color-utilities';

import {
  type Color,
  type CustomColor,
  Hct,
  TonalPalette,
} from './types';

import {
  hct,
} from './colors';

/**
 * Creates a tonal palette from a color with optional harmonization
 *
 * @param color - The base color to create the palette from
 * @param harmonizeTo - Optional target color to harmonize towards.
 *                      Harmonization shifts the hue of the base color
 *                      towards the target color while preserving tone.
 * @param isKeyColor - Whether to preserve the exact tone from the input
 *                     color (true) as key color or derive a tone
 *                     algorithmically (false).
 *                     @defaultValue `true`
 * @returns A TonalPalette instance handling tones from 0-100
 */
export function makeTonalPalette(color: Color, harmonizeTo?: Hct, isKeyColor: boolean = true): TonalPalette {
  let c = hct(color);
  if (harmonizeTo) {
    const c1 = Blend.harmonize(c.toInt(), harmonizeTo.toInt());
    c = hct(c1);
  }

  if (isKeyColor)
    return TonalPalette.fromHct(c);

  return TonalPalette.fromHueAndChroma(c.hue, c.chroma);
}

/**
 * Generates a custom color optionally harmonized to a target color
 *
 * @param color - The base color to transform into a custom color
 * @param harmonizeTo - Optional target color to harmonize towards.
 *                      Harmonization blends the hue of the base color
 *                      with the target while maintaining lightness.
 * @param name - Optional name identifier for the custom color
 * @param isKeyColor - Whether to preserve exact tone from input color
 *                     as key color. @defaultValue `true`.
 * @returns A CustomColor object with light and dark theme variations,
 *          including primary color, on-color, container, and
 *          on-container variants for each theme
 */
export function makeCustomColor(color: Color, harmonizeTo?: Hct, name?: string, isKeyColor: boolean = true): CustomColor {
  const tones = makeTonalPalette(color, harmonizeTo, isKeyColor);

  return makeCustomColorFromPalette(tones, name);
}

/**
 * Generates a custom color from a given tonal palette with predefined
 * light and dark color variations.
 *
 * Light theme uses tones: 40 (color), 100 (onColor), 90 (container),
 * 10 (onContainer). Dark theme uses tones: 80 (color), 20 (onColor),
 * 30 (container), 90 (onContainer). These follow Material Design 3
 * color system guidelines for optimal contrast and accessibility.
 *
 * @param tones - The tonal palette (0-100 tone range) used to derive
 *                color variations
 * @param name - Optional name identifier for the custom color
 * @returns A CustomColor object with light and dark color configurations
 *          containing color, onColor, colorContainer, and onColorContainer
 *          properties for each theme mode
 */
export function makeCustomColorFromPalette(tones: TonalPalette, name?: string): CustomColor {
  return {
    name,
    tones,
    light: {
      color: tones.getHct(40),
      onColor: tones.getHct(100),
      colorContainer: tones.getHct(90),
      onColorContainer: tones.getHct(10),
    },
    dark: {
      color: tones.getHct(80),
      onColor: tones.getHct(20),
      colorContainer: tones.getHct(30),
      onColorContainer: tones.getHct(90),
    },
  };
}
