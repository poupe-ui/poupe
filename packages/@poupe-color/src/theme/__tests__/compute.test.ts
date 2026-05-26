import {
  Blend,
  DynamicScheme,
  Hct,
  TonalPalette,
  Variant,
} from '@poupe/material-color-utilities';

import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  type ARGB,
  type Recipe,
  requiredStandardRoles,
} from '../../types';
import {
  argb,
  argbFromHCT,
} from '../../utils';

import { computeTheme } from '../compute';

const BLUE = argb('#0a84ff');
// TONAL_SPOT preserves the requested specVersion under MCU's
// `maybeFallbackSpecVersion` (it sits in the pass-through set
// alongside NEUTRAL / EXPRESSIVE / VIBRANT). CONTENT and friends would
// silently downgrade to '2021' regardless of the recipe's request,
// turning every "2025 spec" assertion below into a '2021' one.
const BASE_SUBSTRATE = {
  variant: Variant.TONAL_SPOT,
  specVersion: '2025',
  contrast: 0,
} as const;

const makeRecipe = (overrides: Partial<Recipe> = {}): Recipe => ({
  ...BASE_SUBSTRATE,

  seeds: { primary: BLUE },

  ...overrides,
});

describe('computeTheme', () => {
  it('passes substrate fields through untouched', () => {
    const theme = computeTheme(makeRecipe());

    expect(theme.variant).toBe(Variant.TONAL_SPOT);
    expect(theme.specVersion).toBe('2025');
    expect(theme.contrast).toBe(0);
  });

  it('mirrors the single baseline source onto both modal themes', () => {
    const theme = computeTheme(makeRecipe());

    // The baseline anchors the only source; both modal themes receive
    // the same Hct instance, so reference identity holds.
    expect(theme.dark.source).toBe(theme.source);
    expect(theme.light.source).toBe(theme.source);
  });

  it('labels each modal theme with its mode', () => {
    const theme = computeTheme(makeRecipe());

    expect(theme.dark.mode).toBe('dark');
    expect(theme.light.mode).toBe('light');
  });

  it('ignores per-mode primary entries when anchoring the source', () => {
    // Per-mode overlays are raw palette overrides — they never
    // contribute to Theme.source. The baseline primary is the sole
    // anchor; per-mode primary entries reshape that mode's palette
    // but do not move the source.
    const theme = computeTheme(makeRecipe({
      seeds: { primary: BLUE },
      dark: { seeds: { primary: argb('#ff453a') } },
      light: { seeds: { primary: argb('#34c759') } },
    }));

    // theme.source equals the baseline primary exactly; both modes
    // carry that source by reference regardless of the overlays.
    expect(theme.source.toInt()).toBe(BLUE);
    expect(theme.dark.source).toBe(theme.source);
    expect(theme.light.source).toBe(theme.source);
  });

  it('produces all six core palettes on each modal theme', () => {
    const theme = computeTheme(makeRecipe());

    for (const modal of [theme.dark, theme.light]) {
      expect(modal.palettes.primary).toBeDefined();
      expect(modal.palettes.secondary).toBeDefined();
      expect(modal.palettes.tertiary).toBeDefined();
      expect(modal.palettes.neutral).toBeDefined();
      expect(modal.palettes.neutralVariant).toBeDefined();
      expect(modal.palettes.error).toBeDefined();
    }
  });

  it('populates every required standard role on each modal theme', () => {
    // Catches silent MCU renames: extractRoles walks `allColors` and
    // camel-cases the names. If MCU renames a role (e.g. `on_surface`
    // → `on_main_surface`), `theme.dark.roles.onSurface` goes undefined
    // despite the type pinning it required. The six `*PaletteKeyColor`
    // entries exercise `EXTRA_ACCESSORS` rather than `allColors`.
    const theme = computeTheme(makeRecipe());

    for (const role of requiredStandardRoles) {
      expect(theme.dark.roles[role], `dark.roles.${role}`).toBeDefined();
      expect(theme.light.roles[role], `light.roles.${role}`).toBeDefined();
    }
  });

  it('produces dark and light primary roles that differ for non-monochrome variants', () => {
    const theme = computeTheme(makeRecipe());
    // Role accessors return fresh `Hct` instances per call (no
    // reference identity); compare by `.toInt()` to assert the
    // mode-pinned tones diverge.
    expect(theme.dark.roles.primary.toInt())
      .not.toBe(theme.light.roles.primary.toInt());
  });

  it('shares baseline core palettes across modes by reference when no overlay pins them', () => {
    const theme = computeTheme(makeRecipe());

    // No per-mode overlay: both modes inherit the baseline palette
    // set, by reference (overlayCorePalettes returns baseline as-is
    // when the overlay is empty). Reference identity is the strong
    // form of cross-mode invariance.
    expect(theme.dark.palettes.primary).toBe(theme.light.palettes.primary);
    expect(theme.dark.palettes.secondary).toBe(theme.light.palettes.secondary);
    expect(theme.dark.palettes.tertiary).toBe(theme.light.palettes.tertiary);
    expect(theme.dark.palettes.neutral).toBe(theme.light.palettes.neutral);
    expect(theme.dark.palettes.neutralVariant)
      .toBe(theme.light.palettes.neutralVariant);
    expect(theme.dark.palettes.error).toBe(theme.light.palettes.error);
  });

  it('replaces only the overridden palette for the overriding mode', () => {
    const blue = BLUE;
    const red = argb('#ff453a');
    const theme = computeTheme(makeRecipe({
      seeds: { primary: blue },
      dark: { seeds: { primary: red } },
    }));

    // dark.seeds.primary is a raw palette override for dark only:
    // dark.palettes.primary derives from `TonalPalette.fromHct(Hct.
    // fromInt(red))`. light keeps the baseline. Other palettes are
    // not touched by the overlay so they remain shared.
    expect(theme.dark.palettes.primary.keyColor.toInt()).toBe(red);
    expect(theme.light.palettes.primary.keyColor.toInt()).toBe(blue);

    // Non-primary palettes inherit the baseline (which is derived
    // from baseline source = blue) — both modes share them.
    expect(theme.dark.palettes.neutral).toBe(theme.light.palettes.neutral);
    expect(theme.dark.palettes.tertiary).toBe(theme.light.palettes.tertiary);
  });

  it('does not harmonise per-mode overlays — overrides are raw', () => {
    const blue = BLUE;
    const green = argb('#34c759');
    const theme = computeTheme(makeRecipe({
      seeds: { primary: blue },
      dark: { seeds: { tertiary: green } },
    }));

    // Per-mode overrides are the "designer fights MCU" escape
    // hatch — TonalPalette.fromInt(green) directly, no harmonisation
    // against source.
    expect(theme.dark.palettes.tertiary.keyColor.toInt()).toBe(green);
  });

  it('pins a user-supplied non-primary baseline palette seed (default blend)', () => {
    const blue = BLUE;
    const green = argb('#34c759');
    const theme = computeTheme(makeRecipe({
      seeds: { primary: blue, secondary: green },
    }));

    // Default blend=true: secondary is harmonised against source=blue
    // before TonalPalette derivation. The palette's keyColor reflects
    // the harmonised HCT — not the raw seed.
    const harmonised: ARGB = argbFromHCT(Hct.fromInt(Blend.harmonize(green, blue)));
    expect(theme.dark.palettes.secondary.keyColor.toInt()).toBe(harmonised);
    expect(theme.light.palettes.secondary.keyColor.toInt()).toBe(harmonised);
    expect(harmonised).not.toBe(green);
  });

  it('honours blend: false on a baseline core seed', () => {
    const blue = BLUE;
    const green = argb('#34c759');
    const theme = computeTheme(makeRecipe({
      seeds: { primary: blue, tertiary: { value: green, blend: false } },
    }));

    // Designer escape hatch on a baseline core seed: blend=false
    // bypasses harmonisation and the palette derives raw.
    expect(theme.dark.palettes.tertiary.keyColor.toInt()).toBe(green);
    expect(theme.light.palettes.tertiary.keyColor.toInt()).toBe(green);
  });

  it('honours a non-zero contrast level', () => {
    const flat = computeTheme(makeRecipe({ contrast: 0 }));
    const max = computeTheme(makeRecipe({ contrast: 1 }));

    // Maximum contrast shifts roles relative to baseline; pin that the
    // contrast field actually flows through into MCU rather than being
    // silently dropped.
    expect(max.dark.roles.onSurface.toInt())
      .not.toBe(flat.dark.roles.onSurface.toInt());
  });
});

