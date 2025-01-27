<script setup lang="ts">
import { useHead } from '@unhead/vue';

import {
  Card,

  Placeholder,
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
        class="m-auto w-full max-w-md"
        title="@poupe/vue"
      >
        <placeholder
          class="opacity-50 mb-2 p-1"
          rounded="md"
        />
      </card>
    </div>
  </div>
</template>
