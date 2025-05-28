import { type Color } from './types';

/**
 * Complete collection of CSS named colors as defined in the CSS Color Module specifications.
 *
 * This object contains all standard CSS named colors organized by color family,
 * providing a comprehensive palette for color operations and conversions.
 *
 * @remarks
 * - All values are in hexadecimal format (#rrggbb or #rrggbbaa for transparent)
 * - Colors are grouped by visual similarity for easier navigation
 * - Includes all 147 CSS named colors from the CSS Color Module Level 4 specification
 * - Includes the transparent keyword for complete color support
 * - Some colors appear multiple times (e.g., cyan/aqua, fuchsia/magenta) as they represent the same color
 *
 * @example
 * ```typescript
 * const redColor = defaultColors.red; // '#ff0000'
 * const blueColor = defaultColors.blue; // '#0000ff'
 * ```
 */
export const defaultColors = {
  // Reds
  indianred: '#cd5c5c',
  lightcoral: '#f08080',
  salmon: '#fa8072',
  darksalmon: '#e9967a',
  crimson: '#dc143c',
  red: '#ff0000',
  firebrick: '#b22222',
  darkred: '#8b0000',

  // Pinks
  pink: '#ffc0cb',
  lightpink: '#ffb6c1',
  hotpink: '#ff69b4',
  deeppink: '#ff1493',
  mediumvioletred: '#c71585',
  palevioletred: '#db7093',

  // Oranges
  lightsalmon: '#ffa07a',
  coral: '#ff7f50',
  tomato: '#ff6347',
  orangered: '#ff4500',
  darkorange: '#ff8c00',
  orange: '#ffa500',

  // Yellows
  gold: '#ffd700',
  yellow: '#ffff00',
  lightyellow: '#ffffe0',
  lemonchiffon: '#fffacd',
  lightgoldenrodyellow: '#fafad2',
  papayawhip: '#ffefd5',
  moccasin: '#ffe4b5',
  peachpuff: '#ffdab9',
  palegoldenrod: '#eee8aa',
  khaki: '#f0e68c',
  darkkhaki: '#bdb76b',

  // Purples
  lavender: '#e6e6fa',
  thistle: '#d8bfd8',
  plum: '#dda0dd',
  violet: '#ee82ee',
  orchid: '#da70d6',
  fuchsia: '#ff00ff',
  magenta: '#ff00ff',
  mediumorchid: '#ba55d3',
  mediumpurple: '#9370db',
  rebeccapurple: '#663399',
  blueviolet: '#8a2be2',
  darkviolet: '#9400d3',
  darkorchid: '#9932cc',
  darkmagenta: '#8b008b',
  purple: '#800080',
  indigo: '#4b0082',
  slateblue: '#6a5acd',
  darkslateblue: '#483d8b',
  mediumslateblue: '#7b68ee',

  // Greens
  greenyellow: '#adff2f',
  chartreuse: '#7fff00',
  lawngreen: '#7cfc00',
  lime: '#00ff00',
  limegreen: '#32cd32',
  palegreen: '#98fb98',
  lightgreen: '#90ee90',
  mediumspringgreen: '#00fa9a',
  springgreen: '#00ff7f',
  mediumseagreen: '#3cb371',
  seagreen: '#2e8b57',
  forestgreen: '#228b22',
  green: '#008000',
  darkgreen: '#006400',
  yellowgreen: '#9acd32',
  olivedrab: '#6b8e23',
  olive: '#808000',
  darkolivegreen: '#556b2f',
  mediumaquamarine: '#66cdaa',
  darkseagreen: '#8fbc8f',
  lightseagreen: '#20b2aa',
  darkcyan: '#008b8b',
  teal: '#008080',

  // Blues/Cyans
  aqua: '#00ffff',
  cyan: '#00ffff',
  lightcyan: '#e0ffff',
  paleturquoise: '#afeeee',
  aquamarine: '#7fffd4',
  turquoise: '#40e0d0',
  mediumturquoise: '#48d1cc',
  darkturquoise: '#00ced1',
  cadetblue: '#5f9ea0',
  steelblue: '#4682b4',
  lightsteelblue: '#b0c4de',
  powderblue: '#b0e0e6',
  lightblue: '#add8e6',
  skyblue: '#87ceeb',
  lightskyblue: '#87cefa',
  deepskyblue: '#00bfff',
  dodgerblue: '#1e90ff',
  cornflowerblue: '#6495ed',
  royalblue: '#4169e1',
  blue: '#0000ff',
  mediumblue: '#0000cd',
  darkblue: '#00008b',
  navy: '#000080',
  midnightblue: '#191970',

  // Browns
  cornsilk: '#fff8dc',
  blanchedalmond: '#ffebcd',
  bisque: '#ffe4c4',
  navajowhite: '#ffdead',
  wheat: '#f5deb3',
  burlywood: '#deb887',
  tan: '#d2b48c',
  rosybrown: '#bc8f8f',
  sandybrown: '#f4a460',
  goldenrod: '#daa520',
  darkgoldenrod: '#b8860b',
  peru: '#cd853f',
  chocolate: '#d2691e',
  saddlebrown: '#8b4513',
  sienna: '#a0522d',
  brown: '#a52a2a',
  maroon: '#800000',

  // Whites
  white: '#ffffff',
  snow: '#fffafa',
  honeydew: '#f0fff0',
  mintcream: '#f5fffa',
  azure: '#f0ffff',
  aliceblue: '#f0f8ff',
  ghostwhite: '#f8f8ff',
  whitesmoke: '#f5f5f5',
  seashell: '#fff5ee',
  beige: '#f5f5dc',
  oldlace: '#fdf5e6',
  floralwhite: '#fffaf0',
  ivory: '#fffff0',
  antiquewhite: '#faebd7',
  linen: '#faf0e6',
  lavenderblush: '#fff0f5',
  mistyrose: '#ffe4e1',

  // Grays
  gainsboro: '#dcdcdc',
  lightgray: '#d3d3d3',
  lightgrey: '#d3d3d3',
  silver: '#c0c0c0',
  darkgray: '#a9a9a9',
  darkgrey: '#a9a9a9',
  gray: '#808080',
  grey: '#808080',
  dimgray: '#696969',
  dimgrey: '#696969',
  lightslategray: '#778899',
  lightslategrey: '#778899',
  slategray: '#708090',
  slategrey: '#708090',
  darkslategray: '#2f4f4f',
  darkslategrey: '#2f4f4f',
  black: '#000000',

  // Special colors
  transparent: '#00000000',
};

