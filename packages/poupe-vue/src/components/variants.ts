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

// TODO: turn into elevation values
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

export const colorSurfaceVariants = {
  primary: 'bg-primary text-on-primary border-on-primary',
  secondary: 'bg-secondary text-on-secondary border-on-secondary',
  tertiary: 'bg-tertiary text-on-tertiary border-on-tertiary',
  error: 'bg-error text-on-error border-on-error',

  ['primary-fixed']: 'bg-primary-fixed text-on-primary-fixed border-on-primary-fixed',
  ['secondary-fixed']: 'bg-secondary-fixed text-on-secondary-fixed border-on-secondary-fixed',
  ['tertiary-fixed']: 'bg-tertiary-fixed text-on-tertiary-fixed border-on-tertiary-fixed',

  inverse: 'bg-inverse-surface text-on-inverse-surface border-on-inverse-surface',
};

export const surfaceVariants = {
  ...colorSurfaceVariants,

  dim: 'bg-surface-dim text-on-surface-dim border-on-surface-dim',
  base: 'bg-surface text-on-surface border-on-surface',
  bright: 'bg-surface-bright text-on-surface-bright border-on-surface-bright',
  variant: 'bg-surface-variant text-on-surface-variant border-on-surface-variant',
};
