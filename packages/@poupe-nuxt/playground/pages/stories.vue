<script setup lang="ts">
import { useHead } from '#imports';

useHead({
  bodyAttrs: {
    class: 'surface',
  },
});
</script>

<template>
  <div class="min-h-screen">
    <header class="border-b p-4">
      <div class="container mx-auto flex items-center justify-between">
        <h1 class="text-2xl font-bold">Poupe UI Stories</h1>
        <div class="flex items-center gap-2">
          <p-dark-mode-toggle />
          <NuxtLink to="/">
            <p-button surface="surface">
              Back to Home
            </p-button>
          </NuxtLink>
        </div>
      </div>
    </header>
    
    <main class="container mx-auto p-4">
      <StoryViewer />
    </main>
  </div>
</template>