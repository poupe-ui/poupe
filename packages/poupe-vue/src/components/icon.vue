<script lang="ts">
import {
  type IconifyIconProps,
} from '@iconify/vue';

export interface IconProps extends Omit<IconifyIconProps, 'icon'> {
  icon?: IconifyIconProps['icon']
}
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { Icon as IconifyIcon } from '@iconify/vue';

type IconifyIconObject = Exclude<IconifyIconProps['icon'], string>;

const props = defineProps<IconProps>();
const blankIcon: IconifyIconObject = {
  body: '',
};

const icon = computed<IconifyIconProps['icon']>(() => props.icon || blankIcon);
</script>

<template>
  <IconifyIcon
    v-bind="props"
    :icon="icon"
  />
</template>
