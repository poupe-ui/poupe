<script setup lang="ts">
import {
  default as ThemeSchemeGroup,
  type ThemeSchemeGroupProps,
} from './group.vue';

const group: ThemeSchemeGroupProps = {
  ariaLabel: 'Error Colors',
  entries: [
    { bg: 'bg-error', text: 'text-on-error' },
    { bg: 'bg-on-error', text: 'text-error' },
    { bg: 'bg-error-container', text: 'text-on-error-container', class: 'mt-1' },
    { bg: 'bg-on-error-container', text: 'text-error-container' },
  ],
};
</script>

<template>
  <theme-scheme-group v-bind="group" />
</template>
