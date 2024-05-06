import {
  kebabCase,
} from './utils';

import {
  standardDynamicColors,
  standardDynamicSchemes,
  standardDynamicSchemeKey,
  customDynamicColors,
} from './mcu';

import {
  DynamicScheme,
  Hct,
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
