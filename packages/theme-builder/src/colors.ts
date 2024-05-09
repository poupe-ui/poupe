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

type StandardDynamicColorKey = keyof typeof standardDynamicColors;
type StandardDynamicColors = { [K in StandardDynamicColorKey]: Hct };

export function makeStandardColorsFromScheme(scheme: DynamicScheme) {
  const out: Partial<StandardDynamicColors> = {};

  for (const [name, dc] of Object.entries(standardDynamicColors)) {
    out[name as StandardDynamicColorKey] = dc.getHct(scheme);
  }

  return out as StandardDynamicColors;
}

function customColor(source: Hct, name: string, option: ColorOption) {
  const value = argbFromHex(typeof option === 'object' ? option.value : option);
  const blend = typeof option === 'object' ? option.harmonize || true : true;

  return customColorFromArgb(source.toInt(), {
    name,
    value,
    blend,
  });
}

export function makeCustomColors(source: Color, colors = {} satisfies Record<string, ColorOption>) {
  source = hct(source);

  const darkColors: Record<string, Hct> = {};
  const lightColors: Record<string, Hct> = {};

  for (const [name, option] of Object.entries(colors)) {
    const kebabName = kebabCase(name);
    const { dark, light } = customColor(source, name, option as ColorOption);

    for (const [pattern, fn] of Object.entries(customDynamicColors)) {
      const name = pattern.replace('{}', kebabName);

      darkColors[name] = Hct.fromInt(fn(dark));
      lightColors[name] = Hct.fromInt(fn(light));
    }
  }

  type customDynamicColors = {
    [K in keyof typeof darkColors]: Hct; // TODO: fixme
  };

  return {
    source,
    dark: darkColors as customDynamicColors,
    light: lightColors as customDynamicColors,
  };
}

export function makeColors(source: Color,
  scheme: standardDynamicSchemeKey = 'content',
  contrastLevel: number = 0,
  customColors = {} satisfies Record<string, ColorOption>,
) {
  source = hct(source);

  const schemeFactory = standardDynamicSchemes[scheme] || standardDynamicSchemes.content;
  const darkScheme = schemeFactory(source, true, contrastLevel);
  const lightScheme = schemeFactory(source, false, contrastLevel);

  const { dark: darkCustomColors, light: lightCustomColors } = makeCustomColors(source, customColors);
  const darkStandardColors = makeStandardColorsFromScheme(darkScheme);
  const lightStandardColors = makeStandardColorsFromScheme(lightScheme);

  type dynamicColors = typeof darkStandardColors & typeof darkCustomColors;

  const dark: dynamicColors = {
    ...darkStandardColors,
    ...darkCustomColors,
  };

  const light: dynamicColors = {
    ...lightStandardColors,
    ...lightCustomColors,
  };

  return {
    source,
    darkScheme,
    lightScheme,
    dark,
    light,
  };
}
