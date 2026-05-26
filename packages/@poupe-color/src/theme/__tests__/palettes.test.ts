import {
  Blend,
  Hct,
  TonalPalette,
  Variant,
} from '@poupe/material-color-utilities';

import {
  describe,
  expect,
  it,
} from 'vitest';

import type { ARGB } from '../../types';
import {
  argb,
  argbFromHCT,
} from '../../utils';

import {
  fillCorePalettes,
  makePalettes,
  overlayCorePalettes,
} from '../palettes';

const blue = argb('#0a84ff');
const green = argb('#34c759');

const harmonised = (seed: ARGB, target: ARGB): ARGB =>
  argbFromHCT(Hct.fromInt(Blend.harmonize(seed, target)));

const source = Hct.fromInt(blue);
const substrate = {
  contrast: 0,
  specVersion: '2025' as const,
  variant: Variant.CONTENT,
};

describe('makePalettes', () => {
  it('returns an empty map when the table is undefined', () => {
    const out = makePalettes(source, undefined, true, Hct.fromInt);

    expect(out).toEqual({});
  });

  it('skips slots whose entries are undefined', () => {
    const out = makePalettes<'brand' | 'primary'>(
      source,
      { primary: undefined, brand: green },
      true,
      Hct.fromInt,
    );

    expect(out.primary).toBeUndefined();
    expect(out.brand).toBeDefined();
  });

  it('harmonises bare-value entries on defaultBlend=true', () => {
    const out = makePalettes<'brand'>(
      source,
      { brand: green },
      true,
      Hct.fromInt,
    );

    // Default-blend baseline path: seed harmonises against source
    // before TonalPalette construction. keyColor matches the manual
    // Blend.harmonize→Hct round-trip.
    expect(out.brand?.keyColor.toInt()).toBe(harmonised(green, blue));
  });

  it('passes bare-value entries through raw on defaultBlend=false', () => {
    const out = makePalettes<'brand'>(
      source,
      { brand: green },
      false,
      Hct.fromInt,
    );

    // Default-blend overlay path: seed bypasses harmonisation.
    expect(out.brand?.keyColor.toInt()).toBe(green);
  });

  it('honours an explicit blend flag against the contextual default', () => {
    const optInOverlay = makePalettes<'brand'>(
      source,
      { brand: { value: green, blend: true } },
      false, // overlay default
      Hct.fromInt,
    );
    const optOutBaseline = makePalettes<'brand'>(
      source,
      { brand: { value: green, blend: false } },
      true, // baseline default
      Hct.fromInt,
    );

    // Explicit blend overrides the contextual default — opt-in on
    // overlay harmonises, opt-out on baseline runs raw.
    expect(optInOverlay.brand?.keyColor.toInt()).toBe(harmonised(green, blue));
    expect(optOutBaseline.brand?.keyColor.toInt()).toBe(green);
  });

  it('infers K from the literal table for extras', () => {
    const out = makePalettes(
      source,
      { brand: green, accent: green },
      true,
      Hct.fromInt,
    );

    expect(out.brand).toBeDefined();
    expect(out.accent).toBeDefined();
  });
});

describe('fillCorePalettes', () => {
  it('materialises every slot when given no pins', () => {
    // MCU's variant pipeline runs against `sourceColorHct = source`
    // and derives all six palettes from scratch.
    const out = fillCorePalettes(source, {}, substrate);

    expect(out.errorPalette).toBeDefined();
    expect(out.neutralPalette).toBeDefined();
    expect(out.neutralVariantPalette).toBeDefined();
    expect(out.primaryPalette).toBeDefined();
    expect(out.secondaryPalette).toBeDefined();
    expect(out.tertiaryPalette).toBeDefined();
  });

  it('reads a pinned slot back by reference', () => {
    // The pin threads into MCU as an override and reads back
    // unchanged — identity, not just structural equality.
    const pin = TonalPalette.fromInt(green);
    const out = fillCorePalettes(source, { primary: pin }, substrate);

    expect(out.primaryPalette).toBe(pin);
  });

  it('leaves unpinned slots driven by MCU', () => {
    // The pin shadows only the primary slot; every other palette
    // is variant-derived from `source` in both runs.
    const pin = TonalPalette.fromInt(green);
    const withPin = fillCorePalettes(source, { primary: pin }, substrate);
    const without = fillCorePalettes(source, {}, substrate);

    expect(withPin.neutralPalette.keyColor.toInt())
      .toBe(without.neutralPalette.keyColor.toInt());
    expect(withPin.tertiaryPalette.keyColor.toInt())
      .toBe(without.tertiaryPalette.keyColor.toInt());
  });

  it('reads every pin back when all six are supplied', () => {
    const pin = TonalPalette.fromInt(green);
    const out = fillCorePalettes(source, {
      error: pin,
      neutral: pin,
      neutralVariant: pin,
      primary: pin,
      secondary: pin,
      tertiary: pin,
    }, substrate);

    expect(out.errorPalette).toBe(pin);
    expect(out.neutralPalette).toBe(pin);
    expect(out.neutralVariantPalette).toBe(pin);
    expect(out.primaryPalette).toBe(pin);
    expect(out.secondaryPalette).toBe(pin);
    expect(out.tertiaryPalette).toBe(pin);
  });
});

describe('overlayCorePalettes', () => {
  const baseline = fillCorePalettes(source, {}, substrate);

  it('returns baseline by reference when the overlay is empty', () => {
    // Cross-mode reference invariant: an empty overlay means dark
    // and light share the baseline palette set verbatim.
    expect(overlayCorePalettes(baseline, {})).toBe(baseline);
  });

  it('returns baseline by reference when the overlay carries only undefined entries', () => {
    // `undefined` is the cascade-revert sentinel — it does not
    // count as a pin, so the early-bail invariant still holds.
    expect(overlayCorePalettes(baseline, { primary: undefined })).toBe(baseline);
  });

  it('replaces only the pinned slot, leaving others by reference', () => {
    const pin = TonalPalette.fromInt(green);
    const out = overlayCorePalettes(baseline, { tertiary: pin });

    // A real pin produces a fresh `SchemePalettes` and replaces
    // exactly the pinned slot; unpinned slots stay reference-equal
    // to their baseline counterpart.
    expect(out).not.toBe(baseline);
    expect(out.tertiaryPalette).toBe(pin);
    expect(out.primaryPalette).toBe(baseline.primaryPalette);
    expect(out.neutralPalette).toBe(baseline.neutralPalette);
    expect(out.errorPalette).toBe(baseline.errorPalette);
  });

  it('replaces every slot when fully pinned', () => {
    const pin = TonalPalette.fromInt(green);
    const out = overlayCorePalettes(baseline, {
      error: pin,
      neutral: pin,
      neutralVariant: pin,
      primary: pin,
      secondary: pin,
      tertiary: pin,
    });

    expect(out.errorPalette).toBe(pin);
    expect(out.neutralPalette).toBe(pin);
    expect(out.neutralVariantPalette).toBe(pin);
    expect(out.primaryPalette).toBe(pin);
    expect(out.secondaryPalette).toBe(pin);
    expect(out.tertiaryPalette).toBe(pin);
  });
});
