# Changelog

All notable changes to `@poupe/tailwindcss` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.6.0] - 2025-06-29

### Added

- **MD3 Expressive Shape System**: Complete redesign with abbreviated semantic shapes
  - Optimized from 71KB to ~6KB of CSS utilities
  - Multiple shape families with explicit naming:
    - Default rounded shapes (e.g., `shape-lg`)
    - Squircle: iOS-style super-elliptical corners (e.g., `shape-squircle-lg`)
    - Cut: Angled corners (e.g., `shape-cut-sm`)
    - Concave: Inward curved corners (experimental)
    - Convex: Enhanced rounded corners with 1.5x multiplier
  - Asymmetric corner control:
    - Individual corners (e.g., `shape-lg-tl`, `shape-md-br`)
    - Grouped corners (e.g., `shape-lg-top`, `shape-xl-left`)
  - Dynamic shape utilities supporting arbitrary values (e.g., `shape-[20px]`)
  - Enhanced component shapes with semantic defaults

### Changed

- **BREAKING**: Simplified shape utility naming for clarity and brevity
  - `.shape-rounded-lg` → `.shape-lg`
  - `.shape-rounded-lg-t` → `.shape-lg-top`
  - `.shape-squircle` → `.shape-squircle-{scale}`
  - `.shape-top-square` → `.shape-{scale}-bottom`
- Shape scale now uses abbreviated names: `xs`, `sm`, `md`, `lg`, `xl`
- Component shapes retain semantic names (e.g., `.shape-button`)
- All shape utilities now use CSS variables with scale fallbacks

### Fixed

- Dependencies: Updated to TailwindCSS v4.1.11 for better compatibility
- Development dependencies: Updated ESLint, Vitest, and related tools

### Technical Improvements

- Dedicated shape modules: `shapes.ts`, `shape-semantic.ts`, `shape-match-utilities.ts`
- Progressive enhancement with automatic fallbacks
- Better browser compatibility for advanced shape families
- Consistent CSS variable usage enabling runtime customization
- Reduced CSS footprint while maintaining expressiveness

## [0.5.0] - 2025-06-19

### Features

- **Material Design 3 Shape System**: Complete implementation of MD3 shape tokens
  - Shape scale utilities from `shape-none` to `shape-full`
  - Component-specific shape tokens (button, card, fab, text-field, dialog, chip)
  - Squircle support with iOS-style smooth corners using SVG masks
  - CSS variables for all shape values with customization support
  - Graceful fallback for browsers without mask support

- **Ripple Animation Utility**: Material Design ripple effect implementation
  - `.ripple-effect` utility class with configurable duration and opacity
  - Performance optimized with `will-change` property
  - Uses `currentColor` for automatic color matching
  - Customizable via CSS variables (`--md-ripple-duration`,
    `--md-ripple-opacity`)

### Updates

- Added `precommit` script to package.json for consistent code quality checks

### Technical Details

- Shape system uses extensible architecture allowing future shape families
- Squircle implementation uses data URI SVG masks for smooth corners
- All utilities follow Material Design 3 specifications
- Maintains backward compatibility with existing surface and component utilities

## [0.4.2] - Previous Release

Previous release notes available in git history.
