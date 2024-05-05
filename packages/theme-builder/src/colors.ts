import {
  kebabCase,
} from './utils';

import {
  ColorGroup,
  DynamicScheme,
  Hct,
  MaterialDynamicColors,
  SchemeContent,
  SchemeExpressive,
  SchemeFidelity,
  SchemeMonochrome,
  SchemeNeutral,
  SchemeTonalSpot,
  SchemeVibrant,
  argbFromHex,
  hexFromArgb,
  customColor,
} from '@material/material-color-utilities';

// types
//
export type HexColor = `#${string}`;
export type ColorOption = HexColor | { value: HexColor, harmonize?: boolean };

export class Color {
  private _hct?: Hct;
  private _argb?: number;
  private _hex?: HexColor;

  constructor(value: Hct | HexColor | number) {
    this.set(value);
  }

  set(value: Hct | HexColor | number) {
    if (typeof value === 'string') {
      this._argb = argbFromHex(value);
      this._hct = Hct.fromInt(this._argb);
      this._hex = value;
    } else if (typeof value === 'number') {
      this._hct = Hct.fromInt(value);
      this._argb = value;
      this._hex = undefined;
    } else {
      this._hct = value;
      this._argb = undefined;
      this._hex = undefined;
    }
  }

  get hct(): Hct {
    if (this._hct)
      return this._hct;

    throw 'unreachable';
  }

  get argb(): number {
    if (this._argb === undefined) {
      this._argb = this.hct.toInt();
    }
    return this._argb;
  }

  get hex(): HexColor {
    if (this._hex === undefined) {
      this._hex = hexFromArgb(this.argb) as HexColor;
    }
    return this._hex;
  }
}

export type ColorTable = { [name: string]: Color };
export type ColorOptionTable = { [name: string]: ColorOption };

// work tables
//
const standardDynamicSchemes: { [name: string]: typeof DynamicScheme.constructor } = {
  content: SchemeContent,
  expressive: SchemeExpressive,
  fidelity: SchemeFidelity,
  monochrome: SchemeMonochrome,
  neutral: SchemeNeutral,
  tonalSport: SchemeTonalSpot,
  vibrant: SchemeVibrant,
};

const customDynamicColors: { [pattern: string]: (cc: ColorGroup) => number } = {
  '{}': (cc: ColorGroup) => cc.color,
  '{}-container': (cc: ColorGroup) => cc.colorContainer,
  'on-{}': (cc: ColorGroup) => cc.onColor,
  'on-{}-container': (cc: ColorGroup) => cc.onColorContainer,
};

