<script setup lang="ts">
import type { CardProps } from './card.vue';
import Card from './card.vue';
import Button from './button.vue';

// Default controls for all variants
const defaultProps: CardProps = {
  title: 'Card Title',
  surface: 'high',
  rounded: 'xl',
  shadow: 'none',
};
</script>

<template>
  <Story
    title="Card"
    :layout="{ type: 'grid', width: '100%' }"
  >
    <Variant
      title="Default"
      :init-state="() => defaultProps"
    >
      <template #default="{ state }">
        <Card v-bind="state">
          <p>This is the card content. It can contain any elements.</p>
        </Card>
      </template>

      <template #controls="{ state }">
        <HstText
          v-model="state.title"
          title="Title"
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
          <option value="low">
            Low
          </option>
          <option value="high">
            High
          </option>
          <option value="highest">
            Highest
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
      </template>
    </Variant>

    <Variant
      title="Without Title"
      auto-props-disabled
    >
      <Card>
        <p>This card has no title, just content.</p>
      </Card>
    </Variant>

    <Variant
      title="With Footer"
      auto-props-disabled
    >
      <Card title="Card with Footer">
        <p>This card has a footer slot with actions.</p>
        <template #footer>
          <div class="flex justify-end gap-2 p-4 border-t">
            <Button
              label="Cancel"
              surface="base"
            />
            <Button
              label="Save"
              surface="primary"
            />
          </div>
        </template>
      </Card>
    </Variant>

    <Variant
      title="Custom Header"
      auto-props-disabled
    >
      <Card>
        <template #header>
          <div class="flex items-center justify-between p-4 border-b">
            <h3 class="text-xl font-semibold">
              Custom Header
            </h3>
            <Button
              label="Action"
              size="sm"
              surface="tertiary"
            />
          </div>
        </template>
        <p class="p-4">
          Card content with custom header slot.
        </p>
      </Card>
    </Variant>

    <Variant
      title="Surface Variants"
      auto-props-disabled
    >
      <div class="grid grid-cols-2 gap-4">
        <Card
          title="Primary"
          surface="primary"
        >
          <p>Primary surface card</p>
        </Card>
        <Card
          title="Secondary"
          surface="secondary"
        >
          <p>Secondary surface card</p>
        </Card>
        <Card
          title="Base Container"
          surface="base"
        >
          <p>Surface container card</p>
        </Card>
        <Card
          title="Error"
          surface="error"
        >
          <p>Error surface card</p>
        </Card>
      </div>
    </Variant>

    <Variant
      title="Shadow Variants"
      auto-props-disabled
    >
      <div class="flex gap-4 flex-wrap">
        <Card
          title="No Shadow"
          shadow="none"
        >
          <p>No shadow</p>
        </Card>
        <Card
          title="Z1 Shadow"
          shadow="z1"
        >
          <p>Small shadow</p>
        </Card>
        <Card
          title="Z3 Shadow"
          shadow="z3"
        >
          <p>Medium shadow</p>
        </Card>
        <Card
          title="Z5 Shadow"
          shadow="z5"
        >
          <p>Large shadow</p>
        </Card>
      </div>
    </Variant>

    <Variant
      title="Complex Content"
      auto-props-disabled
    >
      <Card
        title="User Profile"
        surface="high"
        shadow="z3"
      >
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-on-primary text-2xl font-bold">
            JD
          </div>
          <div>
            <h4 class="text-lg font-semibold">
              John Doe
            </h4>
            <p class="text-sm opacity-70">
              john.doe@example.com
            </p>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-between p-4 border-t">
            <Button
              label="Message"
              surface="primary"
              size="sm"
            />
            <Button
              label="View Profile"
              surface="base"
              size="sm"
            />
          </div>
        </template>
      </Card>
    </Variant>

    <Variant
      title="Empty State (Placeholder)"
      auto-props-disabled
    >
      <Card title="Empty Card" />
    </Variant>
  </Story>
</template>
