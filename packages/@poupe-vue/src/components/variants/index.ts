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
  primary: 'surface-primary',
  secondary: 'surface-secondary',
  tertiary: 'surface-tertiary',
  error: 'surface-error',

  ['primary-fixed']: 'surface-primary-fixed',
  ['secondary-fixed']: 'surface-secondary-fixed',
  ['tertiary-fixed']: 'surface-tertiary-fixed',

  ['primary-container']: 'surface-primary-container',
  ['secondary-container']: 'surface-secondary-container',
  ['tertiary-container']: 'surface-tertiary-container',
  ['error-container']: 'surface-error-container',

  inverse: 'surface-inverse',
  ['inverse-primary']: 'surface-inverse-primary',
};

export const surfaceVariants = {
  ...colorSurfaceVariants,

  dim: 'surface-dim',
  base: 'surface',
  bright: 'surface-bright',
  variant: 'surface-variant',
};

export const containerVariants = {
  ...colorSurfaceVariants,

  lowest: 'surface-container-lowest',
  low: 'surface-container-low',
  base: 'surface-container',
  high: 'surface-container-high',
  highest: 'surface-container-highest',
};

export const colorSurfaceInteractiveVariants = {
  primary: 'interactive-surface-primary',
  secondary: 'interactive-surface-secondary',
  tertiary: 'interactive-surface-tertiary',
  error: 'interactive-surface-error',

  ['primary-fixed']: 'interactive-surface-primary-fixed',
  ['secondary-fixed']: 'interactive-surface-secondary-fixed',
  ['tertiary-fixed']: 'interactive-surface-tertiary-fixed',

  ['primary-container']: 'interactive-surface-primary-container',
  ['secondary-container']: 'interactive-surface-secondary-container',
  ['tertiary-container']: 'interactive-surface-tertiary-container',
  ['error-container']: 'interactive-surface-error-container',

  inverse: 'interactive-surface-inverse',
  ['inverse-primary']: 'interactive-surface-inverse-primary',
};

export const surfaceInteractiveVariants = {
  ...colorSurfaceInteractiveVariants,

  dim: 'interactive-surface-dim',
  base: 'interactive-surface',
  bright: 'interactive-surface-bright',
  variant: 'interactive-surface-variant',
};

export const containerInteractiveVariants = {
  ...colorSurfaceInteractiveVariants,

  lowest: 'interactive-surface-container-lowest',
  low: 'interactive-surface-container-low',
  base: 'interactive-surface-container',
  high: 'interactive-surface-container-high',
  highest: 'interactive-surface-container-highest',
};
