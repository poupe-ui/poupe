import type { CamelCase } from 'type-fest';

import {
  argb,
  type ARGB,
  type Recipe,
  type SeedOptions,
  type SeedsMap,
  type SpecVersion,
  Variant,
} from '@poupe/color';

import {
  camelCase,
  keys,
} from '@poupe/css';

import {
  type Color,
  hct,
} from '../core';

import {
  type CustomColorOptions,
  type ThemeColors,
} from './types';

import {
  flattenColorOptions,
  flattenPartialColorOptions,
} from './palettes';

import {
  type DynamicSchemeKey,
  dynamicSchemes,
} from './data';

/**
 * Stamp a `Color` (bare) or `{ value: Color }` wrapper into a branded
 * `ARGB`.
 */
const getColor = (c: Color | { value: Color }): ARGB =>
  argb(hct(flattenColorOptions(c).value));

/**
 * Resolve a {@link DynamicSchemeKey} (or a TS-bypass string,
 * or `undefined`) to its MCU `Variant`. Any input that does not name
 * a key in {@link dynamicSchemes} falls back to `'content'`,
 * matching theme-builder's fallback.
 */
const getVariant = (scheme: DynamicSchemeKey | undefined): Variant => {
  const key: DynamicSchemeKey =
    scheme !== undefined && scheme in dynamicSchemes ?
      scheme :
      'content';
  return dynamicSchemes[key];
};

/**
 * Pair an MCU {@link Variant} with its `SpecVersion`. `Variant.CONTENT`
 * pairs with `'2021'`, matching MCU's documented `Scheme.lightContent`
 * ↔ `SchemeContent` pairing. Every other variant pairs with `'2025'`.
 */
const getSpecVersion = (variant: Variant): SpecVersion =>
  variant === Variant.CONTENT ? '2021' : '2025';

/**
 * Build a `@poupe/color` {@link Recipe} from theme-builder's
 * `ThemeColors<K>` input.
 *
 * Translation rules:
 *
 * - `primary` extracts its value (bare or `{ value }` form) into
 *   `Recipe.seeds.primary` as a bare `ARGB`.
 * - Other core slots and extras pass through, with each value
 *   stamped to `ARGB`. Undefined slots are skipped.
 * - `harmonize` maps to `blend`: `harmonize: false` emits the
 *   `{ value, blend: false }` opt-out form; anything else emits the
 *   bare-`ARGB` form.
 * - Extras camel-case their keys; the input `K` survives the
 *   transform as `CamelCase<K>` on the output.
 * - `scheme` resolves to an MCU `Variant` and its paired `SpecVersion`.
 * - `contrastLevel` passes through to `Recipe.contrast`.
 *
 * @throws TypeError when `colors.primary` resolves to an undefined
 *   value.
 */
export const recipeFromThemeColors = <K extends string>(
  colors: ThemeColors<K>,
  scheme?: DynamicSchemeKey,
  contrastLevel: number = 0,
): Recipe<CamelCase<K>> => {
  const { primary, ...rest } = colors;

  const primaryFlat = flattenPartialColorOptions(primary);
  if (primaryFlat.value === undefined) {
    throw new TypeError(
      'recipeFromThemeColors: missing required `primary` value',
    );
  }

  type SeedKey = Exclude<keyof SeedsMap<CamelCase<K>>, 'primary'>;
  const extras: { [P in SeedKey]?: SeedOptions } = {};

  for (const rawKey of keys(rest)) {
    const raw = rest[rawKey] as Color | CustomColorOptions | undefined;
    const flat = flattenPartialColorOptions(raw);
    if (flat.value === undefined) continue;

    const a = getColor(flat.value);
    const harmonize = flat.harmonize ?? true;
    const slot = camelCase(rawKey as string) as SeedKey;

    extras[slot] = harmonize ? a : { blend: false, value: a };
  }

  const seeds: SeedsMap<CamelCase<K>> = {
    ...extras,
    primary: getColor(primary),
  };

  const variant = getVariant(scheme);
  const specVersion = getSpecVersion(variant);

  return {
    specVersion,
    variant,
    contrast: contrastLevel,
    seeds,
  };
};
