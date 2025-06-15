<script setup lang="ts">
import { ref } from 'vue';
import Icon from './icon.vue';
import Card from './card.vue';
import { StorySection, StoryShowcase } from './story';

const sizes = [
  'text-xs', 'text-sm', 'text-base', 'text-lg',
  'text-xl', 'text-2xl', 'text-3xl', 'text-4xl',
] as const;
const colors = [
  'text-primary', 'text-secondary', 'text-tertiary',
  'text-error', 'text-on-surface', 'text-on-surface-variant',
] as const;

const spinnerIcons = [
  'svg-spinners:3-dots-bounce',
  'svg-spinners:3-dots-fade',
  'svg-spinners:3-dots-move',
  'svg-spinners:3-dots-rotate',
  'svg-spinners:3-dots-scale',
  'svg-spinners:3-dots-scale-middle',
  'svg-spinners:6-dots-rotate',
  'svg-spinners:6-dots-scale',
  'svg-spinners:6-dots-scale-middle',
  'svg-spinners:12-dots-scale-rotate',
  'svg-spinners:90-ring',
  'svg-spinners:90-ring-with-bg',
  'svg-spinners:180-ring',
  'svg-spinners:180-ring-with-bg',
  'svg-spinners:270-ring',
  'svg-spinners:270-ring-with-bg',
  'svg-spinners:bars-fade',
  'svg-spinners:bars-rotate-fade',
  'svg-spinners:bars-scale',
  'svg-spinners:bars-scale-fade',
  'svg-spinners:bars-scale-middle',
  'svg-spinners:blocks-scale',
  'svg-spinners:blocks-shuffle-2',
  'svg-spinners:blocks-shuffle-3',
  'svg-spinners:blocks-wave',
  'svg-spinners:bouncingBall',
  'svg-spinners:clock',
  'svg-spinners:dot-revolve',
  'svg-spinners:dots-3',
  'svg-spinners:eclipse',
  'svg-spinners:eclipse-half',
  'svg-spinners:gooey-balls-1',
  'svg-spinners:gooey-balls-2',
  'svg-spinners:pulse',
  'svg-spinners:pulse-2',
  'svg-spinners:pulse-3',
  'svg-spinners:pulse-multiple',
  'svg-spinners:pulse-ring',
  'svg-spinners:pulse-rings-2',
  'svg-spinners:pulse-rings-3',
  'svg-spinners:pulse-rings-multiple',
  'svg-spinners:ring-resize',
  'svg-spinners:square-spin',
  'svg-spinners:tadpole',
  'svg-spinners:wifi',
  'svg-spinners:wifi-fade',
  'svg-spinners:wind-toy',
];

const materialIcons = [
  'material-symbols:home',
  'material-symbols:search',
  'material-symbols:settings',
  'material-symbols:favorite',
  'material-symbols:star',
  'material-symbols:delete',
  'material-symbols:edit',
  'material-symbols:add',
  'material-symbols:close',
  'material-symbols:check',
  'material-symbols:arrow-back',
  'material-symbols:arrow-forward',
  'material-symbols:menu',
  'material-symbols:more-vert',
  'material-symbols:more-horiz',
  'material-symbols:account-circle',
  'material-symbols:info',
  'material-symbols:warning',
  'material-symbols:error',
  'material-symbols:help',
];

const isRotating = ref(false);
</script>

