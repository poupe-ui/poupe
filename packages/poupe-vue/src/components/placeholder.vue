<script lang="ts">
import {
  tv,
  type VariantProps,
} from './variants';

const placeholder = tv({
  slots: {
    wrapper: 'overflow-hidden',
    pattern: 'w-full h-full',
  },
  variants: {
    border: {
      solid: {
        wrapper: 'border-solid border',
      },
      none: {
        wrapper: 'border-none',
      },
      dashed: {
        wrapper: 'border-dashed border',
      },
    },
    color: {
      current: {
        wrapper: 'border-current',
        pattern: 'stroke-current',
      },
      ['outline-variant']: {
        wrapper: 'border-outline-variant',
        pattern: 'stroke-outline-variant',
      },
      outline: {
        wrapper: 'border-outline',
        pattern: 'stroke-outline',
      },
      primary: {
        wrapper: 'border-primary',
        pattern: 'stroke-primary',
      },
      secondary: {
        wrapper: 'border-secondary',
        pattern: 'stroke-secondary',
      },
      tertiary: {
        wrapper: 'border-tertiary',
        pattern: 'stroke-tertiary',
      },
      error: {
        wrapper: 'border-error',
        pattern: 'stroke-error',
      },
    },
  },
});

type PlaceholderVariantProps = VariantProps<typeof placeholder>;

/** Placeholder component props */
export type PlaceholderProps = {
  /** rhombus width. @defaultValue 10 */
  rw?: number
  /** rhombus height. @defaultValue 20 */
  rh?: number

  /** placeholder border. @defaultValue `'dashed'` */
  border?: PlaceholderVariantProps['border']
  /** pattern and border color. @defaultValue '`outline-variant`' */
  color?: PlaceholderVariantProps['color']
};
</script>

<script setup lang="ts">
import { computed, useId } from 'vue';

const props = withDefaults(defineProps<PlaceholderProps>(), {
  rw: 10,
  rh: 20,
  border: 'dashed' as const,
  color: 'outline-variant' as const,
});

const id = useId();
const variants = computed(() => placeholder({
  border: props.border,
  color: props.color,
}));

</script>

<template>
  <div :class="variants.wrapper()">
    <svg
      :class="variants.pattern()"
      aria-hidden="true"
    >
      <defs>
        <pattern
          :id="id"
          x="0"
          y="0"
          :width="rw"
          :height="rh"
          patternUnits="userSpaceOnUse"
        >
          <path
            :d="`M0 0 ${rw} ${rh} M${rw} 0 0 ${rh}`"
            stroke-width="1px"
            vector-effect="non-scaling-stroke"
          />
        </pattern>
      </defs>

      <rect
        stroke="none"
        :fill="`url(#${id})`"
        width="100%"
        height="100%"
      />
    </svg>

    <slot />
  </div>
</template>
