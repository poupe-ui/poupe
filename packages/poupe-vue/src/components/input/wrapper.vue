<script setup lang="ts">
import { computed, ref } from 'vue';
import { useForwardExpose, Toggle as RekaToggle } from 'reka-ui';
import { twMerge } from '../variants';

import { usePoupeIcons } from '@/composables/use-icons';

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

const { poupe: icons } = usePoupeIcons().icons;
const { showPassword, passwordToggleIcon, typeAttr } = usePasswordToggle();

function usePasswordToggle() {
  const showPassword = ref(false);

  return {
    showPassword,
    passwordToggleIcon: computed(() => showPassword.value ? icons.hidePassword : icons.showPassword),
    typeAttr: computed(() => showPassword.value ? 'text' : props.type),
  };
}
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
          :type="typeAttr"
        >
      </slot>
    </div>

    <slot name="end">
      <reka-toggle
        v-if="props.type === 'password'"
        v-model="showPassword"
        class="p-2"
      >
        <icon :icon="passwordToggleIcon" />
      </reka-toggle>
    </slot>
  </div>
</template>
