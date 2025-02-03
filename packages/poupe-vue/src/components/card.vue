<script lang="ts">
import {
  type VariantProps,
  tv,

  onSlot,
  roundedVariants,
  surfaceVariants,
  shadowVariants,
} from './variants';

const card = tv({
  slots: {
    wrapper: 'relative overflow-hidden',
  },
  variants: {
    rounded: onSlot('wrapper', roundedVariants),
    shadow: onSlot('wrapper', shadowVariants),
    surface: onSlot('wrapper', surfaceVariants),
  },
});

type CardVariantProps = VariantProps<typeof card>;

/** Card component props */
export interface CardProps {
  title?: string

  rounded?: CardVariantProps['rounded']
  shadow?: CardVariantProps['shadow']
  surface?: CardVariantProps['surface']
};
</script>

<script setup lang="ts">
import { computed, useSlots } from 'vue';

import Placeholder from './placeholder.vue';

const props = withDefaults(defineProps<CardProps>(), {
  title: undefined,
  rounded: 'xl' as const,
  shadow: 'none' as const,
  surface: 'base' as const,
});

const variants = computed(() => card({
  rounded: props.rounded,
  shadow: props.shadow,
  surface: props.surface,
}));

const slots = useSlots();
const hasHeader = computed<boolean>(() => props.title !== undefined || slots.header !== undefined);
const hasFooter = computed<boolean>(() => slots.footer !== undefined);
</script>

<template>
  <div :class="variants.wrapper()">
    <!-- header -->
    <slot name="header">
      <div
        v-if="title"
        class="p-2 min-h-8"
      >
        <h6 class="text-2xl font-bold">
          {{ title }}
        </h6>
      </div>
    </slot>
    <!-- content -->
    <div
      class="relative overflow-auto mx-2 p-2"
      :class="{
        'mt-2': !hasHeader,
        'mb-2': !hasFooter,
      }"
    >
      <slot>
        <div class="h-32 w-64">
          <Placeholder />
        </div>
      </slot>
    </div>
    <!-- footer -->
    <slot name="footer" />
  </div>
</template>
