# Poupe UI

Poupe UI is a modern, themeable UI framework built with TypeScript that provides a complete solution for building beautiful, accessible, and customizable user interfaces.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.19.1-brightgreen)](package.json)
[![pnpm](https://img.shields.io/badge/pnpm-%3E%3D10.10.0-orange)](package.json)

## Features

- 🎨 **Advanced Theming** - Dynamic theming system with Material Design color utilities
- 🔌 **Framework Agnostic** - Core functionality works with any framework
- ⚡ **Vue Integration** - First-class support for Vue 3 with component library
- 🧩 **Nuxt Module** - Seamless integration with Nuxt applications
- 🌈 **TailwindCSS Plugin** - Native TailwindCSS v4 support
- 📦 **Modular Architecture** - Use only what you need

## Packages

| Package | Version | Description |
|---------|---------|-------------|
| [@poupe/css](./packages/@poupe-css) | [![npm version](https://img.shields.io/npm/v/@poupe/css.svg)](https://www.npmjs.com/package/@poupe/css) | CSS-in-JS utilities |
| [@poupe/theme-builder](./packages/@poupe-theme-builder) | [![npm version](https://img.shields.io/npm/v/@poupe/theme-builder.svg)](https://www.npmjs.com/package/@poupe/theme-builder) | Design token management and theme generation system |
| [@poupe/tailwindcss](./packages/@poupe-tailwindcss) | [![npm version](https://img.shields.io/npm/v/@poupe/tailwindcss.svg)](https://www.npmjs.com/package/@poupe/tailwindcss) | TailwindCSS v4 plugin with theme customization support |
| [@poupe/vue](./packages/@poupe-vue) | [![npm version](https://img.shields.io/npm/v/@poupe/vue.svg)](https://www.npmjs.com/package/@poupe/vue) | Vue component library with theme customization and accessibility support |
| [@poupe/nuxt](./packages/@poupe-nuxt) | [![npm version](https://img.shields.io/npm/v/@poupe/nuxt.svg)](https://www.npmjs.com/package/@poupe/nuxt) | Nuxt module for integrating Poupe UI framework |

## Requirements

- Node.js >=20.19.1
- pnpm >=10.10.0

## Installation

### Vue Application

```bash
# Install the Vue component library
npm install @poupe/vue @poupe/theme-builder tailwindcss
```

### Nuxt Application

```bash
# Install the Nuxt module
npm install @poupe/nuxt
```

Add to your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['@poupe/nuxt'],
})
```

### TailwindCSS Only

```bash
# Install the TailwindCSS plugin
npm install @poupe/tailwindcss @poupe/theme-builder
```

Add to your `tailwind.config.js`:

```javascript
import { poupePlugin } from '@poupe/tailwindcss'

export default {
  // ...
  plugins: [
    poupePlugin({
      // your theme configuration
    }),
  ],
}
```

## Quick Start

### Create a Theme

```typescript
import { createTheme } from '@poupe/theme-builder'

const theme = createTheme({
  // Define your theme
  colors: {
    primary: '#1976d2',
    secondary: '#9c27b0',
    // Add more colors as needed
  },
})
```

### Use with Vue

```typescript
import { createApp } from 'vue'
import { createPoupe } from '@poupe/vue'
import App from './App.vue'

const app = createApp(App)

app.use(createPoupe({
  theme: {
    colors: {
      primary: '#1976d2',
      secondary: '#9c27b0',
    },
  },
}))

app.mount('#app')
```

## Development

This is a monorepo managed with pnpm.

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm -r build

# Run tests
pnpm -r test
```

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