describe('computeTheme with extra palettes', () => {
  const brandSeed = argb('#34c759');
  const accentSeed = argb('#ff9500');

  it('exposes a palettes.<K> slot on each modal theme', () => {
    const theme = computeTheme({
      ...BASE_SUBSTRATE,
      seeds: { primary: BLUE, brand: brandSeed },
    });

    expect(theme.dark.palettes.brand).toBeDefined();
    expect(theme.light.palettes.brand).toBeDefined();
  });

  it('harmonises baseline extras against Theme.source by default', () => {
    const theme = computeTheme({
      ...BASE_SUBSTRATE,
      seeds: { primary: BLUE, brand: brandSeed },
    });

    // Default blend=true on the baseline extra: Blend.harmonize(seed,
    // source) → Hct.fromInt → TonalPalette.fromHct. The palette's
    // keyColor reflects the harmonised HCT, not the raw seed.
    const harmonisedKey: ARGB = argbFromHCT(Hct.fromInt(
      Blend.harmonize(brandSeed, argbFromHCT(theme.source)),
    ));

    expect(theme.dark.palettes.brand.keyColor.toInt()).toBe(harmonisedKey);
    expect(theme.light.palettes.brand.keyColor.toInt()).toBe(harmonisedKey);

    // Harmonisation actually shifted hue — primary blue pulls the
    // brand green toward blue, so the palette key colour diverges
    // from the raw seed.
    expect(harmonisedKey).not.toBe(brandSeed);
  });

  it('honours blend: false on a baseline extra (raw, un-harmonised)', () => {
    const theme = computeTheme({
      ...BASE_SUBSTRATE,
      seeds: {
        primary: BLUE,
        brand: { value: brandSeed, blend: false },
      },
    });

    // The escape hatch: blend=false carries the seed through raw —
    // no Blend.harmonize, palette derives from the unmodified value.
    expect(theme.dark.palettes.brand.keyColor.toInt()).toBe(brandSeed);
    expect(theme.light.palettes.brand.keyColor.toInt()).toBe(brandSeed);
  });

  it('shares the harmonised baseline palette instance across modes when no overlay pins it', () => {
    const theme = computeTheme({
      ...BASE_SUBSTRATE,
      seeds: { primary: BLUE, brand: brandSeed },
    });

    // No per-mode overlay at either layer: both modes inherit the
    // same harmonised baseline palette — reference identity from
    // sharing the baseline `TonalPalette` instance across modes,
    // not just value equality.
    expect(theme.dark.palettes.brand).toBe(theme.light.palettes.brand);
  });

  it('populates the four-quad role colours for each extra seed', () => {
    const theme = computeTheme({
      ...BASE_SUBSTRATE,
      seeds: { primary: BLUE, brand: brandSeed },
    });

    // K, on${K}, ${K}Container, on${K}Container — all required for
    // any declared K — must be Hct-typed and present at runtime, not
    // undefined.
    for (const modal of [theme.dark, theme.light]) {
      expect(modal.roles.brand).toBeDefined();
      expect(modal.roles.onBrand).toBeDefined();
      expect(modal.roles.brandContainer).toBeDefined();
      expect(modal.roles.onBrandContainer).toBeDefined();
    }
  });

  it('pins the four-quad anchor tones to the MD3 spec', () => {
    const theme = computeTheme({
      ...BASE_SUBSTRATE,
      seeds: { primary: BLUE, brand: brandSeed },
    });
    const palette = theme.dark.palettes.brand;

    // MD3 anchor tones, mirrored from theme-builder's
    // makeCustomColorFromPalette: dark uses 80/20/30/90,
    // light uses 40/100/90/10 for color/onColor/container/onContainer.
    expect(theme.dark.roles.brand.toInt()).toBe(palette.tone(80));
    expect(theme.dark.roles.onBrand.toInt()).toBe(palette.tone(20));
    expect(theme.dark.roles.brandContainer.toInt()).toBe(palette.tone(30));
    expect(theme.dark.roles.onBrandContainer.toInt()).toBe(palette.tone(90));

    expect(theme.light.roles.brand.toInt()).toBe(palette.tone(40));
    expect(theme.light.roles.onBrand.toInt()).toBe(palette.tone(100));
    expect(theme.light.roles.brandContainer.toInt()).toBe(palette.tone(90));
    expect(theme.light.roles.onBrandContainer.toInt()).toBe(palette.tone(10));
  });

  it('takes per-mode extra overrides raw; baseline still harmonises', () => {
    const theme = computeTheme({
      ...BASE_SUBSTRATE,
      seeds: { primary: BLUE, brand: brandSeed },
      dark: { seeds: { brand: accentSeed } },
    });

    // dark.seeds.brand is a per-mode raw override — taken as-is.
    expect(theme.dark.palettes.brand.keyColor.toInt()).toBe(accentSeed);

    // light inherits the harmonised baseline (blend=true default).
    const harmonisedBaseline: ARGB = argbFromHCT(Hct.fromInt(
      Blend.harmonize(brandSeed, argbFromHCT(theme.source)),
    ));
    expect(theme.light.palettes.brand.keyColor.toInt())
      .toBe(harmonisedBaseline);
  });

  it('rejects a half-defined extra (declared on only one overlay)', () => {
    const tagSeed = argb('#ff9500');
    // Asymmetric input: `tag` is on dark only — no baseline, no light.
    // `ModalPalettes<K>` types every K slot as required, so a
    // successful run would have to materialise the palette on both
    // modes. The runtime guard rejects the half-defined declaration
    // up front; the user fixes it by mirroring the seed onto light,
    // or by setting a baseline so the missing mode inherits.
    expect(() => computeTheme({
      ...BASE_SUBSTRATE,
      seeds: { primary: BLUE },
      dark: { seeds: { tag: tagSeed } },
    })).toThrow(/asymmetric extra/);
  });

  it('accepts symmetric overlay-only extras (each mode raw)', () => {
    const greenTag = argb('#34c759');
    const orangeTag = argb('#ff9500');
    const theme = computeTheme({
      ...BASE_SUBSTRATE,
      seeds: { primary: BLUE },
      dark: { seeds: { tag: greenTag } },
      light: { seeds: { tag: orangeTag } },
    });

    // Symmetric overlay-only declaration: no baseline `tag`, both
    // overlays declare it. Each mode carries its own palette derived
    // raw from that mode's seed (overlay default `blend: false`).
    expect(theme.dark.palettes.tag.keyColor.toInt()).toBe(greenTag);
    expect(theme.light.palettes.tag.keyColor.toInt()).toBe(orangeTag);

    // Four-quad role accessors materialise on both modes.
    expect(theme.dark.roles.tag).toBeDefined();
    expect(theme.light.roles.tag).toBeDefined();
    expect(theme.dark.roles.onTag).toBeDefined();
    expect(theme.light.roles.onTagContainer).toBeDefined();
  });

  it('surfaces multiple extras side-by-side, each harmonised against Theme.source', () => {
    const theme = computeTheme({
      ...BASE_SUBSTRATE,
      seeds: {
        primary: BLUE,
        brand: brandSeed,
        accent: accentSeed,
      },
    });

    const sourceARGB: ARGB = argbFromHCT(theme.source);
    const expectedBrand: ARGB = argbFromHCT(Hct.fromInt(Blend.harmonize(brandSeed, sourceARGB)));
    const expectedAccent: ARGB = argbFromHCT(Hct.fromInt(Blend.harmonize(accentSeed, sourceARGB)));

    expect(theme.dark.palettes.brand.keyColor.toInt()).toBe(expectedBrand);
    expect(theme.dark.palettes.accent.keyColor.toInt()).toBe(expectedAccent);
    expect(theme.dark.roles.brand).toBeDefined();
    expect(theme.dark.roles.accent).toBeDefined();
  });

  it('exposes TonalPalette instances on every palettes.<K> accessor', () => {
    const theme = computeTheme({
      ...BASE_SUBSTRATE,
      seeds: { primary: BLUE, brand: brandSeed },
    });

    expect(theme.dark.palettes.brand).toBeInstanceOf(TonalPalette);
    expect(theme.light.palettes.brand).toBeInstanceOf(TonalPalette);
  });

  it('throws when a baseline seed name collides with the standard role catalogue', () => {
    expect(() => computeTheme({
      ...BASE_SUBSTRATE,
      seeds: { primary: BLUE, surface: argb('#ffffff') },
    })).toThrow(/standard or extended role/);
  });

  it('throws when a per-mode overlay seed name collides with the standard role catalogue', () => {
    // Collision policy applies at every layer — overlays cannot pin
    // tone-selected role outputs by ARGB either.
    expect(() => computeTheme({
      ...BASE_SUBSTRATE,
      seeds: { primary: BLUE },
      dark: { seeds: { surface: argb('#ffffff') } },
    })).toThrow(/standard or extended role/);
  });

  it('anchors extra four-quad tones statically across contrast levels', () => {
    // EXTRA_ANCHORS is static by design — bespoke extra palettes sit
    // outside MCU's standard-role contrast curves. Standard roles
    // shift with contrast (verified below); the extra four-quad
    // stays pinned to the MD3 anchors regardless.
    const flat = computeTheme({
      ...BASE_SUBSTRATE,
      contrast: 0,
      seeds: { primary: BLUE, brand: brandSeed },
    });
    const max = computeTheme({
      ...BASE_SUBSTRATE,
      contrast: 1,
      seeds: { primary: BLUE, brand: brandSeed },
    });

    // Standard role tones do respond to contrast — pinned to prove
    // the contrast field is actually live in both runs.
    expect(flat.dark.roles.primary.toInt())
      .not.toBe(max.dark.roles.primary.toInt());

    // Extra four-quad tones do not.
    expect(flat.dark.roles.brand.toInt())
      .toBe(max.dark.roles.brand.toInt());
    expect(flat.dark.roles.onBrand.toInt())
      .toBe(max.dark.roles.onBrand.toInt());
    expect(flat.dark.roles.brandContainer.toInt())
      .toBe(max.dark.roles.brandContainer.toInt());
    expect(flat.dark.roles.onBrandContainer.toInt())
      .toBe(max.dark.roles.onBrandContainer.toInt());
  });
});

