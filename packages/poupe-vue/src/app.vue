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
  <div class="flex flex-1 h-screen justify-center">
    <div class="flex container justify-center">
      <card
        class="m-auto w-full max-w-2xl"
        title="@poupe/vue"
      >
        <theme-scheme class="pb-2" />
      </card>
    </div>
  </div>
</template>