<template>
  <div class="space-y-8">
    <!-- Icon Sizes -->
    <StorySection
      title="Icon Sizes"
      description="Icons can be sized using Tailwind text size classes"
    >
      <StoryShowcase class="flex flex-wrap items-center gap-4">
        <Icon
          v-for="size in sizes"
          :key="size"
          icon="material-symbols:star"
          :class="size"
        />
      </StoryShowcase>
    </StorySection>

    <!-- Icon Colors -->
    <StorySection
      title="Icon Colors"
      description="Icons can use any of the theme color classes"
    >
      <StoryShowcase class="flex flex-wrap gap-4">
        <Icon
          v-for="color in colors"
          :key="color"
          icon="material-symbols:favorite"
          :class="`text-2xl ${color}`"
        />
      </StoryShowcase>
    </StorySection>

    <!-- Material Icons -->
    <StorySection
      title="Material Icons"
      description="A collection of commonly used Material Symbols icons"
    >
      <StoryShowcase
        class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8
           lg:grid-cols-10 gap-4"
      >
        <div
          v-for="icon in materialIcons"
          :key="icon"
          class="flex flex-col items-center gap-2"
        >
          <Icon
            :icon="icon"
            class="text-2xl text-on-surface"
          />
          <span class="text-xs text-on-surface-variant text-center">
            {{ icon.split(':')[1] }}
          </span>
        </div>
      </StoryShowcase>
    </StorySection>

    <!-- Animated Icons -->
    <StorySection
      title="Animated Icons"
      description="SVG spinner icons with built-in animations"
    >
      <Card
        surface="base"
        shadow="z1"
      >
        <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
          <div
            v-for="icon in spinnerIcons.slice(0, 16)"
            :key="icon"
            class="flex flex-col items-center gap-2"
          >
            <Icon
              :icon="icon"
              class="text-2xl text-primary"
            />
            <span class="text-xs text-on-surface-variant text-center">
              {{ icon.split(':')[1] }}
            </span>
          </div>
        </div>
      </Card>
    </StorySection>

    <!-- Icon with Effects -->
    <StorySection
      title="Icon Effects"
      description="Icons with interactive effects and animations"
    >
      <StoryShowcase class="flex flex-wrap gap-8">
        <div class="text-center">
          <Icon
            icon="material-symbols:refresh"
            :class="[
              'text-4xl text-primary transition-transform',
              isRotating ? 'animate-spin' : ''
            ]"
            @click="isRotating = !isRotating"
          />
          <p class="text-sm text-on-surface-variant mt-2">
            Click to spin
          </p>
        </div>

        <div class="text-center">
          <Icon
            icon="material-symbols:favorite"
            class="text-4xl text-error hover:scale-125
                   transition-transform cursor-pointer"
          />
          <p class="text-sm text-on-surface-variant mt-2">
            Hover to scale
          </p>
        </div>

        <div class="text-center">
          <Icon
            icon="material-symbols:notifications"
            class="text-4xl text-secondary animate-pulse"
          />
          <p class="text-sm text-on-surface-variant mt-2">
            Pulsing
          </p>
        </div>

        <div class="text-center">
          <Icon
            icon="material-symbols:star"
            class="text-4xl text-tertiary animate-bounce"
          />
          <p class="text-sm text-on-surface-variant mt-2">
            Bouncing
          </p>
        </div>
      </StoryShowcase>
    </StorySection>

    <!-- Icon in Context -->
    <StorySection
      title="Icons in Context"
      description="Examples of icons used within other components"
    >
      <StoryShowcase class="space-y-4">
        <Card
          surface="base"
          shadow="z1"
        >
          <div class="flex items-center gap-3">
            <Icon
              icon="material-symbols:info"
              class="text-2xl text-primary"
            />
            <div>
              <h3 class="font-semibold">
                Information
              </h3>
              <p class="text-sm text-on-surface-variant">
                Icons provide visual context and improve usability
              </p>
            </div>
          </div>
        </Card>

        <Card
          surface="error-container"
          shadow="z1"
        >
          <div class="flex items-center gap-3">
            <Icon
              icon="material-symbols:error"
              class="text-2xl text-on-error-container"
            />
            <div>
              <h3 class="font-semibold text-on-error-container">
                Error Message
              </h3>
              <p class="text-sm text-on-error-container">
                Something went wrong. Please try again.
              </p>
            </div>
          </div>
        </Card>

        <Card
          surface="tertiary-container"
          shadow="z1"
        >
          <div class="flex items-center gap-3">
            <Icon
              icon="material-symbols:check-circle"
              class="text-2xl text-on-tertiary-container"
            />
            <div>
              <h3 class="font-semibold text-on-tertiary-container">
                Success!
              </h3>
              <p class="text-sm text-on-tertiary-container">
                Your changes have been saved successfully.
              </p>
            </div>
          </div>
        </Card>
      </StoryShowcase>
    </StorySection>
  </div>
</template>
