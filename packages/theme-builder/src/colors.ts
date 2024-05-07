import {
  kebabCase,
} from './utils';

import {
  Color,
  HexColor,
  Hct,

  argbFromHex,
  hct,
  customColorFromArgb,
} from './dynamic-color';

import {
  DynamicScheme,
} from './dynamic-scheme';

import {
  standardDynamicSchemes,
  standardDynamicSchemeKey,
  standardDynamicColors,
  customDynamicColors,
} from './colors-data';

// types
//
export type ColorOption = HexColor | { value: HexColor, harmonize?: boolean };

export type ColorTable = { [name: string]: Hct };
export type ColorOptionTable = { [name: string]: ColorOption };

export function makeStandardColorsFromScheme(scheme: DynamicScheme) {
  const out: ColorTable = {};

  for (const [name, dc] of Object.entries(standardDynamicColors)) {
    out[name] = dc.getHct(scheme);
  }

  return out;
}

function customColor(source: Hct, name: string, option: ColorOption) {
  let blend: boolean;
  let value: number;

  if (typeof option === 'string') {
    value = argbFromHex(option);
    blend = true;
  } else {
    value = argbFromHex(option.value);
    blend = option.harmonize || true;
  }

  return customColorFromArgb(source.toInt(), {
    name,
    value,
    blend,
  });
}

export function makeCustomColors(source: Color, colors: ColorOptionTable = {}) {
  source = hct(source);

  const darkColors: ColorTable = {};
  const lightColors: ColorTable = {};

  for (const [name, option] of Object.entries(colors)) {
    const kebabName = kebabCase(name);
    const { dark, light } = customColor(source, name, option);

    for (const [pattern, fn] of Object.entries(customDynamicColors)) {
      const name = pattern.replace('{}', kebabName);

      darkColors[name] = Hct.fromInt(fn(dark));
      lightColors[name] = Hct.fromInt(fn(light));
    }
  }

  type customColorTable = {
    [K in keyof typeof darkColors]: Hct;
  };

  return {
    source,
    dark: darkColors as customColorTable,
    light: lightColors as customColorTable,
  };
}

export function makeColors(source: Color,
  scheme: standardDynamicSchemeKey = 'content',
  contrastLevel: number,
  customColors: ColorOptionTable = {},
) {
  source = hct(source);

  const schemeFactory = standardDynamicSchemes[scheme] || standardDynamicSchemes.content;
  const darkScheme = schemeFactory(source, true, contrastLevel);
  const lightScheme = schemeFactory(source, false, contrastLevel);

  const { dark: darkCustomColors, light: lightCustomColors } = makeCustomColors(source, customColors);

  const dark = {
    ...makeStandardColorsFromScheme(darkScheme),
    ...darkCustomColors,
  };

  const light = {
    ...makeStandardColorsFromScheme(lightScheme),
    ...lightCustomColors,
  };

  type dynamicColorTable = {
    [K in keyof typeof dark]: Hct;
  };

  return {
    source: source as Hct,
    darkScheme,
    lightScheme,
    dark: dark as dynamicColorTable,
    light: light as dynamicColorTable,
  };
}