const standardDynamicColors = {
  // {}
  'background': MaterialDynamicColors.background,
  'inverse-surface': MaterialDynamicColors.inverseSurface,
  // surface-{}
  'surface': MaterialDynamicColors.surface,
  'surface-dim': MaterialDynamicColors.surfaceDim,
  'surface-bright': MaterialDynamicColors.surfaceBright,
  'surface-variant': MaterialDynamicColors.surfaceVariant,
  'surface-tint': MaterialDynamicColors.surfaceTint,
  // surface-container-{}
  'surface-container-lowest': MaterialDynamicColors.surfaceContainerLowest,
  'surface-container-low': MaterialDynamicColors.surfaceContainerLow,
  'surface-container': MaterialDynamicColors.surfaceContainer,
  'surface-container-high': MaterialDynamicColors.surfaceContainerHigh,
  'surface-container-highest': MaterialDynamicColors.surfaceContainerHighest,

  // on-{}
  'on-background': MaterialDynamicColors.onBackground,
  'on-inverse-surface': MaterialDynamicColors.inverseOnSurface,
  // on-surface-{}
  'on-surface': MaterialDynamicColors.onSurface,
  'on-surface-dim': MaterialDynamicColors.onSurface,
  'on-surface-bright': MaterialDynamicColors.onSurface,
  'on-surface-variant': MaterialDynamicColors.onSurfaceVariant,
  'on-surface-tint': MaterialDynamicColors.onSurface,
  // on-surface-container-{}
  'on-surface-container-lowest': MaterialDynamicColors.onSurface,
  'on-surface-container-low': MaterialDynamicColors.onSurface,
  'on-surface-container': MaterialDynamicColors.onSurface,
  'on-surface-container-high': MaterialDynamicColors.onSurface,
  'on-surface-container-highest': MaterialDynamicColors.onSurface,

  // {}
  'primary': MaterialDynamicColors.primary,
  'secondary': MaterialDynamicColors.secondary,
  'tertiary': MaterialDynamicColors.tertiary,
  'error': MaterialDynamicColors.error,

  // {}-container
  'primary-container': MaterialDynamicColors.primaryContainer,
  'secondary-container': MaterialDynamicColors.secondaryContainer,
  'tertiary-container': MaterialDynamicColors.tertiaryContainer,
  'error-container': MaterialDynamicColors.errorContainer,

  // on-{}
  'on-primary': MaterialDynamicColors.onPrimary,
  'on-secondary': MaterialDynamicColors.onSecondary,
  'on-tertiary': MaterialDynamicColors.onTertiary,
  'on-error': MaterialDynamicColors.onError,

  // on-{}-container
  'on-primary-container': MaterialDynamicColors.onPrimaryContainer,
  'on-secondary-container': MaterialDynamicColors.onSecondaryContainer,
  'on-tertiary-container': MaterialDynamicColors.onTertiaryContainer,
  'on-error-container': MaterialDynamicColors.onErrorContainer,

  // misc
  'inverse-primary': MaterialDynamicColors.inversePrimary,

  'outline': MaterialDynamicColors.outline,
  'outline-variant': MaterialDynamicColors.outlineVariant,
};

type standardDynamicSchemeKey = keyof typeof standardDynamicSchemes;

export function makeStandardColorsFromScheme(scheme: DynamicScheme) {
  const out: ColorTable = {};

  for (const [name, dc] of Object.entries(standardDynamicColors)) {
    out[name] = new Color(dc.getHct(scheme));
  }

  return out;
}

function expandOption(o: ColorOption) {
  let blend: boolean;
  let value: number;

  if (typeof o === 'string') {
    value = argbFromHex(o);
    blend = false;
  } else {
    value = argbFromHex(o.value);
    blend = o.harmonize || false;
  }

  return { value, blend };
}

export function makeCustomColors(source: HexColor | Color, colors: ColorOptionTable = {}) {
  source = typeof source === 'string' ? new Color(source) : source;

  const darkColors: ColorTable = {};
  const lightColors: ColorTable = {};

  for (const [name, option] of Object.entries(colors)) {
    const kebabName = kebabCase(name);
    const { value, blend } = expandOption(option);
    const { dark, light } = customColor(source.argb, { name, value, blend });

    for (const [pattern, fn] of Object.entries(customDynamicColors)) {
      const name = pattern.replace('{}', kebabName);

      darkColors[name] = new Color(fn(dark));
      lightColors[name] = new Color(fn(light));
    }
  }

  return {
    source,
    dark: darkColors,
    light: lightColors,
  };
}

export function makeColors(source: HexColor | Color,
  scheme: standardDynamicSchemeKey = 'content',
  contrastLevel: number,
  customColors: ColorOptionTable = {},
) {
  source = typeof source === 'string' ? new Color(source) : source;

  const schemeObject = standardDynamicSchemes[scheme] || standardDynamicSchemes.content;
  const darkScheme = schemeObject(source.hct, true, contrastLevel);
  const lightScheme = schemeObject(source.hct, false, contrastLevel);

  const { dark: darkCustomColors, light: lightCustomColors } = makeCustomColors(source, customColors);

  const dark = {
    ...makeStandardColorsFromScheme(darkScheme),
    ...darkCustomColors,
  };

  const light = {
    ...makeStandardColorsFromScheme(lightScheme),
    ...lightCustomColors,
  };

  // TODO: generate unique type for dark/light
  return {
    source,
    scheme: schemeObject,
    darkScheme,
    lightScheme,
    dark: dark as ColorTable,
    light: light as ColorTable,
  };
}
