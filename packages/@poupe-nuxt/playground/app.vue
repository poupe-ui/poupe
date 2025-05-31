<script setup lang="ts">
import { useHead } from '#imports';

useHead({
  bodyAttrs: {
    class: 'surface',
  },
});
</script>

<template>
  <div class="flex flex-1 h-screen justify-center items-center">
    <div class="container">
      <p-card
        class="m-auto w-full max-w-2xl"
        title="@poupe/vue"
        shadow="z2"
        surface="high"
      >
        <p-theme-scheme class="pb-2" />
      </p-card>
    </div>
  </div>
</template>
