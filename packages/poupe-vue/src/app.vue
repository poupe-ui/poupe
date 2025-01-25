<script setup lang="ts">
import { useHead } from '@unhead/vue';

useHead({
  bodyAttrs: {
    class: 'surface',
  },
});
</script>

<template>
  <div class="text-3xl font-bold">
    Hello, World
  </div>
</template>
