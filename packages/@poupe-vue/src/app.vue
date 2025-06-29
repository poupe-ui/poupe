<script setup lang="ts">
import { ref, computed } from 'vue';
import { useHead } from '@unhead/vue';
import { useDark, useToggle } from '@vueuse/core';

import { Card, Fab } from './components';
import type { FabMenuItem } from './components';
import { ThemeScheme } from './components/theme';
import StoryIndex from './stories/index.vue';

useHead({
  bodyAttrs: {
    class: 'surface',
  },
});

// Page state
type Page = 'theme' | 'stories';
const currentPage = ref<Page>('theme');
const fabMenuOpen = ref(false);

// Dark mode with VueUse
const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: '',
});
const toggleDark = useToggle(isDark);

// Page navigation helpers
const pageOrder: Page[] = ['theme', 'stories'];
const togglePage = () => {
  const currentIndex = pageOrder.indexOf(currentPage.value);
  const nextIndex = (currentIndex + 1) % pageOrder.length;
  currentPage.value = pageOrder[nextIndex];
};

// FAB menu items
const fabItems = computed<FabMenuItem[]>(() => [
  {
    key: 'page-toggle',
    icon: currentPage.value === 'theme'
      ? 'material-symbols:widgets-rounded'
      : 'material-symbols:palette',
    label: currentPage.value === 'theme'
      ? 'Show Component Stories'
      : 'Show Theme Colors',
    onClick: togglePage,
  },
  {
    key: 'dark-mode',
    icon: isDark.value
      ? 'material-symbols:light-mode'
      : 'material-symbols:dark-mode',
    label: isDark.value
      ? 'Switch to Light Mode'
      : 'Switch to Dark Mode',
    onClick: () => toggleDark(),
  },
]);
</script>

<template>
  <div class="min-h-screen relative">
    <!-- FAB Menu -->
    <Fab
      v-model="fabMenuOpen"
      :items="fabItems"
    />

    <!-- Page Content with Transition -->
    <transition
      name="fade"
      mode="out-in"
    >
      <!-- Theme Colors Page -->
      <div
        v-if="currentPage === 'theme'"
        key="theme"
        class="flex flex-1 justify-center items-center min-h-screen py-4
          sm:py-8"
      >
        <div class="container px-4 sm:px-6 lg:px-8">
          <Card
            class="m-auto w-full max-w-6xl"
            title="@poupe/vue - Theme Colors"
            shadow="z2"
            surface="high"
          >
            <ThemeScheme class="pb-2" />
          </Card>
        </div>
      </div>

      <!-- Component Stories Page -->
      <div
        v-else
        key="stories"
        class="min-h-screen"
      >
        <StoryIndex />
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
