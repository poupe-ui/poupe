# @poupe/color

[![jsDocs.io][jsdocs-badge]][jsdocs-url]
[![npm version][npm-badge]][npm-url]
[![License: MIT][license-badge]][license-url]

Material Design 3 theme resolution from a declarative `Recipe` — seeds,
variant, contrast, optional named extras. Produces a typed `Theme`: two
`ModalTheme` units (dark / light), each with every MD3 role resolved as
`Hct` plus its underlying tonal palette.

## Status

Shipped today:

- Public type surface: `Theme`, `ModalTheme`, `Recipe`, the MD3
  role catalogues, the `ARGB` brand.
- Runtime value catalogues those types derive from: `paletteKeys`,
  `modes`, `extendedRoles`, `requiredStandardRoles`,
  `specDependentRoles`, `specsWithDim`, `standardRoles`.
- `argb` umbrella with the per-type converters (`argbFromHCT`,
  `argbFromColord`) plus the `asARGB` numeric brand stamp.
- `getRandomColor` for rolling a fresh opaque source when no
  fixed input is on hand.
- `camelCase` / `capitalize` string helpers used for role-name
  construction.
- `keys` / `unsafeKeys` typed access to an object's own
  string keys.
- `computeTheme<K, S>` — Recipe → Theme pipeline.
- Value-form MCU re-exports (`Hct`, `TonalPalette`,
  `DynamicScheme`, `Variant`) so a single `import` covers both
  the value and the type binding.

Not yet shipped: the Preset layer and cascade resolution that
will sit on top of `computeTheme`.

## Installation

```bash
npm install @poupe/color
```

```bash
yarn add @poupe/color
```

```bash
pnpm add @poupe/color
```

## At a glance

```typescript
import { argb, computeTheme, Variant, type Recipe } from '@poupe/color';

const recipe: Recipe<'brand', '2025'> = {
  variant: Variant.VIBRANT,
  specVersion: '2025',
  contrast: 0,
  seeds: {
    primary: argb('#1976d2'),    // mandatory ARGB; source anchor
    brand: argb('#ff5722'),      // extra slot — K infers as 'brand'
  },
  dark: {
    seeds: { secondary: argb('#9c27b0') },
  },
};

const theme = computeTheme(recipe);  // Theme<'brand', '2025'>
```

The global substrate sits at the top (`variant`, `specVersion`,
`contrast`). `seeds` is the baseline seed map: `primary` is mandatory
and acts as the source anchor; the other core slots and any extras
are optional. `dark` and `light` overlays tweak individual seeds per
mode. The type parameter `K` infers from any non-core seed keys —
`brand` here — and threads through to the resolved `Theme<'brand'>`.

Each extra-role name expands into four role slots on the resolved
theme: `brand`, `onBrand`, `brandContainer`, and `onBrandContainer` —
all `Hct` — exposed on `theme.dark.roles` and `theme.light.roles`.
The matching `TonalPalette` lives at `theme.dark.palettes.brand` and
`theme.light.palettes.brand`.

> **Pick extra-role names that don't already exist.** `K` overlapping
> a standard or extended MD3 role (e.g. `K = 'surface'`) is rejected
> at runtime when computing the theme; the type system doesn't catch
> this.

## API

### Types

Three groups: **input** (`Recipe`, `SeedsMap` / `ModalSeedsMap`,
`SeedOptions`, `SeedValue`) describes what the resolver consumes;
**output** (`Theme`, `ModalTheme`, `ModalRoles`, `ModalPalettes`)
describes what it produces; the rest are primitives (`ARGB`, `Mode`)
and role-name catalogues.

- `Theme<K, S>` / `ModalTheme<K, S>` — resolved theme output. A
  `Theme` holds two `ModalTheme` units, one per mode; each
  carries `mode`, the live MCU `scheme`, `source`, plus
  `palettes` (`ModalPalettes<K>`) and `roles` (`ModalRoles<K, S>`).
  `S` defaults to `SpecVersion` and exposes the full `*Dim`
  quartet; pinning it (e.g. `Theme<K, '2025'>`) narrows
  `ModalRoles`'s spec-dependent slots accordingly.
- `Recipe<K, S>` — dense intermediate input consumed by theme
  computation. Combines a `SeedsMap<K>` baseline with optional
  per-mode overlays under `dark` / `light`. `S` types the
  `specVersion` field so theme computation can thread it into
  `Theme<K, S>` and gate the spec-dependent role slots.
