import type {
  DynamicScheme,
  Hct,
  PaletteKey,
  SpecVersion,
  TonalPalette,
  Variant,
} from './mcu';

/**
 * MCU spec versions that ship the spec-dependent role catalogue
 * ({@link specDependentRoles}). The `*Dim` quartet was introduced
 * in MD3 spec `'2025'` and carries through `'2026'`; older specs
 * (currently `'2021'`) omit it.
 *
 * Enumerated rather than expressed as `Exclude<SpecVersion, '2021'>`
 * so a future MCU spec does not auto-inherit the claim — adding a
 * new entry is an explicit audit point. The `satisfies` clause
 * catches an upstream rename or drop in a new MCU version.
 */
export const specsWithDim = ['2025', '2026'] as const satisfies readonly SpecVersion[];

type SpecWithDim = typeof specsWithDim[number];

/**
 * The two modes a {@link Theme} resolves — `'dark'` and `'light'`.
 * Iterate the array at runtime; use {@link Mode} at compile time.
 */
export const modes = ['dark', 'light'] as const;

/** A theme mode: `'dark'` or `'light'`. */
export type Mode = typeof modes[number];

/**
 * Standard MD3 roles always present on a {@link ModalTheme}, regardless
 * of MCU spec version.
 */
export const requiredStandardRoles = [
  // surface family
  'background',
  'inverseOnSurface',
  'inverseSurface',
  'onBackground',
  'onSurface',
  'onSurfaceVariant',
  'outline',
  'outlineVariant',
  'scrim',
  'shadow',
  'surface',
  'surfaceBright',
  'surfaceContainer',
  'surfaceContainerHigh',
  'surfaceContainerHighest',
  'surfaceContainerLow',
  'surfaceContainerLowest',
  'surfaceDim',
  'surfaceTint',
  'surfaceVariant',
  // primary family
  'inversePrimary',
  'onPrimary',
  'onPrimaryContainer',
  'onPrimaryFixed',
  'onPrimaryFixedVariant',
  'primary',
  'primaryContainer',
  'primaryFixed',
  'primaryFixedDim',
  // secondary family
  'onSecondary',
  'onSecondaryContainer',
  'onSecondaryFixed',
  'onSecondaryFixedVariant',
  'secondary',
  'secondaryContainer',
  'secondaryFixed',
  'secondaryFixedDim',
  // tertiary family
  'onTertiary',
  'onTertiaryContainer',
  'onTertiaryFixed',
  'onTertiaryFixedVariant',
  'tertiary',
  'tertiaryContainer',
  'tertiaryFixed',
  'tertiaryFixedDim',
  // error family (no `errorFixed*`; MCU does not define them)
  'error',
  'errorContainer',
  'onError',
  'onErrorContainer',
  // palette key colours (six)
  'errorPaletteKeyColor',
  'neutralPaletteKeyColor',
  'neutralVariantPaletteKeyColor',
  'primaryPaletteKeyColor',
  'secondaryPaletteKeyColor',
  'tertiaryPaletteKeyColor',
] as const;

/** MD3 roles always present on a {@link ModalTheme}. */
export type RequiredStandardRole = typeof requiredStandardRoles[number];

/**
 * Spec-dependent MD3 roles — the `*Dim` quartet, introduced in
 * MCU's `'2025'` spec (and carried in `'2026'`); absent on
 * `'2021'`. Listed in MCU-natural family order (primary →
 * secondary → tertiary → error).
 *
 * The parameterised type {@link SpecDependentRole}<S> narrows this
 * catalogue to the slots `S` actually carries; on a {@link ModalTheme}
 * a slot in this catalogue is present as `Hct` exactly when the
 * resolved spec ships it.
 */
export const specDependentRoles = [
  'primaryDim',
  'secondaryDim',
  'tertiaryDim',
  'errorDim',
] as const;

