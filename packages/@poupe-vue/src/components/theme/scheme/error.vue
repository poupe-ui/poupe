<script setup lang="ts">
import {
  default as ThemeSchemeGroups,
  type ThemeSchemeGroupsProps,
  type ThemeSchemeGroupEntry,
} from './groups.vue';

const error: ThemeSchemeGroupEntry[] = [
  { bg: 'bg-error', text: 'text-on-error' },
  { bg: 'bg-on-error', text: 'text-error' },
  { bg: 'bg-error-container', text: 'text-on-error-container', class: 'mt-1' },
  { bg: 'bg-on-error-container', text: 'text-error-container' },
];

const groups: ThemeSchemeGroupsProps = {
  ariaLabel: 'Error Colors',
  groups: [error],
};
</script>

<template>
  <theme-scheme-groups v-bind="groups" />
</template>
