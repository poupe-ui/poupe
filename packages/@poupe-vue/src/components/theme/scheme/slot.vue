<script lang="ts">
export interface ThemeSchemeSlotProps {
  bg: string
  text: string
  label?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<ThemeSchemeSlotProps>();

const label = computed(() => props.label || props.bg?.split('-').slice(1).join(' ') || 'undefined');
</script>

<template>
  <div
    class="p-2 capitalize flex items-center justify-center text-center leading-tight h-full overflow-hidden"
    :class="[bg, text]"
    role="status"
    :aria-label="label"
  >
    <span
      class="block w-full"
    >
      {{ label }}
    </span>
  </div>
</template>
