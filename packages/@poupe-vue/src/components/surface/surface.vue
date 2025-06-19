<template>
  <component
    :is="tag"
    :class="classes"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { tv } from 'tailwind-variants';
import { usePoupeDefaults } from '../../composables/use-poupe';
import type { PSurfaceProps } from './surface.props';

const props = withDefaults(defineProps<PSurfaceProps>(), {
  tag: 'div',
  elevation: 'z1',
  shape: 'shape-medium',
  interactive: false,
});

// Use poupe defaults if available
const poupeDefaults = usePoupeDefaults('surface');

// Create interactive variants using tv
const interactiveSurfaceVariants = tv({
  base: '',
  variants: {
    color: {
      'surface': 'interactive-surface',
      'surface-dim': 'interactive-surface-dim',
      'surface-bright': 'interactive-surface-bright',
      'surface-variant': 'interactive-surface-variant',
      'surface-container-lowest': 'interactive-surface-container-lowest',
      'surface-container-low': 'interactive-surface-container-low',
      'surface-container': 'interactive-surface-container',
      'surface-container-high': 'interactive-surface-container-high',
      'surface-container-highest': 'interactive-surface-container-highest',
      'primary': 'interactive-surface-primary',
      'secondary': 'interactive-surface-secondary',
      'tertiary': 'interactive-surface-tertiary',
      'error': 'interactive-surface-error',
      'primary-container': 'interactive-surface-primary-container',
      'secondary-container': 'interactive-surface-secondary-container',
      'tertiary-container': 'interactive-surface-tertiary-container',
      'error-container': 'interactive-surface-error-container',
      'inverse': 'interactive-surface-inverse',
    },
  },
});

const surfaceVariants = tv({
  base: 'relative transition-shadow duration-200',
  variants: {
    elevation: {
      z0: 'z0',
      z1: 'z1',
      z2: 'z2',
      z3: 'z3',
      z4: 'z4',
      z5: 'z5',
    },
    shape: {
      'shape-none': 'rounded-none',
      'shape-extra-small': 'rounded',
      'shape-small': 'rounded-lg',
      'shape-medium': 'rounded-xl',
      'shape-large': 'rounded-2xl',
      'shape-extra-large': 'rounded-3xl',
      'shape-full': 'rounded-full',
    },
    color: {
      'surface': 'surface',
      'surface-dim': 'surface-dim',
      'surface-bright': 'surface-bright',
      'surface-variant': 'surface-variant',
      'surface-container-lowest': 'surface-container-lowest',
      'surface-container-low': 'surface-container-low',
      'surface-container': 'surface-container',
      'surface-container-high': 'surface-container-high',
      'surface-container-highest': 'surface-container-highest',
      'primary': 'surface-primary',
      'secondary': 'surface-secondary',
      'tertiary': 'surface-tertiary',
      'error': 'surface-error',
      'primary-container': 'surface-primary-container',
      'secondary-container': 'surface-secondary-container',
      'tertiary-container': 'surface-tertiary-container',
      'error-container': 'surface-error-container',
      'inverse': 'surface-inverse',
    },
  },
  defaultVariants: {
    elevation: 'z1',
    shape: 'shape-medium',
  },
});

const classes = computed(() => {
  if (props.interactive) {
    // Use interactive variants when interactive
    const interactiveClasses = interactiveSurfaceVariants({
      color: props.color,
    });

    // Combine with surface-specific classes
    return [
      interactiveClasses,
      surfaceVariants({
        elevation: props.elevation || poupeDefaults?.elevation,
        shape: props.shape || poupeDefaults?.shape,
      }),
    ].join(' ');
  }

  return surfaceVariants({
    elevation: props.elevation || poupeDefaults?.elevation,
    shape: props.shape || poupeDefaults?.shape,
    color: props.color,
  });
});
</script>
