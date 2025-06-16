<script setup lang="ts">
import type { StoryGroup, StoryConfigOptions } from './types';
import StorySection from './section.vue';
import StoryShowcase from './showcase.vue';
import StoryRenderer from './renderer.vue';

interface Props {
  group: StoryGroup
  options?: StoryConfigOptions | undefined
  showcaseProps?: Record<string, unknown>
}

withDefaults(defineProps<Props>(), {
  options: undefined,
  showcaseProps: () => ({ gap: 'lg' }),
});
</script>

<template>
  <StorySection
    :title="group.title"
    :description="group.description"
  >
    <StoryShowcase v-bind="showcaseProps">
      <StoryRenderer
        v-for="(story, index) in group.stories"
        :key="`${story.title}-${index}`"
        :story="story"
        :options="options"
      />
    </StoryShowcase>
  </StorySection>
</template>
