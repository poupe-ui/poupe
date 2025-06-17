# @poupe/theme-builder

[![jsDocs.io][jsdocs-badge]][jsdocs-url]
[![npm version][npm-badge]][npm-url]
[![License: MIT][license-badge]][license-url]

Design token management and theme generation system for Material Design 2025
themes with automatic dark mode, CSS variables, and image-based color
extraction.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Basic Theme Creation](#basic-theme-creation)
  - [CSS Theme Generation](#css-theme-generation)
  - [Theme from Image](#theme-from-image)
  - [Color Manipulation](#color-manipulation)
- [API Reference](#api-reference)
  - [Main Exports](#main-exports)
  - [Core Utilities](#core-utilities)
  - [Server Utilities](#server-utilities)
- [Color System](#color-system)
- [CSS Variables](#css-variables)
- [Dark Mode](#dark-mode)
- [Integration with Poupe Ecosystem](#integration-with-poupe-ecosystem)
- [Requirements](#requirements)
- [License](#license)

## Features

- 🎨 Material Design 2025 color system with automatic dark themes
- 🌓 Built-in dark mode support with CSS custom properties
- 🖼️ Generate color palettes from images using Material algorithms
- 🔧 Advanced color manipulation utilities (HCT, RGB, HSL, ARGB)
- 📦 Lightweight, tree-shakable API with TypeScript support
- 🧩 CSS variables generation for external customization
- 🎭 Theme scheme variants (vibrant, expressive, content, etc.)
- 🛠️ Server-side utilities for build-time theme generation

## Installation

```bash
# npm
npm install -D @poupe/theme-builder

# yarn
yarn add -D @poupe/theme-builder

# pnpm
pnpm add -D @poupe/theme-builder
```

## Usage

### Basic Theme Creation

```typescript
import { makeTheme } from '@poupe/theme-builder'

// Create Material Design 2025 theme with color roles
const { dark, light } = makeTheme({
  primary: '#1976d2',
  secondary: '#9c27b0',
  tertiary: '#ff4081',
}, 'vibrant', 0.0)

// Access color roles
console.log(light.primary.value)    // Primary color in light theme
console.log(dark.onPrimary.value)   // Text on primary in dark theme
```

### CSS Theme Generation

```typescript
import { makeCSSTheme } from '@poupe/theme-builder'

// Generate CSS variables for dark/light themes
const cssTheme = makeCSSTheme({
  primary: '#6750A4',
  secondary: '#958DA5',
  error: '#B3261E',
}, {
  scheme: 'content',
  contrastLevel: 0.5,
  prefix: 'md-',
  darkMode: ['.dark', 'media'],    // Multiple selectors + aliases
  lightMode: '.light',
})

// Built-in responsive aliases
makeCSSTheme(colors, {
  darkMode: ['dark', 'mobile'],    // Uses media queries
  lightMode: ['light', 'desktop']  // Now supports arrays too
})

// Advanced selector configuration
const advancedTheme = makeCSSTheme(colors, {
  darkMode: ['mobile', '.dark-mode'],    // Mobile + custom class
  lightMode: ['desktop', '.light-mode'],  // Desktop + custom class
})

// Use generated CSS variables
console.log(cssTheme.vars.primary)   // '--md-primary'
console.log(cssTheme.styles)         // CSS rule objects
```

### Theme from Image

```typescript
import { fromImageElement } from '@poupe/theme-builder'

// Extract color from image element
async function createImageTheme(imageElement: HTMLImageElement) {
  const seedColor = await fromImageElement(imageElement)

  const { dark, light } = makeTheme({
    primary: seedColor.toHex(),
  }, 'expressive')

  return { dark, light }
}
```

### Color Manipulation

```typescript
import {
  hct, colord, hexString, makeTonalPalette
} from '@poupe/theme-builder/core'

// HCT color space (Hue, Chroma, Tone)
const color = hct('#1976d2')
const lighter = color.withTone(80)   // Lighter variant
const muted = color.withChroma(30)   // Lower saturation

// Advanced color utilities
const c = colord('#1976d2')
console.log(c.toHsl())               // HSL representation
console.log(c.lighten(0.2).toHex())  // Lightened color

// Format colors
console.log(hexString(lighter))      // Convert to hex string

// Create tonal palette with full tone range (0-100)
const palette = makeTonalPalette('#1976d2')
console.log(palette.tone(50))        // Medium tone
console.log(palette.tone(90))        // Light tone
console.log(palette.tone(10))        // Dark tone

// Harmonize colors to create cohesive palettes
const primary = hct('#1976d2')
const harmonized = makeTonalPalette('#9c27b0', primary)
```

## API Reference

### Main Exports

```typescript
import {
  // Theme generation
  makeTheme,
  makeCSSTheme,

  // CSS utilities
  assembleCSSColors,
  defaultCSSThemeOptions,

  // Image extraction
  fromImageElement,

  // Color utilities (re-exported from core)
  hct,
  colord,
  hexString,
  rgbaString,
} from '@poupe/theme-builder'
```

### Core Utilities

Color manipulation and formatting utilities:

```typescript
import {
  // Color types and creation
  type Hct,
  type HexColor,
  hct,
  colord,

  // Color formatting
  hexString,
  rgbaString,

  // Color conversion
  argb,
  rgb,

  // CSS utilities (re-exported)
  formatCSSRules,
} from '@poupe/theme-builder/core'
```

### Server Utilities

Server-side color processing, validation, and CSS response utilities:

```typescript
import {
  // Parameter processing
  getColorParam,
  getThemeSchemeParam,

  // CSS formatting utilities
  stringifyCSSRulesArray,
  stringifyCSSRulesArrayStream,
  stringifyCSSRulesArrayAsStream,
  stringifyCSSRulesArrayAsResponse,
  stringifyCSSRulesArrayAsStreamingResponse,

  // Color types (re-exported)
  type HexColor,
  hct,
  colord,
} from '@poupe/theme-builder/server'

// Convert to CSS string (no trailing newline)
const cssString = stringifyCSSRulesArray([
  { '.theme': { '--primary': '#6750A4' } }
])

// Convert with camelCase to kebab-case normalization
const normalizedCSS = stringifyCSSRulesArray([
  { fontSize: '16px', backgroundColor: 'blue' }
], { normalizeProperties: true })
// Result: 'font-size: 16px;\nbackground-color: blue;'

// Create ReadableStream (perfect for Cloudflare Workers)
const stream = stringifyCSSRulesArrayAsStream([
  { '.theme': { '--primary': '#6750A4' } }
])
const response = new Response(stream, {
  headers: { 'Content-Type': 'text/css' }
})

// Create Response object with headers
const response = stringifyCSSRulesArrayAsResponse([
  { '.theme': { '--primary': '#6750A4' } }
])

// Create streaming Response for large CSS files
const streamingResponse = stringifyCSSRulesArrayAsStreamingResponse([
  // Large array of CSS rules
])
```

## Color System

Material Design 2025 color roles and theming:

- **Primary**: Main brand color and variants (primary, primaryDim,
  onPrimary, primaryContainer, onPrimaryContainer)
- **Secondary**: Supporting colors (secondary, secondaryDim,
  onSecondary, secondaryContainer, onSecondaryContainer)
- **Tertiary**: Accent colors (tertiary, tertiaryDim, onTertiary,
  tertiaryContainer, onTertiaryContainer)
- **Error**: Error states (error, errorDim, onError, errorContainer,
  onErrorContainer)
- **Neutral**: Surface and outline colors (surface, onSurface,
  outline, etc.)

```typescript
const { dark, light } = makeTheme({
  primary: '#6750A4',
  secondary: '#958DA5',
  tertiary: '#B58392',
  neutral: '#938F94',
  neutralVariant: '#948F94',
  error: '#B3261E',
}, 'content', 0.0)

// Access all color roles
console.log(light.primaryContainer.value)  // Primary container color
console.log(dark.onSurfaceVariant.value)   // Text on surface variant
```

## CSS Variables

Automatic CSS custom property generation:

```typescript
const cssTheme = makeCSSTheme({
  primary: '#6750A4',
}, {
  prefix: 'md-',         // Variable prefix
  darkMode: '.dark',     // Dark mode selector
  lightMode: '.light',   // Light mode selector (optional)
  darkSuffix: '-dark',   // Dark variable suffix
  lightSuffix: '-light', // Light variable suffix
})

// Generated variables
cssTheme.vars.primary            // '--md-primary'
cssTheme.vars.onPrimary          // '--md-on-primary'
cssTheme.styles                  // CSS rule objects
```

## Dark Mode

Built-in dark mode support with flexible selectors and aliases:

```typescript
// Class-based dark mode (default)
makeCSSTheme(colors, { darkMode: '.dark' })

// Media query dark mode using built-in alias
makeCSSTheme(colors, { darkMode: 'media' })

// Multiple selectors
makeCSSTheme(colors, { darkMode: ['.dark', '.theme-dark'] })

// Built-in responsive aliases
makeCSSTheme(colors, {
  darkMode: ['dark', 'mobile'],  // Uses media queries
  lightMode: 'light'
})

// Custom selectors
makeCSSTheme(colors, {
  darkMode: '[data-theme="dark"]',
  lightMode: '[data-theme="light"]'
})

// Disable dark mode
makeCSSTheme(colors, { darkMode: false })
```

### Built-in Selector Aliases

The theme builder includes convenient aliases for common media queries:

- `'media'` or `'dark'` → `'@media (prefers-color-scheme: dark)'`
- `'light'` → `'@media (prefers-color-scheme: light)'`
- `'mobile'` → `'@media (max-width: 768px)'`
- `'tablet'` → `'@media (min-width: 769px) and (max-width: 1024px)'`
- `'desktop'` → `'@media (min-width: 1025px)'`

```typescript
// Using aliases for responsive theming
const cssTheme = makeCSSTheme(colors, {
  darkMode: ['dark', 'tablet'],    // Dark mode + tablet screens
  lightMode: ['light', 'desktop'], // Light mode + desktop screens
})
```

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

<!-- Badge references -->
[jsdocs-badge]: https://img.shields.io/badge/jsDocs.io-reference-blue
[jsdocs-url]: https://www.jsdocs.io/package/@poupe/theme-builder
[npm-badge]: https://img.shields.io/npm/v/@poupe/theme-builder.svg
[npm-url]: https://www.npmjs.com/package/@poupe/theme-builder
[license-badge]: https://img.shields.io/badge/License-MIT-blue.svg
[license-url]: ../../LICENCE.txt
