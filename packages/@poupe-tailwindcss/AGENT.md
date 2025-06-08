
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
├── __tests__/        # Unit and CLI integration tests
├── assets/           # Pre-built CSS files
│   ├── style.css     # Minimal setup without theme
│   └── default.css   # Complete example with defaults
├── flat/             # Flat plugin API
├── theme/            # Theme generation and utilities
├── utils/            # Builder and helper utilities
└── index.ts          # Main exports

examples/
├── plugin-workflow/     # @plugin syntax example
│   ├── package.json     # Stand-alone project config
│   ├── input.css        # Uses @plugin directive
│   ├── index.html       # Demo with utility classes
│   └── output.css       # Generated (auto-created by build)
├── flat-plugin/         # Default export usage example
│   ├── package.json     # Stand-alone project config
│   ├── tailwind.config.js
│   ├── input.css        # Uses @config directive
│   ├── index.html       # Demo with utility classes
│   └── output.css       # Generated (auto-created by build)
└── theme-plugin/        # Named export usage example
    ├── package.json     # Stand-alone project config
    ├── tailwind.config.js
    ├── input.css        # Uses @config directive
    ├── index.html       # Demo with utility classes
    └── output.css       # Generated (auto-created by build)
```

## Key Features

- **Material Design surfaces**: Automatic surface color utilities
- **Elevation system**: M3 elevation shadows (z1-z5) with tonal elevation
- **Scrim overlays**: Surface overlays for better contrast
- **Theme integration**: Seamless integration with @poupe/theme-builder
- **Typography scales**: M3 typography system
- **Motion utilities**: Material motion timing functions
- **Simplified testing**: CLI validation without complex setup requirements

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

## Build Process

### Theme Asset Generation
- **Hook**: `build:prepare` in `build.config.ts`
- **Output**: `src/assets/default.css` and `src/assets/style.css`
- **Source**: Generated from TypeScript theme definitions
- **Purpose**: Pre-built CSS files for different use cases

### Example CSS Generation
- **Hook**: `build:done` in `build.config.ts`
- **Output**: `examples/*/output.css` files
- **Command**: Uses `pnpx @tailwindcss/cli` for each example
- **Purpose**: Human-viewable CSS files for browser testing

#### Build Commands
The build process runs automatically:

```bash
# Full build - generates plugin, assets, and examples
pnpm build

# This creates:
# - dist/index.mjs (main plugin)
# - src/assets/*.css (theme files)
# - examples/*/output.css (example CSS)
```

#### Example Build Details
Each example is built using TailwindCSS CLI:
- **plugin-workflow**: Uses `@plugin` syntax with content scanning
- **flat-plugin**: Uses config-based plugin with `@config` workflow
- **theme-plugin**: Uses config-based theme plugin with `@config` workflow

Build errors in examples don't fail the main build process.

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

### Unit Tests
- Test utility generation
- Validate CSS output
- Test with different TailwindCSS configurations
- Ensure theme variable integration works

### CLI Integration Tests
- **File**: `src/__tests__/cli.test.ts`
- **Purpose**: Validates CSS assets using actual TailwindCSS CLI
- **Coverage**: Tests `@plugin` workflow and validates example outputs
- **Dependencies**: Requires `@tailwindcss/cli` as dev dependency
- **Strategy**: Separation of concerns between testing and example generation

#### Test Execution
All CLI tests run from the package root using temporary files for validation:

```bash
# Run all tests
pnpm test

# Run only CLI tests
pnpm test cli.test.ts
```

#### Testing Strategy
Tests create minimal temporary files during execution:
- Input CSS files with `@plugin` directives
- HTML files with utility classes for content scanning
- Output CSS files for validation (temporary, auto-clean-up)
- Validation of persistent example files generated by build process

#### Example File Validation
Tests validate that `build.config.ts` successfully generated:
- `examples/plugin-workflow/output.css`
- `examples/flat-plugin/output.css`
- `examples/theme-plugin/output.css`

No temporary files are left in example directories - tests use separate
temporary files with UUID names for functional validation.

## Integration Notes

### Development Integration
- **Build Process**: Automatic example generation for human testing
- **Test Process**: Validates functionality without modifying examples
- **File Separation**: Clear boundaries between generated and source files

### External Integration
Works with:
- TailwindCSS v4.x only
- @poupe/theme-builder for design tokens
- @poupe/vue components use these utilities

### Browser Testing
After building the package:
1. Open `examples/*/index.html` in any browser
2. See styled Material Design components
3. Inspect generated CSS in `examples/*/output.css`
4. No server required - static HTML/CSS files

This provides immediate visual feedback for development and ensures the
plugin generates working CSS for end users.

### Dependencies

- **@poupe/css**: workspace:^ (for CSS utilities)
- **tailwindcss**: ^4.0.0 (peer dependency)
- **@tailwindcss/cli**: ^4.0.0 (dev dependency for examples and testing)
