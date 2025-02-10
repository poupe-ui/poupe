<script setup lang="ts">
import { computed } from 'vue';
import { useForwardExpose } from 'reka-ui';
import { twMerge } from '../variants';

import {
  type InputValue,
  type InputWrapperProps,

  defaultInputWrapperProps,
  inputWrapperVariants,
} from './types';

defineOptions({
  inheritAttrs: false,
});

const model = defineModel<InputValue>();
const props = withDefaults(defineProps<InputWrapperProps>(), defaultInputWrapperProps);

const variants = computed(() => inputWrapperVariants(props));
const wrapperClasses = computed(() => twMerge(variants.value.wrapper(), props.class));

const { forwardRef } = useForwardExpose();
</script>

<template>
  <div
    :class="wrapperClasses"
  >
    <!-- [[ start ][ field ][ end ]] -->
    <slot name="start" />

    <div :class="variants.field()">
      <slot
        :ref="forwardRef"
        name="field"
        :class="variants.input()"
      >
        <input
          v-bind="$attrs"
          :id="props.id"
          :ref="forwardRef"
          v-model="model"
          :class="variants.input()"
          :type="props.type"
        >
      </slot>
    </div>

    <slot name="end" />
  </div>
</template>
