import { unsafeKeys } from '../../utils/utils';

import {
  type ClassValue,
} from 'tailwind-variants';

export { tv, type VariantProps } from 'tailwind-variants';
export { twMerge } from 'tailwind-merge';

/** @returns a variant applied to the specified slot */
export const onSlot = <K extends string> (slot: string | string[], variants: Record<K, ClassValue>) => {
  const slots = Array.isArray(slot) ? slot : [slot];

  type S = typeof slots[number];
  type T = { [slot in S]: ClassValue };

  const out: Partial<Record<K, T>> = {};
  for (const name of unsafeKeys(variants)) {
    const v: Record<S, ClassValue> = {};
    for (const s of slots) {
      v[s] = variants[name];
    }
    out[name] = v;
  }

  return out as { [slot in K]: T };
};

export const borderVariants = {
  none: 'border-none',
  current: 'border-solid border',
  primary: 'border-solid border border-primary',
  secondary: 'border-solid border border-secondary',
  tertiary: 'border-solid border border-tertiary',
  error: 'border-solid border border-error',
  outline: 'border-solid border border-outline',
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

  ['primary-container']: 'bg-primary-container text-on-primary-container border-on-primary-container',
  ['secondary-container']: 'bg-secondary-container text-on-secondary-container border-on-secondary-container',
  ['tertiary-container']: 'bg-tertiary-container text-on-tertiary-container border-on-tertiary-container',
  ['error-container']: 'bg-error-container text-on-error-container border-on-error-container',

  inverse: 'bg-inverse-surface text-on-inverse-surface border-on-inverse-surface',
};

export const surfaceVariants = {
  ...colorSurfaceVariants,

  dim: 'bg-surface-dim text-on-surface-dim border-on-surface-dim',
  base: 'bg-surface text-on-surface border-on-surface',
  bright: 'bg-surface-bright text-on-surface-bright border-on-surface-bright',
  variant: 'bg-surface-variant text-on-surface-variant border-on-surface-variant',
};

export const containerVariants = {
  ...colorSurfaceVariants,

  lowest: 'bg-surface-container-lowest text-on-surface-container-lowest border-on-surface-container-lowest',
  low: 'bg-surface-container-low text-on-surface-container-low border-on-surface-container-low',
  base: 'bg-surface-container text-on-surface-container border-on-surface-container',
  high: 'bg-surface-container-high text-on-surface-container-high border-on-surface-container-high',
  highest: 'bg-surface-container-highest text-on-surface-container-highest border-on-surface-container-highest',
};
