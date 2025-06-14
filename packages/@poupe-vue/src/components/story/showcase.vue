<script setup lang="ts">
interface Props {
  gap?: 'xs' | 'sm' | 'base' | 'lg' | 'xl'
  wrap?: boolean
  center?: boolean
  grid?: boolean
  columns?: number
}

withDefaults(defineProps<Props>(), {
  gap: 'base',
  wrap: true,
  center: false,
  grid: false,
  columns: 0,
});
</script>

<template>
  <div
    :class="[
      grid ? 'grid' : 'flex',
      {
        'flex-wrap': wrap && !grid,
        'items-center': center && !grid,
        'gap-2': gap === 'xs',
        'gap-3': gap === 'sm',
        'gap-4': gap === 'base',
        'gap-6': gap === 'lg',
        'gap-8': gap === 'xl',
        'grid-cols-2': grid && columns === 2,
        'grid-cols-3': grid && columns === 3,
        'grid-cols-4': grid && columns === 4,
        'grid-cols-5': grid && columns === 5,
        'grid-cols-6': grid && columns === 6,
      },
    ]"
  >
    <slot />
  </div>
</template>
