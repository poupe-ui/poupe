# Changelog

All notable changes to `@poupe/theme-builder` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.10.4] - 2026-05-25

### Fixed

- `makeTheme` no longer silently routes `scheme: 'monochrome'` to
  `content`. `makeThemeWithOptions` fell back via
  `standardDynamicSchemes[scheme] || standardDynamicSchemes.content`,
  collapsing `Variant.MONOCHROME` (=0) under JS truthiness. The
  fallback uses `??`, so the unknown-key defence (against
  TS-bypass / `any` callers) is preserved while every zero-valued
  variant survives the lookup.

### Dependencies

- `vitest` devDep `^3.2.4 → ^4.1.7`.

## [0.10.3] - 2026-05-13

### Dependencies

- Drop `unbuild`. Add `obuild`.

### Internal

- Migrate build pipeline from `unbuild` to `obuild` + rolldown,
  mirroring `@poupe/css`. Each published subpath (`.`, `./core`,
  `./server`) gets its own bundle entry — a single multi-input
  bundle would couple them through rolldown's shared module
  graph. Dist layout moves from flat (`dist/core.mjs`) to
  nested (`dist/core/index.mjs`) and types switch from `.d.ts`
  to `.d.mts`; the `exports` map is repointed so the import
  surface is unchanged. Sourcemap emission via the
  `rolldownOutput` hook.

## [0.10.2] - 2026-05-10

### Fixed

- Type-only imports for palette types to keep runtime
  symbols out of the bundle.
- Unblock @poupe/nuxt's jiti chain (workspace cross-effect).
- Address CodeQL alerts.

### Changed

- Pin `cookThemeColors` return type at the declaration site.

### Dependencies

- TypeScript 6.0.3, vue-tsc 3.2.8, vitest 3.2.4, eslint 9.39.4,
  unbuild 3.6.1, @poupe/eslint-config ~0.9.1.

### Internal

- Workspace cspell pipeline.
- Standardised precommit/prepack/clean scripts and `prepare` hook.

Earlier release notes (up to and including `0.10.1`) are available
in git history.