/**
 * Converts CSS named color strings to their hexadecimal equivalents.
 *
 * @param c - The color value to process. Can be any valid Color type.
 * @returns The hexadecimal color value if the input is a known CSS named color,
 *          otherwise returns the original input unchanged.
 *
 * @example
 * ```typescript
 * withKnownColor('red');    // '#ff0000'
 * withKnownColor('blue');   // '#0000ff'
 * withKnownColor('#abc123'); // '#abc123' (unchanged)
 * withKnownColor('unknown'); // 'unknown' (unchanged)
 * ```
 *
 * @remarks
 * Only processes strings that contain only letters (both uppercase and lowercase).
 * Case-insensitive matching is performed by converting input to lowercase.
 */
export function withKnownColor(c: string): string;
export function withKnownColor(c: number): number;
export function withKnownColor(c: Color): Color;
export function withKnownColor(c: Color): Color {
  if (typeof c !== 'string' || !reOnlyLetters.test(c)) {
    return c;
  }

  const name = c.toLowerCase();
  if (name in defaultColors) {
    return defaultColors[name as keyof typeof defaultColors];
  }

  return c;
};

/**
 * Regular expression that matches strings containing only letters (uppercase and lowercase).
 * Used to identify potential CSS named color candidates.
 */
const reOnlyLetters = /^[a-zA-Z]+$/;
