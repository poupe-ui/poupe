<script lang="ts">
export interface ThemeSchemeProps {
  ariaLabel?: string
};
</script>

<script setup lang="ts">
import { computed } from 'vue';

import {
  ThemeSchemeColors,
  ThemeSchemeError,
  ThemeSchemeExtra,
  ThemeSchemeNeutral,
} from './scheme';

const props = defineProps<ThemeSchemeProps>();

const ariaLabel = computed(() => props.ariaLabel || 'Theme Colors');
</script>

<template>
  <div
    class="grid grid-cols-4 gap-2 text-xs"
    role="region"
    :aria-label="ariaLabel"
  >
    <theme-scheme-colors class="col-span-3" />
    <theme-scheme-error class="self-start" />
    <theme-scheme-neutral class="col-span-3" />
    <theme-scheme-extra class="self-start" />
  </div>
</template>