/**
 * MD3 roles whose presence depends on the MCU spec version. Resolves
 * to the {@link specDependentRoles} union for spec versions that ship
 * the `*Dim` quartet (currently `'2025'` and `'2026'`), and to `never`
 * for spec versions that omit it (currently `'2021'`).
 *
 * The conditional distributes over `S`: each member of a union `S`
 * resolves independently and the per-member results form a union.
 * `'2021'` contributes `never` to that union, and since `never` is
 * the absorbing element of `|`, it drops out — so any union
 * containing at least one member that ships the `*Dim` quartet
 * (including the default `S = SpecVersion`) resolves to the full
 * quartet.
 */
export type SpecDependentRole<S extends SpecVersion = SpecVersion> =
  S extends SpecWithDim ? typeof specDependentRoles[number] : never;

/**
 * Spread union of the required and spec-dependent catalogues — the
 * full standard MD3 role set as a flat array. `standardRoles[number]`
 * equals {@link StandardRole}.
 */
export const standardRoles = [
  ...requiredStandardRoles,
  ...specDependentRoles,
] as const;

/**
 * Standard Material Design 3 role catalogue — the union of every
 * standard role name across every spec version. For the
 * spec-narrowed view used by {@link ModalRoles}, see
 * {@link SpecDependentRole}.
 */
export type StandardRole = typeof standardRoles[number];

/**
 * `on*` accessors pairing with the surface-container family. Not backed
 * by MCU's `MaterialDynamicColors`, so theme construction populates
 * them via enrichment (typically by inheriting from `onSurface`). On
 * the resolved {@link ModalTheme} every slot is present as `Hct`.
 */
export const extendedRoles = [
  'onSurfaceBright',
  'onSurfaceContainer',
  'onSurfaceContainerHigh',
  'onSurfaceContainerHighest',
  'onSurfaceContainerLow',
  'onSurfaceContainerLowest',
  'onSurfaceDim',
] as const;

/** `on*` accessors pairing with the surface-container family. */
export type ExtendedRole = typeof extendedRoles[number];

/**
 * Four-quad expansion of one extra-role name `K` into the role keys a
 * {@link ModalTheme} exposes for it: `K`, `on${Capitalize<K>}`,
 * `${K}Container`, `on${Capitalize<K>}Container`.
 *
 * `K` is constrained as `string` for ergonomics; the type system does
 * not reject an extra-role name that overlaps the standard or
 * extended MD3 role catalogues (e.g. `K = 'surface'`). Such
 * collisions are rejected at runtime when computing the theme —
 * choose extra-role names distinct from those catalogues.
 */
export type ExtraRole<K extends string> =
  `${K}Container` |
  `on${Capitalize<K>}` |
  `on${Capitalize<K>}Container` |
  K;

/**
 * Every role key a {@link ModalTheme} exposes for parameters `K` and
 * `S` — required standard roles, the extended `on*` surface-container
 * accessors, the spec-dependent `*Dim` slots gated by `S`, and the
 * four-quad expansion of every declared extra-role name in `K`.
 */
export type RoleKey<
  K extends string = never,
  S extends SpecVersion = SpecVersion,
> =
  ExtendedRole |
  ExtraRole<K> |
  RequiredStandardRole |
  SpecDependentRole<S>;

/**
 * Resolved role colours for one mode. Every value is `Hct`; ARGB
 * lives on the Recipe input side, and the Recipe→Theme transition is
 * the conversion boundary, so consumers never see an int role
 * accessor here.
 *
 * Every slot the type exposes is required and typed as `Hct` — the
 * spec parameter `S` gates the spec-dependent slots at the type
 * level, so the resolver never has to synthesise a value MCU hasn't
 * defined:
 *
 * - {@link RequiredStandardRole}: read directly from MCU's
 *   `DynamicScheme` accessors (some via the dedicated accessor
 *   rather than the `allColors` enumeration).
 * - {@link SpecDependentRole}<S>: the `*Dim` quartet, present in the
 *   type exactly when `S` ships them.
 * - {@link ExtendedRole}: populated by enrichment, typically
 *   inheriting from `onSurface`.
 * - {@link ExtraRole}<K>: populated from the resolved seed for `K`;
 *   the symmetry invariant on {@link Recipe} guarantees every
 *   declared extra is reachable in both modes.
 *
 * Read-only: consumers read role colours, never assign.
 */
