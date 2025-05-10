# @poupe/tailwindcss

[![jsDocs.io](https://img.shields.io/badge/jsDocs.io-reference-blue)](https://www.jsdocs.io/package/@poupe/tailwindcss)
[![npm version](https://img.shields.io/npm/v/@poupe/tailwindcss.svg)](https://www.npmjs.com/package/@poupe/tailwindcss)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../../LICENCE.txt)

TailwindCSS v4 plugin for Poupe UI framework with theme customization support.

## Features

- 🔄 Seamless integration between Poupe themes and TailwindCSS
- 🎨 Automatic generation of TailwindCSS theme from Poupe tokens
- 🌓 Dark mode support built-in
- 🛠️ Utility functions for consistent styling

## Installation

```bash
npm install @poupe/tailwindcss @poupe/theme-builder
# or
yarn add @poupe/tailwindcss @poupe/theme-builder
# or
pnpm add @poupe/tailwindcss @poupe/theme-builder
```

## Usage

### In your tailwind.config.js

```javascript
import { poupePlugin } from '@poupe/tailwindcss'

export default {
  content: [
    // ...your content configuration
  ],
  plugins: [
    poupePlugin({
      // Theme configuration
      theme: {
        colors: {
          primary: '#1976d2',
          secondary: '#9c27b0',
          // Add more colors as needed
        }
      }
    }),
  ],
}
```

### Using the theme utilities

```javascript
import { createTailwindTheme } from '@poupe/tailwindcss/theme'
import { createTheme } from '@poupe/theme-builder'

// Create your Poupe theme
const myTheme = createTheme({
  colors: {
    primary: '#1976d2',
    // ...more colors
  }
})

// Convert to Tailwind format
const tailwindTheme = createTailwindTheme(myTheme)

// Use in your Tailwind config
export default {
  theme: tailwindTheme,
  // ...rest of your config
}
```

## Exports

- **Main Export**: TailwindCSS plugin
- **Theme**: Theme generation utilities
- **Utils**: Helper functions

## Integration

This package integrates well with the following Poupe packages:

- [@poupe/css](../@poupe-css) - CSS-in-JS utilities
- [@poupe/theme-builder](../@poupe-theme-builder) - Theme token generation
- [@poupe/vue](../@poupe-vue) - Vue components library
- [@poupe/nuxt](../@poupe-nuxt) - Nuxt integration

## Requirements

- Node.js >=20.19.1
- TailwindCSS ^4.1.6
- @poupe/theme-builder ^0.7.0

## License

MIT licensed.
