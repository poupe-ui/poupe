<script lang="ts">
import type { ThemeSchemeSlotProps } from './slot.vue';

export interface ThemeSchemeGroupItem extends ThemeSchemeSlotProps {
  class?: string
};

export type ThemeSchemeGroupEntry = ThemeSchemeGroupItem | Array<ThemeSchemeGroupItem>;

export interface ThemeSchemeGroupProps {
  ariaLabel?: string
  entries: Array<ThemeSchemeGroupEntry>
  justify?: keyof typeof justifyClasses
};
</script>

<script setup lang="ts">
import { computed } from 'vue';

import {
  justifyClasses,
  gridColsClasses,
} from './utils';

import ThemeSchemeSlot from './slot.vue';

const props = withDefaults(defineProps<ThemeSchemeGroupProps>(), {
  justify: 'start',
  ariaLabel: undefined,
});

const ariaRole = computed(() => props.ariaLabel ? 'group' : undefined);
const ariaLabel = computed(() => props.ariaLabel);
const justifyClass = computed(() => justifyClasses[props.justify]);

const colsClass = (n: number) => gridColsClasses[n];
</script>

<template>
  <div
    :role="ariaRole"
    :aria-label="ariaLabel"
    class="flex flex-col overflow-auto"
    :class="justifyClass"
  >
    <div
      v-for="(v, i) in entries"
      :key="i"
    >
      <div
        v-if="Array.isArray(v)"
        class="grid grid-flow-col mt-2 h-12"
        :class="colsClass(v.length)"
      >
        <theme-scheme-slot
          v-for="(vv, j) in v"
          :key="j"
          :class="vv.class"
          v-bind="vv"
        />
      </div>
      <theme-scheme-slot
        v-else
        :class="v.class"
        v-bind="v"
      />
    </div>
  </div>
</template>
