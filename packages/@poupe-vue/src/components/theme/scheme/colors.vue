<script setup lang="ts">
import {
  default as ThemeSchemeGroups,
  type ThemeSchemeGroupsProps,
  type ThemeSchemeGroupEntry,
} from './groups.vue';

const primary: ThemeSchemeGroupEntry[] = [
  { bg: 'bg-primary', text: 'text-on-primary' },
  { bg: 'bg-on-primary', text: 'text-primary' },
  { bg: 'bg-primary-container', text: 'text-on-primary-container', class: 'mt-1' },
  { bg: 'bg-on-primary-container', text: 'text-primary-container' },
  [
    { bg: 'bg-primary-fixed', text: 'text-on-primary-fixed' },
    { bg: 'bg-primary-fixed-dim', text: 'text-on-primary-fixed' },
  ],
  { bg: 'bg-on-primary-fixed', text: 'text-primary-fixed' },
  { bg: 'bg-on-primary-fixed-variant', text: 'text-primary-fixed' },
];

const secondary: ThemeSchemeGroupEntry[] = [
  { bg: 'bg-secondary', text: 'text-on-secondary' },
  { bg: 'bg-on-secondary', text: 'text-secondary' },
  { bg: 'bg-secondary-container', text: 'text-on-secondary-container', class: 'mt-1' },
  { bg: 'bg-on-secondary-container', text: 'text-secondary-container' },
  [
    { bg: 'bg-secondary-fixed', text: 'text-on-secondary-fixed' },
    { bg: 'bg-secondary-fixed-dim', text: 'text-on-secondary-fixed' },
  ],
  { bg: 'bg-on-secondary-fixed', text: 'text-secondary-fixed' },
  { bg: 'bg-on-secondary-fixed-variant', text: 'text-secondary-fixed' },
];

const tertiary: ThemeSchemeGroupEntry[] = [
  { bg: 'bg-tertiary', text: 'text-on-tertiary' },
  { bg: 'bg-on-tertiary', text: 'text-tertiary' },
  { bg: 'bg-tertiary-container', text: 'text-on-tertiary-container', class: 'mt-1' },
  { bg: 'bg-on-tertiary-container', text: 'text-tertiary-container' },
  [
    { bg: 'bg-tertiary-fixed', text: 'text-on-tertiary-fixed' },
    { bg: 'bg-tertiary-fixed-dim', text: 'text-on-tertiary-fixed' },
  ],
  { bg: 'bg-on-tertiary-fixed', text: 'text-tertiary-fixed' },
  { bg: 'bg-on-tertiary-fixed-variant', text: 'text-tertiary-fixed' },
];

const groups: ThemeSchemeGroupsProps = {
  ariaLabel: 'Main Colors',
  groups: [primary, secondary, tertiary],
};
</script>

<template>
  <theme-scheme-groups v-bind="groups" />
</template>
