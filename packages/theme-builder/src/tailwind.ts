import {
  StandardDynamicSchemeKey,

  makeColors,
} from './colors';

import {
  Hct,
  HexColor,
  hct,
} from './dynamic-color';

import type { Config as TailwindConfig } from 'tailwindcss';

// types
//
interface ColorConfig {
  value: HexColor
  harmonize?: boolean // default: true
  shades?: boolean // default: true
}

interface MaterialColorConfig {
  primary: HexColor | ColorConfig
  [name: string]: HexColor | ColorConfig
}

// helpers
//
interface TColorData {
  value: Hct
  harmonize: boolean
  shades: boolean
}

function flattenColorConfig(c: HexColor | ColorConfig): TColorData {
  if (typeof c !== 'string') return {
    value: hct(c.value),
    harmonize: c.harmonize || true,
    shades: c.shades || true,
  };

  return {
    value: hct(c),
    harmonize: true,
    shades: true,
  };
}

function flattenColorConfigTable(colors: { [name: string]: HexColor | ColorConfig }) {
  const out: Partial<{
    [K in keyof typeof colors]: TColorData
  }> = {};

  for (const [name, value] of Object.entries(colors)) {
    out[name] = flattenColorConfig(value);
  }

  return out as {
    [K in keyof typeof colors]: TColorData
  };
}

export function withMaterialColors(
  scheme: StandardDynamicSchemeKey = 'content',
  contrastLevel: number = 0,
  colors: MaterialColorConfig,
) {
  const { primary, ...extraColors } = { ...colors };

  const source = flattenColorConfig(primary);
  const customColors = flattenColorConfigTable(extraColors);

  makeColors(source.value, scheme, contrastLevel, customColors);
};
