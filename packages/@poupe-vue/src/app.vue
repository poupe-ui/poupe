<script setup lang="ts">
import { ref } from 'vue';
import { useHead } from '@unhead/vue';

import {
  Button,
  Card,
  DarkModeToggle,
  ThemeScheme,
} from './components';

import { StoryViewer } from './components/story-viewer';

useHead({
  bodyAttrs: {
    class: 'surface',
  },
});

const showStories = ref(false);
</script>

<template>
  <div class="flex flex-col h-screen">
    <header class="border-b p-4">
      <div class="container mx-auto flex items-center justify-between">
        <h1 class="text-2xl font-bold">
          @poupe/vue Playground
        </h1>
        <div class="flex gap-2">
          <Button
            :surface="showStories ? 'primary' : 'base'"
            @click="showStories = !showStories"
          >
            {{ showStories ? 'Hide' : 'Show' }} Stories
          </Button>
          <DarkModeToggle />
        </div>
      </div>
    </header>

    <main class="flex-1 overflow-auto">
      <div
        v-if="!showStories"
        class="flex flex-1 h-full justify-center items-center"
      >
        <div class="container">
          <card
            class="m-auto w-full max-w-4xl"
            title="@poupe/vue"
            shadow="z2"
            surface="high"
          >
            <theme-scheme class="pb-2" />
          </card>
        </div>
      </div>

      <StoryViewer v-else />
    </main>
  </div>
</template>