export type ModalRoles<
  K extends string = never,
  S extends SpecVersion = SpecVersion,
> =
  { readonly [P in ExtendedRole]: Hct } &
  { readonly [P in ExtraRole<K>]: Hct } &
  { readonly [P in RequiredStandardRole]: Hct } &
  { readonly [P in SpecDependentRole<S>]: Hct };

/**
 * Resolved tonal-palette map for one mode, keyed by the bare palette
 * name (no `Palette` suffix — that suffix exists on MCU's
 * `DynamicScheme.primaryPalette`/… to disambiguate role-vs-palette
 * accessors when both live on the same object, a disambiguation the
 * Modal split obviates).
 *
 * The six MD3 core palette keys ({@link PaletteKey}) are always
 * present; one entry per declared extra-role name `K` joins them.
 */
export type ModalPalettes<K extends string = never> = {
  readonly [P in K | PaletteKey]: TonalPalette
};

/**
 * Per-mode unit of a {@link Theme}.
 *
 * - `mode`: `'dark'` or `'light'` — the mode this unit was built
 *   for. Mirrors the boolean `scheme.isDark` in caller-facing form.
 * - `scheme`: the live `DynamicScheme` instance the role accessors
 *   were extracted from. Per-mode overlay palette pins are already
 *   applied.
 * - `source`: the resolved baseline source. Identical reference to
 *   `Theme.source` and to the other mode's `source` — per-mode
 *   primary overrides on `RecipeOverlay` pin that mode's primary
 *   palette directly, but do not influence the source.
 * - `palettes`: every tonal palette ({@link ModalPalettes}).
 * - `roles`: every resolved role colour ({@link ModalRoles}).
 */
export type ModalTheme<
  K extends string = never,
  S extends SpecVersion = SpecVersion,
> = {
  readonly mode: Mode

  readonly scheme: DynamicScheme
  readonly source: Hct

  readonly palettes: ModalPalettes<K>
  readonly roles: ModalRoles<K, S>
};

/**
 * Resolved theme computed from a {@link Recipe}.
 *
 * Composed of two {@link ModalTheme} units — one per mode — sharing
 * the global substrate (`contrast`, `specVersion`, `variant`) and
 * the single baseline `source`. `theme.dark.source` and
 * `theme.light.source` both equal `theme.source` by reference;
 * per-mode primary overrides on `RecipeOverlay` pin the per-mode
 * primary palette raw, but they do not anchor the source — only the
 * baseline does.
 */
export type Theme<
  K extends string = never,
  S extends SpecVersion = SpecVersion,
> = {
  /**
   * Baseline source colour — the resolved `recipe.seeds.primary`.
   * Equals `dark.source` and `light.source` by construction;
   * per-mode primary overrides on `RecipeOverlay` pin palettes raw,
   * not the source.
   */
  readonly source: Hct

  /** Resolved contrast level, range [-1, 1]. Global, not per-mode. */
  readonly contrast: number
  /**
   * The MCU spec year pinned by the resolved library preset. Records
   * the recipe's request verbatim — `theme.dark.scheme.specVersion`
   * may diverge because MCU's `maybeFallbackSpecVersion` normalises
   * the request against the variant's supported set (e.g. `CONTENT`
   * only ships on `'2021'`).
   */
  readonly specVersion: S
  /** The MCU variant pinned by the resolved library preset. */
  readonly variant: Variant

  /** Dark-mode unit: source, scheme, role colours, and palettes. */
  readonly dark: ModalTheme<K, S>
  /** Light-mode unit: source, scheme, role colours, and palettes. */
  readonly light: ModalTheme<K, S>
};
