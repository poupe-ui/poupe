# AGENT.md - @poupe/tailwindcss

This file provides package-specific guidance for the @poupe/tailwindcss
package. For general monorepo guidelines, see the
[root AGENT.md](../../AGENT.md).

## Package Overview

@poupe/tailwindcss is a TailwindCSS v4 plugin that integrates Material
Design 3 principles into TailwindCSS. It provides utilities for surfaces,
elevation, typography, and theme integration.

## Package Structure

```
src/
├── __tests__/        # Unit tests
├── assets/           # Pre-built CSS files
│   ├── style.css     # Minimal setup without theme
│   └── default.css   # Complete example with defaults
├── flat/             # Flat plugin API
├── theme/            # Theme generation and utilities
├── utils/            # Builder and helper utilities
└── index.ts          # Main exports
```

## Key Features

- **Material Design surfaces**: Automatic surface color utilities
- **Elevation system**: M3 elevation shadows (z1-z5) with tonal
  elevation
- **Scrim overlays**: Surface overlays for better contrast
- **Theme integration**: Seamless integration with
  @poupe/theme-builder
- **Typography scales**: M3 typography system
- **Motion utilities**: Material motion timing functions

## CSS Assets

The package provides two pre-built CSS files in `src/assets/`:

### style.css
- Minimal TailwindCSS v4 setup
- Surface utilities without theme colors
- Shadow and elevation system
- Scrim overlay utilities
- No imposed theme - bring your own colors
- Exported as package's main CSS via `@import '@poupe/tailwindcss'`

### default.css
- Complete example with Material Design 3 variables
- Full set of CSS custom properties with default values
- All utilities with example theme colors
- Generated from `build.config.ts` for reference

## Build Configuration

Exports multiple entry points:
- Default export: TailwindCSS plugin function
- Named exports: Configuration utilities

## CSS Utilities Generated

### Surface Utilities
- `.surface-{color}`: Sets background and text color
- `.on-{color}`: Sets appropriate text color for backgrounds
- `.surface-container-{lowest|low|medium|high|highest}`: Container
  variants

### Elevation Utilities
- `.z{1-5}`: Elevation levels with shadows and tonal elevation
- `.scrim-{color}`: Overlay utilities for elevated surfaces

### State Layer Utilities
- `.state-hover`: Hover state overlay
- `.state-focus`: Focus state overlay
- `.state-pressed`: Pressed state overlay

## Plugin Configuration

```js
// tailwind.config.js
import { poupePlugin } from '@poupe/tailwindcss'

export default {
  plugins: [
    poupePlugin({
      // Optional configuration
      prefix: 'p-',        // Prefix for utilities
      colors: {...},       // Custom color overrides
      generateSurfaces: true  // Generate surface utilities
    })
  ]
}
```

## Testing Guidelines

- Test utility generation
- Validate CSS output
- Test with different TailwindCSS configurations
- Ensure theme variable integration works

## Integration Notes

Works with:
- TailwindCSS v4.x only
- @poupe/theme-builder for design tokens
- @poupe/vue components use these utilities

## Dependencies

- **@poupe/css**: workspace:^ (for CSS utilities)
- **tailwindcss**: ^4.0.0 (peer dependency)