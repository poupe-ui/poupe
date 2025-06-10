# AGENT.md - @poupe/theme-builder

This file provides package-specific guidance for the @poupe/theme-builder
package. For general monorepo guidelines, see the
[root AGENT.md](../../AGENT.md).

## Package Overview

@poupe/theme-builder is a Material Design 3 theme generation system. It
generates design tokens, handles color extraction from images, manages
theme variations, and provides runtime theme switching capabilities.

## Package Structure

```text
src/
├── core/             # Core theme generation logic
│   ├── __tests__/   # Core tests
│   ├── colors.ts    # Color utilities
│   ├── palettes.ts  # Palette generation
│   └── utils.ts     # Core utilities
├── css/              # CSS generation utilities
│   └── css.ts       # CSS output formatting
├── server/           # Server-side utilities
│   ├── index.ts     # Server exports
│   └── utils.ts     # Server utilities
├── theme/            # Theme system
│   ├── colors.ts    # Theme colors
│   ├── data.ts      # Theme data structures
│   ├── palettes.ts  # Theme palettes
│   └── theme.ts     # Main theme logic
├── from-image.ts    # Image color extraction
└── index.ts         # Main exports
```

## Key Features

- **Material Design 3 tokens**: Complete M3 design token generation
- **Dynamic color**: Extract colors from images for personalized
  themes
- **Theme variations**: Support for light/dark modes and color variants
- **Runtime theming**: CSS variable-based theme switching
- **Type-safe tokens**: Full TypeScript support for design tokens

## Build Configuration

Exports three entry points via unbuild:
- `index` - Main theme builder functionality
- `core` - Core utilities and algorithms
- `server` - Server-side utilities for SSR

## API Overview

### Core Module (`@poupe/theme-builder`)
- Theme generation from source colors
- Design token calculation
- CSS variable generation
- Theme contrast validation

### Server Module (`@poupe/theme-builder/server`)
- Server-side theme generation
- Image color extraction
- Theme caching utilities

## Design Token Categories

- **Color tokens**: Primary, secondary, tertiary, error, neutral
- **Typography tokens**: Type scales and font families
- **Shape tokens**: Corner radii definitions
- **Motion tokens**: Animation and transition values
- **Elevation tokens**: Shadow definitions

## Testing Guidelines

- Test token generation accuracy
- Validate color contrast ratios
- Test theme switching functionality
- Ensure SSR compatibility

## Integration Notes

This package is used by:
- @poupe/vue for runtime theming
- @poupe/tailwindcss for CSS generation
- @poupe/nuxt for SSR theme support

## Dependencies

- **@poupe/css**: CSS utilities (workspace dependency)
- **@poupe/material-color-utilities**: Material Design 3 color algorithms
- **colord**: Color manipulation and conversion
- **defu**: Deep object merging
- **type-fest**: TypeScript type utilities
