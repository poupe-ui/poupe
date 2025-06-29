# Changelog

All notable changes to `@poupe/tailwindcss` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.0] - 2025-06-19

### Added

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
  - Customizable via CSS variables (`--md-ripple-duration`, `--md-ripple-opacity`)

### Updates

- Added `precommit` script to package.json for consistent code quality checks

### Technical Details

- Shape system uses extensible architecture allowing future shape families
- Squircle implementation uses data URI SVG masks for smooth corners
- All utilities follow Material Design 3 specifications
- Maintains backward compatibility with existing surface and component utilities

## [0.4.2] - Previous Release

Previous release notes available in git history.
