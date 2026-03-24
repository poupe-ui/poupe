<template>
  <StoryViewer :stories="stories" />
</template>

<script setup lang="ts">
import { computed, h } from 'vue';
import { StoryGroupRenderer, StoryViewer } from '../components/story';
import { allComponentStories } from './index';

const renderStoryGroups = (name: string, storyGroups: typeof allComponentStories[number]['storyGroups']) =>
  () => storyGroups.map((group, index) =>
    h(StoryGroupRenderer, {
      key: `${name}-${index}`,
      group,
      showcaseProps: {
        class: 'flex flex-wrap gap-4',
      },
    }),
  );

// Transform component stories into StoryViewer format
const stories = computed(() =>
  allComponentStories.map(({ name, storyGroups }) => ({
    name,
    component: {
      setup: () => renderStoryGroups(name, storyGroups),
    },
  })),
);
</script>
