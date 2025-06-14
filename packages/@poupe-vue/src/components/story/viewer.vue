<script setup lang="ts">
import { ref, computed, provide, type Component } from 'vue';

export interface StoryDefinition {
  name: string
  component: Component
  description?: string
}

interface Props {
  stories: StoryDefinition[]
  defaultStory?: string
}

const props = withDefaults(defineProps<Props>(), {
  defaultStory: undefined,
});

const currentStoryName = ref<string>(
  props.defaultStory || props.stories[0]?.name || '',
);

const currentStory = computed(() => {
  return props.stories.find(s => s.name === currentStoryName.value);
});

// Mobile menu state
const isMobileMenuOpen = ref(false);

// Provide story context for nested components
provide('storyViewer', {
  currentStory: currentStoryName,
});
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Mobile Header -->
    <div class="lg:hidden surface-container-high shadow-z1 sticky top-0 z-20">
      <div class="p-4 flex items-center justify-between">
        <h1 class="text-lg font-bold">
          <slot name="title">
            Component Stories
          </slot>
        </h1>
        <button
          class="p-2 rounded-md hover:bg-surface-container-highest"
          :aria-label="isMobileMenuOpen ? 'Close menu' : 'Open menu'"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              v-if="!isMobileMenuOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <div
      v-if="isMobileMenuOpen"
      class="lg:hidden fixed inset-0 z-10 bg-scrim/50"
      @click="isMobileMenuOpen = false"
    />

    <!-- Main Layout -->
    <div class="flex flex-1">
      <!-- Sidebar Navigation -->
      <div
        :class="[
          'fixed lg:static inset-y-0 left-0 z-20 w-64',
          'surface-container-high shadow-z2 lg:shadow-z1',
          'transform transition-transform duration-200 lg:translate-x-0',
          'flex flex-col h-full lg:h-auto',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
        ]"
      >
        <div class="hidden lg:block p-4 border-b border-outline-variant">
          <h1 class="text-xl font-bold">
            <slot name="title">
              Component Stories
            </slot>
          </h1>
        </div>

        <!-- Story List -->
        <nav class="flex-1 p-2 overflow-y-auto">
          <button
            v-for="story in stories"
            :key="story.name"
            :class="[
              'w-full text-left px-4 py-2 mb-1 rounded-md transition-colors',
              'text-sm font-medium',
              currentStoryName === story.name
                ? 'bg-primary text-on-primary'
                : 'hover:bg-surface-container-highest text-on-surface'
            ]"
            @click="currentStoryName = story.name; isMobileMenuOpen = false"
          >
            {{ story.name }}
          </button>
        </nav>
      </div>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col lg:ml-0">
        <!-- Story Header -->
        <div
          v-if="currentStory"
          class="surface-container p-4 lg:p-6 border-b border-outline-variant"
        >
          <h2 class="text-xl lg:text-2xl font-bold mb-1">
            {{ currentStory.name }}
          </h2>
          <p
            v-if="currentStory.description"
            class="text-on-surface-variant text-sm lg:text-base"
          >
            {{ currentStory.description }}
          </p>
        </div>

        <!-- Story Content -->
        <div class="flex-1 surface overflow-y-auto">
          <div class="container m-auto max-w-6xl p-4 lg:p-6">
            <slot
              name="story"
              :story="currentStory"
            >
              <component
                :is="currentStory?.component"
                v-if="currentStory"
              />
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
