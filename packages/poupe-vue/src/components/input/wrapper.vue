<script lang="ts">
export { type InputWrapperProps } from './wrapper';
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { useForwardExpose } from 'reka-ui';
import { twMerge } from '../variants';

import {
  type InputWrapperProps,

  defaultInputWrapperProps,
  inputWrapperVariants,
} from './wrapper';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<InputWrapperProps>(), defaultInputWrapperProps);

const variants = computed(() => inputWrapperVariants(props));
const fieldClasses = computed(() => twMerge(variants.value.field(), props.class));

const { forwardRef } = useForwardExpose();
</script>

<template>
  <div
    :class="variants.wrapper()"
  >
    <!-- [[ before ][ field ][ after ]] -->
    <slot name="before" />

    <div :class="fieldClasses">
      <slot
        :ref="forwardRef"
        name="field"
      >
        <input
          :ref="forwardRef"
          :class="fieldClasses"
          v-bind="$attrs"
        >
      </slot>
    </div>

    <slot name="after" />
  </div>
</template>
