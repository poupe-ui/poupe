/* re-export */
export type {
  KebabCase,
  Simplify,
} from 'type-fest';

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
