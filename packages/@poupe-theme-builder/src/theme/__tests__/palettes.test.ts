/* eslint-disable unicorn/no-null */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest';

import {
  flattenColorOptions,
  flattenPartialColorOptions,
  makeThemePalettes,
} from '../palettes';

import {
  ThemeColors,
  type ColorOptions,
  type CustomColorOptions,
} from '../types';

import {
  Colord,
  Hct,
  TonalPalette,

  alphaFromArgb,
  redFromArgb,
  greenFromArgb,
  blueFromArgb,
} from '../utils';

function expectArgbToBeClose(actualArgb: number, expectedArgb: number, tolerance: number) {
  const actualAlpha = alphaFromArgb(actualArgb);
  const expectedAlpha = alphaFromArgb(expectedArgb);
  // Alpha component should ideally be exact
  expect(actualAlpha).toBe(expectedAlpha);

  const actualRed = redFromArgb(actualArgb);
  const expectedRed = redFromArgb(expectedArgb);
  expect(actualRed).toBeGreaterThanOrEqual(expectedRed - tolerance);
  expect(actualRed).toBeLessThanOrEqual(expectedRed + tolerance);

  const actualGreen = greenFromArgb(actualArgb);
  const expectedGreen = greenFromArgb(expectedArgb);
  expect(actualGreen).toBeGreaterThanOrEqual(expectedGreen - tolerance);
  expect(actualGreen).toBeLessThanOrEqual(expectedGreen + tolerance);

  const actualBlue = blueFromArgb(actualArgb);
  const expectedBlue = blueFromArgb(expectedArgb);
  expect(actualBlue).toBeGreaterThanOrEqual(expectedBlue - tolerance);
  expect(actualBlue).toBeLessThanOrEqual(expectedBlue + tolerance);
}

describe('flattenColorOptions', () => {
  it('should convert a simple color string to CustomColorOptions', () => {
    const result = flattenColorOptions('#FF0000');

    expect(result).toHaveProperty('value');
    expect(result.value).toBeInstanceOf(Hct);
    expect(result).not.toHaveProperty('harmonize');
    expect(result).not.toHaveProperty('name');
  });

  it('should convert a color number to CustomColorOptions', () => {
    const result = flattenColorOptions(0xFF_00_00_FF);

    expect(result).toHaveProperty('value');
    expect(result.value).toBeInstanceOf(Hct);
  });

  it('should preserve existing ColorOptions properties', () => {
    const input: ColorOptions = {
      value: '#00FF00',
      harmonize: false,
    };

    const result = flattenColorOptions(input);

    expect(result).toHaveProperty('value');
    expect(result.value).toBeInstanceOf(Hct);
    expect(result.harmonize).toBe(false);
  });

  it('should preserve existing CustomColorOptions properties', () => {
    const input: CustomColorOptions = {
      value: '#0000FF',
      harmonize: true,
      name: 'customBlue',
    };

    const result = flattenColorOptions(input);

    expect(result).toHaveProperty('value');
    expect(result.value).toBeInstanceOf(Hct);
    expect(result.harmonize).toBe(true);
    expect(result.name).toBe('customBlue');
  });

  it('should handle Hct color objects', () => {
    const hctColor = Hct.fromInt(0xFF_00_00_FF);
    const result = flattenColorOptions(hctColor);

    expect(result).toHaveProperty('value');
    expect(result.value).toBeInstanceOf(Hct);
  });

  it('should handle Colord color objects', () => {
    const colordColor = new Colord('#FF0000');
    const result = flattenColorOptions(colordColor);

    expect(result).toHaveProperty('value');
    expect(result.value).toBeInstanceOf(Hct);
    const actualHct = result.value as Hct;
    const actualArgb = actualHct.toInt();
    const expectedArgb = 0xFF_FF_00_00;
    const tolerance = 1; // Allow a small tolerance (e.g., +/- 1) for color channels

    expectArgbToBeClose(actualArgb, expectedArgb, tolerance);
  });

  it('should throw error for null or undefined input', () => {
    expect(() => flattenColorOptions(null as never)).toThrow('invalid color');
    expect(() => flattenColorOptions(undefined as never)).toThrow('invalid color');
    expect(() => flattenColorOptions({} as never)).toThrow('invalid color');
  });
});

