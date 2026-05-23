# Changelog

All notable changes to `@poupe/tailwindcss` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Dependencies

- Lift `tailwindcss` peer floor `^4.1.11 → ^4.3.0`,
  with matching devDep bumps for `tailwindcss` and
  `@tailwindcss/node`. Downstream
  `@tailwindcss/vite@4.3.0` widens its `vite` peer to
  `^5.2 || ^6 || ^7 || ^8`, clearing the prior 4.1.x
  cap against `vite ^8`.
- `vitest` devDep `^3.2.4 → ^4.1.7`.

## [0.5.2] - 2026-05-13

### Dependencies

- Drop `unbuild`. Add `obuild`, `consola`.

### Internal

- Migrate build pipeline from `unbuild` to `obuild` + rolldown,
  mirroring `@poupe/theme-builder`. One bundle entry per
  published subpath (`.`, `./theme`, `./utils`); nested dist
  layout (`dist/theme/index.mjs` etc.) and `.d.mts` types;
  sourcemap via the `rolldownOutput` hook. The `exports` map
  is repointed; the `style` condition on `.` still resolves at
  flat `dist/style.css` because the asset-copy hook deposits
  the CSS at the dist root.
- Rewire the asset pipeline off the new build hooks. unbuild's
  `build:prepare` / `build:done` become obuild's `start` /
  `end`. The asset-copy step migrates off
  `context.options.rootDir` / `context.options.outDir` (gone
  from obuild's `BuildContext`) to `context.pkgDir` plus a
  top-level `outDirectory` const. `failOnWarn: false` drops
  out — it was suppressing unbuild's `validatePackage` walk,
  which obuild has no equivalent of.
- Build-time logging in `writeTheme` and
  `generateCSSForExample` switches from `console.log/error` to
  `consola.success/error`, matching the rest of the
  workspace's obuild build configs.

## [0.5.1] - 2026-05-10

### Fixed

- Replace the file-copy plugin with a `build:done` hook,
  dropping the build-time copy dependency.
- Inline `bgPrefix`/`textPrefix` in `makeSurfaceComponents`
  so resolved class strings survive Tailwind's content scan.
- Type-only import of `StandardPaletteKey` to keep the
  runtime bundle clean.
- Satisfy `noUncheckedIndexedAccess` across theme helpers.
- Unblock @poupe/nuxt's jiti chain (workspace cross-effect).
- Address CodeQL and code-review alerts.

### Dependencies

- TypeScript 6.0.3, vue-tsc 3.2.8, vitest 3.2.4, eslint 9.39.4,
  unbuild 3.6.1, @poupe/eslint-config ~0.9.1.

### Internal

- Workspace cspell pipeline; singular-noun casing pass.
- Standardised precommit/prepack/clean scripts and `prepare` hook.

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

### Changed

- Added `precommit` script to package.json for consistent code quality checks

### Technical Details

- Shape system uses extensible architecture allowing future shape families
- Squircle implementation uses data URI SVG masks for smooth corners
- All utilities follow Material Design 3 specifications
- Maintains backward compatibility with existing surface and component utilities

## [0.4.2] - Previous Release

Previous release notes available in git history.
