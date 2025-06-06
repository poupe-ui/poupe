<script lang="ts">
import type { ButtonProps } from './button.vue';

export interface DarkModeToggleProps extends Omit<ButtonProps, 'ellipsis' | 'loading'> {
  /**
   * Storage key for persisting preference
   * @defaultValue 'poupe-theme-preference'
   */
  storageKey?: string

  /**
   * Show tooltip with keyboard shortcut
   * @defaultValue true
   */
  showTooltip?: boolean

  /**
   * Custom icons for light/dark modes
   */
  lightIcon?: string
  darkIcon?: string
}
</script>

<script setup lang="ts">
import { computed, inject, toValue, type MaybeRefOrGetter } from 'vue';
import { useDark, useToggle, usePreferredDark, useKeyModifier, useEventListener } from '@vueuse/core';
import Button from './button.vue';
import Icon from './icon.vue';

const props = withDefaults(defineProps<DarkModeToggleProps>(), {
  storageKey: 'poupe-theme-preference',
  showTooltip: true,
  lightIcon: 'heroicons:sun',
  darkIcon: 'heroicons:moon',
  size: 'base',
  surface: 'surface',
});

// Check if we're in a Nuxt environment by looking for injected color mode
const nuxtColorMode = inject<{ preference?: string; value?: string }>('color-mode', {});

let isDark: MaybeRefOrGetter<boolean>;
let toggleDarkMode: () => void;

if (nuxtColorMode) {
  // In Nuxt, use the color-mode module
  isDark = computed(() => nuxtColorMode.preference === 'dark' || nuxtColorMode.value === 'dark');
  toggleDarkMode = () => {
    nuxtColorMode.preference = nuxtColorMode.preference === 'dark' ? 'light' : 'dark';
  };
} else {
  // In Vue, use VueUse's useDark
  const prefersDark = usePreferredDark();
  const darkRef = useDark({
    selector: 'html',
    attribute: 'class',
    valueDark: 'dark',
    valueLight: '',
    storageKey: props.storageKey,
    storage: localStorage,
    initialValue: prefersDark,
  });
  isDark = darkRef;
  toggleDarkMode = useToggle(darkRef);
}

// Icon to display
const currentIcon = computed(() => isDark.value ? props.lightIcon : props.darkIcon);

// Tooltip text
const tooltipText = computed(() => {
  const mode = isDark.value ? 'light' : 'dark';
  return props.showTooltip ? `Switch to ${mode} mode (Ctrl+D)` : '';
});

// Keyboard shortcut
const ctrlKey = useKeyModifier('Control');
useEventListener('keydown', (e) => {
  if (ctrlKey.value && e.key === 'd') {
    e.preventDefault();
    toggleDarkMode();
  }
});
</script>

<template>
  <Button
    v-bind="$props"
    :title="tooltipText"
    @click="toggleDarkMode"
  >
    <slot :is-dark="isDark">
      <Icon :icon="currentIcon" />
    </slot>
  </Button>
</template>
