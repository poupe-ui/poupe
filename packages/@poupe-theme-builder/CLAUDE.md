# CLAUDE.md - @poupe/theme-builder

This file provides package-specific guidance for the @poupe/theme-builder
package. For general monorepo guidelines, see the
[root CLAUDE.md](../../CLAUDE.md).

## Package Overview

@poupe/theme-builder is a Material Design 3 theme generation system. It
generates design tokens, handles color extraction from images, manages
theme variations, and provides runtime theme switching capabilities.

## Package Structure

```
src/
├── __tests__/        # Unit tests
├── core/             # Core theme generation logic
├── server/           # Server-side utilities
├── tokens/           # Design token definitions
├── utils/            # Utility functions
├── index.ts          # Main exports
└── server.ts         # Server module exports
```

## Key Features

- **Material Design 3 tokens**: Complete M3 design token generation
- **Dynamic color**: Extract colors from images for personalized
  themes
- **Theme variations**: Support for light/dark modes and color variants
- **Runtime theming**: CSS variable-based theme switching
- **Type-safe tokens**: Full TypeScript support for design tokens

## Build Configuration

Exports two entry points via unbuild:
- `index` - Core theme builder functionality
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

- **@poupe/css**: workspace:^ (for CSS utilities)
- **@material/material-color-utilities**: For M3 color algorithms
