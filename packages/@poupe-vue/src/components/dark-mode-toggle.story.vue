<script setup lang="ts">
import type { DarkModeToggleProps } from './dark-mode-toggle.vue'
import DarkModeToggle from './dark-mode-toggle.vue'

// Default controls for all variants
const defaultProps: DarkModeToggleProps = {
  size: 'base',
  surface: 'surface',
  storageKey: 'poupe-theme-preference',
  showTooltip: true,
}
</script>

<template>
  <Story title="DarkModeToggle" :layout="{ type: 'grid', width: '100%' }">
    <Variant title="Default" :init-state="() => defaultProps">
      <template #default="{ state }">
        <DarkModeToggle v-bind="state" />
      </template>

      <template #controls="{ state }">
        <HstText v-model="state.storageKey" title="Storage Key" />
        <HstCheckbox v-model="state.showTooltip" title="Show Tooltip" />
        
        <HstSelect v-model="state.surface" title="Surface">
          <option value="base">Base</option>
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
          <option value="tertiary">Tertiary</option>
          <option value="error">Error</option>
          <option value="surface">Surface</option>
          <option value="surface-dim">Surface Dim</option>
          <option value="surface-bright">Surface Bright</option>
          <option value="surface-container-lowest">Surface Container Lowest</option>
          <option value="surface-container-low">Surface Container Low</option>
          <option value="surface-container">Surface Container</option>
          <option value="surface-container-high">Surface Container High</option>
          <option value="surface-container-highest">Surface Container Highest</option>
        </HstSelect>

        <HstSelect v-model="state.size" title="Size">
          <option value="xs">Extra Small</option>
          <option value="sm">Small</option>
          <option value="base">Base</option>
          <option value="lg">Large</option>
          <option value="xl">Extra Large</option>
        </HstSelect>
      </template>
    </Variant>

    <Variant title="Sizes" auto-props-disabled>
      <div class="flex gap-2 items-center">
        <DarkModeToggle size="xs" />
        <DarkModeToggle size="sm" />
        <DarkModeToggle size="base" />
        <DarkModeToggle size="lg" />
        <DarkModeToggle size="xl" />
      </div>
    </Variant>

    <Variant title="Surfaces" auto-props-disabled>
      <div class="flex gap-2">
        <DarkModeToggle surface="primary" />
        <DarkModeToggle surface="secondary" />
        <DarkModeToggle surface="tertiary" />
        <DarkModeToggle surface="surface" />
        <DarkModeToggle surface="surface-container" />
      </div>
    </Variant>

    <Variant title="Custom Icons" auto-props-disabled>
      <div class="flex gap-2">
        <DarkModeToggle 
          light-icon="heroicons:light-bulb"
          dark-icon="heroicons:moon"
        />
        <DarkModeToggle 
          light-icon="heroicons:sparkles"
          dark-icon="heroicons:star"
        />
      </div>
    </Variant>

    <Variant title="With Custom Content" auto-props-disabled>
      <DarkModeToggle>
        <template #default="{ isDark }">
          <span class="flex items-center gap-2">
            <Icon :icon="isDark ? 'heroicons:sun' : 'heroicons:moon'" />
            {{ isDark ? 'Light' : 'Dark' }} Mode
          </span>
        </template>
      </DarkModeToggle>
    </Variant>

    <Variant title="No Tooltip" auto-props-disabled>
      <DarkModeToggle :show-tooltip="false" />
    </Variant>

    <Variant title="Different Styles" auto-props-disabled>
      <div class="flex gap-2">
        <DarkModeToggle surface="primary" rounded="full" />
        <DarkModeToggle surface="secondary" rounded="none" />
        <DarkModeToggle surface="tertiary" border="md" />
        <DarkModeToggle surface="surface" shadow="md" />
      </div>
    </Variant>
  </Story>
</template>