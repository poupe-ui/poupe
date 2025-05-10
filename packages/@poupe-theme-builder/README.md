# @poupe/theme-builder

[![jsDocs.io](https://img.shields.io/badge/jsDocs.io-reference-blue)](https://www.jsdocs.io/package/@poupe/theme-builder)
[![npm version](https://img.shields.io/npm/v/@poupe/theme-builder.svg)](https://www.npmjs.com/package/@poupe/theme-builder)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../../LICENCE.txt)

Design token management and theme generation system for Poupe UI framework.

## Features

- 🎨 Create customizable design tokens for your UI components
- 🌓 Dark mode and light mode support out of the box
- 🎭 Material Design color system integration
- 🧩 Export to various formats, including TailwindCSS

## Installation

```bash
npm install @poupe/theme-builder
# or
yarn add @poupe/theme-builder
# or
pnpm add @poupe/theme-builder
```

## Basic Usage

```typescript
import { createTheme } from '@poupe/theme-builder'

// Create a theme with your custom colors
const theme = createTheme({
  colors: {
    primary: '#1976d2',
    scheme: 'vibrant',
  }
})
```

## Core Concepts

The theme builder uses a token-based approach to design systems, allowing you to:

1. Define base colors and design tokens
2. Generate color variants automatically (hover, active, etc.)
3. Create dark/light mode variations
4. Export tokens to different formats

## Submodules

This package offers several specialized submodules:

- `@poupe/theme-builder/core` - Core theme generation functions
- `@poupe/theme-builder/utils` - Utility functions for working with tokens
- `@poupe/theme-builder/tailwind` - TailwindCSS integration
- `@poupe/theme-builder/server` - Server-side utilities

## Integration with Poupe Ecosystem

- [@poupe/css](../@poupe-css) - CSS-in-JS utilities
- [@poupe/tailwindcss](../@poupe-tailwindcss) - TailwindCSS integration
- [@poupe/vue](../@poupe-vue) - Vue components library
- [@poupe/nuxt](../@poupe-nuxt) - Nuxt integration

## Requirements

- Node.js >=20.19.1
- pnpm >=10.10.0 (for development)

## License

MIT licensed.