describe('flattenPartialColorOptions', () => {
  it('should handle undefined input gracefully', () => {
    const result = flattenPartialColorOptions(undefined);
    expect(result).toEqual({});
  });

  it('should handle null input gracefully', () => {
    const result = flattenPartialColorOptions(undefined);
    expect(result).toEqual({});
  });

  it('should handle Hct color objects', () => {
    const hctColor = Hct.fromInt(0xFF_00_00_FF);
    const result = flattenPartialColorOptions(hctColor);

    expect(result).toHaveProperty('value');
    expect(result.value).toEqual(hctColor);
  });

  it('should handle Colord color objects', () => {
    const colordColor = new Colord('#FF0000');
    const result = flattenPartialColorOptions(colordColor);

    expect(result).toHaveProperty('value');
    expect(result.value).toEqual(colordColor);
  });

  it('should handle partial CustomColorOptions', () => {
    const input = { harmonize: false };
    const result = flattenPartialColorOptions(input);

    expect(result).toEqual({ harmonize: false });
  });

  it('should handle color strings', () => {
    const result = flattenPartialColorOptions('#FF0000');

    expect(result).toHaveProperty('value');
    expect(result.value).toBe('#FF0000');
  });
});

describe('makeThemePalette', () => {
  it('should create theme palette with primary color only', () => {
    const colors: ThemeColors<never> = {
      primary: '#4285F4',
    };

    const result = makeThemePalettes(colors);

    expect(result.source).toBeInstanceOf(Hct);
    expect(result.corePalettes.primary).toBeInstanceOf(TonalPalette);
    expect(result.palettes.primary).toBeInstanceOf(TonalPalette);
    expect(result.colors.primary).toHaveProperty('value');
    expect(result.extraPalettes).toEqual({});
  });

  it('should create theme palette with all core colors', () => {
    const colors: ThemeColors<never> = {
      primary: '#4285F4',
      secondary: '#34A853',
      tertiary: '#FBBC05',
      neutral: '#9AA0A6',
      neutralVariant: '#80868B',
      error: '#EA4335',
    };

    const result = makeThemePalettes(colors);

    expect(result.source).toBeInstanceOf(Hct);
    expect(result.corePalettes.primary).toBeInstanceOf(TonalPalette);
    expect(result.palettes.secondary).toBeInstanceOf(TonalPalette);
    expect(result.palettes.tertiary).toBeInstanceOf(TonalPalette);
    expect(result.palettes.neutral).toBeInstanceOf(TonalPalette);
    expect(result.palettes.neutralVariant).toBeInstanceOf(TonalPalette);
    expect(result.palettes.error).toBeInstanceOf(TonalPalette);
  });

  it('should handle custom colors with default names', () => {
    const colors: ThemeColors<'brand' | 'accent'> = {
      primary: '#4285F4',
      brand: '#FF6B35',
      accent: '#7209B7',
    };

    const result = makeThemePalettes(colors);

    expect(result.palettes.brand).toBeInstanceOf(TonalPalette);
    expect(result.palettes.accent).toBeInstanceOf(TonalPalette);
    expect(result.colors.brand).toHaveProperty('value');
    expect(result.colors.accent).toHaveProperty('value');
    expect(result.extraPalettes.brand).toBeInstanceOf(TonalPalette);
    expect(result.extraPalettes.accent).toBeInstanceOf(TonalPalette);
  });

  it('should handle custom colors with custom names', () => {
    const colors: ThemeColors<'customKey'> = {
      primary: '#4285F4',
      customKey: {
        value: '#FF6B35',
        name: 'brandOrange',
        harmonize: false,
      },
    };

    const result = makeThemePalettes(colors);

    expect(result.palettes.brandOrange).toBeInstanceOf(TonalPalette);
    expect(result.colors.brandOrange).toHaveProperty('value');
    expect(result.colors.brandOrange.harmonize).toBe(false);
    expect(result.extraPalettes.brandOrange).toBeInstanceOf(TonalPalette);
  });

  it('should override core palette with custom name', () => {
    const colors: ThemeColors<'customKey'> = {
      primary: '#4285F4',
      customKey: {
        value: '#34A853',
        name: 'secondary', // This should override the core secondary
        harmonize: false,
      },
    };

    const result = makeThemePalettes(colors);

    // Should have the custom secondary, not an extra palette
    expect(result.palettes.secondary).toBeInstanceOf(TonalPalette);
    expect(result.colors.secondary.harmonize).toBe(false);
    expect(Object.keys(result.palettes)).not.toContain('customKey');

    expect(result.corePalettes.secondary).toBeInstanceOf(TonalPalette);
    expect(result.extraPalettes.secondary).toBeUndefined();
  });

  it('should handle primary color as ColorOptions object', () => {
    const colors: ThemeColors<never> = {
      primary: { value: '#4285F4' },
    };

    const result = makeThemePalettes(colors);

    expect(result.source).toBeInstanceOf(Hct);
    expect(result.corePalettes.primary).toBeInstanceOf(TonalPalette);
  });

  it('should throw error for undefined optional colors', () => {
    const colors: ThemeColors<'optional'> = {
      primary: '#4285F4',
      optional: undefined as any,
    };

    expect(() => makeThemePalettes(colors)).toThrow('invalid color');
  });

  it('should preserve harmonization settings', () => {
    const colors: ThemeColors<'noHarmonize' | 'withHarmonize'> = {
      primary: '#4285F4',
      secondary: { value: '#34A853', harmonize: false },
      noHarmonize: { value: '#FF6B35', harmonize: false },
      withHarmonize: { value: '#7209B7', harmonize: true },
    };

    const result = makeThemePalettes(colors);

    expect(result.colors.secondary.harmonize).toBe(false);
    expect(result.colors.noHarmonize.harmonize).toBe(false);
    expect(result.colors.withHarmonize.harmonize).toBe(true);
  });
});

