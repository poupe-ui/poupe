import { unsafeKeys } from '@poupe/theme-builder/utils';

import {
  type ClassValue,
} from 'tailwind-variants';

/** @returns a variant applied to the specified slot */
export const onSlot = <K extends string> (slot: string | string[], classes: Record<K, ClassValue>) => {
  const slots = Array.isArray(slot) ? slot : [slot];

  type S = typeof slots[number];
  type V = Record<S, ClassValue>;
  type T = Record<K, V>;

  const out: Partial<T> = {};
  for (const name of unsafeKeys(classes)) {
    const v: V = {};
    for (const s of slots) {
      v[s] = classes[name];
    }
    out[name] = v;
  }

  return out as T;
};
