# @poupe/tailwindcss

[![jsDocs.io](https://img.shields.io/badge/jsDocs.io-reference-blue)](https://www.jsdocs.io/package/@poupe/tailwindcss)
[![npm version](https://img.shields.io/npm/v/@poupe/tailwindcss.svg)](https://www.npmjs.com/package/@poupe/tailwindcss)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../../LICENCE.txt)

A TypeScript plugin for TailwindCSS v4 that integrates with the Poupe UI
framework, providing theme customization and utility functions.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Basic Configuration](#basic-configuration)
  - [Using Flat Plugin Bridge](#using-flat-plugin-bridge)
  - [CSS Import with @plugin](#css-import-with-plugin)
  - [Creating Themes Programmatically](#creating-themes-programmatically)
- [Color System](#color-system)
- [Surface Components](#surface-components)
- [Dark Mode](#dark-mode)
- [Configuration Options](#configuration-options)
- [API Reference](#api-reference)
- [Integration with Poupe Ecosystem](#integration-with-poupe-ecosystem)
- [Requirements](#requirements)
- [License](#license)

## Features

- 🔄 Seamless integration between Poupe themes and TailwindCSS
- 🎨 Automatic generation of TailwindCSS theme from Poupe tokens
- 🌓 Dark mode support built-in
- 🛠️ Utility functions for consistent styling
- 📦 Lightweight, tree-shakable API
- 🧩 Component-friendly design tokens

## Installation

```bash
npm install -D @poupe/tailwindcss tailwindcss@4
```

```bash
yarn add -D @poupe/tailwindcss tailwindcss@4
```

```bash
pnpm add -D @poupe/tailwindcss tailwindcss@4
```

## Usage

### Basic Configuration

In your `tailwind.config.js` or `tailwind.config.ts` file:

```typescript
import { themePlugin as poupePlugin } from '@poupe/tailwindcss'

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

### Using Flat Plugin Bridge

The flat plugin bridge provides a more concise configuration API:

```typescript
import flatPlugin from '@poupe/tailwindcss'

export default {
  content: [
    '**/*.{vue,ts}',
  ],
  plugins: [
    flatPlugin({
      // Customization options
      themePrefix: 'md-',
      surfacePrefix: 'surface-',

      // Define color palette
      primary: '#6750A4',
      secondary: '#958DA5',
      error: '#B3261E',

      // Custom shade configuration
      neutral: ['#E4E1F6', true, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
    }),
  ],
}
```

### CSS Import with @plugin

For direct CSS integration, use the `@plugin` directive in your CSS file:

```css
@import 'tailwindcss';

@plugin '@poupe/tailwindcss' {
  primary: #6750A4;
  secondary: #958DA5;
}
```

This method allows you to specify theme colors directly in your CSS without
needing to configure the plugin in your Tailwind config.

### Creating Themes Programmatically

For more advanced use cases, you can create themes programmatically:

```typescript
import { ThemeOptions, makeThemeFromPartialOptions, formatTheme } from '@poupe/tailwindcss'
import fs from 'fs'

// Define your theme options
const themeOptions: Partial<ThemeOptions> = {
  themePrefix: 'md-',
  colors: {
    primary: { value: '#6750A4' },
    secondary: { value: '#958DA5' },
    tertiary: { value: '#B58392' },
    error: { value: '#B3261E' },
    surface: { value: '#FEF7FF' },
  },
  shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
}

// Create a theme from options
const theme = makeThemeFromPartialOptions(themeOptions)

// Generate CSS output
const cssRules = formatTheme(theme, 'class', '  ')

// Write to file
fs.writeFileSync('theme.css', cssRules.join('\n'))
```

## Color System

The plugin integrates with `@poupe/theme-builder` to generate Material Design 3
compliant color systems with the following key features:

- **Semantic Colors**: Primary, secondary, tertiary, error, surface, etc.
- **Color Shades**: Each color generates shade variants (50-900)
- **Dark Mode**: Automatic dark theme generation with proper contrast
- **Color Harmonization**: Optional harmonization of colors with the primary color
- **CSS Variables**: Colors are accessible via CSS variables

```css
/* Generated CSS Variables Example */
:root {
  --md-primary: 103, 80, 164; /* RGB values */
  --md-primary-50: 244, 242, 250;
  --md-primary-100: 234, 228, 242;
  --md-primary-500: 103, 80, 164;
  --md-primary-900: 30, 27, 38;
}
```

### Color Customization

Colors can be customized using several formats:

```typescript
flatPlugin({
  // Basic color definition
  primary: '#6750A4',

  // Disable harmonization with primary
  secondary: ['#958DA5', false],

  // Custom shades
  neutral: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],

  // Custom color with harmonization and custom shades
  tertiary: ['#B58392', true, 50, 100, 500, 900],
})
```



## Surface Components

Pre-configured component utilities that combine background colors with text colors:

```html
<!-- Primary surface with appropriate text color -->
<div class="surface-primary">Primary Surface</div>

<!-- Secondary surfaces -->
<div class="surface-secondary">Secondary Surface</div>
<div class="surface-secondary-container">Secondary Container</div>

<!-- Various surface containers with different elevations -->
<div class="surface-container-lowest">Lowest Container</div>
<div class="surface-container-low">Low Container</div>
<div class="surface-container">Standard Container</div>
<div class="surface-container-high">High Container</div>
<div class="surface-container-highest">Highest Container</div>
```

These utilities apply both background color (`bg-*`) and text color (`text-*`)
with proper contrast based on Material Design guidelines.

## Dark Mode

The plugin automatically generates dark mode variants for all colors. By default,
it uses Tailwind's class strategy (`.dark` class):

```html
<html class="dark">
  <!-- Dark mode is applied -->
</html>
```

This behavior can be customized using the `darkMode` configuration option in your
Tailwind config, or through the plugin's options:

```typescript
poupePlugin({
  // Class strategy (default)
  darkMode: 'class',

  // Media query strategy
  // darkMode: 'media',

  // Custom dark class selector
  // darkSuffix: '-dark',

  // Custom light class selector
  // lightSuffix: '-light',
})
```

## Configuration Options

### ThemeOptions

```typescript
interface ThemeOptions {
  // Prefix for CSS variables (default: 'md-')
  themePrefix?: string;

  // Prefix for surface components (default: 'surface-')
  surfacePrefix?: string | false;

  // When true, only generates variable references without color values
  omitTheme?: boolean;

  // Suffix for dark mode selectors
  darkSuffix?: string;

  // Suffix for light mode selectors
  lightSuffix?: string;

  // Control debugging output
  debug?: boolean;

  // Material theme scheme
  scheme?: SchemeOptions;

  // Contrast level for accessibility
  contrastLevel?: number;

  // Disable print mode
  disablePrintMode?: boolean;

  // Shade values to generate (false to disable)
  shades?: number[] | false;

  // Color definitions
  colors: {
    [key: string]: ThemeColorOptions;
  };
}
```

### FlatOptions

The flat plugin API provides a more concise way to specify options:

```typescript
interface FlatOptions {
  // Same as ThemeOptions.themePrefix
  themePrefix?: string;

  // Same as ThemeOptions.surfacePrefix
  surfacePrefix?: string | false;

  // Same as ThemeOptions.omitTheme
  omitTheme?: boolean;

  // Same as ThemeOptions.darkSuffix
  darkSuffix?: string;

  // Same as ThemeOptions.lightSuffix
  lightSuffix?: string;

  // Same as ThemeOptions.shades
  shades?: number[] | false;

  // Enable debug output
  debug?: boolean;

  // Color definitions with simplified syntax
  [color: string]: string | boolean | number[] | [boolean, ...number[]] |
                  [string, boolean] | [string, boolean, ...number[]] |
                  [string, ...number[]];
}
```

## API Reference

### Main Exports

```typescript
// Default export - flat plugin API
import flatPlugin from '@poupe/tailwindcss'

// Named exports
import {
  // Theme plugin with options
  themePlugin,

  // Function to create a theme from options
  makeThemeFromPartialOptions,

  // Format a theme to CSS
  formatTheme,

  // Color formatter utilities
  colorFormatter,
} from '@poupe/tailwindcss'
```

### Theme Module

```typescript
import {
  // Shade utilities
  makeShades,
  defaultShades,

  // Theme utilities
  makeTheme,
} from '@poupe/tailwindcss/theme'
```

### Color Utilities

```typescript
import { colorFormatter } from '@poupe/tailwindcss/utils/color'

// Format colors as RGB (default)
const rgbFormatter = colorFormatter('rgb');

// Format colors as HSL
const hslFormatter = colorFormatter('hsl');

// Format colors as hex
const hexFormatter = colorFormatter('hex');

// Format colors as space-separated RGB values
const numbersFormatter = colorFormatter('numbers');
```

## Integration with Poupe Ecosystem

- [@poupe/css](../@poupe-css) - CSS utility library with core functionality
- [@poupe/theme-builder](../@poupe-theme-builder) - Material Design 3 token generation
- [@poupe/vue](../@poupe-vue) - Vue components library built on this theme system
- [@poupe/nuxt](../@poupe-nuxt) - Nuxt integration for easy setup

This package serves as the bridge between the Poupe theme system and TailwindCSS,
allowing you to use Material Design 3 tokens with Tailwind's utility-first approach.

## Requirements

- Node.js >=20
- TailwindCSS ^4.1
- @poupe/theme-builder ^0.8

## License

MIT licensed.
