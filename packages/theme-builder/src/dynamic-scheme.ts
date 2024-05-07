import {
  Color,
} from './dynamic-color';

import {
  DynamicScheme,
} from '@material/material-color-utilities';

// re-export
//
export {
  DynamicScheme,
} from '@material/material-color-utilities';

// DynamicScheme
//
export type standardDynamicSchemeFactory = (primary: Color, isDark: boolean, contrastLevel: number) => DynamicScheme;
