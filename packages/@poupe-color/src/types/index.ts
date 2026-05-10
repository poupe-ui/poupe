// MCU surface — classes and enums in value form (so consumers get
// both runtime and type bindings), plus the palette catalogue.
export {
  DynamicScheme,
  Hct,
  type PaletteKey,
  type SpecVersion,
  TonalPalette,
  Variant,

  paletteKeys,
} from './mcu';

// Branded colour primitive.
export {
  type ARGB,
  asARGB,
} from './argb';

// Theme shape — output of the Recipe → Theme pipeline; with the
// role catalogues from which the role types derive.
export {
  type ExtendedRole,
  type ExtraRole,
  type ModalPalettes,
  type ModalRoles,
  type ModalTheme,
  type Mode,
  type RequiredStandardRole,
  type RoleKey,
  type SpecDependentRole,
  type StandardRole,
  type Theme,

  extendedRoles,
  modes,
  requiredStandardRoles,
  specDependentRoles,
  specsWithDim,
  standardRoles,
} from './theme';

// Recipe — dense intermediate consumed when computing a theme.
export type {
  ModalSeedsMap,
  Recipe,
  RecipeOverlay,
  SeedOptions,
  SeedsMap,
  SeedValue,
} from './recipe';
