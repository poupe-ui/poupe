<script setup lang="ts">
import Card from './card.vue';
import Button from './button.vue';
import { StorySection, StoryShowcase } from './story';

const surfaces = [
  'base', 'lowest', 'low', 'high', 'highest',
] as const;
const shadows = ['none', 'z1', 'z2', 'z3', 'z4', 'z5'] as const;
const roundedOptions = [
  'none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl',
] as const;
</script>

<template>
  <div class="space-y-8">
    <!-- Surface Variants -->
    <StorySection
      title="Surface Variants"
      description="Cards can use different surface colors for visual hierarchy"
    >
      <StoryShowcase class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card
          v-for="surface in surfaces"
          :key="surface"
          :surface="surface"
          :title="`Surface ${surface}`"
        >
          This card demonstrates the {{ surface }} surface variant with
          appropriate background and text colors.
        </Card>
      </StoryShowcase>
    </StorySection>

    <!-- Shadow Variants -->
    <StorySection
      title="Shadow Variants"
      description="Material Design 3 elevation levels for depth perception"
    >
      <StoryShowcase class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card
          v-for="shadow in shadows"
          :key="shadow"
          :shadow="shadow"
          surface="base"
          :title="`Shadow ${shadow}`"
        >
          Material Design 3 elevation level {{ shadow }}
        </Card>
      </StoryShowcase>
    </StorySection>

    <!-- Rounded Variants -->
    <StorySection
      title="Rounded Variants"
      description="Different corner radius options for various use cases"
    >
      <StoryShowcase class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card
          v-for="rounded in roundedOptions"
          :key="rounded"
          :rounded="rounded"
          surface="high"
          shadow="z1"
          :title="`Rounded ${rounded}`"
        >
          Corner radius variant: {{ rounded }}
        </Card>
      </StoryShowcase>
    </StorySection>

    <!-- Card with Slots -->
    <StorySection
      title="Card with All Slots"
      description="Cards support header, default, and footer slots for flexible content"
    >
      <Card
        surface="high"
        shadow="z2"
        rounded="lg"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-semibold">
              Custom Header
            </h3>
            <Button
              surface="tertiary"
              size="sm"
            >
              Action
            </Button>
          </div>
        </template>

        <p class="mb-4">
          This card demonstrates all available slots. The header and footer
          slots allow for custom content while maintaining consistent styling.
        </p>
        <p>
          Cards are perfect for grouping related information and actions
          in a visually distinct container.
        </p>

        <template #footer>
          <div class="flex gap-2 justify-end">
            <Button
              surface="base"
              border="outline"
            >
              Cancel
            </Button>
            <Button surface="primary">
              Confirm
            </Button>
          </div>
        </template>
      </Card>
    </StorySection>

    <!-- Interactive Cards -->
    <StorySection
      title="Interactive Cards"
      description="Cards can respond to user interactions with hover states and transitions"
    >
      <StoryShowcase class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          surface="base"
          shadow="z1"
          rounded="md"
          class="transition-all hover:shadow-z3 cursor-pointer"
          title="Hoverable Card"
        >
          <p class="mb-2">
            This card elevates on hover for visual feedback.
          </p>
          <p class="text-sm text-on-surface-variant">
            Try hovering over this card to see the elevation change.
          </p>
        </Card>

        <Card
          surface="primary"
          shadow="z2"
          rounded="md"
          title="Colored Card"
        >
          <p class="mb-2">
            Cards can use any surface color variant.
          </p>
          <p class="text-sm">
            This creates emphasis and visual hierarchy in your layouts.
          </p>
        </Card>
      </StoryShowcase>
    </StorySection>

    <!-- Complex Card Layout -->
    <StorySection
      title="Complex Card Example"
      description="A comprehensive example showing advanced card layouts and content"
    >
      <Card
        surface="highest"
        shadow="z3"
        rounded="xl"
      >
        <template #header>
          <div class="space-y-2">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-2xl font-bold">
                  Premium Feature
                </h3>
                <p class="text-on-surface-variant">
                  Advanced capabilities for power users
                </p>
              </div>
              <span
                class="px-3 py-1 bg-tertiary text-on-tertiary
                     rounded-full text-sm"
              >
                PRO
              </span>
            </div>
          </div>
        </template>

        <div class="space-y-4">
          <div class="grid grid-cols-3 gap-4 text-center">
            <div>
              <div class="text-3xl font-bold text-primary">
                150+
              </div>
              <div class="text-sm text-on-surface-variant">
                Components
              </div>
            </div>
            <div>
              <div class="text-3xl font-bold text-secondary">
                50+
              </div>
              <div class="text-sm text-on-surface-variant">
                Templates
              </div>
            </div>
            <div>
              <div class="text-3xl font-bold text-tertiary">
                ∞
              </div>
              <div class="text-sm text-on-surface-variant">
                Possibilities
              </div>
            </div>
          </div>

          <p class="text-on-surface">
            Unlock the full potential of your application with our comprehensive
            component library and advanced features.
          </p>
        </div>

        <template #footer>
          <div class="flex flex-col sm:flex-row gap-2">
            <Button
              surface="primary"
              expand
            >
              Get Started
            </Button>
            <Button
              surface="base"
              border="outline"
              expand
            >
              Learn More
            </Button>
          </div>
        </template>
      </Card>
    </StorySection>
  </div>
</template>
