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
    :class="[
      'grid grid-cols-4 gap-2 h-full',
      'text-[length:var(--text-3xs)] sm:text-[length:var(--text-2xs)] md:text-xs lg:text-sm theme-scheme-sizes',
    ]"
    role="region"
    :aria-label="ariaLabel"
  >
    <theme-scheme-colors class="col-span-3 h-full" />
    <theme-scheme-error class="h-full" />
    <theme-scheme-neutral class="col-span-3 h-full" />
    <theme-scheme-extra class="h-full" />
  </div>
</template>

<style scoped>
.theme-scheme-sizes {
  --text-3xs: calc(var(--text-base) * 0.5);
  --text-2xs: calc(var(--text-base) * 0.625);
}
</style>
