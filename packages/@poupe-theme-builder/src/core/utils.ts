/* re-export */
export {
  kebabCase,
  keys,
  pairs,
  unsafeKeys,
} from '@poupe/css';

/** Converts a number to an unsigned 32-bit integer */
export const uint32 = (n: number) => n >>> 0;

/** Converts a number to an unsigned 8-bit integer */
export const uint8 = (n: number) => (n >>> 0) & 0xFF;

export const alphaFromArgb = (argb: number) => uint8(uint32(argb) >> 24);
export const redFromArgb = (argb: number) => uint8(uint32(argb) >> 16);
export const greenFromArgb = (argb: number) => uint8(uint32(argb) >> 8);
export const blueFromArgb = (argb: number) => uint8(uint32(argb));
