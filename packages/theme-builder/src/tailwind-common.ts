// imports
//
import {
  Hct,

  argbFromHct,
  arrayFromArgb,
} from './core';

// rgbFromArgb for tailwindcss color variables.
export const rgbFromArgb = (argb: number) => {
  const [, r, g, b] = arrayFromArgb(argb);
  return `${r} ${g} ${b}`;
};

// rgbFromHct for tailwindcss color variables.
export const rgbFromHct = (c: Hct) => rgbFromArgb(argbFromHct(c));
