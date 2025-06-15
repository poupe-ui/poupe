<script setup lang="ts">
import { ref } from 'vue';
import { Input } from '../input';
import Icon from '../icon.vue';
import Card from '../card.vue';
import { StorySection, StoryShowcase } from '../story';
import Button from '../button.vue';

const surfaces = [
  'base', 'primary', 'secondary', 'tertiary', 'error',
] as const;
const borders = [
  'none', 'current', 'primary', 'secondary', 'tertiary', 'error', 'outline',
] as const;
const focusBorders = [
  'none', 'current', 'primary', 'secondary', 'tertiary', 'error', 'outline',
] as const;
const roundedOptions = [
  'none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full',
] as const;

const basicValue = ref('');
const emailValue = ref('');
const passwordValue = ref('');
const numberValue = ref('');
const searchValue = ref('');
const disabledValue = ref('This input is disabled');
const readonlyValue = ref('This input is read-only');
</script>

<template>
  <div class="space-y-8">
    <!-- Basic Usage -->
    <StorySection
      title="Basic Usage"
      description="Basic input field with two-way binding demonstration"
    >
      <StoryShowcase class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          v-model="basicValue"
          label="Basic Input"
          placeholder="Enter some text..."
        />
        <Input
          v-model="basicValue"
          label="Input with Value"
          placeholder="This syncs with the first input"
        />
      </StoryShowcase>
    </StorySection>

    <!-- Input Types -->
    <StorySection
      title="Input Types"
      description="Different HTML input types for various use cases"
    >
      <StoryShowcase class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          v-model="emailValue"
          type="email"
          label="Email"
          placeholder="user@example.com"
        />
        <Input
          v-model="passwordValue"
          type="password"
          label="Password"
          placeholder="Enter password"
        />
        <Input
          v-model="numberValue"
          type="number"
          label="Number"
          placeholder="Enter a number"
        />
        <Input
          v-model="searchValue"
          type="search"
          label="Search"
          placeholder="Search..."
        />
      </StoryShowcase>
    </StorySection>

    <!-- Surface Variants -->
    <StorySection
      title="Surface Variants"
      description="Input fields with different surface backgrounds"
    >
      <StoryShowcase class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input
          v-for="surface in surfaces"
          :key="surface"
          :model-value="`Surface ${surface}`"
          :surface="surface"
          :label="`Surface ${surface}`"
        />
      </StoryShowcase>
    </StorySection>

    <!-- Border Variants -->
    <StorySection
      title="Border Variants"
      description="Input fields with different border styles"
    >
      <StoryShowcase class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input
          v-for="border in borders"
          :key="border"
          :model-value="`Border ${border}`"
          :border="border"
          :label="`Border ${border}`"
        />
      </StoryShowcase>
    </StorySection>

    <!-- Focus Border Variants -->
    <StorySection
      title="Focus Border Variants"
      description="Click on inputs to see different focus ring styles"
    >
      <StoryShowcase class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input
          v-for="focusBorder in focusBorders"
          :key="focusBorder"
          :model-value="`Focus ${focusBorder}`"
          :focus-border="focusBorder"
          :label="`Focus ${focusBorder}`"
          placeholder="Click to focus"
        />
      </StoryShowcase>
    </StorySection>

    <!-- Rounded Variants -->
    <StorySection
      title="Rounded Variants"
      description="Input fields with different border radius options"
    >
      <StoryShowcase class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input
          v-for="rounded in roundedOptions"
          :key="rounded"
          :model-value="`Rounded ${rounded}`"
          :rounded="rounded"
          :label="`Rounded ${rounded}`"
        />
      </StoryShowcase>
    </StorySection>

    <!-- States -->
    <StorySection
      title="Input States"
      description="Disabled and read-only input field states"
    >
      <StoryShowcase class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          v-model="disabledValue"
          label="Disabled Input"
          :disabled="true"
        />
        <Input
          v-model="readonlyValue"
          label="Read-only Input"
          :readonly="true"
        />
      </StoryShowcase>
    </StorySection>

    <!-- With Icons (Custom Slots) -->
    <StorySection
      title="Inputs with Icons"
      description="Input fields with prepend and append icon slots"
    >
      <StoryShowcase class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          v-model="emailValue"
          label="Email with Icon"
          type="email"
          placeholder="user@example.com"
        >
          <template #prepend>
            <Icon
              icon="material-symbols:mail"
              class="text-on-surface-variant"
            />
          </template>
        </Input>

        <Input
          v-model="searchValue"
          label="Search with Icon"
          type="search"
          placeholder="Search..."
        >
          <template #append>
            <Icon
              icon="material-symbols:search"
              class="text-on-surface-variant"
            />
          </template>
        </Input>

        <Input
          v-model="passwordValue"
          label="Password with Toggle"
          type="password"
          placeholder="Enter password"
        >
          <template #append>
            <Icon
              icon="material-symbols:visibility"
              class="text-on-surface-variant cursor-pointer
                     hover:text-on-surface"
            />
          </template>
        </Input>

        <Input
          v-model="basicValue"
          label="Input with Both Icons"
          placeholder="Type something..."
        >
          <template #prepend>
            <Icon
              icon="material-symbols:edit"
              class="text-on-surface-variant"
            />
          </template>
          <template #append>
            <Icon
              icon="material-symbols:check"
              class="text-on-surface-variant"
            />
          </template>
        </Input>
      </StoryShowcase>
    </StorySection>

    <!-- Complex Example -->
    <StorySection
      title="Complex Form Example"
      description="A complete user registration form showcasing various input features"
    >
      <Card
        surface="high"
        shadow="z2"
      >
        <template #header>
          <h3 class="text-xl font-semibold">
            User Registration
          </h3>
        </template>

        <form class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="John"
              required
            />
            <Input
              label="Last Name"
              placeholder="Doe"
              required
            />
          </div>

          <Input
            v-model="emailValue"
            type="email"
            label="Email Address"
            placeholder="john.doe@example.com"
            focus-border="primary"
            required
          >
            <template #prepend>
              <Icon
                icon="material-symbols:mail"
                class="text-on-surface-variant"
              />
            </template>
          </Input>

          <Input
            v-model="passwordValue"
            type="password"
            label="Password"
            placeholder="Create a strong password"
            focus-border="primary"
            required
          >
            <template #prepend>
              <Icon
                icon="material-symbols:lock"
                class="text-on-surface-variant"
              />
            </template>
          </Input>

          <Input
            type="tel"
            label="Phone Number (Optional)"
            placeholder="+1 (555) 123-4567"
          >
            <template #prepend>
              <Icon
                icon="material-symbols:phone"
                class="text-on-surface-variant"
              />
            </template>
          </Input>
        </form>

        <template #footer>
          <div class="flex gap-2 justify-end">
            <Button
              surface="base"
              border="outline"
            >
              Cancel
            </Button>
            <Button surface="primary">
              Register
            </Button>
          </div>
        </template>
      </Card>
    </StorySection>
  </div>
</template>
