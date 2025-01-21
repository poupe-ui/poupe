<script lang="ts">
import type { PropertyType } from '@poupe/theme-builder/utils';
import type { ThemeSchemeGroupProps } from './group.vue';

export {
  type ThemeSchemeGroupEntry,
} from './group.vue';

export interface ThemeSchemeGroupsProps {
  ariaLabel?: string
  groups: Array<PropertyType<ThemeSchemeGroupProps, 'entries'>>
}
</script>

<script setup lang="ts">
import ThemeSchemeGroup from './group.vue';

import { gridColsClasses } from './utils';
import { computed } from 'vue';

const props = defineProps<ThemeSchemeGroupsProps>();

const ariaRole = computed(() => props.ariaLabel ? 'group' : undefined);
const ariaLabel = computed(() => props.ariaLabel);

const colsClass = computed(() => gridColsClasses[props.groups.length]);
</script>

<template>
  <div
    :role="ariaRole"
    :aria-label="ariaLabel"
    class="grid gap-2 w-full overflow-auto"
    :class="colsClass"
  >
    <div
      v-for="(group, i) in groups"
      :key="i"
    >
      <theme-scheme-group :entries="group" />
    </div>
  </div>
</template>
