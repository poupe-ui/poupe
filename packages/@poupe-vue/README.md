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

## Available Exports

- **Main export**: Core components and configuration
- **config**: Theme configuration utilities
- **resolver**: Component resolving for build tools

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
