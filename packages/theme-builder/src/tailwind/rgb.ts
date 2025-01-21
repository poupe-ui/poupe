// imports
//
import {
  Hct,

  argbFromHct,
  splitArgb,
} from '../core/colors';

// rgbFromArgb for tailwindcss color variables.
export const rgbFromArgb = (argb: number) => {
  const { r, g, b } = splitArgb(argb);
  return `${r} ${g} ${b}`;
};

// rgbFromHct for tailwindcss color variables.
export const rgbFromHct = (c: Hct) => rgbFromArgb(argbFromHct(c));