describe('computeTheme exposes the per-mode DynamicScheme', () => {
  it('attaches a DynamicScheme to each modal theme', () => {
    const theme = computeTheme(makeRecipe());

    expect(theme.dark.scheme).toBeInstanceOf(DynamicScheme);
    expect(theme.light.scheme).toBeInstanceOf(DynamicScheme);
  });

  it('threads substrate fields through to each scheme', () => {
    // TONAL_SPOT preserves the requested specVersion through MCU's
    // `maybeFallbackSpecVersion`, so the resolved scheme mirrors the
    // recipe verbatim. The "genuine 2021 scheme" row below pins
    // the spec-pass-through assertion explicitly under NEUTRAL +
    // '2021', and the README's divergence callout covers the
    // CONTENT-forces-'2021' wrinkle that does not apply here.
    const theme = computeTheme(makeRecipe({ contrast: 0.5 }));

    for (const modal of [theme.dark, theme.light]) {
      expect(modal.scheme.contrastLevel).toBe(0.5);
      expect(modal.scheme.specVersion).toBe('2025');
      expect(modal.scheme.variant).toBe(Variant.TONAL_SPOT);
    }

    expect(theme.dark.scheme.isDark).toBe(true);
    expect(theme.light.scheme.isDark).toBe(false);
  });

  it('exposes the same DynamicScheme its palette accessors were drawn from', () => {
    // The scheme on each modal is the live MCU instance
    // buildModalTheme extracted from — not a rebuild. Reference
    // identity on the palette objects is the strong form of "same
    // scheme": MCU's suffixed accessor (`scheme.primaryPalette`) and
    // our bare-key accessor (`palettes.primary`) return the very
    // same TonalPalette.
    const theme = computeTheme(makeRecipe());

    expect(theme.dark.scheme.primaryPalette).toBe(theme.dark.palettes.primary);
    expect(theme.dark.scheme.errorPalette).toBe(theme.dark.palettes.error);
    expect(theme.light.scheme.primaryPalette)
      .toBe(theme.light.palettes.primary);
    expect(theme.light.scheme.errorPalette).toBe(theme.light.palettes.error);
  });

  it('reflects per-mode core overrides on the corresponding scheme', () => {
    const red = argb('#ff453a');
    const theme = computeTheme(makeRecipe({
      seeds: { primary: BLUE },
      dark: { seeds: { primary: red } },
    }));

    // Per-mode overlay pins dark.scheme.primaryPalette to the
    // override; light.scheme keeps the baseline. The schemes diverge
    // exactly where the overlay said they should.
    expect(theme.dark.scheme.primaryPalette.keyColor.toInt()).toBe(red);
    expect(theme.light.scheme.primaryPalette.keyColor.toInt()).toBe(BLUE);
  });
});

