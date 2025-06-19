import { tv } from 'tailwind-variants';
import {
  onSlot,
  borderVariantsBase,
  borderVariants,
  roundedVariants,
  shadowVariants,
  containerInteractiveVariants,
  colorSurfaceInteractiveVariants,
} from '../variants';

// Size variants with MD3 specifications
const sizeVariantProps = {
  xs: 'text-xs font-light min-h-8 px-3 py-1',
  sm: 'text-sm font-medium min-h-10 px-4 py-2',
  base: 'text-sm font-medium min-h-10 px-6 py-2.5',
  lg: 'text-base font-medium min-h-12 px-8 py-3',
  xl: 'text-lg font-medium min-h-14 px-10 py-4',
};

// FAB size variants
const fabSizeVariants = {
  sm: 'h-10 w-10',
  base: 'h-14 w-14',
  lg: 'h-24 w-24',
};

// Extended FAB size variants
const extendedFabSizeVariants = {
  sm: 'h-10 px-4',
  base: 'h-14 px-6',
  lg: 'h-24 px-8',
};

// Icon button size variants
const iconButtonSizeVariants = {
  xs: 'h-8 w-8',
  sm: 'h-10 w-10',
  base: 'h-12 w-12',
  lg: 'h-14 w-14',
  xl: 'h-16 w-16',
};

export const button = tv({
  slots: {
    wrapper: [
      'relative inline-flex items-center justify-center',
      'font-medium tracking-wide',
      'transition-all duration-200',
      'select-none',
      borderVariantsBase,
    ],
    icon: 'flex-shrink-0',
    label: '',
    loadingIcon: 'animate-spin',
  },
  variants: {
    // MD3 Button variants
    variant: {
      text: {
        wrapper: 'bg-transparent hover:bg-current/8 focus:bg-current/12 active:bg-current/12',
      },
      outlined: {
        wrapper: 'bg-transparent hover:bg-current/8 focus:bg-current/12 active:bg-current/12',
      },
      filled: {
        wrapper: '',
      },
      elevated: {
        wrapper: 'shadow-z1 hover:shadow-z2',
      },
      tonal: {
        wrapper: '',
      },
    },

    // Surface colors (interactive)
    surface: onSlot('wrapper', {
      ...containerInteractiveVariants,
      ...colorSurfaceInteractiveVariants,
    }),

    // Legacy border support
    border: onSlot('wrapper', borderVariants),

    // Shape variants (will migrate to shape tokens)
    rounded: onSlot('wrapper', roundedVariants),
    shape: {
      'shape-none': { wrapper: 'rounded-none' },
      'shape-extra-small': { wrapper: 'rounded' },
      'shape-small': { wrapper: 'rounded-lg' },
      'shape-medium': { wrapper: 'rounded-xl' },
      'shape-large': { wrapper: 'rounded-2xl' },
      'shape-extra-large': { wrapper: 'rounded-3xl' },
      'shape-full': { wrapper: 'rounded-full' },
      'shape-button': { wrapper: 'rounded-full' }, // MD3 default for buttons
    },

    // Shadow variants
    shadow: onSlot('wrapper', shadowVariants),

    // Size variants
    size: onSlot('wrapper', sizeVariantProps),

    // Special button types
    fab: {
      true: {
        wrapper: 'rounded-2xl',
      },
    },

    extended: {
      true: {},
    },

    iconButton: {
      true: {
        wrapper: 'rounded-full p-0',
      },
    },

    // States
    disabled: {
      true: {
        wrapper: 'cursor-not-allowed opacity-38',
      },
      false: {
        wrapper: 'cursor-pointer',
      },
    },

    loading: {
      true: {
        wrapper: 'cursor-wait',
      },
    },

    expand: {
      true: {
        wrapper: 'w-full',
      },
    },

    toggle: {
      true: {},
    },

    pressed: {
      true: {
        wrapper: 'bg-current/12',
      },
    },
  },

  compoundVariants: [
    // Outlined variant needs visible border
    {
      variant: 'outlined',
      class: {
        wrapper: 'border-current/12 hover:border-current/20',
      },
    },

    // FAB sizing
    {
      fab: true,
      extended: false,
      size: 'sm',
      class: {
        wrapper: fabSizeVariants.sm,
      },
    },
    {
      fab: true,
      extended: false,
      size: ['base', 'lg', 'xl'],
      class: {
        wrapper: fabSizeVariants.base,
      },
    },

    // Extended FAB sizing
    {
      fab: true,
      extended: true,
      size: 'sm',
      class: {
        wrapper: extendedFabSizeVariants.sm,
      },
    },
    {
      fab: true,
      extended: true,
      size: ['base', 'lg', 'xl'],
      class: {
        wrapper: extendedFabSizeVariants.base,
      },
    },

    // Icon button sizing
    {
      iconButton: true,
      size: 'xs',
      class: {
        wrapper: iconButtonSizeVariants.xs,
      },
    },
    {
      iconButton: true,
      size: 'sm',
      class: {
        wrapper: iconButtonSizeVariants.sm,
      },
    },
    {
      iconButton: true,
      size: 'base',
      class: {
        wrapper: iconButtonSizeVariants.base,
      },
    },
    {
      iconButton: true,
      size: 'lg',
      class: {
        wrapper: iconButtonSizeVariants.lg,
      },
    },
    {
      iconButton: true,
      size: 'xl',
      class: {
        wrapper: iconButtonSizeVariants.xl,
      },
    },

    // Variant + surface combinations
    {
      variant: 'filled',
      surface: 'primary',
      class: {
        wrapper: 'interactive-surface-primary',
      },
    },
    {
      variant: 'tonal',
      surface: 'primary',
      class: {
        wrapper: 'interactive-surface-primary-container',
      },
    },

    // Icon spacing
    {
      fab: false,
      iconButton: false,
      class: {
        icon: 'mr-2',
      },
    },
  ],

  defaultVariants: {
    variant: 'text',
    border: 'none',
    rounded: 'full',
    shadow: 'none',
    surface: 'primary',
    size: 'base',
    expand: false,
    disabled: false,
    fab: false,
    extended: false,
    iconButton: false,
    toggle: false,
    pressed: false,
    shape: 'shape-button',
  },
});