describe('makeThemePalette integration', () => {
  it('should create consistent palettes for the same input', () => {
    const colors: ThemeColors<never> = {
      primary: '#4285F4',
      secondary: '#34A853',
    };

    const result1 = makeThemePalettes(colors);
    const result2 = makeThemePalettes(colors);

    expect(result1.source.toInt()).toBe(result2.source.toInt());
    expect(result1.corePalettes.primary.tone(50)).toBe(result2.corePalettes.primary.tone(50));
    expect(result1.palettes.secondary?.tone(50)).toBe(result2.palettes.secondary?.tone(50));
  });

  it('should generate different palettes for different primaries', () => {
    const colors1: ThemeColors<never> = {
      primary: '#4285F4', // Blue
      secondary: '#FF0000',
    };

    const colors2: ThemeColors<never> = {
      primary: '#34A853', // Green
      secondary: '#FF0000', // Same secondary
    };

    const result1 = makeThemePalettes(colors1);
    const result2 = makeThemePalettes(colors2);

    expect(result1.source.toInt()).not.toBe(result2.source.toInt());
    // Harmonized secondary should be different due to different primary
    expect(result1.palettes.secondary?.tone(50)).not.toBe(result2.palettes.secondary?.tone(50));
  });

  it('should handle mixed core and custom colors', () => {
    const colors: ThemeColors<'brand'> = {
      primary: '#4285F4',
      secondary: '#34A853',
      brand: '#FF6B35',
    };

    const result = makeThemePalettes(colors);

    // Secondary will be in corePalettes
    expect(result.corePalettes.secondary).toBeInstanceOf(TonalPalette);
    expect(result.extraPalettes.secondary).toBeUndefined();
    expect(result.palettes.secondary).toBe(result.corePalettes.secondary);

    // Extra palette
    expect(result.extraPalettes.brand).toBeInstanceOf(TonalPalette);
    expect(result.palettes.brand).toBeInstanceOf(TonalPalette);

    // Colors
    expect(result.colors.secondary).toHaveProperty('value');
    expect(result.colors.brand).toHaveProperty('value');
  });
});
