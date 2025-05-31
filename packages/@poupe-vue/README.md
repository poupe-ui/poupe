# @poupe/vue

[![API Reference][jsdocs-shield]][jsdocs-link]
[![NPM Version][npm-shield]][npm-link]
[![License][license-shield]][license-link]

Vue component library for Poupe UI framework with theme customization
and accessibility support.

## Features

- 🧩 Feature-rich Vue 3 component library
- 🎨 Built-in theme customization
- ♿ Strong focus on accessibility
- 🌓 Dark/light mode theming
- 🔧 Fully typed with TypeScript
- 📱 Responsive design out of the box

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

## Components

### Available Components

The Vue component library provides Material Design 3 components with full
accessibility support and semantic HTML foundations.

#### Navigation & Layout

- **PScaffold** - Main app structure with header, content, and navigation
- **PAppBar** - Top/bottom navigation bars (`role="banner"` or `"toolbar"`)
- **PNavigationBar** - Bottom navigation for mobile (`role="navigation"`)
- **PNavigationDrawer** - Side navigation panel (`role="navigation"`)
- **PNavigationRail** - Desktop side navigation (`role="navigation"`)
- **PSurface** - Base container with elevation and color theming

#### Content Containers

- **PCard** - Flexible content container (`role="group"` or `"article"`)
- **PBottomSheet** - Slide-up content panel (`role="dialog"`)
- **PSideSheet** - Slide-in content panel (`role="dialog"`)
- **PDialog** - Modal dialog (`role="dialog"` or `"alertdialog"`)
- **PTabs** - Tabbed content organization (`role="tablist"`)
- **PCarousel** - Scrollable item collection (`role="region"`)

#### Interactive Controls

- **PButton** - Action buttons with multiple variants (`role="button"`)
- **PCheckbox** - Selection control (`role="checkbox"`)
- **PRadioButton** - Single choice from group (`role="radio"`)
- **PSwitch** - Toggle control (`role="switch"`)
- **PSlider** - Range input (`role="slider"`)
- **PTextField** - Text input (`role="textbox"`)
- **PChip** - Compact interactive elements (various roles)

#### Display & Feedback

- **PProgressIndicator** - Progress display (`role="progressbar"`)
- **PSnackbar** - Brief message display (`role="status"` or `"alert"`)
- **PTooltip** - Contextual help (`role="tooltip"`)
- **PBadge** - Status indicators
- **PMenu** - Action lists (`role="menu"`)
- **PDivider** - Content separator

#### Material Design 3 Principles

All components follow M3 design tokens with:

- **Tonal Elevation** - Dynamic color based on elevation
- **Dynamic Color** - Adapts to user's wallpaper
- **Accessibility First** - Semantic HTML with ARIA support
- **Theme Integration** - Consistent color and typography system

### Accessibility Guidelines

Components prioritize semantic HTML and use ARIA attributes only when
necessary. Key principles:

1. **Semantic HTML First** - Use native elements when possible
2. **Meaningful Labels** - Provide accessible names via text or `aria-label`
3. **Keyboard Navigation** - Full keyboard support for all interactions
4. **Screen Reader Support** - Proper ARIA roles and live regions

## Available Exports

- **Main export**: Core components and configuration
- **config**: Theme configuration utilities
- **resolver**: Component resolving for build tools
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
