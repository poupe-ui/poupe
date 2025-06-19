<template>
  <component
    :is="component"
    ref="buttonElement"
    :class="[
      twMerge(variants.wrapper(), $props.class),
    ]"
    :disabled="disabled || loading"
    :aria-pressed="toggle ? isPressed.toString() : undefined"
    :aria-label="ariaLabel"
    :type="component === 'button' ? 'button' : undefined"
    @click="handleClick"
  >
    <!-- Ripple effect -->
    <span
      v-for="ripple in ripples"
      :key="ripple.id"
      :style="getRippleStyle(ripple)"
      class="ripple-effect"
    />

    <!-- Leading icon -->
    <Icon
      v-if="icon && !loading"
      :icon="icon"
      :class="variants.icon()"
    />

    <!-- Loading spinner -->
    <Icon
      v-if="loading"
      icon="mdi:loading"
      :class="[variants.icon(), variants.loadingIcon()]"
    />

    <!-- Label -->
    <span
      v-if="showLabel"
      :class="variants.label()"
      v-text="computedLabel"
    />

    <!-- Default slot -->
    <slot v-else-if="$slots.default" />

    <!-- Trailing icon -->
    <Icon
      v-if="trailingIcon && !loading"
      :icon="trailingIcon"
      :class="[variants.icon(), !iconButton && 'ml-2']"
    />
  </component>
</template>

<script setup lang="ts">
/* global Event, HTMLElement */
import { computed, ref } from 'vue';
import { twMerge } from 'tailwind-merge';
import { defu } from 'defu';
import { usePoupeDefaults } from '../../composables/use-poupe';
import { useRipple } from '../../composables/use-ripple';
import Icon from '../icon.vue';
import { button } from './button.variants';
import type { PButtonProps } from './button.props';

// Define props first
const props = withDefaults(defineProps<PButtonProps>(), {
  disabled: false,
  loading: false,
  ellipsis: false,
  fab: false,
  extended: false,
  iconButton: false,
  toggle: false,
  pressed: false,
  expand: false,
});

const emit = defineEmits<{
  click: [event: Event]
  toggle: [pressed: boolean]
}>();

// Use poupe defaults
const poupeDefaults = usePoupeDefaults('button');

// Component ref
const buttonElement = ref<HTMLElement>();

// Ripple effect
const { ripples, getRippleStyle } = useRipple(buttonElement, {
  disabled: props.disabled || props.loading,
});

// Computed component type
const component = computed(() => {
  return props.toggle ? 'button' : 'button';
});

// Handle toggle state
const isPressed = ref(props.pressed || false);
const handleClick = (event: Event) => {
  if (props.toggle && !props.disabled && !props.loading) {
    isPressed.value = !isPressed.value;
    emit('toggle', isPressed.value);
  }
  emit('click', event);
};

// Component defaults
const componentDefaults = {
  variant: 'text',
  surface: 'primary',
  border: 'none',
  rounded: 'full',
  shadow: 'none',
  size: 'base',
  shape: 'shape-button',
};

// Apply variants with merged defaults using defu
const variants = computed(() => {
  const mergedProps = defu(
    {
      // Props that should always come from the component
      fab: props.fab,
      extended: props.extended,
      iconButton: props.iconButton,
      disabled: props.disabled || props.loading,
      loading: props.loading,
      expand: props.expand,
      toggle: props.toggle,
      pressed: props.toggle ? isPressed.value : false,
      // Props that can be defaulted
      variant: props.variant,
      surface: props.surface,
      border: props.border,
      rounded: props.rounded,
      shadow: props.shadow,
      size: props.size,
      shape: props.shape,
    },
    poupeDefaults || {},
    componentDefaults,
  ) as Parameters<typeof button>[0];

  return button(mergedProps);
});

// Computed label
const computedLabel = computed(() => {
  if (!props.label) return undefined;
  return props.ellipsis ? `${props.label}…` : props.label;
});

// Show label logic
const showLabel = computed(() => {
  if (props.iconButton && !props.extended) return false;
  if (props.fab && !props.extended) return false;
  return Boolean(props.label);
});

// Computed aria-label
const ariaLabel = computed(() => {
  if (props.iconButton || (props.fab && !props.extended)) {
    return props.label || undefined;
  }
  return undefined;
});
</script>
