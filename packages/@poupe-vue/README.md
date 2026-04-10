# @poupe/vue

[![API Reference][jsdocs-shield]][jsdocs-link]
[![NPM Version][npm-shield]][npm-link]
[![License][license-shield]][license-link]

Vue component library for Poupe UI framework with theme customization
and accessibility support.

## Features

- 🧩 Feature-rich Vue 3 component library
- 🎨 Built-in theme customization with Material Design 3
- ♿ Strong focus on accessibility
- 🌓 Dark/light mode theming
- 🔧 Fully typed with TypeScript
- 📱 Responsive design out of the box
- ✨ Interactive state layers (hover, focus, pressed, disabled)

## Installation

```bash
npm install @poupe/vue @poupe/theme-builder
# or
yarn add @poupe/vue @poupe/theme-builder
# or
pnpm add @poupe/vue @poupe/theme-builder
```

For TailwindCSS integration:

```bash
npm install @poupe/tailwindcss
```

## Basic Setup

```typescript
import { createApp } from 'vue'
import { createPoupe } from '@poupe/vue'
import App from './App.vue'

// Create Vue app
const app = createApp(App)

// Setup Poupe with theme
app.use(createPoupe({
  theme: {
    colors: {
      primary: '#1976d2',
      secondary: '#9c27b0',
      // Add more colors as needed
    }
  },
  // Optional: component-specific options
  components: {
    // Button specific options
    button: {
      defaultVariant: 'filled'
    }
  }
}))

app.mount('#app')
```

## Using Components

```vue
<template>
  <div>
    <PButton variant="filled" color="primary">Click Me</PButton>

    <PCard>
      <template #header>Card Header</template>
      Card content goes here
      <template #footer>Card Footer</template>
    </PCard>

    <PInput v-model="inputValue" label="Username" />

    <PSurface color="primary" shape="lg" shadow="z2" padding="md">
      Elevated surface content
    </PSurface>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const inputValue = ref('')
</script>
```

### PCard Component

The PCard component is built on PSurface and provides a convenient way to
create Material Design 3 cards:

```vue
<template>
  <!-- Simple card with title -->
  <PCard title="Card Title">
    This is the card content. It can contain any text or components.
  </PCard>

  <!-- Card with custom header and footer -->
  <PCard>
    <template #header>
      <h3 class="text-xl font-medium">Custom Header</h3>
    </template>
    Main content area
    <template #footer>
      <div class="flex justify-end gap-2">
        <PButton surface="base">Cancel</PButton>
        <PButton surface="primary">Save</PButton>
      </div>
    </template>
  </PCard>

  <!-- Interactive card with primary container -->
  <PCard container="primary" interactive>
    Click me! I'm an interactive card.
  </PCard>

  <!-- Card with surface variants -->
  <PCard surface="high" shadow="z3" shape="lg">
    Elevated card with high emphasis
  </PCard>
</template>
```

Card props:

- `title`: Card title displayed in header
- `surface`: Convenience prop for surface colors (base, dim, bright, lowest,
  low, container, high, highest)
- `container`: Convenience prop for container colors (primary, secondary,
  tertiary, error)
  - Note: If both `surface` and `container` are specified, `container` takes precedence
- `shape`: Corner radius variant (xs, sm, md, lg, xl) - defaults to 'md'
- `shadow`: Elevation shadow (none, z1-z5) - defaults to 'z1'
- `interactive`: Enable hover/focus/pressed states
- All other PSurface props are supported

### PSurface Component

The PSurface component provides Material Design 3 surface containers:

```vue
<template>
  <!-- Basic surface -->
  <PSurface>Default surface</PSurface>

  <!-- Interactive surface with elevation -->
  <PSurface
    color="secondary"
    shadow="z3"
    shape="xl"
    padding="lg"
    interactive
  >
    Interactive elevated content
  </PSurface>

  <!-- Container variant -->
  <PSurface variant="container" color="high">
    High emphasis container
  </PSurface>
</template>
```

Surface props:

