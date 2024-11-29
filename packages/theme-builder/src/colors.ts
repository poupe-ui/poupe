import {
  KebabCase,
  Prettify,
  kebabCase,
} from './utils';

import {
  Color,
  Hct,

  argb,
  hct,
  customColorFromArgb,
} from './dynamic-color';

import {
  DynamicScheme,
} from './dynamic-scheme';

import {
  StandardDynamicColorKey,
  StandardDynamicSchemeKey,
  CustomDynamicColorKey,

  standardDynamicSchemes,
  standardDynamicColors,
  customDynamicColors,
} from './colors-data';

// types
//
export type ColorOption = Color | { value: Color, harmonize?: boolean };

type StandardDynamicColors = { [K in StandardDynamicColorKey]: Hct };

type CustomDynamicColors<T extends string> = { [K in CustomDynamicColorKey<KebabCase<T>>]: Hct };

export function makeStandardColorsFromScheme(scheme: DynamicScheme) {
  const out: Partial<StandardDynamicColors> = {};

  for (const [name, dc] of Object.entries(standardDynamicColors)) {
    out[name as StandardDynamicColorKey] = dc.getHct(scheme);
  }

  return out as StandardDynamicColors;
}

function customColor(source: Hct, name: string, option: ColorOption) {
  if (option instanceof Hct || typeof option !== 'object') {
    option = { value: option };
  }

  const value = argb(option.value);
  const blend = option.harmonize || true;

  return customColorFromArgb(source.toInt(), {
    name,
    value,
    blend,
  });
}

export function makeCustomColors<Colors extends Record<string, ColorOption>>(source: Color, colors: Colors) {
  source = hct(source);

  type customDynamicColors = CustomDynamicColors<keyof Colors & string>;

  const darkColors: Partial<customDynamicColors> = {};
  const lightColors: Partial<customDynamicColors> = {};

  for (const [name, option] of Object.entries(colors)) {
    const kebabName = kebabCase(name);
    const { dark, light } = customColor(source, name, option);

    for (const [pattern, fn] of Object.entries(customDynamicColors)) {
      const name = pattern.replace('{}', kebabName) as keyof customDynamicColors;

      darkColors[name] = Hct.fromInt(fn(dark));
      lightColors[name] = Hct.fromInt(fn(light));
    }
  }

  return {
    source,
    dark: darkColors as Prettify<customDynamicColors>,
    light: lightColors as Prettify<customDynamicColors>,
  };
}

export function makeColors<CustomColors extends Record<string, ColorOption>>(source: Color,
  customColors: CustomColors = {} as CustomColors,
  scheme: StandardDynamicSchemeKey = 'content',
  contrastLevel: number = 0,
) {
  source = hct(source);

  const schemeFactory = standardDynamicSchemes[scheme] || standardDynamicSchemes.content;
  const darkScheme = schemeFactory(source, true, contrastLevel);
  const lightScheme = schemeFactory(source, false, contrastLevel);

  const { dark: darkCustomColors, light: lightCustomColors } = makeCustomColors(source, customColors);
  const darkStandardColors = makeStandardColorsFromScheme(darkScheme);
  const lightStandardColors = makeStandardColorsFromScheme(lightScheme);

  const dark = {
    ...darkStandardColors,
    ...darkCustomColors,
  };

  const light = {
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
