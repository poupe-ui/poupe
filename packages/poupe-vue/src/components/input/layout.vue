<script lang="ts">
export { type InputLayoutProps } from './layout';
</script>

<script setup lang="ts">
import { computed, useId } from 'vue';

import {
  Label as RekaLabel,
  useForwardExpose,
} from 'reka-ui';

import Icon from '../icon.vue';
import InputWrapper from './wrapper.vue';

import {
  type InputLayoutProps,
  defaultInputLayoutProps,
  inputLayoutVariants,
} from './layout';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<InputLayoutProps>(), defaultInputLayoutProps);

const variants = computed(() => inputLayoutVariants(props));

const id = computed(() => props.id ?? useId());

const { forwardRef } = useForwardExpose();
</script>

<!--
  +----------------------------+
  |            label           |
  +-------+-------+------+-----+
  | start | field | unit | end |
  +-------+-------+------+-----+
  |            help            |
  +----------------------------+
-->

<template>
  <div
    :class="variants.root()"
  >
    <slot
      v-if="$slots.label || $props.label"
      name="label"
      :class="variants.label()"
    >
      <reka-label
        :for="id"
        :class="variants.label()"
      >
        {{ $props.label }}
      </reka-label>
    </slot>

    <input-wrapper
      :id="id"
      :ref="forwardRef"
      v-bind="$attrs"
      :class="variants.field()"
    >
      <template #before>
        <slot
          v-if="$slots.start || $props.iconStart"
          name="start"
          :class="variants.start()"
        >
          <icon
            :icon="$props.iconStart"
            :class="variants.start()"
          />
        </slot>
      </template>

      <template #after>
        <slot
          v-if="$slots.unit || $props.unit"
          name="unit"
          :class="variants.unit()"
        >
          <div
            :class="variants.unit()"
            v-text="props.unit"
          />
        </slot>

        <slot
          v-if="$slots.end || $props.iconEnd"
          name="end"
          :class="variants.end()"
        >
          <icon
            :icon="$props.iconEnd"
            :class="variants.end()"
          />
        </slot>
      </template>
    </input-wrapper>

    <slot
      v-if="$slots.help || $props.help"
      name="help"
      :class="variants.help()"
    >
      <div :class="variants.help()">
        <slot v-text="$props.help" />
      </div>
    </slot>
  </div>
</template>
