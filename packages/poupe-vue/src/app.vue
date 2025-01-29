<script setup lang="ts">
import { useHead } from '@unhead/vue';

import {
  Placeholder,
} from './components';

useHead({
  bodyAttrs: {
    class: 'surface',
  },
});
</script>

<template>
  <div class="flex h-screen items-center justify-center">
    <div class="w-full max-w-2xl">
      <placeholder
        class="opacity-50"
        rounded="xl"
      />
    </div>
  </div>
</template>
