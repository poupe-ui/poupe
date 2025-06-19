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
  </div>
</template>

<script setup>
import { ref } from 'vue'

const inputValue = ref('')
</script>
```

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

## Development Tools

### Screenshot Helpers

The package includes Playwright-based screenshot utilities for capturing
component states:

#### Manual Screenshots

```bash
# Start dev server first
pnpm dev

# In another terminal, take screenshots
pnpm screenshot                           # Theme page
pnpm screenshot button                    # Specific component
pnpm screenshot theme theme-dark.png --dark     # Dark mode
pnpm screenshot --all-viewports           # Multiple screen sizes
```

#### Automated Screenshots

For CI/CD or quick captures without managing the dev server:

```bash
# Automatically starts dev server, takes screenshot, and cleans up
pnpm screenshot:auto                      # Theme page
pnpm screenshot:auto button --dark        # Button in dark mode
pnpm screenshot:auto --all-viewports      # All viewport sizes
```

**Options:**
- `--dark` - Enable dark mode
- `--mobile` - Use mobile viewport
- `--full-page` - Capture full page
- `--all-viewports` - Capture mobile, tablet, and desktop sizes

All screenshots are saved in the gitignored `screenshots/` directory.

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
