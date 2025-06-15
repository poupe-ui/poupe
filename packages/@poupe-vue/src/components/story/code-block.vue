<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { computed, ref } from 'vue';

const props = withDefaults(defineProps<{
  code: string
  language?: string
}>(), {
  language: 'vue',
});

const copied = ref(false);

const formattedCode = computed(() => props.code.trim());

async function copyToClipboard() {
  try {
    await globalThis.navigator.clipboard.writeText(formattedCode.value);
    copied.value = true;
    globalThis.setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (error) {
    globalThis.console.error('Failed to copy:', error);
  }
}
</script>

<template>
  <div class="story-code-block surface-container-high on-surface rounded-lg overflow-hidden">
    <div class="flex items-center justify-between px-3 py-2 border-b border-outline-variant">
      <span class="text-xs on-surface-variant">
        {{ language || 'code' }}
      </span>
      <button
        class="p-1 -mr-1 surface-container-highest on-surface rounded hover:surface-container transition-colors"
        :title="copied ? 'Copied!' : 'Copy code'"
        @click="copyToClipboard"
      >
        <Icon
          :icon="copied ? 'mdi:check' : 'mdi:content-copy'"
          class="w-4 h-4"
        />
      </button>
    </div>
    <pre class="overflow-x-auto p-4 text-sm font-mono"><code>{{ formattedCode }}</code></pre>
  </div>
</template>

<style scoped>
.story-code-block {
  font-family: 'Cascadia Code', 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace;
}

.story-code-block pre {
  margin: 0;
  line-height: 1.5;
}

.story-code-block code {
  font-size: 0.875rem;
  color: inherit;
}

/* Basic syntax colors using CSS variables */
.dark .story-code-block code {
  color: #e1e4e8;
}

.light .story-code-block code {
  color: #24292e;
}
</style>
