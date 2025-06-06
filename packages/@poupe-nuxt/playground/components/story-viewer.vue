<script setup lang="ts">
import { ref, computed, defineAsyncComponent, watch, onMounted, type Component } from 'vue';
import { useKeyModifier, useEventListener } from '@vueuse/core';

// Import all story files from @poupe-vue package
const storyModules = import.meta.glob('../../@poupe-vue/src/components/**/*.story.vue');
const storySourceModules = import.meta.glob('../../@poupe-vue/src/components/**/*.story.vue', { as: 'raw' });

// Source code viewer state
const showSource = ref(false);
const currentSource = ref('');

// Create a list of story names and their paths
const stories = computed(() => {
  return Object.keys(storyModules).map((path) => {
    // Extract name from path like ../../@poupe-vue/src/components/button.story.vue
    const parts = path.split('/');
    const fileName = parts[parts.length - 1];
    const name = fileName.replace('.story.vue', '');
    
    return {
      name,
      path,
      displayName: name.charAt(0).toUpperCase() + name.slice(1),
    };
  }).sort((a, b) => a.name.localeCompare(b.name));
});

const selectedStory = ref('');
const StoryComponent = computed<Component | undefined>(() => {
  if (!selectedStory.value) return undefined;

  const story = stories.value.find(s => s.name === selectedStory.value);
  if (!story) return undefined;

  return defineAsyncComponent({
    loader: () => storyModules[story.path]() as Promise<Component>,
    errorComponent: {
      template: '<div class="p-4 text-error">Failed to load story component</div>',
    },
    timeout: 3000,
  });
});

// Load source code when story changes
const loadSource = async () => {
  const story = stories.value.find(s => s.name === selectedStory.value);
  if (story && storySourceModules[story.path]) {
    currentSource.value = await storySourceModules[story.path]();
  }
};

// Watch for story changes
watch(selectedStory, () => {
  showSource.value = false;
  loadSource();
});

// Keyboard shortcuts
const ctrlKey = useKeyModifier('Control');

// Ctrl+U for source view toggle
useEventListener('keydown', (e) => {
  if (ctrlKey.value && e.key === 'u') {
    e.preventDefault();
    showSource.value = !showSource.value;
  }
});

// Auto-select first story
onMounted(() => {
  if (stories.value.length > 0 && !selectedStory.value) {
    selectedStory.value = stories.value[0].name;
  }
});
</script>

<template>
  <div class="flex h-[calc(100vh-73px)]">
    <!-- Sidebar -->
    <aside class="w-64 border-r bg-surface-container-lowest overflow-y-auto">
      <div class="p-4">
        <h2 class="text-lg font-semibold mb-4">
          Components
        </h2>
        <nav class="space-y-1">
          <button
            v-for="story in stories"
            :key="story.name"
            :class="[
              'w-full text-left px-3 py-2 rounded-md transition-colors',
              selectedStory === story.name
                ? 'bg-primary text-on-primary'
                : 'hover:bg-surface-container-low'
            ]"
            @click="selectedStory = story.name"
          >
            {{ story.displayName }}
          </button>
        </nav>
      </div>
    </aside>

    <!-- Story Content -->
    <main class="flex-1 overflow-auto bg-surface">
      <div
        v-if="!selectedStory"
        class="flex items-center justify-center h-full"
      >
        <p class="text-lg opacity-60">
          Select a component from the sidebar
        </p>
      </div>

      <div
        v-else-if="StoryComponent"
        class="flex flex-col h-full"
      >
        <!-- Story Header -->
        <div class="border-b p-4 flex items-center justify-between">
          <h1 class="text-2xl font-bold">
            {{ stories.find(s => s.name === selectedStory)?.displayName }}
          </h1>
          <div class="flex items-center gap-2">
            <p-button
              size="sm"
              :surface="showSource ? 'primary' : 'surface'"
              @click="showSource = !showSource"
              title="Toggle source code (Ctrl+U)"
            >
              <p-icon icon="heroicons:code-bracket" class="mr-2" />
              {{ showSource ? 'Hide' : 'Show' }} Source
            </p-button>
            <p-dark-mode-toggle size="sm" />
          </div>
        </div>

        <!-- Story Content or Source -->
        <div class="flex-1 overflow-auto">
          <div v-if="!showSource" class="p-8">
            <Suspense>
              <component :is="StoryComponent" />
              <template #fallback>
                <div class="flex items-center justify-center p-8">
                  <p-icon icon="spinner" class="text-2xl mr-2" />
                  <span>Loading story...</span>
                </div>
              </template>
            </Suspense>
          </div>

          <!-- Source Code Viewer -->
          <div v-else class="h-full">
            <pre class="p-4 h-full overflow-auto bg-surface-container-lowest"><code>{{ currentSource }}</code></pre>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>