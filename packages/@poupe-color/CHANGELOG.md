# Changelog

All notable changes to `@poupe/color` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
