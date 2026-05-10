import pkg from '../package.json';

export {
  // MCU surface
  type DynamicScheme,
  type Hct,
  type PaletteKey,
  type SpecVersion,
  type TonalPalette,
  type Variant,

  paletteKeys,

  // Branded colour primitive
  type ARGB,
  asARGB,

  // Theme shape
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

  // Recipe — dense intermediate consumed when computing a theme.
  type ModalSeedsMap,
  type Recipe,
  type RecipeOverlay,
  type SeedOptions,
  type SeedsMap,
  type SeedValue,
} from './types';

// Colour-conversion helpers
export {
  argb,
  argbFromColord,
  argbFromHCT,
} from './utils';

/** `@poupe/color` package version, sourced from `package.json`. */
export const VERSION: string = pkg.version;
