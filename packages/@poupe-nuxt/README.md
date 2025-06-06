# @poupe/nuxt

[![jsDocs.io](https://img.shields.io/badge/jsDocs.io-reference-blue)](https://www.jsdocs.io/package/@poupe/nuxt)
[![npm version](https://img.shields.io/npm/v/@poupe/nuxt.svg)](https://www.npmjs.com/package/@poupe/nuxt)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../../LICENCE.txt)

Nuxt module for integrating Poupe UI framework with theme customization and components.

## Features

- 🧩 Easy integration of Poupe UI with Nuxt applications
- 🔄 Auto-imports of Poupe Vue components
- 🎨 Theme customization through Nuxt config
- 🌓 Dark/light mode support with integration to @nuxtjs/color-mode
- 🛠️ TailwindCSS configuration included

## Installation

```bash
npm install @poupe/nuxt @poupe/vue @poupe/theme-builder
# or
yarn add @poupe/nuxt @poupe/vue @poupe/theme-builder
# or
pnpm add @poupe/nuxt @poupe/vue @poupe/theme-builder
```

## Setup

Add the module to your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: [
    '@poupe/nuxt'
  ],
  poupe: {
    // Configuration options
    theme: {
      colors: {
        primary: '#1976d2',
        secondary: '#9c27b0',
        // Add more colors as needed
      }
    }
  }
})
```

## Configuration Options

### Theme Configuration

```typescript
export default defineNuxtConfig({
  modules: ['@poupe/nuxt'],
  poupe: {
    theme: {
      colors: {
        primary: '#1976d2',
        secondary: '#9c27b0',
        // Other colors
      },
      // Other theme options
      spacing: {
        // Custom spacing
      },
      borderRadius: {
        // Custom border radius
      }
    },
    // Enable/disable dark mode
    darkMode: true,
    // Component options
    components: {
      prefix: 'P', // Default prefix for components
      // Component-specific options
    }
  }
})
```

## Using Components

Once installed, all Poupe components are automatically available in your Nuxt application:

```vue
<template>
  <div>
    <PButton>Click me</PButton>
    <PCard>
      <h2>Card Title</h2>
      <p>Card content</p>
    </PCard>
  </div>
</template>
```

## Development

For local development, check out the [playground](./playground) directory.

### Component Development

The playground includes a stories viewer page to view and test all Poupe UI components:

```bash
cd playground

# Start the Nuxt dev server
pnpm dev
```

Then navigate to `/stories` to see an interactive environment to explore all components from @poupe/vue.

## Related Packages

- [@poupe/css](../@poupe-css) - CSS-in-JS utilities
- [@poupe/theme-builder](../@poupe-theme-builder) - Theme token generation
- [@poupe/vue](../@poupe-vue) - Vue components library
- [@poupe/tailwindcss](../@poupe-tailwindcss) - TailwindCSS integration

## Requirements

- Nuxt ^3.17.2
- Node.js >=20.19.1
- @poupe/theme-builder ^0.7.0
- @poupe/vue ^0.4.1

## License

MIT licensed.
