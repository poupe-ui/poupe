// imports
//
import {
  type Color,
  DynamicScheme,
  Hct,

  argbFromHct,
  customColorFromArgb,
  hct,
} from './core';

import {
  type KebabCase,
  type Prettify,

  kebabCase,
} from './utils';

import {
  StandardDynamicColorKey,
  StandardDynamicSchemeKey,
  CustomDynamicColorKey,

  standardDynamicSchemes,
  standardDynamicColors,
  customDynamicColors,
} from './dynamic-color-data';

// types
//
interface CustomColorOption {
  value: Hct
  harmonize?: boolean
};

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

function flattenColorOptions<K extends string>(options: Record<K, ColorOption>) {
  const out: Partial<Record<K, CustomColorOption>> = {};
  for (const name in options) {
    const opt = options[name];
    let value: CustomColorOption;

    if (opt instanceof Hct) {
      value = { value: opt };
    } else if (typeof opt === 'object') {
      value = { value: hct(opt.value), harmonize: opt.harmonize };
    } else {
      value = { value: hct(opt) };
    }

    out[name] = value;
  }
  return out as Record<K, CustomColorOption>;
}

function customColor(source: Hct, name: string, option: CustomColorOption) {
  const value = argbFromHct(option.value);
  const blend = option.harmonize === undefined ? true : option.harmonize;

  return customColorFromArgb(source.toInt(), {
    name,
    value,
    blend,
  });
}

export function makeCustomColors<K extends string>(source: Color, colors: Record<K, ColorOption>) {
  const $source = hct(source);
  const $colors = flattenColorOptions(colors);

  type customDynamicColors = CustomDynamicColors<K>;

  const darkColors: Partial<customDynamicColors> = {};
  const lightColors: Partial<customDynamicColors> = {};

  for (const name in $colors) {
    const kebabName = kebabCase(name);
    const { dark, light } = customColor($source, name, $colors[name]);

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
