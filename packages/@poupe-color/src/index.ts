import pkg from '../package.json';

// MCU classes / enum re-exported value-form so consumers get both the
// runtime binding and the type binding inherent to class declarations.
export {
  Hct,
  TonalPalette,

  DynamicScheme,
  Variant,
} from '@poupe/material-color-utilities';

export {
  // MCU surface — types only
  type PaletteKey,
  type SpecVersion,

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

// Theme computation.
export {
  computeTheme,
} from './theme';

// Runtime helpers.
export {
  argb,
  argbFromColord,
  argbFromHCT,

  getRandomColor,

  camelCase,
  capitalize,

  keys,
  unsafeKeys,
} from './utils';

/** `@poupe/color` package version, sourced from `package.json`. */
export const VERSION: string = pkg.version;
