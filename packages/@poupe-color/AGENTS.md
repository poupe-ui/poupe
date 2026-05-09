# AGENTS.md - @poupe/color

This file provides package-specific guidance for the @poupe/color
package. For general monorepo guidelines, see the
[root AGENTS.md](../../AGENTS.md).

## Package Overview

@poupe/color is a TypeScript library for colour seeding and scheme
preset utilities. It sits below `@poupe/theme-builder` in the
dependency graph and wraps `@poupe/material-color-utilities` and
`colord` behind an extendable preset abstraction.

## Status

Scaffold stage. The only public export is `VERSION` (sourced from
`package.json`). Public API will accrete here as the design lands.

## Package Structure

```text
src/
├── __tests__/        # Unit tests
│   └── index.test.ts
└── index.ts          # Main exports
```

## Build Configuration

- Bundler: `obuild` (rolldown under the hood)
- Output: `dist/index.mjs` (ESM) and `dist/index.d.mts`
- Sourcemaps enabled
- Single entry point (`./src/index.ts`)
- TypeScript: one `tsconfig.json` covers source, build configs, and
  tests — departs from the three-tsconfig monorepo convention used
  elsewhere. `@types/node` from devDependencies is in scope across
  all three.

## Testing Guidelines

- Tests live in `src/__tests__/`
- Use Vitest (`pnpm test`); `globals: true` is enabled
- The first test asserts `VERSION` matches `package.json`
- Add focused unit tests as new public API lands

## Dependencies

- **@poupe/material-color-utilities**: HCT, palettes, dynamic schemes
- **colord**: colour parsing and manipulation

This package is **independent of `@poupe/css`**. CSS rendering and
kebab-case conversion are `@poupe/theme-builder`'s concern.

## Integration Notes

This package is intended to be consumed by:

- @poupe/theme-builder for design-token generation

It is not consumed directly by `@poupe/tailwindcss`, `@poupe/vue`, or
`@poupe/nuxt` — those reach it transitively through
`@poupe/theme-builder`.

## Build Output

- `dist/index.mjs` — ES module
- `dist/index.d.mts` — TypeScript definitions
