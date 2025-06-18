<script setup lang="ts">
import { ref, computed } from 'vue';
import { useHead } from '@unhead/vue';
import { useDark, useToggle } from '@vueuse/core';

import { Card, Button, Icon } from './components';
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
  fabMenuOpen.value = false;
};

// Computed properties for page toggle button
const pageToggleIcon = computed(() => {
  switch (currentPage.value) {
    case 'theme':
      return 'material-symbols:widgets-rounded';
    case 'stories':
      return 'material-symbols:palette';
    default:
      return 'material-symbols:palette';
  }
});

const pageToggleLabel = computed(() => {
  switch (currentPage.value) {
    case 'theme':
      return 'Show Component Stories';
    case 'stories':
      return 'Show Theme Colors';
    default:
      return 'Toggle Page';
  }
});
</script>

<template>
  <div class="min-h-screen relative">
    <!-- FAB Menu -->
    <div class="fixed bottom-6 right-6 z-50">
      <!-- Menu Items -->
      <transition-group name="fab-menu">
        <!-- Dark Mode Toggle -->
        <div
          v-if="fabMenuOpen"
          key="dark-mode"
          class="absolute bottom-20 right-0 mb-2"
        >
          <Button
            :surface="'secondary'"
            size="base"
            rounded="full"
            shadow="z2"
            class="min-w-0 w-12 h-12 p-0 flex items-center justify-center"
            :aria-label="isDark
              ? 'Switch to Light Mode'
              : 'Switch to Dark Mode'"
            @click="toggleDark()"
          >
            <Icon
              :icon="isDark
                ? 'material-symbols:light-mode'
                : 'material-symbols:dark-mode'"
              size="text-xl"
            />
          </Button>
        </div>

        <!-- Page Toggle -->
        <div
          v-if="fabMenuOpen"
          key="page-toggle"
          class="absolute bottom-36 right-0 mb-2"
        >
          <Button
            :surface="'secondary'"
            size="base"
            rounded="full"
            shadow="z2"
            class="min-w-0 w-12 h-12 p-0 flex items-center justify-center"
            :aria-label="pageToggleLabel"
            @click="togglePage"
          >
            <Icon
              :icon="pageToggleIcon"
              size="text-xl"
            />
          </Button>
        </div>
      </transition-group>

      <!-- Main FAB -->
      <Button
        :surface="'primary'"
        size="lg"
        rounded="full"
        shadow="z3"
        class="min-w-0 w-14 h-14 p-0 flex items-center justify-center relative"
        aria-label="Toggle menu"
        @click="fabMenuOpen = !fabMenuOpen"
      >
        <Icon
          :icon="fabMenuOpen
            ? 'material-symbols:close'
            : 'material-symbols:add'"
          size="text-2xl"
          :class="{ 'rotate-45': fabMenuOpen }"
          class="transition-transform duration-200"
        />
      </Button>
    </div>

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
            class="m-auto w-full max-w-4xl"
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

.fab-menu-enter-active,
.fab-menu-leave-active {
  transition: all 0.3s ease;
}

.fab-menu-enter-from,
.fab-menu-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(10px);
}

.rotate-45 {
  transform: rotate(45deg);
}
</style>
