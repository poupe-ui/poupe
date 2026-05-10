# Changelog

All notable changes to `@poupe/theme-builder` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
