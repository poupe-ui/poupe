import { describe, it, expect } from 'vitest';

import {
  defaultShades,
  getShades,
  makeHexShades,
  makeShades,
  validShade,
} from '../shades';

import { hct } from '@poupe/theme-builder/core';

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
      // eslint-disable-next-line unicorn/consistent-function-scoping
      const isLighter = (hex1: string, hex2: string) => {
        // Simple lightness comparison - sum of RGB values
        const sum1 = Number.parseInt(hex1.slice(1, 3), 16) + Number.parseInt(hex1.slice(3, 5), 16) + Number.parseInt(hex1.slice(5, 7), 16);
        const sum2 = Number.parseInt(hex2.slice(1, 3), 16) + Number.parseInt(hex2.slice(3, 5), 16) + Number.parseInt(hex2.slice(5, 7), 16);
        return sum1 > sum2;
      };

      expect(isLighter(result![100], result![500])).toBe(true);
      expect(isLighter(result![500], result![900])).toBe(true);
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
