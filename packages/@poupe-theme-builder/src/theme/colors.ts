// imports
//
import type { KebabCase } from 'type-fest';

import {
  kebabCase,
  pairs,
  unsafeKeys,
} from '@poupe/css';

import {
  type Color,
  type CorePalettes,
  DynamicScheme,
  Hct,
  SchemeCmf,
  type SpecVersion,
  TonalPalette,
  Variant,

  hct,
  makeCustomColor,
  makeCustomColorFromPalette,
} from '../core';

import {
  type CustomDynamicColorKey,
  type StandardDynamicColorKey,
  type StandardPaletteKey,

  customDynamicColors,
  getAcceptedSpecVersions,
  standardDynamicColors,
  standardPalettes,
} from './data';

import {
  type ColorOptions,
} from './types';

// types
//

export type StandardDynamicColors = { [K in StandardDynamicColorKey]: Hct };
type StandardPaletteColors = { [K in KebabCase<StandardPaletteKey>]: Hct };
type StandardPalettes = { [K in KebabCase<StandardPaletteKey>]: TonalPalette };

export type CustomDynamicColors<T extends string> = { [K in CustomDynamicColorKey<KebabCase<T>>]: Hct };

export function makeStandardColorsFromScheme(scheme: DynamicScheme) {
  const out = {} as StandardDynamicColors;

  for (const [name, fn] of pairs(standardDynamicColors)) {
    out[name] = Hct.fromInt(fn(scheme));
  }

  return out;
}

export function makeStandardPaletteKeyColorsFromScheme(scheme: DynamicScheme) {
  const out = {} as StandardPaletteColors;
  for (const [kebabName, palette] of pairs(makeStandardPaletteFromScheme(scheme))) {
    out[kebabName] = palette.keyColor;
  }
  return out;
}

export function makeStandardPaletteFromScheme(scheme: DynamicScheme) {
  const out = {} as StandardPalettes;

  for (const [name, fn] of pairs(standardPalettes)) {
    const kebabName = kebabCase(name) as KebabCase<StandardPaletteKey>;
    out[kebabName] = fn(scheme);
  }

  return out;
}

export function makeCustomColors<K extends string>(source: Color, colors: Record<K, ColorOptions>) {
  const $source = hct(source);

  const colorOptions = {} as Record<KebabCase<K>, ColorOptions>;
  const palettes = {} as Record<KebabCase<K>, TonalPalette>;
  const darkColors = {} as CustomDynamicColors<K>;
  const lightColors = {} as CustomDynamicColors<K>;

  for (const [color, options] of pairs(colors)) {
    const kebabName = kebabCase(color) as KebabCase<K>;
    const $color = hct(options.value);
    const harmonize = options.harmonize ?? true;

    const { tones, dark, light } = makeCustomColor($color, harmonize ? $source : undefined, kebabName);

    colorOptions[kebabName] = options;
    palettes[kebabName] = tones;

    for (const [pattern, fn] of Object.entries(customDynamicColors)) {
      const name = pattern.replace('{}', kebabName) as keyof CustomDynamicColors<K>;

      darkColors[name] = fn(dark);
      lightColors[name] = fn(light);
    }
  }

  return {
    source,
    colors: unsafeKeys(colorOptions),
    colorOptions,
    palettes,
    dark: darkColors,
    light: lightColors,
  };
}

export function makeCustomColorsFromPalettes<K extends string>(colors: Record<K, TonalPalette> = {} as Record<K, TonalPalette>) {
  const palettes = {} as Record<KebabCase<K>, TonalPalette>;
  const darkColors = {} as CustomDynamicColors<K>;
  const lightColors = {} as CustomDynamicColors<K>;

  for (const [color, tones] of pairs(colors)) {
    const kebabName = kebabCase(color) as KebabCase<K>;
    const { dark, light } = makeCustomColorFromPalette(tones, kebabName);

    palettes[kebabName] = tones;
    for (const [pattern, fn] of pairs(customDynamicColors)) {
      const name = pattern.replace('{}', kebabName) as keyof CustomDynamicColors<K>;

      darkColors[name] = fn(dark);
      lightColors[name] = fn(light);
    }
  }

  return {
    colors: unsafeKeys(palettes),
    palettes,
    dark: darkColors,
    light: lightColors,
  };
}

