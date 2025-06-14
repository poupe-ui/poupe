export { tv, type VariantProps } from 'tailwind-variants';
export { twMerge } from 'tailwind-merge';

export * from './consts';
export * from './on-slot';
export * from './on-variant';

export const borderVariantsBase = 'border-solid border';

export const borderVariants = {
  none: 'border-transparent',
  current: 'border-current',
  primary: 'border-primary',
  secondary: 'border-secondary',
  tertiary: 'border-tertiary',
  error: 'border-error',
  outline: 'border-outline',
};

export const borderInFocusVariantsBase = 'ring-solid ring-2 ring-transparent';

export const borderInFocusVariants = {
  none: '',
  current: 'focus-within:ring-current',
  primary: 'focus-within:ring-primary',
  secondary: 'focus-within:ring-secondary',
  tertiary: 'focus-within:ring-tertiary',
  error: 'focus-within:ring-error',
  outline: 'focus-within:ring-outline',
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

  z1: 'shadow-shadow shadow-z1',
  z2: 'shadow-shadow shadow-z2',
  z3: 'shadow-shadow shadow-z3',
  z4: 'shadow-shadow shadow-z4',
  z5: 'shadow-shadow shadow-z5',
  inset: 'inset-shadow-shadow inset-shadow',
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
