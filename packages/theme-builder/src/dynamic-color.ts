// imports
//
import {
  type Color,
  DynamicScheme,
  Hct,

  argb,
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
  CustomDynamicColorKey,

  standardDynamicColors,
  customDynamicColors,
  StandardPaletteKey,
  standardPaletteKeyColors,
} from './dynamic-color-data';

// types
//

/**
 * ColorOptions describes how a color must be processed.
 */
export interface ColorOptions {
  value: Color

  /** name allows us to customize the tailwindcss color name */
  name?: string

  /** harmonize indicates the value must be blended to the source color */
  harmonize?: boolean
};

type StandardDynamicColors = { [K in StandardDynamicColorKey]: Hct };
type StandardPaletteColors = { [K in StandardPaletteKey]: Hct };

type CustomDynamicColors<T extends string> = { [K in CustomDynamicColorKey<KebabCase<T>>]: Hct };

export function makeStandardColorsFromScheme(scheme: DynamicScheme) {
  const out: Partial<StandardDynamicColors> = {};

  for (const [name, dc] of Object.entries(standardDynamicColors)) {
    out[name as StandardDynamicColorKey] = dc.getHct(scheme);
  }

  return out as StandardDynamicColors;
}

export function makeStandardPaletteFromScheme(scheme: DynamicScheme) {
  const out: Partial<StandardPaletteColors> = {};

  for (const [name, dc] of Object.entries(standardPaletteKeyColors)) {
    out[name as StandardPaletteKey] = dc.getHct(scheme);
  }

  return out as StandardPaletteColors;
}

function flattenColorOptions<K extends string>(options: Record<K, ColorOptions>) {
  const out: Partial<Record<K, ColorOptions>> = {};
  for (const name in options) {
    const opt = options[name];
    let value: ColorOptions;

    if (opt instanceof Hct) {
      value = { value: opt };
    } else if (typeof opt === 'object') {
      value = { value: hct(opt.value), harmonize: opt.harmonize };
    } else {
      value = { value: hct(opt) };
    }

    out[name] = value;
  }
  return out as Record<K, ColorOptions>;
}

function customColor(source: Hct, name: string, option: ColorOptions) {
  const value = argb(option.value);
  const blend = option.harmonize === undefined ? true : option.harmonize;

  return customColorFromArgb(source.toInt(), {
    name,
    value,
    blend,
  });
}

export function makeCustomColors<K extends string>(source: Color, colors: Record<K, ColorOptions>) {
  const $source = hct(source);
  const $colors = flattenColorOptions(colors);

  type customDynamicColors = CustomDynamicColors<K>;

  const names: Array<KebabCase<K>> = [];
  const darkColors: Partial<customDynamicColors> = {};
  const lightColors: Partial<customDynamicColors> = {};

  for (const color in $colors) {
    const kebabName = kebabCase(color) as KebabCase<K>;
    const { dark, light } = customColor($source, color, $colors[color]);

    names.push(kebabName);

    for (const [pattern, fn] of Object.entries(customDynamicColors)) {
      const name = pattern.replace('{}', kebabName) as keyof customDynamicColors;

      darkColors[name] = Hct.fromInt(fn(dark));
      lightColors[name] = Hct.fromInt(fn(light));
    }
  }

  return {
    source,
    colors: names,
    dark: darkColors as Prettify<customDynamicColors>,
    light: lightColors as Prettify<customDynamicColors>,
  };
}
