# Changelog

All notable changes to `@poupe/nuxt` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.3] - 2026-05-10

### Fixed

- Install `createPoupe()` in the runtime plugin so theme
  composables find their provide tree at app boot.
- Guard `false | ModuleOptions` unions in the setup helpers
  so `defineNuxtModule` callers can opt out without crashing.
- Run `dev:prepare` before `type-check` so vue-tsc sees the
  generated types.

### Changed

- Bind the playground dev server to `0.0.0.0` for tunnelled
  testing.
- Skip a redundant `prepare` step inside `type-check`.

### Dependencies

- nuxt 3.21.4 with matching `@nuxt/kit` / `@nuxt/schema` floors;
  tailwindcss 4.1.11, tailwind-merge 3.3.1.
- TypeScript 6.0.3, vue-tsc 3.2.8, vitest 3.2.4, eslint 9.39.4,
  @poupe/eslint-config ~0.9.1.

### Internal

- Workspace cspell pipeline.
- Standardised precommit/prepack/clean scripts and `prepare` hook.
- chrome-devtools-mcp setup docs.

Earlier release notes (up to and including `0.4.2`) are available
in git history.
