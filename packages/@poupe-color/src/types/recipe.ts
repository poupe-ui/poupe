import type {
  PaletteKey,
  SpecVersion,
  Variant,
} from './mcu';

import type { ARGB } from './argb';

/**
 * Per-seed input shape: either a bare `ARGB` or an object carrying
 * optional metadata.
 *
 * The object form pairs `value` with a `blend` flag that controls
 * harmonisation against `Theme.source` before palette derivation.
 * `Blend.harmonize` rotates the seed's hue toward the source so the
 * palette sits naturally inside the theme.
 *
 * `blend`'s default depends on context: baseline seeds default to
 * `true` (harmonise unless opted out), per-mode overlays default to
 * `false` (raw unless opted in). The bare-value form always takes
 * the contextual default. Both layers accept the object form.
 *
 * For `primary` the harmonisation target is the source itself, so
 * `blend` collapses to identity — the same code path runs uniformly
 * across every slot.
 */
export type SeedOptions =
  ARGB |
  { readonly blend?: boolean; readonly value: ARGB };

/**
 * Canonical, fully-expanded form of a {@link SeedOptions}. The
 * contextual `blend` default has been resolved and `value` is
 * materially present, so downstream sites consume this shape
 * directly — no re-discrimination of the union, no re-application
 * of defaults.
 */
export type SeedValue = {
  readonly blend: boolean
  readonly value: ARGB
};

/**
 * Baseline tonal-palette seed map. `primary` is mandatory and typed
 * as bare {@link ARGB} (the source anchor — `blend` collapses to
 * identity for this slot). The remaining five core slots
 * ({@link PaletteKey} minus `primary`) and any user-declared extras
 * `K` are optional {@link SeedOptions}.
 *
 * Consumed by {@link Recipe}. One map unifies the six MD3 core
 * palette names and the user-declared extras — routing core vs.
 * extra by name happens at theme-computation time.
 */
export type SeedsMap<K extends string = never> = {
  readonly [P in (Exclude<PaletteKey, 'primary'> | K)]?: SeedOptions
} & {
  readonly primary: ARGB
};

/**
 * Per-mode seed map. Every slot is optional {@link SeedOptions} —
 * including `primary` (since overlays do not anchor `Theme.source`
 * and contribute palette pins only). Slots absent from the overlay
 * inherit the baseline palette by reference.
 *
 * Consumed by {@link RecipeOverlay}. Routing is by name, mirroring
 * the baseline shape: `k ∈ PaletteKey` replaces that mode's core
 * palette; a non-core `k` (contributing to `K`) replaces the mode's
 * extra palette.
 */
export type ModalSeedsMap<K extends string = never> = {
  readonly [P in (K | PaletteKey)]?: SeedOptions
};

/**
 * Per-mode overlay applied on top of the baseline-derived palette set.
 *
 * Every entry is a {@link SeedOptions} pinning the named slot's
 * palette source for that mode. The bare-value form (and the
 * object form with `blend` omitted) defaults to `blend: false` — raw
 * pin, no harmonisation — matching the spirit of an explicit pin
 * (caller intent wins over derivation). The object form may opt in
 * to harmonisation against `Theme.source` via `blend: true`.
 *
 * Routing is by name, mirroring the baseline shape: `k ∈ PaletteKey`
 * replaces that mode's core palette; a non-core `k` (contributing to
 * the inferred `K`) replaces the mode's extra palette likewise.
 * Names colliding with the standard or extended role catalogues are
 * rejected at theme-construction entry.
 *
 * Slots absent from the overlay inherit the baseline palette by
 * reference; both modes share the baseline `TonalPalette` instance
 * for slots without an overlay pin.
 *
 * Overlays never influence `Theme.source` — the baseline determines
 * the canonical source HCT. The cross-overlay extras-symmetry
 * invariant is documented on {@link Recipe}.
 */
export type RecipeOverlay<K extends string = never> = {
  readonly seeds?: ModalSeedsMap<K>
};

/**
 * Dense intermediate produced by cascade resolution and consumed
 * when computing a theme from a recipe.
 *
 * `seeds` carries the baseline tonal-palette seeds. `primary` is
 * mandatory — its `ARGB` anchors `Theme.source` and the primary
 * palette pin in one move. The remaining five core slots and any
 * user-declared extras (contributing to `K`) are optional
 * {@link SeedOptions}. TypeScript infers `K` from the seed-map
 * literal's non-core keys.
 *
 * `dark` / `light` carry per-mode overrides via {@link RecipeOverlay}
 * — `SeedOptions` defaulting to `blend: false`. Their entries
 * replace that mode's palette for the named slot directly, raw by
 * default; the object form may opt in to harmonisation. Overlays
 * never influence `Theme.source` — `seeds.primary` is the sole
 * source anchor.
 *
 * Seed names matching the standard or extended role catalogues are
 * rejected at theme-construction entry — those name tone-selected
 * outputs, not palette inputs.
 *
 * Extras must be palette-symmetric across modes: every extra name
 * `k` declared on one overlay must also appear either on baseline
 * seeds (whose palette covers the missing mode) or on the other
 * overlay (each mode carries its own raw palette). Half-defined
 * extras — declared on a single overlay with no baseline
 * counterpart — are rejected at theme-construction entry; the
 * `ModalPalettes<K>` map exposes every declared `K` as a required
 * slot on both modes.
 *
 * Pure data: every field is serialisable. The HCT representation
 * needed downstream is reconstructed at theme-construction time via
 * `Hct.fromInt`.
 *
 * Recipe is the low-level builder input. Making `seeds.primary`
 * mandatory keeps theme construction deterministic; convenience
 * layers may resolve their own default-primary policy and still
 * emit a valid Recipe.
 */
export type Recipe<
  K extends string = never,
  S extends SpecVersion = SpecVersion,
> = {
  /**
   * MCU spec year pinned by the resolved library preset. Typed as the
   * parameter `S` so theme computation can thread the literal through
   * to `Theme<K, S>` and gate the spec-dependent role slots.
   */
  readonly specVersion: S

  /** MCU palette-generation variant pinned by the resolved library preset. */
  readonly variant: Variant

  /** Resolved contrast level, range [-1, 1]. Global, not per-mode. */
  readonly contrast: number

  /**
   * Tonal-palette seeds — {@link SeedsMap}<K>. `primary` is mandatory
   * (bare `ARGB`, the source anchor); other core slots are optional
   * `SeedOptions` falling through to MCU's variant-derived defaults
   * when undefined; extra slots have no MCU-derived default and
   * surface only in the modes that resolved one.
   */
  readonly seeds: SeedsMap<K>

  /** Optional dark-mode overrides (raw by default). */
  readonly dark?: RecipeOverlay<K>

  /** Optional light-mode overrides (raw by default). */
  readonly light?: RecipeOverlay<K>
};
