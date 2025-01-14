import {
  Hct as HCT,

  sourceColorFromImage,
} from '@material/material-color-utilities';

/** @returns a color suitable to make a theme from the given image element. */
export async function fromImageElement(image: HTMLImageElement): Promise<HCT> {
  const color = await sourceColorFromImage(image);

  return HCT.fromInt(color);
}
