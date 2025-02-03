<script lang="ts">
import {
  type VariantProps,
  tv,

  onSlot,
  borderVariants,
  roundedVariants,
  shadowVariants,
  surfaceVariants,
} from './variants';

const defaultVariantProps = {
  border: 'none' as const,
  rounded: 'md' as const,
  shadow: 'md' as const,
  surface: 'base' as const,
  size: 'base' as const,
  expand: false,
};

const sizeVariantProps = {
  xs: 'text-xs font-light m-1 p-1',
  sm: 'text-sm m-2 font-light px-2 py-1',
  base: 'text-base font-normal m-2 p-2',
  lg: 'text-base font-medium m-2 px-4 py-2',
  xl: 'text-xl font-medium m-2 px-4 py-2',
};

const button = tv({
  slots: {
    wrapper: '',
  },
  variants: {
    surface: onSlot('wrapper', surfaceVariants),
    border: onSlot('wrapper', borderVariants),
    rounded: onSlot('wrapper', roundedVariants),
    shadow: onSlot('wrapper', shadowVariants),
    size: onSlot('wrapper', sizeVariantProps),

    expand: {
      true: {
        wrapper: 'w-full',
      },
    },
  },
  defaultVariants: defaultVariantProps,
});

type ButtonVariantProps = VariantProps<typeof button>;

export type ButtonProps = {
  label?: string
  ellipsis?: boolean

  surface?: ButtonVariantProps['surface']
  border?: ButtonVariantProps['border']
  rounded?: ButtonVariantProps['rounded']
  shadow?: ButtonVariantProps['shadow']
  size?: ButtonVariantProps['size']
  expand?: ButtonVariantProps['expand']
};
</script>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<ButtonProps>();

const variants = computed(() => button({
  border: props.border,
  rounded: props.rounded,
  shadow: props.shadow,
  surface: props.surface,
  size: props.size,
  expand: props.expand,
}));

const label = computed(() => {
  const s = props.label || 'Button';
  return props.ellipsis ? `${s}…` : s;
});
</script>

<template>
  <button :class="variants.wrapper()">
    <span
      v-if="$props.label || !$slots.default"
      v-text="label"
    />
    <slot v-else>
      {{ label }}
    </slot>
  </button>
</template>
