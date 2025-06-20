# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.6.0] - 2025-06-20

### Added

#### New Components
- **PSurface**: Base container component with Material Design 3 surface and container variants
  - Surface variants: all MD3 surface colors from dim to container-highest
  - Container variants: primary, secondary, tertiary, error
  - Shape system integration with size aliases and explicit variants
  - Interactive states with proper state layers
  - Shadow, border, and padding variants
  - Global defaults integration via usePoupe

- **PCard**: Material Design 3 card component built on PSurface
  - Convenience props for surface and container colors
  - Built-in header and footer slots
  - Title prop for quick card headers
  - Inherits all PSurface capabilities

#### New Composables
- **usePoupe**: Global configuration and defaults management
  - Provides app-wide component defaults via Vue's provide/inject
  - Supports theme configuration (dark mode, custom colors)
  - Accessibility options (reducedMotion, highContrast)
  - Ripple effect configuration
  - Extendable interface for component-specific defaults
  - Helper function `usePoupeMergedProps` for three-level prop merging (global < component < props)

- **useRipple**: Material Design ripple effect implementation
  - Handles mouse and touch events to create ripple animations
  - Configurable color, opacity, duration, and bounded behavior
  - Automatically cleans up ripples after animation completes
  - Integrates with the `.ripple-effect` utility from @poupe/tailwindcss

#### New Utilities
- **tryWarn**: Safe console warning utility for development mode
  - Only logs warnings in development
  - Prevents eslint no-undef errors
  - Guards against missing console.warn

#### Export Structure
- Created separate entry points for better tree-shaking:
  - `@poupe/vue/composables` - All composables
  - `@poupe/vue/components` - All components (re-export from main)

### Changed

#### PButton Component
- Complete refactor with Material Design 3 semantics
- New button types: text, outlined, filled, elevated, tonal
- Semantic color variants: base, primary, secondary, tertiary, error
- FAB (Floating Action Button) support with extended mode
- Icon button mode for icon-only buttons
- Toggle button capability with pressed state
- Leading and trailing icon support
- Improved size system with xs, sm, base, lg, xl
- Ripple effect integration
- Better prop organization and TypeScript interfaces

### Fixed
- Story viewer test slot props now have proper TypeScript types

### Developer Experience
- Added shared `mountWithPoupe` test utility for consistent component testing
- All component tests migrated to use the new test helper
- Improved type safety across all components
- Module augmentation for component defaults

### Internal
- Refactored all components to eliminate `withDefaults` usage
- Single source of truth for component defaults
- Improved prop naming: `directProps` for raw props, `props` for merged values
- Consistent three-level prop merging pattern across all components

## [0.5.5] - Previous Release

_Previous changelog entries..._