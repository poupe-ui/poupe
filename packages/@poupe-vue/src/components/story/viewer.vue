<script setup lang="ts">
import { ref, computed, provide, watch, onMounted, onUnmounted, type Component } from 'vue';
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router';

export interface StoryDefinition {
  name: string
  component: Component
  description?: string
}

interface Props {
  stories: StoryDefinition[]
  defaultStory?: string
  useRouter?: {
    route: RouteLocationNormalizedLoaded
    router: Router
  }
}

const props = withDefaults(defineProps<Props>(), {
  defaultStory: undefined,
  useRouter: undefined,
});

// Create URL-safe slugs for each story
const createSlug = (name: string) => name.toLowerCase().replaceAll(/\s+/g, '-');

// Get story name from slug
const getStoryFromSlug = (slug: string) => {
  const story = props.stories.find(s => createSlug(s.name) === slug);
  return story?.name || '';
};

// Navigation abstraction
const navigation = computed(() =>
  props.useRouter
    ? {
    // Vue Router navigation
      getCurrentStory: () => {
        const storyParam = props.useRouter!.route.query.story as string;
        if (storyParam) {
          const storyName = getStoryFromSlug(storyParam);
          if (storyName) return storyName;
        }
        return props.defaultStory || props.stories[0]?.name || '';
      },
      setStory: (storyName: string) => {
        const slug = createSlug(storyName);
        props.useRouter!.router.push({
          query: { ...props.useRouter!.route.query, story: slug },
        });
      },
      init: () => {
        if (!props.useRouter!.route.query.story && currentStory.value) {
          const slug = createSlug(currentStory.value.name);
          props.useRouter!.router.replace({
            query: { ...props.useRouter!.route.query, story: slug },
          });
        }
      },
    }
    : {
    // Hash-based navigation
      getCurrentStory: () => {
        if (globalThis.location !== undefined) {
          const hash = globalThis.location.hash.slice(1);
          if (hash) {
            const storyName = getStoryFromSlug(hash);
            if (storyName) return storyName;
          }
        }
        return props.defaultStory || props.stories[0]?.name || '';
      },
      setStory: (storyName: string) => {
        if (globalThis.location !== undefined) {
          globalThis.location.hash = createSlug(storyName);
        }
      },
      init: () => {
        if (globalThis.location !== undefined && !globalThis.location.hash && currentStory.value) {
          globalThis.location.hash = createSlug(currentStory.value.name);
        }
      },
    },
);

// Determine initial story
const getInitialStoryName = () => {
  // In test environment or when no hash, use defaultStory if provided
  if (globalThis.location === undefined || !globalThis.location.hash) {
    return props.defaultStory || props.stories[0]?.name || '';
  }
  // Otherwise use the navigation logic
  return navigation.value.getCurrentStory();
};

// Current story state
const currentStoryName = ref<string>(getInitialStoryName());

const currentStory = computed(() => {
  return props.stories.find(s => s.name === currentStoryName.value);
});

// Update current story when props change
watch(() => [props.stories, props.defaultStory], () => {
  const newStory = navigation.value.getCurrentStory();
  if (newStory !== currentStoryName.value) {
    currentStoryName.value = newStory;
  }
});

// Update URL when story changes
const selectStory = (storyName: string) => {
  currentStoryName.value = storyName;
  navigation.value.setStory(storyName);
};

// Handle navigation changes
let hashChangeListener: (() => void) | undefined;

if (props.useRouter) {
  // Watch route changes for Vue Router
  watch(() => props.useRouter!.route.query.story, (newStory) => {
    if (newStory) {
      const storyName = getStoryFromSlug(newStory as string);
      if (storyName && storyName !== currentStoryName.value) {
        currentStoryName.value = storyName;
      }
    }
  });
} else {
  // Setup hash change listener
  onMounted(() => {
    hashChangeListener = () => {
      const newStoryName = navigation.value.getCurrentStory();
      if (newStoryName !== currentStoryName.value) {
        currentStoryName.value = newStoryName;
      }
    };
    if (typeof globalThis.addEventListener === 'function') {
      globalThis.addEventListener('hashchange', hashChangeListener);
    }
  });

  onUnmounted(() => {
    if (hashChangeListener && typeof globalThis.removeEventListener === 'function') {
      globalThis.removeEventListener('hashchange', hashChangeListener);
    }
  });
}

// Initialize navigation on mount
onMounted(() => {
  // Only initialize navigation if we're not in a test environment
  // or if we have a router (which handles its own navigation)
  if (props.useRouter || globalThis.location !== undefined) {
    navigation.value.init();
  }
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
            @click="selectStory(story.name); isMobileMenuOpen = false"
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