- `SeedsMap<K>` / `ModalSeedsMap<K>` — baseline and per-mode
  seed-map shapes. Baseline pins `primary` as a mandatory bare
  `ARGB` (the source anchor); the other core slots and extras
  (`K`) accept optional `SeedOptions`. Per-mode maps make every
  slot optional.
- `RecipeOverlay<K>` — per-mode overlay wrapper around
  `ModalSeedsMap<K>`. Each entry is a `SeedOptions` defaulting
  to `blend: false` (raw); the object form may opt into
  harmonisation.
- `SeedOptions` — bare `ARGB` or `{ value: ARGB; blend?: boolean }`.
  Controls whether the seed is harmonised against `Theme.source`
  before palette derivation; the contextual default is `true` on
  baseline, `false` on per-mode overlays.
- `SeedValue` — canonical expanded `{ value: ARGB; blend: boolean }`
  form produced after defaults resolve; downstream sites consume
  this shape directly.
- `RoleKey<K, S>` / `StandardRole` / `RequiredStandardRole` /
  `SpecDependentRole<S>` / `ExtendedRole` / `ExtraRole<K>` — MD3
  role-name catalogues keying `ModalRoles<K, S>`. `SpecDependentRole`
  narrows by spec version: the `*Dim` quartet exists on `'2025'` /
  `'2026'` and resolves to `never` on `'2021'`.
- `ModalRoles<K, S>` / `ModalPalettes<K>` — the role and palette
  buckets of a `ModalTheme`. `ModalRoles` keys every resolved
  role colour (`Hct`) by its MD3 role name, with `S` gating the
  spec-dependent `*Dim` slots; `ModalPalettes` keys every resolved
  `TonalPalette` by its bare palette name (no `Palette` suffix —
  `primary`, `secondary`, etc.) and is spec-agnostic.
- `PaletteKey` — the six MCU core palette names; the default
  key set of `ModalPalettes`.
- `Mode` — `'dark' | 'light'`.
- `ARGB` — branded `number` for an opaque `0xFFRRGGBB` integer.
- MCU re-exports — see the [MCU re-exports](#mcu-re-exports)
  subsection. The runtime classes (`Hct`, `TonalPalette`,
  `DynamicScheme`) and the `Variant` enum are re-exported as
  values; `PaletteKey` and `SpecVersion` stay type-only.

### Value catalogues

Every concrete role / palette type derives from an `as const`
array exposed under the same name. Iterate the array at runtime;
use the type at compile time.

```typescript
import { paletteKeys } from '@poupe/color';

for (const key of paletteKeys) {
  // key: 'primary' | 'secondary' | 'tertiary'
  //    | 'neutral' | 'neutralVariant' | 'error'
}
```

Available arrays: `paletteKeys`, `modes`, `extendedRoles`,
`requiredStandardRoles`, `specDependentRoles`, `specsWithDim`,
`standardRoles`.

### Theme computation

- `computeTheme<K, S>(recipe: Recipe<K, S>): Theme<K, S>` — Recipe →
  Theme. Splits each layer's seed map into core-palette and
  extra-palette subsets, validates extras for palette symmetry across
  baseline / dark / light, harmonises baseline seeds against
  `Theme.source` (per-mode overlays stay raw by default), and
  assembles per-mode `ModalTheme<K, S>` instances pinning every MD3
  role and the four-quad extras. `K` infers from the seed-map
  literal's non-core keys; `S` infers from `recipe.specVersion`, so a
  pinned spec literal narrows the spec-dependent `*Dim` slots
  (absent on `'2021'`, required `Hct` on `'2025'` / `'2026'`).

> **MCU may downgrade the recorded spec.** `theme.specVersion`
> echoes `recipe.specVersion` verbatim; `theme.dark.scheme.specVersion`
> may differ because MCU's `maybeFallbackSpecVersion` normalises the
> request against the variant's supported set (e.g. `Variant.CONTENT`
> only ships on `'2021'`). Read `theme.specVersion` for what the
> recipe asked for, the modal `scheme.specVersion` for what MCU
> actually ran.

### Runtime helpers

Reach for `argb` when wiring a `Recipe` by hand from hex strings; the
per-type helpers are escape hatches for callers who already hold a
typed `Hct` or `Colord` value.

