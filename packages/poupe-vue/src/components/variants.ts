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

export const roundedVariants = {
  full: 'rounded-full',
  none: 'rounded-none',

  xs: 'rounded-sm',
  sm: 'rounded',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  ['2xl']: 'rounded-2xl',
  ['3xl']: 'rounded-3xl',
};

export const shadowVariants = {
  current: 'shadow-shadow shadow',
  none: 'shadow-none',

  xs: 'shadow-shadow shadow-sm',
  sm: 'shadow-shadow shadow',
  md: 'shadow-shadow shadow-md',
  lg: 'shadow-shadow shadow-lg',
  xl: 'shadow-shadow shadow-xl',
  ['2xl']: 'shadow-shadow shadow-2xl',
  inner: 'shadow-shadow shadow-inner',
};
