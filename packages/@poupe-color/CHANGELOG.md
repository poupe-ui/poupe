# Changelog

All notable changes to `@poupe/color` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.1] - 2026-05-22

- Initial scaffold.
- Public type surface for the Recipe → Theme pipeline:
  - `Recipe<K, S>`, `Theme<K, S>`, `ModalTheme<K, S>` and the
    `SeedsMap` / `RecipeOverlay` / `SeedOptions` / `SeedValue`
    seed shapes.
  - `ARGB` brand plus the `asARGB` u32 validator.
  - `argb` umbrella dispatcher over
    `number | string | Hct | Colord`, with `argbFromHCT` and
    `argbFromColord` per-type escape hatches.
  - MD3 role-name catalogues (`paletteKeys`,
    `requiredStandardRoles`, `specDependentRoles`,
    `standardRoles`, `extendedRoles`, `modes`) paired with the
    types they generate.
  - `SpecDependentRole<S>` gates the `*Dim` quartet by spec
    version.
  - MCU type re-exports (`Hct`, `TonalPalette`, `DynamicScheme`,
    `Variant`, `SpecVersion`).
- Runtime helpers:
  - `getRandomColor(): ARGB` — opaque random colour, validated via
    `colord`'s `isValid()` before stamping. Callers consume the
    `ARGB` directly without taking a `colord` dependency.
  - `camelCase(s)` / `capitalize<S>(s)` — string-shape helpers;
    `capitalize` threads the intrinsic `Capitalize<S>` so
    literal-string types are preserved, and `camelCase` mirrors
    the `@poupe/css` utility verbatim.
  - `keys(object, valid?)` / `unsafeKeys(object)` — typed
    own-string-keys access; `keys` yields a `Generator<K>`,
    `unsafeKeys` returns `Array<keyof T>`. Drops the `as K[]`
    cast at `for (const k of Object.keys(t))` loops over typed
    records. Both mirror `@poupe/css`'s helpers verbatim.
- `computeTheme<K, S>(recipe: Recipe<K, S>): Theme<K, S>` —
  Recipe → Theme pipeline. Splits seed maps into core and extra
  subsets, validates palette symmetry across baseline and per-mode
  overlays, harmonises baseline seeds against `Theme.source`, and
  assembles per-mode `ModalTheme<K, S>` instances pinning every
  MD3 role and the four-quad extras. `S` threads through to gate
  the spec-dependent `*Dim` slots on the resolved `Theme`.
- Value-form re-exports of the MCU runtime classes (`Hct`,
  `TonalPalette`, `DynamicScheme`) and the `Variant` enum so a
  single `import { Hct } from '@poupe/color'` covers both the
  value binding and the type binding.
