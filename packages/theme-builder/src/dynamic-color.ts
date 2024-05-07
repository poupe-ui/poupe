// imports
//
import {
  CustomColor,
  Hct,

  customColor as customColorFromArgb,

  argbFromHex,
  hexFromArgb,
} from '@material/material-color-utilities';

// re-export
//
export {
  CustomColor,
  Hct,

  customColor as customColorFromArgb,

  argbFromHex,
  hexFromArgb,
} from '@material/material-color-utilities';

// tools
//
export const customColorFromHct = (source: Hct, color: CustomColor) => customColorFromArgb(source.toInt(), color);

export const hctFromHex = (hex: string) => Hct.fromInt(argbFromHex(hex));
export const hexFromHct = (c: Hct) => hexFromArgb(c.toInt());
