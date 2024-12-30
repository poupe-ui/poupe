// imports
//
import {
  Hct,

  argbFromHct,
  redFromArgb,
  greenFromArgb,
  blueFromArgb,
} from './core';

// rgbFromArgb for tailwindcss color variables.
export const rgbFromArgb = (argb: number) => {
  const r = redFromArgb(argb);
  const g = greenFromArgb(argb);
  const b = blueFromArgb(argb);
  return `${r} ${g} ${b}`;
};

// rgbFromHct for tailwindcss color variables.
export const rgbFromHct = (c: Hct) => rgbFromArgb(argbFromHct(c));
