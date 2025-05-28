import {
  type Color,
  defaultColors as cssNamedColors,
} from '@poupe/theme-builder/core';

/**
 * Modern Tailwind CSS color palette for web design.
 *
 * This collection provides the essential colors from Tailwind CSS v3+,
 * optimized for modern web interfaces and design systems.
 *
 * @remarks
 * - All values are in hexadecimal format (#rrggbb)
 * - Colors are organized by hue family for consistent theming
 * - Includes neutral grays (slate, gray, zinc, neutral, stone) for versatile UI elements
 * - Vibrant colors (red through rose) for accent and semantic use cases
 * - Takes precedence over CSS named colors via {@link withKnownColor}
 * - Falls back to complete CSS named color collection from `@poupe/theme-builder`
 *
 * @example
 * ```typescript
 * const primaryColor = defaultColors.blue; // '#3b82f6'
 * const neutralColor = defaultColors.slate; // '#64748b'
 * ```
 */
export const defaultColors = {
  // Neutral grays - versatile for backgrounds, text, and borders
  slate: '#64748b', // Cool gray with blue undertones
  gray: '#6b7280', // True neutral gray
  grey: '#6b7280', // British spelling alias for gray
  zinc: '#71717a', // Warm gray with slight brown undertones
  neutral: '#737373', // Pure neutral gray
  stone: '#78716c', // Warm gray with beige undertones

  // Vibrant color palette - semantic and accent colors
  red: '#ef4444', // Error states, warnings, destructive actions
  orange: '#f97316', // Warning states, energy, attention
  amber: '#f59e0b', // Caution, pending states
  yellow: '#eab308', // Highlights, notifications
  lime: '#84cc16', // Fresh, growth, eco-friendly
  green: '#22c55e', // Success states, confirmations
  emerald: '#10b981', // Prosperity, nature
  teal: '#14b8a6', // Balance, healing, professionalism
  cyan: '#06b6d4', // Information, technology
  sky: '#0ea5e9', // Open, freedom, clarity
  blue: '#3b82f6', // Primary actions, links, trust
  indigo: '#6366f1', // Deep focus, sophistication
  violet: '#8b5cf6', // Creativity, luxury
  purple: '#a855f7', // Innovation, mystery
  fuchsia: '#d946ef', // Bold, energetic, modern
  pink: '#ec4899', // Friendly, approachable, feminine
  rose: '#f43f5e', // Romance, warmth, passion

  // Essential monochrome - maximum contrast
  black: '#000', // Pure black for maximum contrast
  white: '#fff', // Pure white for maximum contrast
};

/**
 * Converts color names to their hexadecimal equivalents.
 *
 * Supports both Tailwind CSS colors and CSS named colors with precedence
 * given to Tailwind colors for modern web design consistency.
 *
 * @param c - The color value to process. Can be any valid Color type.
 * @returns The hexadecimal color value if the input is a known color name,
 *          otherwise returns the original input unchanged.
 *
 * @example
 * ```typescript
 * withKnownColor('blue');    // '#3b82f6' (Tailwind blue)
 * withKnownColor('red');     // '#ef4444' (Tailwind red)
 * withKnownColor('crimson'); // '#dc143c' (CSS named color)
 * withKnownColor('#abc123'); // '#abc123' (unchanged)
 * withKnownColor('unknown'); // 'unknown' (unchanged)
 * ```
 *
 * @remarks
 * - Tailwind CSS colors take precedence over CSS named colors
 * - Case-insensitive matching is performed by converting input to lowercase
 * - Only processes strings that contain only letters (both uppercase and lowercase)
 * - Non-string inputs and invalid color names are returned unchanged
 * - Falls back to CSS named colors from `@poupe/theme-builder` for comprehensive coverage
 */
export function withKnownColor(c: string): string;
export function withKnownColor(c: number): number;
export function withKnownColor(c: Color): Color;
export function withKnownColor(c: Color): Color {
  if (typeof c !== 'string' || !reOnlyLetters.test(c)) {
    return c;
  }

  const name = c.toLowerCase();

  // Check Tailwind CSS colors first (takes precedence)
  if (name in defaultColors) {
    return defaultColors[name as keyof typeof defaultColors];
  }

  // Fall back to CSS named colors for comprehensive coverage
  if (name in cssNamedColors) {
    return cssNamedColors[name as keyof typeof cssNamedColors];
  }

  return c;
};

/**
 * Regular expression that matches strings containing only letters (uppercase and lowercase).
 * Used to identify potential CSS named color candidates.
 */
const reOnlyLetters = /^[a-zA-Z]+$/;
