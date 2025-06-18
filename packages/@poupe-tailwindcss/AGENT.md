
# AGENT.md - @poupe/tailwindcss

This file provides package-specific guidance for the @poupe/tailwindcss
package. For general monorepo guidelines, see the
[root AGENT.md](../../AGENT.md).

## Package Overview

@poupe/tailwindcss is a TailwindCSS v4 plugin that integrates Material
Design 3 principles into TailwindCSS. It provides utilities for surfaces,
elevation, typography, and theme integration.

## Package Structure

```text
src/
├── __tests__/        # Unit and CLI integration tests
├── assets/           # Pre-built CSS files
│   ├── style.css     # Minimal setup without theme
│   └── default.css   # Complete example with defaults
├── flat/             # Flat plugin API
├── theme/            # Theme generation and utilities
│   ├── match-utilities.ts  # v4-to-v3 bridge for dynamic utilities
│   └── ...
├── utils/            # Builder and helper utilities
└── index.ts          # Main exports

examples/
├── plugin-workflow/     # @plugin syntax example
│   ├── package.json     # Stand-alone project config
│   ├── default-plugin.css  # Uses @plugin directive
│   ├── index.html       # Demo with utility classes
│   └── output.css       # Generated (auto-created by build)
├── flat-plugin/         # Default export usage example
│   ├── package.json     # Stand-alone project config
│   ├── flat-plugin.config.js
│   ├── flat-plugin.css  # Uses @config directive
│   ├── index.html       # Demo with utility classes
│   └── output.css       # Generated (auto-created by build)
└── theme-plugin/        # Named export usage example
    ├── package.json     # Stand-alone project config
    ├── theme-plugin.config.js
    ├── theme-plugin.css # Uses @config directive
    ├── index.html       # Demo with utility classes
    └── output.css       # Generated (auto-created by build)
```

## Key Features

- **Material Design surfaces**: Automatic surface color utilities
- **Elevation system**: M3 elevation shadows (z1-z5) with tonal elevation
- **Scrim overlays**: Surface overlays with opacity modifier support
- **Theme integration**: Seamless integration with @poupe/theme-builder
- **Typography scales**: M3 typography system
- **Motion utilities**: Material motion timing functions
- **Simplified testing**: CLI validation without complex setup requirements

## Recent Changes

### v0.4.0 - Unified Scrim Utilities & v4-to-v3 Bridge
- **NEW**: Added opacity modifier support to all scrim utilities
  (e.g., `scrim-modal/50`)
- **NEW**: Implemented `--md-scrim-rgb` variable following the same pattern
  as `--md-shadow-rgb`
- **NEW**: Automatic theme switching for scrim colors in dark/light modes
- **NEW**: Uses TailwindCSS v4 `--modifier([percentage])` syntax for
  modifier capture
- **NEW**: `asMatchUtility` bridge function converts v4 syntax to v3
  matchUtilities API
- **BREAKING**: Merged standalone `scrim` and `scrim-z-*` into unified
  `scrim-*` utilities with variable z-index
- **BREAKING**: Scrim background-color now uses
  `rgb(var(--md-scrim-rgb) / ...)` instead of `rgb(from ...)`
- Default opacity is 32% (when no modifier is used) but can be customized
  with Tailwind modifiers
- Works with both semantic scrims (`scrim-modal/75`) and arbitrary z-index
  (`scrim-[100]/25`)
- **TECHNICAL**: Bridge pattern enables v4 `--value()` and `--modifier()`
  patterns to work with v3 matchUtilities

### Interactive Surface Components
- **NEW**: Added `interactive-surface-*` utilities that combine surface
  styling with MD3 state layers
- **NEW**: All surface utilities now have interactive counterparts with
  built-in hover/focus/pressed states
- **NEW**: Proper naming for special surfaces like
  `interactive-surface-inverse-primary`
- **IMPROVED**: Configuration-based surface pair generation using pattern
  matching with `{}` placeholders
- **FIXED**: Interactive surfaces now correctly use `interactive-` prefix
- Includes transition timing with `--md-state-transition-duration` CSS
  variable

## TailwindCSS v4-to-v3 Bridge Pattern

The package includes `asMatchUtility` function at
`src/theme/match-utilities.ts` that bridges TailwindCSS v4 CSS syntax to v3
JavaScript API:

### Bridge Functionality
- **Detects v4 patterns**: Identifies utilities using `--value()` and
  `--modifier()` syntax
