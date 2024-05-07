import {
  Color,

  hct,
} from './dynamic-color';

import {
  DynamicScheme,
  SchemeContent,
  SchemeExpressive,
  SchemeFidelity,
  SchemeMonochrome,
  SchemeNeutral,
  SchemeTonalSpot,
  SchemeVibrant,
} from '@material/material-color-utilities';

// re-export
//
export {
  DynamicScheme,
} from '@material/material-color-utilities';

// DynamicScheme
//
export type standardDynamicSchemeFactory = (primary: Color, isDark: boolean, contrastLevel: number) => DynamicScheme;

export const standardDynamicSchemes: Record<string, standardDynamicSchemeFactory> = {
  content: (primary, isDark = false, contrastLevel = 0) => new SchemeContent(hct(primary), isDark, contrastLevel),
  expressive: (primary, isDark = false, contrastLevel = 0) => new SchemeExpressive(hct(primary), isDark, contrastLevel),
  fidelity: (primary, isDark = false, contrastLevel = 0) => new SchemeFidelity(hct(primary), isDark, contrastLevel),
  monochrome: (primary, isDark = false, contrastLevel = 0) => new SchemeMonochrome(hct(primary), isDark, contrastLevel),
  neutral: (primary, isDark = false, contrastLevel = 0) => new SchemeNeutral(hct(primary), isDark, contrastLevel),
  tonalSpot: (primary, isDark = false, contrastLevel = 0) => new SchemeTonalSpot(hct(primary), isDark, contrastLevel),
  vibrant: (primary, isDark = false, contrastLevel = 0) => new SchemeVibrant(hct(primary), isDark, contrastLevel),
};

export type standardDynamicSchemeKey =
  'content' | 'expressive' | 'fidelity' |
  'monochrome' | 'neutral' | 'tonalSpot' | 'vibrant';
