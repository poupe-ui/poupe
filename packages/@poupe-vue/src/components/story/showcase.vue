<script setup lang="ts">
interface Props {
  gap?: 'xs' | 'sm' | 'base' | 'lg' | 'xl'
  wrap?: boolean
  center?: boolean
}

withDefaults(defineProps<Props>(), {
  gap: 'base',
  wrap: true,
  center: false,
});
</script>

<template>
  <div
    :class="[
      'flex min-w-0',
      {
        'flex-wrap': wrap,
        'items-center': center,
        'gap-2': gap === 'xs',
        'gap-3': gap === 'sm',
        'gap-4': gap === 'base',
        'gap-6': gap === 'lg',
        'gap-8': gap === 'xl',
      },
    ]"
  >
    <slot />
  </div>
</template>
