<script setup lang="ts">
import type { ButtonProps } from './button.vue';
import Button from './button.vue';

// Default controls for all variants
const defaultProps: ButtonProps = {
  label: 'Click me',
  disabled: false,
  loading: false,
  ellipsis: false,
  surface: 'base',
  border: 'none',
  rounded: 'md',
  shadow: 'none',
  size: 'base',
  expand: false,
};
</script>

<template>
  <Story
    title="Button"
    :layout="{ type: 'grid', width: '100%' }"
  >
    <Variant
      title="Default"
      :init-state="() => defaultProps"
    >
      <template #default="{ state }">
        <Button v-bind="state" />
      </template>

      <template #controls="{ state }">
        <HstText
          v-model="state.label"
          title="Label"
        />
        <HstCheckbox
          v-model="state.disabled"
          title="Disabled"
        />
        <HstCheckbox
          v-model="state.loading"
          title="Loading"
        />
        <HstCheckbox
          v-model="state.ellipsis"
          title="Ellipsis"
        />
        <HstCheckbox
          v-model="state.expand"
          title="Expand"
        />

        <HstSelect
          v-model="state.surface"
          title="Surface"
        >
          <option value="base">
            Base
          </option>
          <option value="primary">
            Primary
          </option>
          <option value="secondary">
            Secondary
          </option>
          <option value="tertiary">
            Tertiary
          </option>
          <option value="error">
            Error
          </option>
          <option value="surface">
            Surface
          </option>
          <option value="surface-dim">
            Surface Dim
          </option>
          <option value="surface-bright">
            Surface Bright
          </option>
          <option value="surface-container-lowest">
            Surface Container Lowest
          </option>
          <option value="surface-container-low">
            Surface Container Low
          </option>
          <option value="surface-container">
            Surface Container
          </option>
          <option value="surface-container-high">
            Surface Container High
          </option>
          <option value="surface-container-highest">
            Surface Container Highest
          </option>
        </HstSelect>

        <HstSelect
          v-model="state.border"
          title="Border"
        >
          <option value="none">
            None
          </option>
          <option value="sm">
            Small
          </option>
          <option value="md">
            Medium
          </option>
          <option value="lg">
            Large
          </option>
        </HstSelect>

        <HstSelect
          v-model="state.rounded"
          title="Rounded"
        >
          <option value="none">
            None
          </option>
          <option value="sm">
            Small
          </option>
          <option value="md">
            Medium
          </option>
          <option value="lg">
            Large
          </option>
          <option value="xl">
            Extra Large
          </option>
          <option value="2xl">
            2XL
          </option>
          <option value="3xl">
            3XL
          </option>
          <option value="full">
            Full
          </option>
        </HstSelect>

        <HstSelect
          v-model="state.shadow"
          title="Shadow"
        >
          <option value="none">
            None
          </option>
          <option value="sm">
            Small
          </option>
          <option value="md">
            Medium
          </option>
          <option value="lg">
            Large
          </option>
          <option value="xl">
            Extra Large
          </option>
          <option value="2xl">
            2XL
          </option>
        </HstSelect>

        <HstSelect
          v-model="state.size"
          title="Size"
        >
          <option value="xs">
            Extra Small
          </option>
          <option value="sm">
            Small
          </option>
          <option value="base">
            Base
          </option>
          <option value="lg">
            Large
          </option>
          <option value="xl">
            Extra Large
          </option>
        </HstSelect>
      </template>
    </Variant>

    <Variant
      title="Sizes"
      auto-props-disabled
    >
      <div class="flex gap-2 items-center">
        <Button
          label="Extra Small"
          size="xs"
        />
        <Button
          label="Small"
          size="sm"
        />
        <Button
          label="Base"
          size="base"
        />
        <Button
          label="Large"
          size="lg"
        />
        <Button
          label="Extra Large"
          size="xl"
        />
      </div>
    </Variant>

    <Variant
      title="Surfaces"
      auto-props-disabled
    >
      <div class="grid grid-cols-3 gap-2">
        <Button
          label="Base"
          surface="base"
        />
        <Button
          label="Primary"
          surface="primary"
        />
        <Button
          label="Secondary"
          surface="secondary"
        />
        <Button
          label="Tertiary"
          surface="tertiary"
        />
        <Button
          label="Error"
          surface="error"
        />
        <Button
          label="Base"
          surface="base"
        />
        <Button
          label="Inverse"
          surface="inverse"
        />
        <Button
          label="Primary Fixed"
          surface="primary-fixed"
        />
        <Button
          label="Lowest"
          surface="lowest"
        />
        <Button
          label="Low"
          surface="low"
        />
        <Button
          label="Base Container"
          surface="base"
        />
        <Button
          label="High"
          surface="high"
        />
        <Button
          label="Highest"
          surface="highest"
        />
      </div>
    </Variant>

    <Variant
      title="States"
      auto-props-disabled
    >
      <div class="flex gap-2">
        <Button label="Normal" />
        <Button
          label="Disabled"
          disabled
        />
        <Button
          label="Loading"
          loading
        />
      </div>
    </Variant>

    <Variant
      title="With Slot Content"
      auto-props-disabled
    >
      <Button>
        <span class="flex items-center gap-2">
          <svg
            class="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z" />
          </svg>
          Custom Content
        </span>
      </Button>
    </Variant>

    <Variant
      title="Expanded"
      auto-props-disabled
    >
      <div class="w-full max-w-md">
        <Button
          label="Full Width Button"
          expand
        />
      </div>
    </Variant>
  </Story>
</template>
