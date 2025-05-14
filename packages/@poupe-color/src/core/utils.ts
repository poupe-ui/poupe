import {
  type RGBColor,
} from './types';

/** Converts a number to an unsigned 32-bit integer */
export const uint32 = (n: number) => n >>> 0;

/** Converts a number to an unsigned 8-bit integer */
export const uint8 = (n: number) => (n >>> 0) & 0xFF;

/**
 * Extracts the alpha (opacity) value from an ARGB color value.
 *
 * @param argb - The color value in ARGB format (32-bit integer)
 */
export const alphaFromARGB = (argb: number): number => uint8(argb >>> 24) / 255;

/**
 * Extracts the red color component from an ARGB color value.
 *
 * @param argb - The color value in ARGB format (32-bit integer)
 * @returns The red color component value between 0 and 255
 */
export const redFromARGB = (argb: number): number => uint8(argb >>> 16);

/**
 * Extracts the green color component from an ARGB color value.
 *
 * @param argb - The color value in ARGB format (32-bit integer)
 * @returns The green color component value between 0 and 255
 */
export const greenFromARGB = (argb: number): number => uint8(argb >>> 8);

/**
 * Extracts the blue color component from an ARGB color value.
 *
 * @param argb - The color value in ARGB format (32-bit integer)
 * @returns The blue color component value between 0 and 255
 */
export const blueFromARGB = (argb: number): number => uint8(argb);

/**
 * Converts an ARGB color value to an RGBColor object with optional opacity.
 *
 * @param argb - The color value in ARGB format (32-bit integer)
 * @param opacityOne - Optional flag to force opacity to 1 or include opacity only if less than 1
 * @returns An RGBColor object with red, green, blue, and optional opacity values
 */
export function rgbaFromARGB(argb: number, opacityOne?: boolean): RGBColor {
  const a = alphaFromARGB(argb);

  return {
    r: redFromARGB(argb),
    g: greenFromARGB(argb),
    b: blueFromARGB(argb),
    ...(opacityOne || a < 1 ? { opacity: a } : {}),
  };
}
