# AGENTS.md - @poupe/color

This file provides package-specific guidance for the @poupe/color
package. For general monorepo guidelines, see the
[root AGENTS.md](../../AGENTS.md).

## Package Overview

@poupe/color resolves Material Design 3 themes from a declarative
`Recipe`. It sits below `@poupe/theme-builder` in the dependency
graph and wraps `@poupe/material-color-utilities` (HCT, palettes,
dynamic schemes) and `colord` (input parsing) into a typed `Theme`:
two `ModalTheme` units (dark and light), each with every MD3 role
resolved as `Hct` plus its underlying tonal palette.

## Status

Type surface, runtime helpers, and the Recipe → Theme pipeline
implemented. Public exports include the type catalogue (`Theme`,
`ModalTheme`, `Recipe`, the MD3 role types, `ARGB`), the runtime
value arrays those types derive from, the `argb` umbrella with
its per-type variants (`argbFromHCT`, `argbFromColord`, `asARGB`),
`getRandomColor` for rolling a fresh opaque ARGB source, the
`camelCase` / `capitalize` string helpers, the `keys` /
`unsafeKeys` object-key helpers, `computeTheme<K, S>` for
assembling a `Theme<K, S>` from a `Recipe<K, S>`, and value-form
MCU re-exports (`Hct`, `TonalPalette`, `DynamicScheme`, `Variant`).
The Preset layer and cascade resolution sitting on top of
`computeTheme` are designed but unimplemented.

## Package Structure

```text
src/
├── __tests__/                  # Package-level smoke tests
├── index.ts                    # Public barrel
├── theme/                      # Theme computation pipeline
│   ├── __tests__/              # Pipeline runtime + type tests
│   ├── compute.ts              # `computeTheme` entry — Recipe → Theme
│   ├── index.ts                # Theme-layer barrel
│   ├── modal.ts                # `ModalTheme` assembly
│   ├── palettes.ts             # Palette derivation and overlay
│   ├── roles.ts                # Role accessor extraction
│   ├── seeds.ts                # `SeedOptions` → `SeedValue` expansion
│   ├── split.ts                # Baseline / per-mode seed split
│   └── substrate.ts            # Global Recipe-field substrate
├── types/                      # Public type surface
│   ├── __tests__/              # Type-level and runtime tests
│   ├── argb.ts                 # Opaque-ARGB branded primitive
│   ├── index.ts                # Types-layer barrel
│   ├── mcu.ts                  # Centralised MCU type surface
│   ├── recipe.ts               # Recipe input shapes
│   └── theme.ts                # Resolved theme shapes and role catalogues
└── utils/                      # Runtime helpers
    ├── __tests__/              # Helper behaviour tests
    ├── argb.ts                 # `argb` umbrella + per-type converters
    ├── index.ts                # Utils-layer barrel
    ├── keys.ts                 # Typed object-key helpers
    ├── memoize.ts              # Unary per-call memo cache
    ├── random.ts               # Random opaque colour generator
    └── strings.ts              # String-shape helpers
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

- Type tests live in `*.types.ts` files under `__tests__/`.
  Vitest skips them at runtime; `tsc` validates them.
- Runtime tests live in `*.test.ts` files under `__tests__/`.
- Use Vitest (`pnpm -F @poupe/color test`); the script invokes
  `vitest run`.
- Every concrete catalogue (`paletteKeys`, `modes`,
  `requiredStandardRoles`, …) has both a type test (the derived
  type matches the array) and a runtime test (declared order,
  no-duplicates, plus disjointness or composition against
  neighbouring catalogues where applicable — e.g.
  `extendedRoles` ∩ `standardRoles` is empty;
  `standardRoles` = `requiredStandardRoles` ++ `specDependentRoles`).
- Spec-parameterised types (`SpecDependentRole<S>`,
  `ModalRoles<K, S>`, `Theme<K, S>`, `Recipe<K, S>`) carry
  type-level rows pinning their shape at each spec literal —
  `'2021'` (no `*Dim` quartet), `'2025'`, `'2026'`, mixed-union
  distribution, and `keyof ModalRoles<never, '2025'>`
  exhaustiveness.
- K-parameterised types (`ExtraRole<K>`, `ModalPalettes<K>`,
  `ModalRoles<K, S>`) carry rows for the four-quad expansion and
  bare-key palette slots; `Recipe<K>` adds K-inference rows that
  bind the union across baseline / dark / light seed sites.
- Add focused tests for each new public API symbol.

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
