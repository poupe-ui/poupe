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
  - [Advanced Theme Integration](#advanced-theme-integration)
- [API Reference](#api-reference)
  - [Main Plugin](#main-plugin)
  - [Theme Utilities](#theme-utilities)
  - [CSS Generation](#css-generation)
  - [Color Utilities](#color-utilities)
  - [Helper Functions](#helper-functions)
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
npm install -D @poupe/tailwindcss @poupe/theme-builder
```

```bash
yarn add -D @poupe/tailwindcss @poupe/theme-builder
```

```bash
pnpm add -D @poupe/tailwindcss @poupe/theme-builder
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

### Advanced Theme Integration

For more advanced usage, you can create and customize themes separately:

```typescript
import { createTailwindTheme } from '@poupe/tailwindcss/theme'
import { createTheme } from '@poupe/theme-builder'

// Create your Poupe theme
const myTheme = createTheme({
  colors: {
    primary: '#1976d2',
    secondary: '#9c27b0',
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

## API Reference

The library exports several modules for different use cases:

### Main Plugin

```typescript
import { themePlugin } from '@poupe/tailwindcss'
```

The main plugin that integrates Poupe theme tokens with TailwindCSS. It
automatically generates color variants, shadows, typography scales, and component
utilities based on your theme configuration.

### Theme Utilities

```typescript
import { createTheme } from '@poupe/tailwindcss/theme'
```

Utilities for converting Poupe themes to TailwindCSS compatible themes,
including:

- Color shade generation
- Typography scaling
- Spacing and sizing adaptations
- Component-specific tokens

### CSS Generation

```typescript
import { formatTheme } from '@poupe/tailwindcss/theme/css'
```

Functions to generate CSS rules from your Poupe theme:

- **formatTheme**: Formats a theme configuration into a series of CSS rules and utilities
  ```typescript
  function formatTheme(
    theme: Theme,                            // The theme configuration object
    darkMode: DarkModeStrategy = 'class',    // Strategy for handling dark mode
    indent: string = '  ',                   // Indentation string for formatting
    stringify?: (value: Hct) => string,      // Optional function to convert Hct color values to string format
  ): string[]
  ```
  
- **themeColors**: Generates CSS custom property rules for theme colors
  ```typescript
  function themeColors(
    colors: Record<string, ThemeColorConfig>,
    extendColors: boolean = false,
    persistentColors: Record<string, string> = defaultPersistentColors,
  ): CSSRules[]
  ```

### Color Utilities

```typescript
import { colorFormatter } from '@poupe/tailwindcss/utils/color'
```

Utilities for converting and formatting HCT colors:

- **colorFormatter**: Creates a function that converts HCT colors to various string formats
  ```typescript
  function colorFormatter(
    v: ColorFormat = 'rgb'                   // The color format to convert to
  ): (c: Hct) => string
  ```

The supported color formats (`ColorFormat`) are:
- `'numbers'` - Returns space-separated RGB values like `"255 128 0"`
- `'rgb'` - Returns RGB format like `"rgb(255, 128, 0)"` (default)
- `'hsl'` - Returns HSL format like `"hsl(30, 100%, 50%)"`
- `'hex'` - Returns HEX format like `"#FF8000"`
- A custom formatting function that takes an Hct color and returns a string

#### Using colorFormatter with formatTheme

The `colorFormatter` function works seamlessly with `formatTheme` to control how colors appear in the generated CSS:

```typescript
import { formatTheme } from '@poupe/tailwindcss/theme/css'
import { colorFormatter } from '@poupe/tailwindcss/utils/color'

// Format theme with colors in hex format
const cssRules = formatTheme(myTheme, 'class', '  ', colorFormatter('hex'));

// Format theme with colors in HSL format
const cssRules = formatTheme(myTheme, 'class', '  ', colorFormatter('hsl'));

// Use the default RGB format
const cssRules = formatTheme(myTheme);
```

This allows you to customize the color format in your CSS output based on specific requirements:
- Use hex format for more compact CSS
- Use HSL for better human readability and easier tweaking
- Use RGB format (default) for broad compatibility
- Create custom formatters for specialized needs

### Helper Functions

```typescript
import { getShades, validShade } from '@poupe/tailwindcss/theme'
```

Helper functions for:

- Working with color shades
- Validating theme options
- Type checking utility functions
- Debugging and logging tools

## Integration with Poupe Ecosystem

- [@poupe/css](../@poupe-css) - CSS utility library
- [@poupe/theme-builder](../@poupe-theme-builder) - Design tokens generation
- [@poupe/vue](../@poupe-vue) - Vue components library
- [@poupe/nuxt](../@poupe-nuxt) - Nuxt integration

## Requirements

- Node.js >=20
- TailwindCSS ^4.1
- @poupe/theme-builder ^0.8

## License

MIT licensed.
