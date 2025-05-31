<script setup lang="ts">
import { useHead } from '@unhead/vue';

import {
  Card,

  ThemeScheme,
} from './components';

useHead({
  bodyAttrs: {
    class: 'surface',
  },
});
</script>

<template>
  <div class="flex flex-1 h-screen justify-center items-center">
    <div class="container">
      <card
        class="m-auto w-full max-w-2xl"
        title="@poupe/vue"
        shadow="z2"
        surface="high"
      >
        <theme-scheme class="pb-2" />
      </card>
    </div>
  </div>
</template>