- `variant`: 'surface' | 'container' - Surface type
- `color`: Surface color based on MD3 color system
- `shape`: Shape variant (none, xs, sm, md, lg, xl, rounded, full,
  squircle-xs, etc.) - uses Material Design 3 shape system where size-only
  variants are squircles
- `shadow`: Elevation shadow (none, z1-z5)
- `border`: Border style (none, primary, secondary, outline, etc.)
- `interactive`: Enable hover/focus/pressed states
- `padding`: Content padding (none, sm, md, lg, xl)

## Composables

### useRipple

Add Material Design ripple effects to any element:

```vue
<template>
  <button ref="buttonRef" class="ripple-effect">
    Click me
  </button>
</template>

<script setup>
import { ref } from 'vue'
import { useRipple } from '@poupe/vue'

const buttonRef = ref()
useRipple(buttonRef, {
  color: 'currentColor',
  opacity: 0.12,
  duration: 600
})
</script>
```

The ripple effect requires the `.ripple-effect` utility class from @poupe/tailwindcss
for the animation keyframes.

### usePoupe

Access global configuration and component defaults:

```vue
<script setup>
import { usePoupe, usePoupeMergedProps } from '@poupe/vue'

// Access global configuration
const poupe = usePoupe()
console.log(poupe?.theme?.dark) // true/false

// Merge props with component and global defaults
const mergedProps = usePoupeMergedProps(props, 'button', {
  variant: 'text',
  color: 'primary',
  size: 'medium'
})
</script>
```

Configure global defaults via the Poupe plugin:

```typescript
app.use(createPoupe({
  theme: { dark: true },
  defaults: {
    button: {
      variant: 'filled',
      color: 'primary'
    }
  }
}))
```

## Story Viewer

The package includes a built-in story viewer for component documentation:

```vue
<template>
  <StoryViewer :stories="stories" />
</template>

<script setup>
import { StoryViewer } from '@poupe/vue/story-viewer'
import buttonStories from './components/button.stories.vue'
import cardStories from './components/card.stories.vue'

const stories = [
  { name: 'Button', component: buttonStories },
  { name: 'Card', component: cardStories }
]
</script>
```

## Available Exports

- **Main export**: Core components and configuration
- **config**: Theme configuration utilities
- **resolver**: Component resolving for build tools
- **story-viewer**: Components viewer
- **theme-scheme**: Theme visualization component

### Theme Scheme Component

The `ThemeScheme` component is exported separately as it's a
specialized utility component for visualizing and debugging theme colors:

```typescript
// Import from the separate export
import { ThemeScheme } from '@poupe/vue/theme-scheme'
```

This component displays all theme color schemes and is useful for:

- Visualizing your theme's color palette
- Debugging theme configurations
- Showcasing theme variations to stakeholders

## TailwindCSS Integration

For optimal experience, integrate with TailwindCSS:

```js
// tailwind.config.js
import { poupePlugin } from '@poupe/tailwindcss'

export default {
  // ...
  plugins: [
    poupePlugin()
  ]
}
```

## Related Packages

- [@poupe/css](../@poupe-css) - CSS-in-JS utilities
- [@poupe/theme-builder](../@poupe-theme-builder) - Theme token generation
- [@poupe/tailwindcss](../@poupe-tailwindcss) - TailwindCSS integration
- [@poupe/nuxt](../@poupe-nuxt) - Nuxt integration

## Requirements

- Vue ^3.5.13
- Node.js >=20.19.1
- @poupe/theme-builder ^0.7.0
- @poupe/tailwindcss ^0.2.6

## License

MIT licensed.

[jsdocs-shield]: https://img.shields.io/badge/jsDocs.io-reference-blue
[jsdocs-link]: https://www.jsdocs.io/package/@poupe/vue
[npm-shield]: https://img.shields.io/npm/v/@poupe/vue.svg
[npm-link]: https://www.npmjs.com/package/@poupe/vue
[license-shield]: https://img.shields.io/badge/License-MIT-blue.svg
[license-link]: ../../LICENCE.txt
