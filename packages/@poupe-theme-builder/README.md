# @poupe/theme-builder

[![jsDocs.io](https://img.shields.io/badge/jsDocs.io-reference-blue)](https://www.jsdocs.io/package/@poupe/theme-builder)
[![npm version](https://img.shields.io/npm/v/@poupe/theme-builder.svg)](https://www.npmjs.com/package/@poupe/theme-builder)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../../LICENCE.txt)

A TypeScript library for design token management and theme generation in the
Poupe UI framework.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Basic Configuration](#basic-configuration)
  - [Advanced Theme Creation](#advanced-theme-creation)
- [API Reference](#api-reference)
  - [Core API](#core-api)
  - [Color Utilities](#color-utilities)
  - [Theme Generation](#theme-generation)
- [Submodules](#submodules)
- [Integration with Poupe Ecosystem](#integration-with-poupe-ecosystem)
- [Requirements](#requirements)
- [License](#license)

## Features

- 🎨 Create customizable design tokens for your UI components
- 🌓 Dark mode and light mode support out of the box
- 🎭 Material Design color system integration
- 🧩 Export to various formats, including CSS variables
- 📦 Lightweight, tree-shakable API
- 🖼️ Generate themes from images

## Installation

```bash
npm install -D @poupe/theme-builder
```

```bash
yarn add -D @poupe/theme-builder
```

```bash
pnpm add -D @poupe/theme-builder
```

## Usage

### Basic Configuration

```typescript
import { createTheme } from '@poupe/theme-builder'

// Create a theme with your custom colors
const theme = createTheme({
  colors: {
    primary: '#1976d2',
    secondary: '#9c27b0',
    scheme: 'vibrant',
  }
})
```

### Advanced Theme Creation

```typescript
import { createTheme, themeFromImage } from '@poupe/theme-builder'

// Create a theme from an image
async function createDynamicTheme(imagePath) {
  // Extract colors from an image
  const imageTheme = await themeFromImage(imagePath);
  
  // Create a theme with dynamic colors
  const theme = createTheme({
    colors: {
      ...imageTheme,
      // Override specific colors if needed
      accent: '#ff4081'
    },
    darkMode: true,
    contrastLevel: 0.5
  });
  
  return theme;
}
```

## API Reference

### Core API

```typescript
import { createTheme, hexString, rgb } from '@poupe/theme-builder'
```

The core API provides functions for creating themes and working with color
formats.

### Color Utilities

```typescript
import { argb, hct, splitArgb } from '@poupe/theme-builder/core'
```

Utilities for working with colors in different formats:

- Color format conversion (HEX, RGB, HSL, ARGB)
- Color manipulation functions
- Material Design color system integration

### Theme Generation

```typescript
import { makeCSSTheme, themeFromImage } from '@poupe/theme-builder'
```

Functions for generating and transforming themes:

- Create themes from color palettes
- Generate themes from images
- Convert themes to CSS variables
- Create dark/light mode variations

## Submodules

This package offers several specialized submodules:

- `@poupe/theme-builder/core` - Core color manipulation functions
- `@poupe/theme-builder/utils` - Utility functions for working with tokens
- `@poupe/theme-builder/server` - Server-side utilities for theme generation

## Integration with Poupe Ecosystem

- [@poupe/css](../@poupe-css) - CSS utility library
- [@poupe/tailwindcss](../@poupe-tailwindcss) - TailwindCSS integration
- [@poupe/vue](../@poupe-vue) - Vue components library
- [@poupe/nuxt](../@poupe-nuxt) - Nuxt integration

## Requirements

- Node.js >=20.19.1
- TypeScript-friendly environment

## License

MIT licensed.
