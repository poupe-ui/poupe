# Changelog

All notable changes to `@poupe/theme-builder` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `ThemeGenerationOptions.specVersion` — opt-in override for the
  MCU spec version. Re-exports `SpecVersion` from `core`. The
  effective default mirrors MCU's `maybeFallbackSpecVersion` plus
  the `SchemeCmf` constraint: `EXPRESSIVE | VIBRANT | TONAL_SPOT
  | NEUTRAL` default to `'2025'` and honour an explicit `'2021'`;
  `CMF` is forced to `'2026'`; every other variant is forced to
  `'2021'`.
- `variantSpecAcceptance` + `getAcceptedSpecVersions` — data table
  and accessor exposing the variant → spec-versions matrix that
  MCU 0.4's `maybeFallbackSpecVersion` encodes. `getAcceptedSpecVersions`
  returns an empty list for variants outside the table;
  `makeDynamicScheme` treats that as unsupported and throws
  `TypeError` rather than passing the variant to MCU.

### Changed

- `makeDynamicScheme` accepts an optional trailing `specVersion`
  argument instead of hard-coding it. The effective value mirrors
  MCU's variant fallback.
- `standardDynamicSchemes` renamed to `dynamicSchemes`; companion
  `StandardDynamicSchemeKey` renamed to `DynamicSchemeKey`. The
  table now covers every MCU 0.4 variant.
  `ThemeGenerationOptions.scheme`, the `server` re-exports, and
  `@poupe/tailwindcss`'s `ThemeOptions` track the rename.
  `as const`-narrowed so per-entry `Variant` literals survive
  lookup (e.g. `variantSpecAcceptance[dynamicSchemes['cmf']]`
  resolves to the precise spec tuple at the type level). `cmf`
  routes through `SchemeCmf` inside `makeDynamicScheme` —
  `SchemeCmf` is the only MCU path that handles `Variant.CMF`
  dispatch and is `'2026'`-only, so the acceptance table pins
  `cmf` to `['2026']` and caller-supplied core palettes are
  ignored for CMF (`SchemeCmf` computes its own from the source
  colour). Multi-source CMF seeding (a second source colour) is
  deferred.

### Dependencies

- Bump `@poupe/material-color-utilities` to `^0.4.1`. The new MCU
  changes scheme output independently of the spec version
  selection; the bundled `@poupe/tailwindcss` baseline CSS
  regenerates accordingly.

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
