<template>
  <StoryViewer :stories="stories" />
</template>

<script setup lang="ts">
import { computed, h } from 'vue';
import { StoryViewer, StoryGroupRenderer } from '../components/story';
import { allComponentStories } from './index';

// Transform component stories into StoryViewer format
const stories = computed(() =>
  allComponentStories.map(({ name, storyGroups }) => ({
    name,
    component: {
      setup() {
        return () =>
          storyGroups.map((group, index) =>
            h(StoryGroupRenderer, {
              key: `${name}-${index}`,
              group,
              showcaseProps: {
                class: 'flex flex-wrap gap-4',
              },
            }),
          );
      },
    },
  })),
);
</script>
