# @poupe/tailwindcss

[![jsDocs.io](https://img.shields.io/badge/jsDocs.io-reference-blue)](https://www.jsdocs.io/package/@poupe/tailwindcss)
[![npm version](https://img.shields.io/npm/v/@poupe/tailwindcss.svg)](https://www.npmjs.com/package/@poupe/tailwindcss)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../../LICENCE.txt)

TailwindCSS v4 plugin for Material Design 3 themes with automatic
dark mode, elevation shadows, scrim overlays, and component utilities.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Basic Configuration](#basic-configuration)
  - [Flat Plugin API](#flat-plugin-api)
  - [CSS @plugin](#css-plugin)
  - [Programmatic Theme Generation](#programmatic-theme-generation)
- [Color System](#color-system)
- [Shadow System](#shadow-system)
- [Scrim Utilities](#scrim-utilities)
- [Surface Components](#surface-components)
- [Dark Mode](#dark-mode)
- [Configuration Options](#configuration-options)
- [API Reference](#api-reference)
- [Ecosystem](#ecosystem)
- [Requirements](#requirements)
- [License](#license)

## Features

- 🎨 Material Design 3 color system with automatic dark themes
- 🌓 Built-in dark mode support (class or media query)
- ✨ Elevation shadows with z-level utilities (z1-z5)
- 🎭 Scrim overlays with Material Design z-index layering
- 🛠️ Surface component utilities with proper contrast
- 📦 Lightweight, tree-shakable API
- 🧩 CSS variables for external customization

## Installation

```bash
# npm
npm install -D @poupe/tailwindcss tailwindcss@4

# yarn
yarn add -D @poupe/tailwindcss tailwindcss@4

# pnpm
pnpm add -D @poupe/tailwindcss tailwindcss@4
```

## Usage

### Basic Configuration

`tailwind.config.ts`:

```typescript
import { themePlugin } from '@poupe/tailwindcss'

export default {
  plugins: [
    themePlugin({
      colors: {
        primary: '#1976d2',
        secondary: '#9c27b0',
      }
    }),
  ],
}
```

### Flat Plugin API

More concise configuration:

```typescript
import flatPlugin from '@poupe/tailwindcss'

export default {
  plugins: [
    flatPlugin({
      primary: '#6750A4',
      secondary: '#958DA5',
      error: '#B3261E',

      // Custom shades: [color, harmonize, ...shades]
      neutral: ['#E4E1F6', true, 50, 100, 200, 300, 400, 500,
                600, 700, 800, 900]
    }),
  ],
}
```

### CSS @plugin

Direct CSS integration:

```css
@import 'tailwindcss';

@plugin '@poupe/tailwindcss' {
  primary: #6750A4;
  secondary: #958DA5;
}
```

### CSS Assets

The package provides two pre-built CSS files that extend TailwindCSS v4:

#### `style.css`

Minimal theme-agnostic utilities and components:

- Surface component utilities
- Shadow system utilities (z1-z5)
- Scrim overlay utilities
- Material Design z-index system
- No color values - bring your own theme

Usage with TailwindCSS:

```css
/* Import together with TailwindCSS base */
@import 'tailwindcss';
@import '@poupe/tailwindcss';  /* or '@poupe/tailwindcss/style.css' */
```

#### `default.css`

Complete example with Material Design 3 theme:

- Full set of Material Design 3 CSS custom properties
- Default color values for all theme colors
- Complete shadow and elevation system
- All surface and scrim utilities
- Fixed color surface combinations
- Ready-to-use example theme

Usage:

```css
/* Import together with TailwindCSS base */
@import 'tailwindcss';
@import '@poupe/tailwindcss/default.css';
/* Override any variables as needed */
```

**Note**: These CSS files contain TailwindCSS v4 directives (@theme,
@utility) and must be used together with TailwindCSS base styles.

Shadow utilities:

```html
<div class="shadow-z1">Level 1</div>
<div class="shadow-z2">Level 2 (default)</div>
<div class="shadow-z3">Level 3</div>
<div class="shadow-z4">Level 4</div>
<div class="shadow-z5">Level 5</div>
<div class="inset-shadow">Inset Shadow</div>
```

## Scrim Utilities

Modal backdrop overlays with Material Design z-index layering:

```html
<!-- Semantic z-index levels -->
<div class="scrim-modal">Modal backdrop</div>
<div class="scrim-drawer">Drawer backdrop</div>
<div class="scrim-elevated">High priority overlay</div>

<!-- With opacity modifiers -->
<div class="scrim-modal/50">Modal with 50% opacity</div>
<div class="scrim-drawer/75">Drawer with 75% opacity</div>
<div class="scrim-content/25">Content overlay with 25% opacity</div>

<!-- Arbitrary z-index values with opacity -->
<div class="scrim-[1250]">Custom z-index</div>
<div class="scrim-[1250]/40">Custom z-index with 40% opacity</div>
<div class="scrim-[var(--custom-z)]/60">CSS variable with 60% opacity</div>
```

Material Design z-index scale:

```css
--md-z-navigation-persistent: 1000;  /* Mobile stepper, bottom nav */
--md-z-navigation-floating: 1050;    /* FAB, speed dial */
--md-z-navigation-top: 1100;         /* App bar, top navigation */
--md-z-drawer: 1200;                 /* Navigation drawer */
--md-z-modal: 1300;                  /* Modal dialogs */
--md-z-snackbar: 1400;               /* Snackbars, toasts */
--md-z-tooltip: 1500;                /* Tooltips */
```

Scrim variants (simplified naming):

- `scrim-base` (950) - Basic overlay, below navigation
- `scrim-content` (975) - Content overlay
- `scrim-drawer` (1250) - Drawer overlays
- `scrim-modal` (1275) - Modal preparation
- `scrim-elevated` (1350) - High-priority overlays
- `scrim-system` (1450) - System-level scrims

### Opacity Support

All scrim utilities support Tailwind's opacity modifier syntax:

- Default opacity: 32% (when no modifier is used)
- Custom opacity: `scrim-modal/50`, `scrim-drawer/75`, etc.
- Arbitrary z-index with opacity: `scrim-[100]/25`

**Technical Implementation:**

- Uses `--md-scrim-rgb` variable (following the same pattern as
  `--md-shadow-rgb`)
- TailwindCSS v4 `--modifier([percentage])` for capturing modifier values
- CSS custom properties enable dynamic opacity:
  `var(--md-scrim-opacity, 32%)`
- Automatic theme switching for scrim colors in dark/light modes
- Bridge pattern converts v4 syntax to v3 matchUtilities for broad
  compatibility

## Shape System

Material Design 3 shape utilities with extensible architecture:

### Shape Scale

```html
<!-- Shape scale utilities -->
<div class="shape-none">No rounding (0px)</div>
<div class="shape-extra-small">Extra small (4px)</div>
<div class="shape-small">Small (8px)</div>
<div class="shape-medium">Medium (12px)</div>
<div class="shape-large">Large (16px)</div>
<div class="shape-extra-large">Extra large (28px)</div>
<div class="shape-full">Full rounding (999px)</div>
```

### Shape Families

```html
<!-- Default rounded corners -->
<div class="shape-medium shape-rounded">Rounded corners</div>

<!-- iOS-style squircle (smooth corners) -->
<div class="shape-medium shape-squircle">Squircle shape</div>
```

### CSS Variables

All shapes use CSS variables for customization:

```css
:root {
  --md-shape-none: 0px;
  --md-shape-extra-small: 4px;
  --md-shape-small: 8px;
  --md-shape-medium: 12px;
  --md-shape-large: 16px;
  --md-shape-extra-large: 28px;
  --md-shape-full: 999px;
}
```

### Component-Specific Shapes

Material Design 3 component shape tokens with sensible defaults:

```html
<!-- Component shapes with default values -->
<button class="shape-button">Pill button (full rounding)</button>
<div class="shape-card">Card with medium rounding</div>
<button class="shape-fab">FAB with large rounding</button>
<input class="shape-text-field" placeholder="Text field">
<div class="shape-dialog">Dialog with extra-large rounding</div>
<span class="shape-chip">Chip with small rounding</span>

<!-- Squircle variants for smooth corners -->
<button class="shape-squircle-button">Smooth pill button</button>
<div class="shape-squircle-card">Smooth card</div>
```

Component shapes cascade through CSS variables:

- `--md-shape-button` → `--md-shape-full` → `999px`
- `--md-shape-card` → `--md-shape-medium` → `12px`
- `--md-shape-fab` → `--md-shape-large` → `16px`
- `--md-shape-text-field` → `--md-shape-extra-small` → `4px`
- `--md-shape-dialog` → `--md-shape-extra-large` → `28px`
- `--md-shape-chip` → `--md-shape-small` → `8px`

### Squircle Implementation

- Uses SVG masks for true iOS-style smooth corners
- Graceful fallback to border-radius for unsupported browsers
- Configurable corner smoothing via `--md-shape-corner-smooth`
- Future-ready for additional shape families (cut corners, diamonds, etc.)

### Programmatic Theme Generation

Generate CSS themes programmatically:

```typescript
import { makeThemeFromPartialOptions, formatTheme } from
  '@poupe/tailwindcss'

const theme = makeThemeFromPartialOptions({
  colors: {
    primary: { value: '#6750A4' },
    secondary: { value: '#958DA5' },
  },
})

const css = formatTheme(theme, 'class', '  ')
console.log(css.join('\n'))
```

## Color System

Comprehensive color palette with Tailwind CSS and CSS named colors:

- **Tailwind Colors**: Modern palette (slate, gray/grey, zinc, neutral,
  stone, red, orange, amber, yellow, lime, green, emerald, teal, cyan,
  sky, blue, indigo, violet, purple, fuchsia, pink, rose)
- **CSS Named Colors**: Complete CSS specification fallback (149 colors)
- **Color Priority**: Tailwind colors take precedence over CSS named
  colors
- **Material Design 3**: Semantic colors with automatic dark themes
- **Color Shades**: Automatic shade variants (50-900)
- **CSS Variables**: All colors accessible as `--md-*`

```css
:root {
  --md-primary: 103, 80, 164;
  --md-primary-50: 244, 242, 250;
  --md-primary-500: 103, 80, 164;
  --md-primary-900: 30, 27, 38;
}
```

### Color Resolution

Colors are resolved with priority order:

```typescript
import { withKnownColor } from '@poupe/tailwindcss'

// Tailwind colors (highest priority)
withKnownColor('blue')     // '#3b82f6' (Tailwind blue)
withKnownColor('red')      // '#ef4444' (Tailwind red)
withKnownColor('gray')     // '#6b7280' (Tailwind gray)
withKnownColor('grey')     // '#6b7280' (British spelling alias)

// CSS named colors (fallback)
withKnownColor('crimson')  // '#dc143c' (CSS named color)
withKnownColor('navy')     // '#000080' (CSS named color)

// Unknown colors (unchanged)
withKnownColor('#custom')  // '#custom' (unchanged)
```

### Color Customization

Various color definition formats:

```typescript
flatPlugin({
  primary: '#6750A4',                      // Basic color
  secondary: ['#958DA5', false],           // No harmonization
  neutral: [50, 100, 200, 300, 400, 500], // Custom shades
  tertiary: ['#B58392', true, 50, 500],    // Harmonize + shades
})
```

## Shadow System

Material Design 3 elevation system with 5 z-levels:

- **z1**: Subtle elevation
- **z2/DEFAULT**: Standard floating elements
- **z3**: Prominent UI elements
- **z4**: Important modal windows
- **z5**: Critical/focused elements

Shadow utilities use `--md-shadow-rgb` variable for customization, while
scrim utilities use `--md-scrim-rgb`:

```css
--shadow-z1: 0 1px 4px 0 rgba(var(--md-shadow-rgb), 0.37);
--shadow-z2: 0 2px 2px 0 rgba(var(--md-shadow-rgb), 0.20),
             0 6px 10px 0 rgba(var(--md-shadow-rgb), 0.30);
```

```html
<div class="shadow-z1">Level 1</div>
<div class="drop-shadow-z3">Drop shadow</div>
<div class="inset-shadow">Inset effect</div>
```

## Surface Components

Component utilities with background + text color and proper contrast:

```html
<div class="surface-primary">Primary Surface</div>
<div class="surface-secondary">Secondary Surface</div>
<div class="surface-secondary-container">Secondary Container</div>

<div class="surface-container-lowest">Lowest</div>
<div class="surface-container-low">Low</div>
<div class="surface-container">Standard</div>
<div class="surface-container-high">High</div>
<div class="surface-container-highest">Highest</div>

<!-- Fixed color combinations -->
<div class="surface-primary-fixed">Fixed background with on-fixed text</div>
<div class="surface-primary-fixed-variant">
  Fixed background with variant text
</div>
<div class="surface-primary-fixed-dim">
  Dim fixed background with on-fixed text
</div>
<div class="surface-primary-fixed-dim-variant">
  Dim fixed with variant text
</div>
```

### Interactive Surface Components

Interactive surface utilities combine surface styling with Material Design 3
state layer support. They automatically include hover, focus, and pressed
states with proper transition timing:

```html
<!-- Interactive surfaces with built-in state layers -->
<button class="interactive-surface-primary">Primary Interactive</button>
<button class="interactive-surface-secondary">Secondary Interactive</button>
<button class="interactive-surface-tertiary">Tertiary Interactive</button>

<!-- Container variants with interaction states -->
<div class="interactive-surface-container-lowest">Interactive Lowest</div>
<div class="interactive-surface-container">Interactive Standard</div>
<div class="interactive-surface-container-highest">Interactive Highest</div>

<!-- Special interactive surfaces -->
<button class="interactive-surface-inverse-primary">Inverse Primary</button>
<button class="interactive-surface-error">Error Interactive</button>

<!-- Fixed color interactive surfaces -->
<button class="interactive-surface-primary-fixed">Fixed Interactive</button>
```

Interactive surfaces include:

- **Automatic state layers**: hover, focus, and pressed states
- **Smooth transitions**: Uses `--md-state-transition-duration` CSS variable
- **Proper contrast**: Maintains accessible text/background combinations
- **All surface variants**: Available for every standard surface utility

## Animation Utilities

Material Design animation effects:

### Ripple Effect

The `.ripple-effect` utility class provides Material Design ripple animations:

```html
<button class="relative overflow-hidden">
  Click me
  <span class="ripple-effect"></span>
</button>
```

Features:

- **Circular animation**: Expands from center with 50% border-radius
- **Configurable duration**: Use `--md-ripple-duration` (default: 600ms)
- **Configurable opacity**: Use `--md-ripple-opacity` (default: 0.12)
- **Color matching**: Uses `currentColor` to match parent text color
- **Performance**: Optimized with `will-change: transform, opacity`

```css
/* Customize ripple properties */
.custom-ripple {
  --md-ripple-duration: 800ms;
  --md-ripple-opacity: 0.2;
}
```

## Dark Mode

Automatic dark mode variants using `.dark` class (default):

```html
<html class="dark"><!-- Dark mode active --></html>
```

Customize dark mode strategy:

```typescript
themePlugin({
  darkMode: 'class',        // Default: .dark class
  // darkMode: 'media',     // Use @media (prefers-color-scheme)
  // darkSuffix: '-dark',   // Custom dark selector
})
```

## Configuration Options

**themePlugin()** - structured options:

```typescript
{
  themePrefix: 'md-',
  surfacePrefix: 'surface-',
  omitTheme: false,
  darkSuffix: '',
  shades: [50,100,200,300,400,500,600,700,800,900],
  colors: { primary: { value: '#6750A4' } }
}
```

**flatPlugin()** - flat color properties:

```typescript
{
  themePrefix: 'md-',
  surfacePrefix: 'surface-',
  primary: '#6750A4',              // Direct color definition
  secondary: ['#958DA5', false],   // [color, harmonize]
  neutral: [50, 100, 200, 500]     // Custom shades
}
```

## API Reference

```typescript
// Main exports
import flatPlugin, {
  themePlugin,
  makeThemeFromPartialOptions,
  formatTheme,
  colorFormatter
} from '@poupe/tailwindcss'

// Color system
import { defaultColors, withKnownColor } from
  '@poupe/tailwindcss/theme'

// Theme utilities
import { makeTheme, makeShadows, makeShades } from
  '@poupe/tailwindcss/theme'

// Color formatters: 'rgb' | 'hsl' | 'hex' | 'numbers'
const formatter = colorFormatter('rgb')
```

## Ecosystem

- [@poupe/theme-builder](../@poupe-theme-builder) - MD3 token generation
- [@poupe/vue](../@poupe-vue) - Vue components
- [@poupe/nuxt](../@poupe-nuxt) - Nuxt integration

## Requirements

- Node.js >=20, TailwindCSS ^4.1

## License

MIT
