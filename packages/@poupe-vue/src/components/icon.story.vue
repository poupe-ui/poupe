<script setup lang="ts">
import type { IconProps } from './icon.vue';
import Icon from './icon.vue';

// Default controls for all variants
const defaultProps: IconProps = {
  icon: 'heroicons:sparkles',
  width: 24,
  height: 24,
};

// Common icons to showcase
const commonIcons = [
  { name: 'Spinner', icon: 'spinner' },
  { name: 'Show Password', icon: 'showPassword' },
  { name: 'Hide Password', icon: 'hidePassword' },
  { name: 'Home', icon: 'heroicons:home' },
  { name: 'User', icon: 'heroicons:user' },
  { name: 'Settings', icon: 'heroicons:cog' },
  { name: 'Search', icon: 'heroicons:magnifying-glass' },
  { name: 'Heart', icon: 'heroicons:heart' },
  { name: 'Star', icon: 'heroicons:star' },
  { name: 'Check', icon: 'heroicons:check' },
  { name: 'X Mark', icon: 'heroicons:x-mark' },
  { name: 'Plus', icon: 'heroicons:plus' },
  { name: 'Minus', icon: 'heroicons:minus' },
  { name: 'Arrow Right', icon: 'heroicons:arrow-right' },
  { name: 'Download', icon: 'heroicons:arrow-down-tray' },
];

const sizes = [
  { label: 'Small (16px)', size: 16 },
  { label: 'Medium (24px)', size: 24 },
  { label: 'Large (32px)', size: 32 },
  { label: 'Extra Large (48px)', size: 48 },
  { label: 'XXL (64px)', size: 64 },
];
</script>

<template>
  <Story
    title="Icon"
    :layout="{ type: 'grid', width: '100%' }"
  >
    <Variant
      title="Default"
      :init-state="() => defaultProps"
    >
      <template #default="{ state }">
        <Icon v-bind="state" />
      </template>

      <template #controls="{ state }">
        <HstText
          v-model="state.icon"
          title="Icon"
        />
        <HstNumber
          v-model="state.width"
          title="Width"
        />
        <HstNumber
          v-model="state.height"
          title="Height"
        />
        <HstCheckbox
          v-model="state.inline"
          title="Inline"
        />
        <HstCheckbox
          v-model="state.flip"
          title="Flip"
        />
        <HstText
          v-model="state.rotate"
          title="Rotate (e.g., 90deg, 1, 2, 3)"
        />
      </template>
    </Variant>

    <Variant
      title="Common Icons"
      auto-props-disabled
    >
      <div class="grid grid-cols-5 gap-4">
        <div
          v-for="item in commonIcons"
          :key="item.icon"
          class="flex flex-col items-center gap-2 p-4 rounded-lg bg-surface-container"
        >
          <Icon
            :icon="item.icon"
            :width="32"
            :height="32"
          />
          <span class="text-xs text-center">{{ item.name }}</span>
          <code class="text-xs opacity-60">{{ item.icon }}</code>
        </div>
      </div>
    </Variant>

    <Variant
      title="Sizes"
      auto-props-disabled
    >
      <div class="flex items-end gap-4">
        <div
          v-for="sizeConfig in sizes"
          :key="sizeConfig.size"
          class="flex flex-col items-center gap-2"
        >
          <Icon
            icon="heroicons:sparkles"
            :width="sizeConfig.size"
            :height="sizeConfig.size"
          />
          <span class="text-xs">{{ sizeConfig.label }}</span>
        </div>
      </div>
    </Variant>

    <Variant
      title="Colors"
      auto-props-disabled
    >
      <div class="flex gap-4">
        <Icon
          icon="heroicons:heart"
          :width="32"
          :height="32"
          class="text-primary"
        />
        <Icon
          icon="heroicons:heart"
          :width="32"
          :height="32"
          class="text-secondary"
        />
        <Icon
          icon="heroicons:heart"
          :width="32"
          :height="32"
          class="text-tertiary"
        />
        <Icon
          icon="heroicons:heart"
          :width="32"
          :height="32"
          class="text-error"
        />
        <Icon
          icon="heroicons:heart"
          :width="32"
          :height="32"
          class="text-on-surface"
        />
      </div>
    </Variant>

    <Variant
      title="Transformations"
      auto-props-disabled
    >
      <div class="flex gap-4">
        <div class="flex flex-col items-center gap-2">
          <Icon
            icon="heroicons:arrow-right"
            :width="32"
            :height="32"
          />
          <span class="text-xs">Normal</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <Icon
            icon="heroicons:arrow-right"
            :width="32"
            :height="32"
            flip="horizontal"
          />
          <span class="text-xs">Flipped</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <Icon
            icon="heroicons:arrow-right"
            :width="32"
            :height="32"
            :rotate="1"
          />
          <span class="text-xs">Rotate 90°</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <Icon
            icon="heroicons:arrow-right"
            :width="32"
            :height="32"
            :rotate="2"
          />
          <span class="text-xs">Rotate 180°</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <Icon
            icon="heroicons:arrow-right"
            :width="32"
            :height="32"
            :rotate="3"
          />
          <span class="text-xs">Rotate 270°</span>
        </div>
      </div>
    </Variant>

    <Variant
      title="Loading Spinner"
      auto-props-disabled
    >
      <div class="flex items-center gap-4">
        <Icon
          icon="spinner"
          :width="24"
          :height="24"
        />
        <span>Loading...</span>
      </div>
    </Variant>

    <Variant
      title="Inline Usage"
      auto-props-disabled
    >
      <p class="text-lg">
        This is an inline icon <Icon
          icon="heroicons:sparkles"
          :inline="true"
        /> within text.
      </p>
    </Variant>

    <Variant
      title="Unknown Icon"
      auto-props-disabled
    >
      <div class="flex flex-col items-center gap-2">
        <Icon
          icon="this-icon-does-not-exist"
          :width="32"
          :height="32"
        />
        <span class="text-xs">Unknown icon fallback</span>
      </div>
    </Variant>

    <Variant
      title="No Icon (Blank)"
      auto-props-disabled
    >
      <div class="flex items-center gap-2 p-4 border-2 border-dashed border-outline">
        <span>Before</span>
        <Icon
          :icon="undefined"
          :width="24"
          :height="24"
        />
        <span>After (blank icon space)</span>
      </div>
    </Variant>
  </Story>
</template>
