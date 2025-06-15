<script setup lang="ts">
import Placeholder from './placeholder.vue';
import Card from './card.vue';
import Button from './button.vue';
import { StorySection, StoryShowcase } from './story';

const colors = ['primary', 'secondary', 'tertiary', 'error'] as const;
const sizes = [
  { size: 50, label: 'Small (50px)' },
  { size: 100, label: 'Medium (100px)' },
  { size: 150, label: 'Large (150px)' },
  { size: 200, label: 'Extra Large (200px)' },
  { size: 250, label: 'XXL (250px)' },
];
</script>

<template>
  <div class="space-y-8">
    <!-- Basic Usage -->
    <StorySection
      title="Basic Placeholder"
      description="Simple placeholder components with default settings"
    >
      <StoryShowcase class="flex flex-wrap gap-4">
        <Placeholder />
        <Placeholder :size="150" />
        <Placeholder :size="200" />
      </StoryShowcase>
    </StorySection>

    <!-- Color Variants -->
    <StorySection
      title="Color Variants"
      description="Placeholders with different theme colors"
    >
      <StoryShowcase class="flex flex-wrap gap-4">
        <Placeholder
          v-for="color in colors"
          :key="color"
          :color="color"
          :size="120"
        />
      </StoryShowcase>
    </StorySection>

    <!-- Size Examples -->
    <StorySection
      title="Different Sizes"
      description="Placeholders ranging from small to extra large"
    >
      <StoryShowcase class="flex flex-wrap items-end gap-4">
        <div
          v-for="{ size, label } in sizes"
          :key="size"
          class="text-center"
        >
          <Placeholder
            :size="size"
            color="primary"
          />
          <p class="text-sm text-on-surface-variant mt-2">
            {{ label }}
          </p>
        </div>
      </StoryShowcase>
    </StorySection>

    <!-- Placeholder in Context -->
    <StorySection
      title="Placeholder in Context"
      description="Placeholders used within card components as image placeholders"
    >
      <!-- Image Placeholder in Card -->
      <StoryShowcase class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card
          v-for="n in 3"
          :key="n"
          surface="base"
          shadow="z1"
        >
          <template #header>
            <Placeholder
              :size="200"
              color="tertiary"
              class="w-full"
            />
          </template>

          <h3 class="font-semibold mb-2">
            Card Title {{ n }}
          </h3>
          <p class="text-sm text-on-surface-variant">
            This card uses a placeholder as the header image.
            Placeholders are useful during development or when content
            is loading.
          </p>

          <template #footer>
            <Button
              surface="primary"
              size="sm"
            >
              View More
            </Button>
          </template>
        </Card>
      </StoryShowcase>
    </StorySection>

    <!-- Loading States -->
    <StorySection
      title="Loading States"
      description="Using placeholders to create loading state UI patterns"
    >
      <StoryShowcase class="space-y-4">
        <!-- Profile Loading State -->
        <Card
          surface="base"
          shadow="z1"
        >
          <div class="flex items-center gap-4">
            <Placeholder
              :size="64"
              color="secondary"
              class="rounded-full"
            />
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-surface-variant rounded w-32" />
              <div class="h-3 bg-surface-variant rounded w-48" />
            </div>
          </div>
        </Card>

        <!-- Content Loading State -->
        <Card
          surface="base"
          shadow="z1"
        >
          <div class="space-y-3">
            <Placeholder
              :size="150"
              class="w-full"
            />
            <div class="space-y-2">
              <div class="h-4 bg-surface-variant rounded w-3/4" />
              <div class="h-4 bg-surface-variant rounded w-full" />
              <div class="h-4 bg-surface-variant rounded w-5/6" />
            </div>
          </div>
        </Card>
      </StoryShowcase>
    </StorySection>

    <!-- Grid Layout -->
    <StorySection
      title="Grid Layout Example"
      description="Responsive grid of placeholders with alternating colors"
    >
      <StoryShowcase class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Placeholder
          v-for="n in 8"
          :key="n"
          :size="150"
          :color="colors[(n - 1) % colors.length]"
          class="w-full"
        />
      </StoryShowcase>
    </StorySection>

    <!-- Custom Styling -->
    <StorySection
      title="Custom Styling"
      description="Placeholders with custom CSS classes applied"
    >
      <StoryShowcase class="flex flex-wrap gap-4">
        <Placeholder
          :size="120"
          color="primary"
          class="rounded-full"
        />
        <Placeholder
          :size="120"
          color="secondary"
          class="rounded-xl shadow-z2"
        />
        <Placeholder
          :size="120"
          color="tertiary"
          class="rounded-none border-4 border-outline"
        />
        <Placeholder
          :size="120"
          color="error"
          class="rounded-lg opacity-50"
        />
      </StoryShowcase>
    </StorySection>

    <!-- Responsive Placeholder -->
    <StorySection
      title="Responsive Placeholder"
      description="Placeholder that adapts its height based on screen size"
    >
      <Card
        surface="high"
        shadow="z2"
      >
        <Placeholder
          :size="300"
          color="primary"
          class="w-full h-48 md:h-64 lg:h-80"
        />
        <div class="mt-4">
          <h3 class="text-lg font-semibold">
            Responsive Content
          </h3>
          <p class="text-sm text-on-surface-variant mt-2">
            This placeholder adapts its height based on screen size
            while maintaining full width.
          </p>
        </div>
      </Card>
    </StorySection>
  </div>
</template>
