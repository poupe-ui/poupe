/* eslint-disable unicorn/consistent-function-scoping */
import { describe, it, expect } from 'vitest';

import {
  TonalPalette,

  hct,
} from '@poupe/theme-builder/core';

import {
  defaultShades,
  getShades,
  makeHexShades,
  makeShades,
  makeShadesFromPalette,
  validShade,
} from '../shades';

describe('shades utilities', () => {
  describe('validShade', () => {
    it('returns true for valid shade values', () => {
      expect(validShade(50)).toBe(true);
      expect(validShade(100)).toBe(true);
      expect(validShade(950)).toBe(true);
      expect(validShade(999)).toBe(true);
    });

    it('returns false for invalid shade values', () => {
      expect(validShade(0)).toBe(false);
      expect(validShade(1000)).toBe(false);
      expect(validShade(-100)).toBe(false);
      expect(validShade(100.5)).toBe(false);
    });
  });

  describe('getShades', () => {
    it('returns default shades when input is true or undefined', () => {
      expect(getShades(true).shades).toEqual(defaultShades);
      expect(getShades().shades).toEqual(defaultShades);
    });

    it('returns false when input is false', () => {
      expect(getShades(false).shades).toBe(false);
    });

    it('returns custom shades when array is provided', () => {
      expect(getShades([100, 300, 500]).shades).toEqual([100, 300, 500]);
    });

    it('handles negative values as append mode', () => {
      const expectedSet = new Set([...defaultShades, 100, 300]);
      expect(getShades([-100, -300]).shades).toEqual([...expectedSet].sort((a, b) => a - b));
    });

    it('sorts shades in ascending order', () => {
      expect(getShades([500, 100, 900]).shades).toEqual([100, 500, 900]);
    });

    it('removes duplicate shades', () => {
      expect(getShades([100, 100, 500, 500]).shades).toEqual([100, 500]);
    });

    it('returns error for invalid shade values', () => {
      const result = getShades([0, 100, 1000]);
      expect(result.shades).toBe(false);
      expect(result.ok).toBe(false);
    });

    it('returns error for empty shade array', () => {
      const result = getShades([]);
      expect(result.shades).toBe(false);
      expect(result.ok).toBe(false);
    });

    it('returns error for non-array, non-boolean input', () => {
      // @ts-expect-error Testing invalid input
      const result = getShades('invalid');
      expect(result.shades).toBe(false);
      expect(result.ok).toBe(false);
    });

    it('uses provided defaults when specified', () => {
      const customDefaults = [200, 400, 600, 800];
      expect(getShades(undefined, customDefaults).shades).toEqual(customDefaults);
      expect(getShades([-100], customDefaults).shades).toEqual([100, 200, 400, 600, 800]);
    });
  });

  describe('makeShades', () => {
    const testColor = hct('#0047AB'); // Royal Blue

    it('returns undefined when shades is false', () => {
      expect(makeShades(testColor, false)).toBeUndefined();
    });

    it('maps out of range shade values to white or black', () => {
      const shades = makeShades(testColor, [0, 2000]);
      expect(shades).toBeDefined();
      // Shade 0 should be white (tone 100)
      expect(shades![0].tone).toBeCloseTo(100, 0);
      // Shade 2000 should be black (tone 0)
      expect(shades![2000].tone).toBeCloseTo(0, 0);
    });

    it('generates Hct colors for valid shades', () => {
      const shades = makeShades(testColor, [100, 500, 900]);

      expect(shades).toBeDefined();
      expect(Object.keys(shades!).length).toBe(3);
      expect(shades![100]).toBeDefined();
      expect(shades![500]).toBeDefined();
      expect(shades![900]).toBeDefined();

      // Verify colors have same hue but different tones
      const h100 = shades![100].hue;
      const h500 = shades![500].hue;
      const h900 = shades![900].hue;

      expect(h100).toBeCloseTo(h500, 0);
      expect(h500).toBeCloseTo(h900, 0);

      // Verify tones follow expected pattern (higher shade = lower tone)
      expect(shades![100].tone).toBeGreaterThan(shades![500].tone);
      expect(shades![500].tone).toBeGreaterThan(shades![900].tone);
    });
  });

  describe('makeHexShades', () => {
    const testColor = '#0047AB'; // Royal Blue

    it('returns undefined when shades is false', () => {
      expect(makeHexShades(testColor, false)).toBeUndefined();
    });

    it('uses default shades when none provided', () => {
      const result = makeHexShades(testColor);
      expect(result).toBeDefined();
      expect(Object.keys(result!).length).toBe(defaultShades.length);

      // Check that all default shades exist
      for (const shade of defaultShades) {
        expect(result![shade]).toBeDefined();
      }
    });

    it('generates hex color strings for each shade', () => {
      const result = makeHexShades(testColor, [100, 500, 900]);

      expect(result).toBeDefined();
      expect(Object.keys(result!).length).toBe(3);

      // Verify hex format
      const hexRegex = /^#[0-9A-F]{6}$/i;
      expect(result![100]).toMatch(hexRegex);
      expect(result![500]).toMatch(hexRegex);
      expect(result![900]).toMatch(hexRegex);

      // Check that all generated shades are different
      const hexValues = Object.values(result!);
      const uniqueHexValues = new Set(hexValues);
      expect(uniqueHexValues.size).toBe(hexValues.length);

      // 100 should be lighter than 500, and 900 should be darker
      const isLighter = (hex1: string, hex2: string) => {
        // Using weighted RGB for better perceptual comparison (human eyes are more sensitive to green)
        const getWeightedLightness = (hex: string) => {
          const r = Number.parseInt(hex.slice(1, 3), 16);
          const g = Number.parseInt(hex.slice(3, 5), 16);
          const b = Number.parseInt(hex.slice(5, 7), 16);
          return 0.299 * r + 0.587 * g + 0.114 * b; // Standard luminance formula
        };
        return getWeightedLightness(hex1) > getWeightedLightness(hex2);
      };

      expect(isLighter(result![100], result![500])).toBe(true);
      expect(isLighter(result![500], result![900])).toBe(true);
    });
  });

  describe('makeShadesFromPalette', () => {
    const testColor = hct('#0047AB'); // Royal Blue
    const testPalette = TonalPalette.fromHct(testColor);

    it('returns undefined when shades is false', () => {
      expect(makeShadesFromPalette(testPalette, false)).toBeUndefined();
    });

    it('generates Hct colors from existing palette', () => {
      const shades = makeShadesFromPalette(testPalette, [100, 500, 900]);

      expect(shades).toBeDefined();
      expect(Object.keys(shades!).length).toBe(3);
      expect(shades![100]).toBeDefined();
      expect(shades![500]).toBeDefined();
      expect(shades![900]).toBeDefined();

      // Verify colors have same hue but different tones
      const h100 = shades![100].hue;
      const h500 = shades![500].hue;
      const h900 = shades![900].hue;

      expect(h100).toBeCloseTo(h500, 0);
      expect(h500).toBeCloseTo(h900, 0);

      // Verify tones follow expected pattern (higher shade = lower tone)
      expect(shades![100].tone).toBeGreaterThan(shades![500].tone);
      expect(shades![500].tone).toBeGreaterThan(shades![900].tone);
    });

    it('produces consistent results with makeShades', () => {
      const shadesFromColor = makeShades(testColor, [200, 400, 600, 800]);
      const shadesFromPalette = makeShadesFromPalette(testPalette,
        [200, 400, 600, 800]);

      expect(shadesFromColor).toBeDefined();
      expect(shadesFromPalette).toBeDefined();

      // Both methods should produce identical results
      for (const shade of [200, 400, 600, 800] as const) {
        expect(shadesFromColor![shade].hue)
          .toBeCloseTo(shadesFromPalette![shade].hue, 1);
        expect(shadesFromColor![shade].chroma)
          .toBeCloseTo(shadesFromPalette![shade].chroma, 1);
        expect(shadesFromColor![shade].tone)
          .toBeCloseTo(shadesFromPalette![shade].tone, 1);
      }
    });

    it('handles edge case shade values', () => {
      const shades = makeShadesFromPalette(testPalette, [1, 999]);

      expect(shades).toBeDefined();
      // Note: Actual tone values depend on the TonalPalette implementation
      expect(shades![1].tone).toBeGreaterThan(90); // Very light tone
      expect(shades![999].tone).toBeLessThan(10); // Very dark tone
    });

    it('is more efficient for multiple operations on same palette', () => {
      // This is more of a documentation test - both should work
      const palette = TonalPalette.fromHct(testColor);

      // Multiple shade generations from same palette
      const set1 = makeShadesFromPalette(palette, [100, 200]);
      const set2 = makeShadesFromPalette(palette, [300, 400]);
      const set3 = makeShadesFromPalette(palette, [500, 600]);

      expect(set1).toBeDefined();
      expect(set2).toBeDefined();
      expect(set3).toBeDefined();

      // All should share the same hue and chroma
      const hue1 = set1![100].hue;
      const hue2 = set2![300].hue;
      const hue3 = set3![500].hue;

      expect(hue1).toBeCloseTo(hue2, 0);
      expect(hue2).toBeCloseTo(hue3, 0);
    });

    it('handles empty shade array gracefully', () => {
      const result = makeShadesFromPalette(testPalette, []);
      expect(result).toBeDefined();
      expect(Object.keys(result!).length).toBe(0);
    });
  });

  describe('toTone function', () => {
    // toTone is a private function, so we can test it indirectly through makeShades
    it('converts shade to correct tone value', () => {
      const testColor = hct('#0047AB');
      const shades = makeShades(testColor, [50, 500, 950]);

      // Verify tone values: toTone(shade) = (1000 - shade) / 10
      expect(shades![50].tone).toBeCloseTo(95, 1); // (1000 - 50) / 10 = 95
      expect(shades![500].tone).toBeCloseTo(50, 1); // (1000 - 500) / 10 = 50
      expect(shades![950].tone).toBeCloseTo(5, 1); // (1000 - 950) / 10 = 5
    });
  });
});