- `argb(color: number | string | Hct | Colord): ARGB` — umbrella
  dispatcher. Numbers stamp through `asARGB`; `Hct` and `Colord`
  instances route to dedicated converters; strings parse through
  colord — CSS hex (`#abc`, `#aabbcc`, `#aabbccaa` — alpha last
  per CSS Color Module Level 4) and CSS functional forms
  (`rgb(...)`, `hsl(...)`, …). Named colours (`'red'`) need
  colord's `namesPlugin` and aren't handled here. Returns the
  opaque `0xFFRRGGBB` form; input alpha is dropped at the boundary.
- `argbFromHCT(c: Hct): ARGB` — thin stamp of MCU's HCT integer.
- `argbFromColord(c: Colord): ARGB` — opaque ARGB from a `Colord`
  instance. Throws on an invalid Colord (e.g. parsed from
  invalid input).
- `asARGB(n: number): ARGB` — stamp a `number` as an opaque
  `ARGB` at a trust boundary. Validates u32 range and forces
  alpha to `0xFF`.
- `getRandomColor(): ARGB` — opaque random colour, validated via
  `colord`'s `isValid()` (throws on an invalid roll). Drop in
  directly as a `Recipe`'s `primary` when no fixed source is on
  hand; the colord parse is internal so callers don't take a
  direct `colord` dependency.
- `camelCase(s: string): string` — convert a string to camelCase.
  Handles kebab-case, snake_case, and space-separated forms plus
  internal capitalisation patterns like `BGColor` → `bgColor` and
  `HTMLElement` → `htmlElement`; vendor-prefix leading hyphens
  (`-webkit-foo`) are stripped before conversion. Mirrors
  `@poupe/css`'s `camelCase` verbatim.
- `capitalize<S extends string>(s: S): Capitalize<S>` — uppercase
  the first character. The return type threads TypeScript's
  intrinsic `Capitalize<S>`, so the literal-string type is
  preserved (e.g. `capitalize('foo')` is typed `'Foo'`), pairing
  naturally with template-literal role-name construction.
- `keys<T, K extends keyof T>(object: T, valid?): Generator<K>` —
  type-safe own-string-keys iteration. Yields each own string key
  of `object` that passes the optional `valid` predicate. Drops
  the `as K[]` cast at `for (const k of …)` call sites against
  typed records. Mirrors `@poupe/css`'s `keys` verbatim.
- `unsafeKeys<T>(object: T): Array<keyof T>` — `Object.keys` cast
  to preserve key types. The "unsafe" tag reflects that the cast
  is stronger than the runtime guarantee: a `Record<'a' | 'b', V>`
  may carry extra keys at runtime that the type pretends are
  absent. Reach for `keys` instead unless you need the array form.
  Mirrors `@poupe/css`'s `unsafeKeys` verbatim.

### MCU re-exports

A single `import { Hct, TonalPalette } from '@poupe/color'` covers
both the value binding and the type binding inherent to class
declarations, so consumers do not have to add a direct dependency
on `@poupe/material-color-utilities` for the common entry points.

- `Hct`, `TonalPalette`, `DynamicScheme` — classes (value + type).
- `Variant` — enum value.
- `PaletteKey`, `SpecVersion` — types only.

### `VERSION`

The package version, sourced from `package.json` at build time.

```typescript
import { VERSION } from '@poupe/color';

console.log(VERSION); // e.g. '0.0.0'
```

## Integration with Poupe Ecosystem

- [@poupe/material-color-utilities][mcu] — upstream HCT, palettes,
  dynamic schemes
- [@poupe/theme-builder](../@poupe-theme-builder) — consumes
  `@poupe/color` to generate design tokens
- [@poupe/css](../@poupe-css) — peer dependency of theme-builder for
  CSS rendering (not used directly by `@poupe/color`)

## Requirements

- Node.js >= 20.19.2
- TypeScript-friendly environment

## License

MIT licensed.

<!-- Badge references -->
[jsdocs-badge]: https://img.shields.io/badge/jsDocs.io-reference-blue
[jsdocs-url]: https://www.jsdocs.io/package/@poupe/color
[npm-badge]: https://img.shields.io/npm/v/@poupe/color.svg
[npm-url]: https://www.npmjs.com/package/@poupe/color
[license-badge]: https://img.shields.io/badge/License-MIT-blue.svg
[license-url]: ../../LICENCE.txt
[mcu]: https://www.npmjs.com/package/@poupe/material-color-utilities
