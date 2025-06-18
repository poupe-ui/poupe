<script setup lang="ts">
import { computed, h, type VNode, type VNodeChild } from 'vue';
import type { StoryConfig, StoryConfigOptions } from './types';
import { generateCode } from './utils';
import StoryShowcaseItem from './showcase-item.vue';

interface Props {
  story: StoryConfig
  options?: StoryConfigOptions | undefined
}

const props = withDefaults(defineProps<Props>(), {
  options: undefined,
});

const code = computed(() => generateCode(props.story, props.options));

// Computed property that returns the component or render function
const componentToRender = computed<() => VNode>(() => {
  if (!props.story.component) {
    return () => h('div', { class: 'text-on-surface-variant' }, 'No preview available');
  }

  const slots: Record<string, () => VNodeChild> = {};

  if (props.story.slots) {
    for (const [name, content] of Object.entries(props.story.slots)) {
      slots[name] = typeof content === 'function' ? content : () => content;
    }
  }

  const component = () => h(props.story.component!, props.story.props || {}, slots);

  // If wrapper class is specified, wrap the component
  if (props.story.wrapperClass) {
    return () => h('div', { class: props.story.wrapperClass }, [component()]);
  }

  return component;
});
</script>

<template>
  <StoryShowcaseItem
    :title="story.title"
    :code="code"
    language="vue"
  >
    <component :is="componentToRender" />
  </StoryShowcaseItem>
</template>
