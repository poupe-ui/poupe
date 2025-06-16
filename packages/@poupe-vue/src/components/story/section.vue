<script setup lang="ts">
interface Props {
  title: string
  description?: string
}

defineProps<Props>();
</script>

<template>
  <section class="mb-8">
    <header class="mb-4">
      <h2 class="text-2xl font-bold text-on-surface">
        {{ title }}
      </h2>
      <p
        v-if="description"
        class="text-on-surface-variant mt-1"
      >
        {{ description }}
      </p>
    </header>
    <div class="space-y-4">
      <slot />
    </div>
  </section>
</template>
