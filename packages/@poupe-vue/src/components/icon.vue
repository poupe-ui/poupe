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
import { usePoupeIcons } from '@/composables/use-icons';

const props = defineProps<IconProps>();

const { toIcon } = usePoupeIcons();

const icon = computed<IconifyIconProps['icon']>(() => toIcon(props.icon));
</script>

<template>
  <IconifyIcon
    v-bind="props"
    :icon="icon"
  />
</template>
