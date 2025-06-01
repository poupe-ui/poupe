<script lang="ts">
import type { ThemeSchemeGroupProps } from './group.vue';

export {
  type ThemeSchemeGroupEntry,
} from './group.vue';

export interface ThemeSchemeGroupsProps {
  ariaLabel?: string
  groups: Array<ThemeSchemeGroupProps['entries']>
}
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { gridColsClasses } from './utils';

import type { ThemeSchemeGroupEntry, ThemeSchemeGroupItem } from './group.vue';
import ThemeSchemeSlot from './slot.vue';

const props = defineProps<ThemeSchemeGroupsProps>();

const ariaRole = computed(() => props.ariaLabel ? 'group' : undefined);
const ariaLabel = computed(() => props.ariaLabel);

const maxEntries = computed(() => Math.max(...props.groups.map(group => group.length)));

// Create a flattened structure to avoid repeated calls and type casting
const entriesGrid = computed(() => {
  const grid: Array<Array<ThemeSchemeGroupEntry | undefined>> = [];

  for (const [groupIndex, group] of props.groups.entries()) {
    grid[groupIndex] = [];
    for (let entryIndex = 0; entryIndex < maxEntries.value; entryIndex++) {
      grid[groupIndex][entryIndex] = entryIndex < group.length ? group[entryIndex] : undefined;
    }
  }

  return grid;
});

const isArrayEntry = (entry: ThemeSchemeGroupEntry): entry is ThemeSchemeGroupItem[] => {
  return Array.isArray(entry);
};
</script>

<template>
  <div
    :role="ariaRole"
    :aria-label="ariaLabel"
    class="grid gap-2 w-full overflow-auto"
    :class="gridColsClasses[props.groups.length]"
    :style="`grid-template-rows: repeat(${maxEntries}, 3rem);`"
  >
    <div
      v-for="(groupEntries, groupIndex) in entriesGrid"
      :key="groupIndex"
      class="grid gap-0"
      :style="`grid-template-rows: subgrid; grid-row: 1 / ${maxEntries + 1};`"
    >
      <template
        v-for="(entry, entryIndex) in groupEntries"
        :key="entryIndex"
      >
        <div
          v-if="entry"
          :style="`grid-row: ${entryIndex + 1};`"
        >
          <div
            v-if="isArrayEntry(entry)"
            class="grid grid-flow-col h-12"
            :class="gridColsClasses[entry.length]"
          >
            <theme-scheme-slot
              v-for="(item, itemIndex) in entry"
              :key="itemIndex"
              :class="item.class"
              v-bind="item"
            />
          </div>
          <theme-scheme-slot
            v-else
            :class="entry.class"
            v-bind="entry"
          />
        </div>
        <div
          v-else
          :style="`grid-row: ${entryIndex + 1};`"
        />
      </template>
    </div>
  </div>
</template>
