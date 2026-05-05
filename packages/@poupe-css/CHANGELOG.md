# Changelog

All notable changes to `@poupe/css` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Dependencies

- Drop `unbuild`. Add `obuild`.

### Internal

- Migrate build pipeline from `unbuild` to `obuild` + rolldown,
  aligning with the rest of the workspace. `build.config.ts`
  declares an explicit `entries` array; sourcemap parity is
  preserved through a `rolldownOutput` hook that flips
  `outConfig.sourcemap` — obuild only exposes rolldown's
  `InputOptions` per bundle entry, so the output-side knob has
  to be reached through the hook. Output layout, `exports`
  map, and consumer-visible API are unchanged.

## [0.3.2] - 2026-05-10

### Fixed

- Restore unbuild stub generation by removing a stripped comment.
- Resolve CodeQL and review alerts surfaced during workspace lint.

### Changed

- Extract deep-rule helpers for reuse across the package.

### Dependencies

- TypeScript 6.0.3, vue-tsc 3.2.8, vitest 3.2.4, eslint 9.39.4,
  unbuild 3.6.1, @poupe/eslint-config ~0.9.1.

### Internal

- Workspace cspell pipeline; tightened spelling and
  singular-noun casing across sources.
- Standardised precommit/prepack/clean scripts and a shared
  `prepare` hook via `@kagal/cross-test`.

Earlier release notes (up to and including `0.3.1`) are available
in git history.
