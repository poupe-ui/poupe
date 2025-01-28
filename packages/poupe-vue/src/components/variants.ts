import { unsafeKeys } from '../utils/utils';

import {
  type ClassValue,
} from 'tailwind-variants';

export { tv, type VariantProps } from 'tailwind-variants';

/** @returns a variant applied to the specified slot */
export const onSlot = <K extends string> (slot: string, variants: Record<K, ClassValue>) => {
  type T = { [slot: string]: ClassValue };
  const out: Partial<Record<K, T>> = {};
  for (const name of unsafeKeys(variants)) {
    out[name] = { [slot]: variants[name] };
  }
  return out as Record<K, T>;
};
