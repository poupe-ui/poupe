<script lang="ts">
import {
  type VariantProps,
  tv,
  twMerge,

  onSlot,

  borderVariantsBase,

  borderVariants,
  roundedVariants,
  shadowVariants,
  containerVariants,
} from './variants';

const sizeVariantProps = {
  xs: 'text-xs font-light m-1 p-1',
  sm: 'text-sm m-2 font-light px-2 py-1',
  base: 'text-base font-normal m-2 p-2',
  lg: 'text-base font-medium m-2 px-4 py-2',
  xl: 'text-xl font-medium m-2 px-4 py-2',
};

const button = tv({
  slots: {
    wrapper: [
      'flex flex-row rtl:flex-row-reverse items-center justify-center',
      borderVariantsBase,
    ],
  },
  variants: {
    surface: onSlot('wrapper', containerVariants),
    border: onSlot('wrapper', borderVariants),
    rounded: onSlot('wrapper', roundedVariants),
    shadow: onSlot('wrapper', shadowVariants),
    size: onSlot('wrapper', sizeVariantProps),

    disabled: {
      true: {
        wrapper: 'cursor-not-allowed',
      },
      false: {
        wrapper: 'cursor-pointer',
      },
    },

    expand: {
      true: {
        wrapper: 'w-full mx-0',
      },
    },
  },
  defaultVariants: {
    border: 'none',
    rounded: 'md',
    shadow: 'md',
    surface: 'base',
    size: 'base',
    expand: false,
    disabled: false,
  },
});

type ButtonVariantProps = VariantProps<typeof button>;

export type ButtonProps = {
  label?: string
  ellipsis?: boolean
  loading?: boolean
  disabled?: boolean

  class?: string

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
import { default as Icon } from './icon.vue';

const props = defineProps<ButtonProps>();

const variants = computed(() => button({
  ...props,
  disabled: props.disabled || props.loading,
}));

const label = computed(() => {
  const s = props.label || 'Button';
  return props.ellipsis ? `${s}…` : s;
});

</script>

<template>
  <button
    :class="[
      twMerge(variants.wrapper(), $props.class),
    ]"
    :disabled="disabled || loading"
  >
    <span
      v-if="$props.label || !$slots.default"
      v-text="label"
    />
    <slot v-else>
      {{ label }}
    </slot>

    <slot
      v-if="loading"
      name="loading"
    >
      <icon
        icon="spinner"
        class="ms-2"
      />
    </slot>
  </button>
</template>
