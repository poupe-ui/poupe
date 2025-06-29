<script lang="ts">
import {
  type VariantProps,
  tv,
  twMerge,

  onSlot,
  surfaceInteractiveVariants,
  containerInteractiveVariants,
  shapeVariants,
  shadowVariants,
  borderVariants,
  borderVariantsBase,
} from './variants';

// Define defaults in one place
const surfaceDefaults = {
  tag: 'div',
  class: '',
  role: 'surface',
  tone: 'base',
  level: 'base',
  shape: 'none',
  shadow: 'none',
  border: 'none',
  interactive: false,
  padding: 'none',
} as const;

export const surface = tv({
  slots: {
    wrapper: 'relative',
  },
  variants: {
    role: {
      surface: {},
      container: {},
    },
    // Surface tones (for role='surface')
    tone: {
      dim: { wrapper: 'surface-dim' },
      base: { wrapper: 'surface' },
      bright: { wrapper: 'surface-bright' },
    },
    // Container levels (for role='container')
    level: {
      lowest: { wrapper: 'surface-container-lowest' },
      low: { wrapper: 'surface-container-low' },
      base: { wrapper: 'surface-container' },
      high: { wrapper: 'surface-container-high' },
      highest: { wrapper: 'surface-container-highest' },
    },
    // Semantic color variants
    variant: {
      'primary': { wrapper: 'surface-primary' },
      'secondary': { wrapper: 'surface-secondary' },
      'tertiary': { wrapper: 'surface-tertiary' },
      'error': { wrapper: 'surface-error' },
      'primary-fixed': { wrapper: 'surface-primary-fixed' },
      'secondary-fixed': { wrapper: 'surface-secondary-fixed' },
      'tertiary-fixed': { wrapper: 'surface-tertiary-fixed' },
      'primary-container': { wrapper: 'surface-primary-container' },
      'secondary-container': { wrapper: 'surface-secondary-container' },
      'tertiary-container': { wrapper: 'surface-tertiary-container' },
      'error-container': { wrapper: 'surface-error-container' },
      'inverse': { wrapper: 'surface-inverse' },
      'inverse-primary': { wrapper: 'surface-inverse-primary' },
    },
    shape: onSlot('wrapper', shapeVariants),
    shadow: onSlot('wrapper', shadowVariants),
    border: onSlot('wrapper', borderVariants),
    interactive: {
      true: {
        wrapper: 'cursor-pointer',
      },
      false: {},
    },
    padding: {
      none: {},
      sm: { wrapper: 'p-2' },
      md: { wrapper: 'p-4' },
      lg: { wrapper: 'p-6' },
      xl: { wrapper: 'p-8' },
    },
  },
  defaultVariants: {
    role: surfaceDefaults.role,
    tone: surfaceDefaults.tone,
    level: surfaceDefaults.level,
    shape: surfaceDefaults.shape,
    shadow: surfaceDefaults.shadow,
    border: surfaceDefaults.border,
    interactive: surfaceDefaults.interactive,
    padding: surfaceDefaults.padding,
  },
  compoundVariants: [
    {
      border: ['primary', 'secondary', 'tertiary', 'error', 'outline', 'current'],
      class: {
        wrapper: borderVariantsBase,
      },
    },
  ],
});

export type SurfaceVariantProps = VariantProps<typeof surface>;

/** Surface component props */
export interface SurfaceProps {
  /** HTML tag to render */
  tag?: string

  /** Surface role (surface or container) */
  role?: NonNullable<SurfaceVariantProps['role']>

  /** Surface tone (for role='surface': dim, base, bright) */
  tone?: NonNullable<SurfaceVariantProps['tone']>

  /** Container level (for role='container': lowest, low, base, high, highest) */
  level?: NonNullable<SurfaceVariantProps['level']>

  /** Semantic color variant (primary, secondary, tertiary, error, etc.) */
  variant?: NonNullable<SurfaceVariantProps['variant']>

  /** Shape variant */
  shape?: NonNullable<SurfaceVariantProps['shape']>

  /** Shadow elevation */
  shadow?: NonNullable<SurfaceVariantProps['shadow']>

  /** Border style */
  border?: NonNullable<SurfaceVariantProps['border']>

  /** Enable interactive states */
  interactive?: NonNullable<SurfaceVariantProps['interactive']>

  /** Padding size */
  padding?: NonNullable<SurfaceVariantProps['padding']>

  /** Additional CSS classes */
  class?: string
}

// Module augmentation for global defaults
declare module '../composables/use-poupe' {
  interface PoupeComponentDefaults {
    surface?: Partial<SurfaceProps>
  }
}
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { usePoupeMergedProps } from '../composables';

// Disable automatic attribute inheritance
defineOptions({
  inheritAttrs: false,
});

// Define props without withDefaults
const directProps = defineProps<SurfaceProps>();

// Merge with global defaults and component defaults
// This provides three-level merging: global defaults < component defaults < props
const props = computed(() =>
  usePoupeMergedProps(directProps, 'surface', surfaceDefaults),
);

const variants = computed(() => {
  const baseVariants = surface({
    role: props.value.role,
    tone: props.value.tone,
    level: props.value.level,
    variant: props.value.variant,
    shape: props.value.shape,
    shadow: props.value.shadow,
    border: props.value.border,
    interactive: props.value.interactive,
    padding: props.value.padding,
  });

  // If interactive, use the interactive surface variant
  if (props.value.interactive) {
    const role = props.value.role as 'surface' | 'container';
    const interactiveVariants = role === 'container'
      ? containerInteractiveVariants
      : surfaceInteractiveVariants;

    // Determine the color key based on role, tone/level, and variant
    let colorKey: string | undefined;
    if (props.value.variant) {
      colorKey = props.value.variant;
    } else if (role === 'surface' && props.value.tone) {
      colorKey = props.value.tone;
    } else if (role === 'container' && props.value.level) {
      colorKey = props.value.level;
    }

    if (colorKey && colorKey in interactiveVariants) {
      return {
        wrapper: () => twMerge(
          baseVariants.wrapper(),
          interactiveVariants[colorKey as keyof typeof interactiveVariants],
        ),
      };
    }
  }

  return baseVariants;
});

const classes = computed(() =>
  twMerge(variants.value.wrapper(), props.value.class),
);
</script>

<template>
  <component
    :is="props.tag"
    :class="classes"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>
