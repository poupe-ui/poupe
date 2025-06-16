<!-- eslint-disable vue/require-default-prop -->
<script setup lang="ts">
import { computed, h } from 'vue';
import type { StoryConfig, StoryConfigOptions } from './types';
import { generateCode } from './utils';
import StoryShowcaseItem from './showcase-item.vue';

interface Props {
  story: StoryConfig
  options?: StoryConfigOptions
}

const props = defineProps<Props>();

const code = computed(() => generateCode(props.story, props.options));

const hasSlots = computed(() => {
  return props.story.slots && Object.keys(props.story.slots).length > 0;
});

function renderComponent() {
  if (!props.story.component) return undefined;

  const slots = {} as Record<string, () => unknown>;

  if (props.story.slots) {
    for (const [name, content] of Object.entries(props.story.slots)) {
      slots[name] = typeof content === 'function' ? content : () => content;
    }
  }

  return h(props.story.component, props.story.props || {}, slots);
}
</script>

<template>
  <StoryShowcaseItem
    :title="story.title"
    :code="code"
    :language="options?.language || 'vue'"
  >
    <!-- Use component with props -->
    <component
      :is="story.component"
      v-if="story.component && !hasSlots"
      v-bind="story.props || {}"
    />

    <!-- Use render function for slots -->
    <component
      :is="renderComponent"
      v-else-if="story.component && hasSlots"
    />

    <!-- Use template string (requires compile-time transformation) -->
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div
      v-else-if="story.template"
      v-html="story.template"
    />

    <!-- Fallback -->
    <div
      v-else
      class="text-on-surface-variant"
    >
      No preview available
    </div>
  </StoryShowcaseItem>
</template>
