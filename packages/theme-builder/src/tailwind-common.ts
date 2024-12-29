// imports
//
import {
  Hct,

  argbFromHct,
  redFromArgb,
  greenFromArgb,
  blueFromArgb,
} from './dynamic-color';

// re-export
//
export {
  type Color,
  type HexColor,
  Hct,

  hct,
  hexFromHct,
} from './dynamic-color';

// export
//

// rgbFromArgb for tailwindcss color variables.
export const rgbFromArgb = (argb: number) => {
  const r = redFromArgb(argb);
  const g = greenFromArgb(argb);
  const b = blueFromArgb(argb);
  return `${r} ${g} ${b}`;
};

// rgbFromHct for tailwindcss color variables.
export const rgbFromHct = (c: Hct) => rgbFromArgb(argbFromHct(c));
