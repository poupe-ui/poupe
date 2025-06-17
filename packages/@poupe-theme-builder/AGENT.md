# AGENT.md - @poupe/theme-builder

This file provides package-specific guidance for the @poupe/theme-builder
package. For general monorepo guidelines, see the
[root AGENT.md](../../AGENT.md).

## Package Overview

@poupe/theme-builder is a Material Design 2025 theme generation system. It
generates design tokens, handles color extraction from images, manages
theme variations, and provides runtime theme switching capabilities.

## Package Structure

```text
src/
├── core/             # Core theme generation logic
│   ├── __tests__/   # Core tests
│   ├── colors.ts    # Color utilities
│   ├── palettes.ts  # Palette generation
│   ├── states.ts    # State layer utilities
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
│   ├── states.ts    # State color variants
│   └── theme.ts     # Main theme logic
├── from-image.ts    # Image color extraction
└── index.ts         # Main exports
```

## Key Features

- **Material Design 2025 tokens**: Complete Material Design 2025 token
  generation with dim color variants
- **Dynamic color**: Extract colors from images for personalized
  themes
- **Theme variations**: Support for light/dark modes and color variants
- **Runtime theming**: CSS variable-based theme switching
- **Type-safe tokens**: Full TypeScript support for design tokens
- **State layer colors**: Material Design 3 interactive state variants
  (hover, focus, pressed, dragged, disabled)

## Build Configuration

Exports three entry points via unbuild:
- `index` - Main theme builder functionality
- `core` - Core utilities and algorithms
- `server` - Server-side utilities for SSR

## API Overview

### Core Module (`@poupe/theme-builder`)
- Theme generation from source colors (Material Design 2025 spec only)
- Design token calculation with dim color variants
- CSS variable generation
- Theme contrast validation
- Fixed to phone platform and 2025 spec
- State layer color generation with M3 opacities
- CSS color-mix parameter calculation for state colors

### Server Module (`@poupe/theme-builder/server`)
- Server-side theme generation
- Image color extraction
- Theme caching utilities
- CSS formatting utilities
  - `stringifyCSSRulesArray`: String format (no trailing newline,
    optional property normalization)
  - `stringifyCSSRulesArrayStream`: Async generator for streaming
  - `stringifyCSSRulesArrayAsStream`: ReadableStream for edge environments
  - `stringifyCSSRulesArrayAsResponse`: Response object creation
  - `stringifyCSSRulesArrayAsStreamingResponse`: Streaming Response
    with ReadableStream
  - All functions support `normalizeProperties` option for camelCase
    to kebab-case conversion

## Design Token Categories

- **Color tokens**: Primary (with dim variant), secondary (with dim
  variant), tertiary (with dim variant), error (with dim variant),
  neutral
- **State color tokens**: Interactive state variants for all color roles
  - Hover (8% opacity)
  - Focus (12% opacity)
  - Pressed (12% opacity)
  - Dragged (16% opacity)
  - Disabled (12% for containers, 38% for content)
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
- **@poupe/material-color-utilities**: Material Design 2025 color algorithms
- **colord**: Color manipulation and conversion
- **defu**: Deep object merging
- **type-fest**: TypeScript type utilities
