// imports
//
import {
  HCT,

  argbFromHCT,
  splitArgb,
} from './core';

// rgbFromArgb for tailwindcss color variables.
export const rgbFromArgb = (argb: number) => {
  const { r, g, b } = splitArgb(argb);
  return `${r} ${g} ${b}`;
};

// rgbFromHCT for tailwindcss color variables.
export const rgbFromHCT = (c: HCT) => rgbFromArgb(argbFromHCT(c));
