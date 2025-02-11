<script lang="ts">
export { type InputProps } from './base';
</script>

<script setup lang="ts">
import {
  type Ref,
  computed, ref, toValue,
} from 'vue';

import { useForwardExpose } from 'reka-ui';

import { useConfig } from '@/composables/use-config';

import Icon from '../icon.vue';
import InputLayout from './layout.vue';

import {
  type InputProps,
  defaultInputProps,
} from './base';

const props = withDefaults(defineProps<InputProps>(), defaultInputProps);

const initialType = computed(() => props.type || 'text');
const { typeAttr, passwordToggleIcon, passwordToggle } = usePasswordToggle(initialType);
const { forwardRef } = useForwardExpose();

function usePasswordToggle(typ: Ref<string>) {
  const { icons } = useConfig();

  const typeAttr = ref<InputProps['type']>(toValue(typ));

  const typeIsPassword = () => typeAttr.value === 'password';
  const passwordToggleIcon = computed(() => typeIsPassword() ? icons.showPassword : icons.hidePassword);
  const passwordToggle = () => typeAttr.value = typeIsPassword() ? 'text' : 'password';

  return {
    typeAttr,
    passwordToggleIcon,
    passwordToggle,
  };
};
</script>

<template>
  <input-layout
    :ref="forwardRef"
    :type="typeAttr"
  >
    <template
      v-if="$slots.label"
      #label="{class: c}"
    >
      <slot
        name="label"
        :class="c"
      />
    </template>

    <template
      v-if="$slots.help"
      #help="{class: c}"
    >
      <slot
        name="help"
        :class="c"
      />
    </template>

    <template
      v-if="$slots.unit"
      #unit="{class:c}"
    >
      <slot
        name="unit"
        :class="c"
      />
    </template>

    <template
      v-if="$slots.start"
      #start="{class:c}"
    >
      <slot
        name="start"
        :class="c"
      />
    </template>

    <template
      v-if="$slots.end || $props.type === 'password'"
      #end="{class:c}"
    >
      <slot
        name="end"
        :class="c"
      >
        <button
          v-if="$props.type === 'password'"
          :class="c"
          @click="passwordToggle"
        >
          <icon :icon="passwordToggleIcon" />
        </button>
      </slot>
    </template>
  </input-layout>
</template>