describe('Variant interactions with primary seed', () => {
  // Setting `seeds.primary` interposes a primaryPalette pin via
  // `makePalettes` — `TonalPalette.fromHct(seed)` runs unconditionally
  // and short-circuits MCU's variant-specific primary derivation. These
  // rows pin the design choice so a future swing to "feed the seed
  // through MCU's variant pipeline" surfaces as a failing assertion.

  it('pins the primary palette to the raw seed under MONOCHROME', () => {
    // MCU's MONOCHROME variant would normally collapse primary to
    // grayscale; the user-supplied seed wins. The "designer fights
    // MCU" escape hatch made explicit.
    const theme = computeTheme({
      ...BASE_SUBSTRATE,
      variant: Variant.MONOCHROME,
      seeds: { primary: BLUE },
    });

    expect(theme.dark.palettes.primary.keyColor.toInt()).toBe(BLUE);
  });
});

describe('Spec-version-conditional roles', () => {
  // Roles whose presence depends on the spec the recipe pinned. These
  // pin the wire — if MCU drops a role from a spec, the corresponding
  // accessor goes undefined and the assertion fires.

  it('populates the four allColors-excluded roles on the 2025 spec', () => {
    // scrim / shadow / surfaceTint / surfaceVariant are defined on
    // MaterialDynamicColors and present in every supported spec, but
    // excluded from MCU's `allColors` enumeration. `extractRoles`
    // pulls them in via EXTRA_ACCESSORS to honour the
    // `RequiredStandardRole` contract; pin presence to catch a
    // future MCU drop.
    const theme = computeTheme(makeRecipe({ specVersion: '2025' }));

    for (const modal of [theme.dark, theme.light]) {
      expect(modal.roles.scrim).toBeDefined();
      expect(modal.roles.shadow).toBeDefined();
      expect(modal.roles.surfaceTint).toBeDefined();
      expect(modal.roles.surfaceVariant).toBeDefined();
    }
  });

  it('populates the *Dim quartet on the 2025 spec', () => {
    // primaryDim / secondaryDim / tertiaryDim / errorDim are
    // spec-dependent on `ModalRoles<K, S>`: required `Hct` on
    // `'2025'` / `'2026'`, absent on `'2021'` (gated by
    // `SpecDependentRole<S>`). Pin runtime populations for the
    // spec we ship against.
    const theme = computeTheme(makeRecipe({ specVersion: '2025' }));

    for (const modal of [theme.dark, theme.light]) {
      expect(modal.roles.primaryDim).toBeDefined();
      expect(modal.roles.secondaryDim).toBeDefined();
      expect(modal.roles.tertiaryDim).toBeDefined();
      expect(modal.roles.errorDim).toBeDefined();
    }
  });

  it('echoes the recipe specVersion when MCU downgrades the scheme', () => {
    // MCU 0.4.1's `maybeFallbackSpecVersion` silently downgrades
    // `'2026'` to `'2025'` for TONAL_SPOT (and every pass-through
    // variant other than CMF), so the live scheme reports `'2025'`.
    // `theme.specVersion` echoes the recipe verbatim, the modal
    // `scheme.specVersion` reflects MCU's resolved spec — the
    // divergence the README pins as a caller-facing contract. The
    // `*Dim` quartet still materialises because the downgraded
    // `'2025'` is in `specsWithDim`.
    const theme = computeTheme<never, '2026'>({
      variant: Variant.TONAL_SPOT,
      specVersion: '2026',
      contrast: 0,
      seeds: { primary: BLUE },
    });

    expect(theme.specVersion).toBe('2026');
    expect(theme.dark.scheme.specVersion).toBe('2025');
    expect(theme.light.scheme.specVersion).toBe('2025');

    for (const modal of [theme.dark, theme.light]) {
      expect(modal.roles.primaryDim).toBeDefined();
      expect(modal.roles.secondaryDim).toBeDefined();
      expect(modal.roles.tertiaryDim).toBeDefined();
      expect(modal.roles.errorDim).toBeDefined();
    }
  });

  it('does not materialise the *Dim quartet on a genuine 2021 scheme', () => {
    // NEUTRAL is in MCU's "specVersion-passes-through" set, so the
    // resolved scheme.specVersion is the requested '2021' — a genuine
    // '2021' scheme, distinct from the silent CONTENT-forced '2021'
    // the README's divergence callout describes. The typed contract
    // — `SpecDependentRole<'2021'> = never` — promises the *Dim
    // quartet is absent from `Theme<K, '2021'>['dark']['roles']`.
    // This row checks the runtime honours that contract.
    const theme = computeTheme<never, '2021'>({
      variant: Variant.NEUTRAL,
      specVersion: '2021',
      contrast: 0,
      seeds: { primary: BLUE },
    });

    expect(theme.dark.scheme.specVersion).toBe('2021');
    expect(theme.light.scheme.specVersion).toBe('2021');

    const darkRoles = theme.dark.roles as Record<string, unknown>;
    const lightRoles = theme.light.roles as Record<string, unknown>;
    expect('primaryDim' in darkRoles).toBe(false);
    expect('secondaryDim' in darkRoles).toBe(false);
    expect('tertiaryDim' in darkRoles).toBe(false);
    expect('errorDim' in darkRoles).toBe(false);
    expect('primaryDim' in lightRoles).toBe(false);
  });
});
