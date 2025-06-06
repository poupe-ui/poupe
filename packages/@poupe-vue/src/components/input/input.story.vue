<script setup lang="ts">
import type { InputWrapperProps } from './types';
import InputWrapper from './wrapper.vue';
import Icon from '../icon.vue';

// Default controls for all variants
const defaultProps: InputWrapperProps = {
  type: 'text',
  surface: 'base',
  border: 'outline',
  outline: 'current',
  rounded: 'full',
  padding: 2,
  expand: false,
  unit: undefined,
  iconStart: undefined,
  iconEnd: undefined,
};

const inputTypes = [
  'text',
  'password',
  'email',
  'number',
  'tel',
  'url',
  'search',
  'date',
  'time',
  'datetime-local',
];
</script>

<template>
  <Story
    title="Input"
    :layout="{ type: 'grid', width: '100%' }"
  >
    <Variant
      title="Default"
      :init-state="() => ({ ...defaultProps, modelValue: '' })"
    >
      <template #default="{ state }">
        <InputWrapper
          v-model="state.modelValue"
          v-bind="state"
          placeholder="Enter text..."
        />
      </template>

      <template #controls="{ state }">
        <HstText
          v-model="state.modelValue"
          title="Value"
        />

        <HstSelect
          v-model="state.type"
          title="Type"
        >
          <option
            v-for="t in inputTypes"
            :key="t"
            :value="t"
          >
            {{ t }}
          </option>
        </HstSelect>

        <HstText
          v-model="state.unit"
          title="Unit"
        />
        <HstText
          v-model="state.iconStart"
          title="Start Icon"
        />
        <HstText
          v-model="state.iconEnd"
          title="End Icon"
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
          <option value="outline">
            Outline
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
          v-model="state.outline"
          title="Outline Color"
        >
          <option value="current">
            Current
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

        <HstNumber
          v-model="state.padding"
          title="Padding"
          :min="0"
          :max="4"
        />
        <HstCheckbox
          v-model="state.expand"
          title="Expand"
        />
      </template>
    </Variant>

    <Variant
      title="Input Types"
      auto-props-disabled
    >
      <div class="space-y-4">
        <InputWrapper
          type="text"
          placeholder="Text input"
        />
        <InputWrapper
          type="password"
          placeholder="Password input"
        />
        <InputWrapper
          type="email"
          placeholder="Email input"
        />
        <InputWrapper
          type="number"
          placeholder="Number input"
        />
        <InputWrapper
          type="search"
          placeholder="Search input"
        />
        <InputWrapper type="date" />
        <InputWrapper type="time" />
      </div>
    </Variant>

    <Variant
      title="With Icons"
      auto-props-disabled
    >
      <div class="space-y-4">
        <InputWrapper
          icon-start="heroicons:magnifying-glass"
          placeholder="Search..."
        />
        <InputWrapper
          icon-end="heroicons:envelope"
          placeholder="Email address"
        />
        <InputWrapper
          icon-start="heroicons:user"
          icon-end="heroicons:check"
          placeholder="Username"
        />
      </div>
    </Variant>

    <Variant
      title="With Units"
      auto-props-disabled
    >
      <div class="space-y-4">
        <InputWrapper
          type="number"
          unit="USD"
          placeholder="0.00"
        />
        <InputWrapper
          type="number"
          unit="kg"
          placeholder="Weight"
        />
        <InputWrapper
          type="number"
          unit="%"
          placeholder="Percentage"
        />
      </div>
    </Variant>

    <Variant
      title="Surface Variants"
      auto-props-disabled
    >
      <div class="space-y-4">
        <InputWrapper
          surface="primary"
          placeholder="Primary surface"
        />
        <InputWrapper
          surface="secondary"
          placeholder="Secondary surface"
        />
        <InputWrapper
          surface="tertiary"
          placeholder="Tertiary surface"
        />
        <InputWrapper
          surface="error"
          placeholder="Error surface"
        />
        <InputWrapper
          surface="base"
          placeholder="Base surface"
        />
      </div>
    </Variant>

    <Variant
      title="Border Variants"
      auto-props-disabled
    >
      <div class="space-y-4">
        <InputWrapper
          border="none"
          placeholder="No border"
        />
        <InputWrapper
          border="outline"
          placeholder="Outline border"
        />
        <InputWrapper
          border="primary"
          placeholder="Primary border"
        />
        <InputWrapper
          border="secondary"
          placeholder="Secondary border"
        />
        <InputWrapper
          border="tertiary"
          placeholder="Tertiary border"
        />
      </div>
    </Variant>

    <Variant
      title="Outline Colors"
      auto-props-disabled
    >
      <div class="space-y-4">
        <InputWrapper
          outline="primary"
          placeholder="Primary outline"
        />
        <InputWrapper
          outline="secondary"
          placeholder="Secondary outline"
        />
        <InputWrapper
          outline="tertiary"
          placeholder="Tertiary outline"
        />
        <InputWrapper
          outline="error"
          placeholder="Error outline"
        />
      </div>
    </Variant>

    <Variant
      title="Padding Sizes"
      auto-props-disabled
    >
      <div class="space-y-4">
        <InputWrapper
          :padding="0"
          placeholder="Padding 0"
        />
        <InputWrapper
          :padding="1"
          placeholder="Padding 1"
        />
        <InputWrapper
          :padding="2"
          placeholder="Padding 2 (default)"
        />
        <InputWrapper
          :padding="3"
          placeholder="Padding 3"
        />
        <InputWrapper
          :padding="4"
          placeholder="Padding 4"
        />
      </div>
    </Variant>

    <Variant
      title="Custom Slots"
      auto-props-disabled
    >
      <div class="space-y-4">
        <InputWrapper>
          <template #start>
            <div class="px-2 text-primary">
              $
            </div>
          </template>
          <template #field="{ padding }">
            <input
              type="number"
              :class="`w-full focus:outline-none ${padding}`"
              placeholder="0.00"
            >
          </template>
          <template #unit>
            <span class="px-2 text-xs font-medium">USD</span>
          </template>
        </InputWrapper>

        <InputWrapper>
          <template #end="{ padding }">
            <button :class="`${padding} text-primary hover:text-primary-variant`">
              <Icon icon="heroicons:clipboard-document" />
            </button>
          </template>
        </InputWrapper>
      </div>
    </Variant>

    <Variant
      title="Expanded Width"
      auto-props-disabled
    >
      <div class="w-full max-w-md">
        <InputWrapper
          expand
          placeholder="Full width input"
        />
      </div>
    </Variant>

    <Variant
      title="Password Toggle"
      auto-props-disabled
    >
      <InputWrapper
        type="password"
        placeholder="Enter password"
        icon-start="heroicons:lock-closed"
      />
    </Variant>

    <Variant
      title="Combined Features"
      auto-props-disabled
    >
      <div class="space-y-4">
        <InputWrapper
          surface="base"
          border="primary"
          rounded="lg"
          icon-start="heroicons:credit-card"
          unit="CVV"
          placeholder="123"
        />

        <InputWrapper
          surface="primary"
          border="outline"
          outline="primary"
          icon-start="heroicons:at-symbol"
          icon-end="heroicons:check-circle"
          placeholder="email@example.com"
        />
      </div>
    </Variant>
  </Story>
</template>
