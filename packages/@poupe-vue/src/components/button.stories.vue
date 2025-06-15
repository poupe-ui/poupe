<script setup lang="ts">
import { ref } from 'vue';
import Button from './button.vue';
import Icon from './icon.vue';
import { StorySection, StoryShowcase } from './story';

const surfaces = [
  'base', 'primary', 'secondary', 'tertiary', 'error',
] as const;
const sizes = ['xs', 'sm', 'base', 'lg', 'xl'] as const;
const borders = [
  'none', 'current', 'primary', 'secondary', 'tertiary', 'error', 'outline',
] as const;
const roundedOptions = [
  'none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full',
] as const;
const shadows = ['none', 'z1', 'z2', 'z3', 'z4', 'z5'] as const;

const isLoading = ref(false);

const toggleLoading = () => {
  isLoading.value = !isLoading.value;
};
</script>

<template>
  <div class="p-8 space-y-8">
    <!-- Surface Variants -->
    <StorySection
      title="Surface Variants"
      description="Different surface colors for various button purposes"
    >
      <StoryShowcase class="flex flex-wrap gap-4">
        <Button
          v-for="surface in surfaces"
          :key="surface"
          :surface="surface"
          :label="`${surface} Button`"
        />
      </StoryShowcase>
    </StorySection>

    <!-- Size Variants -->
    <section>
      <h2 class="text-2xl font-bold mb-4 text-on-surface">
        Size Variants
      </h2>
      <div class="flex flex-wrap items-center gap-4">
        <Button
          v-for="size in sizes"
          :key="size"
          :size="size"
          surface="primary"
          :label="`Size ${size}`"
        />
      </div>
    </section>

    <!-- Border Variants -->
    <section>
      <h2 class="text-2xl font-bold mb-4 text-on-surface">
        Border Variants
      </h2>
      <div class="flex flex-wrap gap-4">
        <Button
          v-for="border in borders"
          :key="border"
          :border="border"
          surface="base"
          :label="`Border ${border}`"
        />
      </div>
    </section>

    <!-- Rounded Variants -->
    <section>
      <h2 class="text-2xl font-bold mb-4 text-on-surface">
        Rounded Variants
      </h2>
      <div class="flex flex-wrap gap-4">
        <Button
          v-for="rounded in roundedOptions"
          :key="rounded"
          :rounded="rounded"
          surface="primary"
          :label="`Rounded ${rounded}`"
        />
      </div>
    </section>

    <!-- Shadow Variants -->
    <section>
      <h2 class="text-2xl font-bold mb-4 text-on-surface">
        Shadow Variants
      </h2>
      <div class="flex flex-wrap gap-4">
        <Button
          v-for="shadow in shadows"
          :key="shadow"
          :shadow="shadow"
          surface="base"
          :label="`Shadow ${shadow}`"
        />
      </div>
    </section>

    <!-- States -->
    <section>
      <h2 class="text-2xl font-bold mb-4 text-on-surface">
        Button States
      </h2>
      <div class="flex flex-wrap gap-4">
        <Button
          surface="primary"
          label="Normal"
        />
        <Button
          surface="primary"
          label="Disabled"
          :disabled="true"
        />
        <Button
          surface="primary"
          label="Loading"
          :loading="true"
        />
        <Button
          surface="primary"
          :label="isLoading ? 'Stop Loading' : 'Toggle Loading'"
          :loading="isLoading"
          @click="toggleLoading"
        />
      </div>
    </section>

    <!-- Expanded Button -->
    <section>
      <h2 class="text-2xl font-bold mb-4 text-on-surface">
        Expanded Button
      </h2>
      <Button
        surface="primary"
        label="Full Width Button"
        :expand="true"
      />
    </section>

    <!-- Custom Content with Slots -->
    <section>
      <h2 class="text-2xl font-bold mb-4 text-on-surface">
        Custom Content
      </h2>
      <div class="flex flex-wrap gap-4">
        <Button surface="primary">
          <Icon
            icon="material-symbols:add"
            class="mr-2"
          />
          Add Item
        </Button>
        <Button surface="secondary">
          Settings
          <Icon
            icon="material-symbols:settings"
            class="ml-2"
          />
        </Button>
        <Button surface="tertiary">
          <Icon
            icon="material-symbols:favorite"
            class="mr-2"
          />
          Like
          <span class="ml-2 text-xs">(42)</span>
        </Button>
      </div>
    </section>

    <!-- Ellipsis -->
    <section>
      <h2 class="text-2xl font-bold mb-4 text-on-surface">
        Ellipsis
      </h2>
      <div class="flex flex-wrap gap-4">
        <Button
          surface="primary"
          label="Loading"
          :ellipsis="true"
        />
        <Button
          surface="secondary"
          label="Processing"
          :ellipsis="true"
        />
      </div>
    </section>
  </div>
</template>
