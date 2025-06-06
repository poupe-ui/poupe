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
        
        <template #footer>
          <div class="flex justify-between items-center p-4 border-t">
            <p-dark-mode-toggle />
            <NuxtLink to="/stories">
              <p-button surface="primary">
                View Component Stories
              </p-button>
            </NuxtLink>
          </div>
        </template>
      </p-card>
    </div>
  </div>
</template>