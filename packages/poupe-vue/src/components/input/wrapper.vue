<script setup lang="ts">
import { computed } from 'vue';
import { useForwardExpose, Toggle as RekaToggle } from 'reka-ui';
import { twMerge } from '../variants';

import { usePasswordToggle } from '@/composables/use-password';

import Icon from '../icon.vue';

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
const { showPassword, passwordToggleIcon, typeAttr } = usePasswordToggle(props.type);
</script>

<template>
  <div
    :class="wrapperClasses"
  >
    <!-- [[ start ][ input ][ unit ][ end ]] -->
    <slot
      v-if="$slots.start || $props.iconStart !== undefined"
      name="start"
      :class="variants.start()"
      :padding="$props.padding"
    >
      <div
        :class="variants.start()"
        role="presentation"
        aria-hidden="true"
      >
        <icon
          :icon="$props.iconStart"
        />
      </div>
    </slot>

    <div :class="variants.field()">
      <slot
        :ref="forwardRef"
        name="field"
        :class="variants.input()"
        :padding="$props.padding"
      >
        <input
          v-bind="$attrs"
          :id="props.id"
          :ref="forwardRef"
          v-model="model"
          :class="variants.input()"
          :type="typeAttr"
        >
      </slot>
    </div>

    <slot
      v-if="$slots.unit || $props.unit"
      name="unit"
      :class="variants.unit()"
      :padding="$props.padding"
    >
      <div
        :class="variants.unit()"
        role="note"
        :aria-label="$props.unit"
        v-text="$props.unit"
      />
    </slot>

    <slot
      v-if="$slots.end || $props.iconEnd !== undefined || $props.type === 'password'"
      name="end"
      :class="variants.end()"
      :padding="$props.padding"
    >
      <div
        v-if="$props.iconEnd !== undefined"
        :class="variants.end()"
        role="presentation"
        aria-hidden="true"
      >
        <icon
          :icon="$props.iconEnd"
        />
      </div>

      <reka-toggle
        v-else-if="props.type === 'password'"
        v-model="showPassword"
        :class="variants.end()"
      >
        <icon :icon="passwordToggleIcon" />
      </reka-toggle>
    </slot>
  </div>
</template>
