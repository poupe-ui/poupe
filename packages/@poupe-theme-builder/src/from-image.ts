import {
  Hct,

  sourceColorFromImage,
} from '@poupe/material-color-utilities';

/** @returns a color suitable to make a theme from the given image element. */
export async function fromImageElement(image: HTMLImageElement): Promise<Hct> {
  const color = await sourceColorFromImage(image);

  return Hct.fromInt(color);
}