/**
 * Resolve the spec version a variant should use, given a caller
 * preference. Throws `TypeError` when the variant is outside the
 * acceptance table (a future MCU enum value, a TS-bypass cast,
 * etc.) — theme-builder refuses to pass unsupported variants to
 * MCU's constructors. The variant's accepted specs come from
 * {@link getAcceptedSpecVersions}; selection is:
 *
 * - The preference is accepted: take it.
 * - Else the highest accepted spec strictly below the preference
 *   (downgrade — MCU's `maybeFallbackSpecVersion` rule for modern
 *   variants collapsing `'2026'` → `'2025'`).
 * - Else the lowest accepted spec (`accepted[0]`). For variants
 *   whose floor sits *above* the preference (`CMF` only accepts
 *   `'2026'`), this is an upgrade rather than a downgrade.
 */
const resolveSpecVersion = (variant: Variant, preferred?: SpecVersion): SpecVersion => {
  const accepted = getAcceptedSpecVersions(variant);
  const [floor] = accepted;
  if (floor === undefined) {
    throw new TypeError(`unsupported variant: ${variant}`);
  }

  const target = preferred ?? '2025';
  if (accepted.includes(target)) return target;

  for (let i = accepted.length - 1; i >= 0; i--) {
    const candidate = accepted[i];
    if (candidate !== undefined && candidate < target) return candidate;
  }

  return floor;
};

/**
 * Creates a dynamic color scheme based on the provided source color, variant, and other parameters.
 * Targets the `'phone'` platform. The MCU spec version mirrors
 * MCU's `maybeFallbackSpecVersion` rule plus the `SchemeCmf`
 * constraint:
 *
 * - `Variant.EXPRESSIVE`, `Variant.VIBRANT`, `Variant.TONAL_SPOT`,
 *   `Variant.NEUTRAL` default to `'2025'`; an explicit `'2021'`
 *   is honoured.
 * - `Variant.CMF` routes through `SchemeCmf` (MCU's dedicated CMF
 *   constructor) and is forced to `'2026'`. `palettes` is ignored
 *   for CMF — `SchemeCmf` computes its palettes from `source`.
 * - Every other variant (`CONTENT`, `FIDELITY`, `MONOCHROME`,
 *   `RAINBOW`, `FRUIT_SALAD`) is forced to `'2021'` regardless of
 *   what the caller passes.
 *
 * Throws `TypeError` for variants outside the acceptance table
 * (TS-bypass casts, future MCU enum values) rather than passing
 * them through to MCU.
 *
 * @param source - The source color in HCT color space
 * @param variant - The color scheme to apply
 * @param contrastLevel - The desired contrast level
 * @param isDark - Whether the scheme is for a dark or light theme
 * @param palettes - Optional color palettes to customize the scheme
 *   (ignored for `Variant.CMF`).
 * @param specVersion - MCU specification version. The effective
 *   value mirrors MCU's variant fallback (see above). Defaults to
 *   `'2025'` before the fallback applies.
 * @returns A configured DynamicScheme instance
 */
export function makeDynamicScheme(
  source: Hct,
  variant: Variant,
  contrastLevel: number,
  isDark: boolean,
  palettes: Partial<CorePalettes> = {},
  specVersion?: SpecVersion,
): DynamicScheme {
  const resolvedSpec = resolveSpecVersion(variant, specVersion);

  if (variant === Variant.CMF) {
    return new SchemeCmf(source, isDark, contrastLevel, resolvedSpec, 'phone');
  }

  return new DynamicScheme({
    sourceColorHct: source,
    variant,
    contrastLevel,
    isDark,
    primaryPalette: palettes.primary,
    secondaryPalette: palettes.secondary,
    tertiaryPalette: palettes.tertiary,
    neutralPalette: palettes.neutral,
    neutralVariantPalette: palettes.neutralVariant,
    errorPalette: palettes.error,
    specVersion: resolvedSpec,
    platform: 'phone',
  });
}