- **Converts to matchUtilities**: Transforms them to work with TailwindCSS
  v3 matchUtilities API
- **Enables arbitrary values**: Supports patterns like `scrim-[100]` or
  `scrim-[var(--custom-z)]`
- **Handles modifiers**: Processes opacity modifiers with percentage
  conversion (`/50` → `50%`)

### Supported Patterns
```css
/* v4 CSS syntax */
.scrim-* {
  @apply fixed inset-0;
  z-index: --value(integer, [integer]);
  background-color: rgb(var(--md-scrim-rgb) / var(--md-scrim-opacity, 32%));
  --md-scrim-opacity: --modifier([percentage]);
}
```

Becomes v3 matchUtilities:
```javascript
api.matchUtilities({
  'scrim': (value, { modifier }) => ({
    '@apply fixed inset-0': {},
    'z-index': value,
    'background-color':
      'rgb(var(--md-scrim-rgb) / var(--md-scrim-opacity, 32%))',
    '--md-scrim-opacity': modifier ? `${modifier}%` : '32%'
  })
}, { type: 'number', modifiers: 'any' })
```

### Integration Points
- **Plugin processing**: Used in `src/theme/plugin.ts` via
  `doMatchUtility()`
- **Component generation**: Works with dynamic utilities from
  `makeZIndexComponents()`
- **Type mapping**: Converts v4 types (integer, percentage) to v3
  equivalents (number, percentage)

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
  (default-plugin.css)
- **flat-plugin**: Uses config-based plugin with `@config` workflow
  (flat-plugin.css + flat-plugin.config.js)
- **theme-plugin**: Uses config-based theme plugin with `@config` workflow
  (theme-plugin.css + theme-plugin.config.js)

Build errors in examples don't fail the main build process.

## CSS Utilities Generated

### Surface Utilities
- `.surface-{color}`: Sets background and text color
- `.on-{color}`: Sets appropriate text color for backgrounds
- `.surface-container-{lowest|low|medium|high|highest}`: Container
  variants
- **Fixed Color Combinations**: Automatic generation of all combinations
  between fixed backgrounds (primary-fixed, primary-fixed-dim) and fixed
  text variants (on-primary-fixed, on-primary-fixed-variant) with smart
  naming to avoid redundancy

### Interactive Surface Utilities
- `.interactive-surface-{color}`: Surface with Material Design 3 state
  layers
- `.interactive-surface-container-{variant}`: Container surfaces with
  interaction states
- **State Layers**: Automatic hover, focus, and pressed states with proper
  transitions
- **All Variants**: Every surface utility has an interactive counterpart
- **Special Naming**: Handles cases like
  `interactive-surface-inverse-primary` correctly

### Elevation Utilities
- `.z{1-5}`: Elevation levels with shadows and tonal elevation
- `.scrim-[value]`: Arbitrary z-index overlays with full scrim styling
- `.scrim-{base|content|drawer|modal|elevated|system}`: Semantic overlays
  with predefined z-index
- All scrim utilities include fixed positioning, background color, and
  support opacity modifiers (e.g., `/50`, `/75`)

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
- **Coverage**:
  - Tests `@plugin` workflow with plugin file
  - Validates example output files exist
  - Tests CSS assets combined with TailwindCSS base
  - Verifies theme variables and utilities work together
  - **NEW**: Comprehensive scrim opacity modifier validation
  - Tests modifier syntax compatibility with TailwindCSS v4
  - Validates `--modifier([percentage])` syntax processing
- **Dependencies**: Requires `@tailwindcss/cli` as dev dependency
- **Strategy**: Separation of concerns between testing and example generation

#### Test Execution
All CLI tests run from the package root using temporary files for
validation:

```bash
# Run all tests
pnpm test

# Run only CLI tests
pnpm test cli.test.ts
```

#### Testing Strategy
Tests create minimal temporary files during execution:
- Input CSS files with `@plugin` directives
- HTML files with utility classes for content scanning (including modifier
  examples)
- Output CSS files for validation (temporary, auto-clean-up)
- Validation of persistent example files generated by build process
- Comprehensive modifier functionality validation through actual TailwindCSS
  CLI processing
- **NEW**: Bridge pattern testing via `match-utilities.test.ts` and
  `plugin-match-utilities.test.ts`

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

- **Runtime**: @poupe/css, @poupe/theme-builder (workspace deps), type-fest
- **Peer**: tailwindcss v4
- **Development**: @tailwindcss/node for testing

