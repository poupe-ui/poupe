import {
  type Color,
  Hct,

  argb,
  argbFromHct,
  splitArgb,
} from '../core/colors';

/** @returns RGB representation of the given ARGB number for tailwindcss color variables. */
export const rgbFromArgb = (argb: number) => {
  const { r, g, b } = splitArgb(argb);
  return `${r} ${g} ${b}`;
};

/** @returns RGB representation of the given {@link Hct} color for tailwindcss color variables. */
export const rgbFromHct = (c: Hct) => rgbFromArgb(argbFromHct(c));

/** @returns RGB representation of the given {@link Color} for tailwindcss color variables. */
export const rgb = (c: Color) => rgbFromArgb(argb(c));
