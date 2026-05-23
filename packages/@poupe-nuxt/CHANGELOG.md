# Changelog

<!-- cspell:words dxup nuxi -->

All notable changes to `@poupe/nuxt` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.4] - 2026-05-23

### Fixed

- Add the missing `prepare` lifecycle hook so `pnpm
  install` stubs the module like the other workspace
  packages. Without it, a fresh checkout could install
  cleanly but `pnpm --filter @poupe/nuxt dev` would
  fail with "Could not load @poupe/nuxt. Is it
  installed?" because `dist/module.mjs` was never
  produced. The hook delegates to the existing
  `dev:prepare` script, gated by
  `cross-test -s dist/module.mjs`.

### Changed

- Point every `nuxi <cmd>` script at the `nuxt <cmd>`
  binary across @poupe/nuxt and its playground; drop
  the explicit `nuxi` devDep from the playground.
  `@nuxt/cli` ships both binaries and arrives
  transitively via `nuxt`, so neither the direct devDep
  nor the older `nuxi` binary was earning its keep.

### Dependencies

- `tailwindcss` and `@tailwindcss/vite` deps
  `^4.1.11 → ^4.3.0`. The widened `vite` peer on
  `@tailwindcss/vite@4.3.0` clears the prior 4.1.x
  cap against `vite ^8`.
- Nuxt 3 ecosystem refresh: `nuxt`, `@nuxt/kit`,
  `@nuxt/schema` devDeps `^3.21.4 → ^3.21.6`
  (`nuxt@3.21.6` pins `@nuxt/kit` exactly at 3.21.6).
- `@nuxt/devtools` devDep `^2.7.0 → ^3.2.4`. The 3.x
  line depends directly on `@nuxt/kit@^4`, already in
  the tree via `@dxup/nuxt` and
  `unplugin-vue-components`, so the bump doesn't widen
  the Nuxt 4 leakage surface. Drops the dual
  `@nuxt/devtools@2.7.0` install and its
  `magicast@0.3.5` duplicate.
- `vite` devDep `^6.4.2 → ^8.0.14`.
- `vitest` devDep `^3.2.4 → ^4.1.7`.

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
