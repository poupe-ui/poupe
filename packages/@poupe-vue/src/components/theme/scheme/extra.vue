<script setup lang="ts">
import {
  default as ThemeSchemeGroup,
  type ThemeSchemeGroupProps,
} from './group.vue';

const group: ThemeSchemeGroupProps = {
  ariaLabel: 'Additional Colors',
  justify: 'between',
  entries: [
    { bg: 'bg-inverse-surface', text: 'text-on-inverse-surface' },
    { bg: 'bg-on-inverse-surface', text: 'text-inverse-surface' },
    { bg: 'bg-inverse-primary', text: 'text-primary' },
    [
      { bg: 'bg-scrim', text: 'text-primary-50' },
      { bg: 'bg-shadow', text: 'text-primary-50' },
    ],
  ],
};
</script>

<template>
  <theme-scheme-group v-bind="group" />
</template>
