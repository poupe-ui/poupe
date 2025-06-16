<!-- eslint-disable vue/require-default-prop -->
<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { ref } from 'vue';
import StoryCodeBlock from './code-block-simple.vue';

interface Props {
  code?: string | undefined
  language?: string | undefined
  filename?: string | undefined
  title?: string | undefined
}

withDefaults(defineProps<Props>(), {
  language: 'vue',
});

const showCode = ref(false);
</script>

<template>
  <div class="story-showcase-item">
    <div
      v-if="title || code"
      class="mb-2 flex items-center justify-between"
    >
      <h4
        v-if="title"
        class="text-sm font-medium on-surface-variant"
      >
        {{ title }}
      </h4>
      <button
        v-if="code"
        class="ml-auto p-1.5 -mr-1.5 surface-container-highest on-surface rounded hover:surface-container transition-colors"
        :title="showCode ? 'Hide code' : 'Show code'"
        @click="showCode = !showCode"
      >
        <Icon
          :icon="showCode ? 'mdi:code-off' : 'mdi:code-tags'"
          class="w-4 h-4"
        />
      </button>
    </div>

    <div class="story-showcase-content">
      <slot />
    </div>

    <div
      v-if="showCode && code"
      class="mt-4"
    >
      <StoryCodeBlock
        :code="code"
        :language="language"
        :filename="filename"
      />
    </div>
  </div>
</template>
