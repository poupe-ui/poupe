import { describe, it, expect } from 'vitest';
import { makeShadows, makeShadowRules } from '../shadows';
import type { Theme } from '../types';
import { makeThemeFromPartialOptions } from '../plugin';

describe('shadow utilities', () => {
  const mockTheme: Theme = makeThemeFromPartialOptions({
    themePrefix: 'poupe-test-',
  });

  describe('makeShadows', () => {
    it('should generate the correct shadow values', () => {
      const [shadows, innerShadows] = makeShadows(mockTheme);
      const themePrefix = mockTheme.options.themePrefix;
      const rgbValues = `from var(--${themePrefix}shadow) r g b`;

      const c15 = `rgb(${rgbValues} / 0.15)`;
      const c17 = `rgb(${rgbValues} / 0.17)`;
      const c19 = `rgb(${rgbValues} / 0.19)`;
      const c20 = `rgb(${rgbValues} / 0.20)`;
      const c30 = `rgb(${rgbValues} / 0.30)`;
      const c37 = `rgb(${rgbValues} / 0.37)`;

      const expectedZ1 = `0 1px 4px 0 ${c37}`;
      const expectedZ2 = `0 2px 2px 0 ${c20}, 0 6px 10px 0 ${c30}`;
      const expectedZ3 = `0 11px 7px 0 ${c19}, 0 13px 25px 0 ${c30}`;
      const expectedZ4 = `0 14px 12px 0 ${c17}, 0 20px 40px 0 ${c30}`;
      const expectedZ5 = `0 17px 17px 0 ${c15}, 0 27px 55px 0 ${c30}`;
      const expectedInner = `inset 0 2px 4px 0 ${c20}`;
      const expectedNone = '0 0 rgb(0, 0 / 0, 0)';

      // Check shadow values
      expect(shadows['*']).toBe('initial');
      expect(shadows['z1']).toBe(expectedZ1);
      expect(shadows['z2']).toBe(expectedZ2);
      expect(shadows['DEFAULT']).toBe(expectedZ2);
      expect(shadows['z3']).toBe(expectedZ3);
      expect(shadows['z4']).toBe(expectedZ4);
      expect(shadows['z5']).toBe(expectedZ5);
      expect(shadows['none']).toBe(expectedNone);

      // Check inner-shadow values
      expect(innerShadows['*']).toBe('initial');
      expect(innerShadows['DEFAULT']).toBe(expectedInner);
      expect(innerShadows['none']).toBe(expectedNone);
    });

    it('should use a different theme prefix correctly', () => {
      const customTheme: Theme = makeThemeFromPartialOptions({
        themePrefix: 'my-custom-prefix-',
      });
      const [shadows] = makeShadows(customTheme);
      const themePrefix = customTheme.options.themePrefix;
      const rgbValues = `from var(--${themePrefix}shadow) r g b`;
      const c37 = `rgb(${rgbValues} / 0.37)`;

      expect(shadows['z1']).toBe(`0 1px 4px 0 ${c37}`);
    });

    it('should ensure DEFAULT shadow is the same as z2', () => {
      const [shadows] = makeShadows(mockTheme);
      expect(shadows['DEFAULT']).toBe(shadows['z2']);
    });
  });

  describe('makeShadowRules', () => {
    it('should generate the correct shadow CSS variables with proper prefixes', () => {
      const shadowRules = makeShadowRules(mockTheme);
      const themePrefix = mockTheme.options.themePrefix;
      const rgbValues = `from var(--${themePrefix}shadow) r g b`;

      const c15 = `rgb(${rgbValues} / 0.15)`;
      const c17 = `rgb(${rgbValues} / 0.17)`;
      const c19 = `rgb(${rgbValues} / 0.19)`;
      const c20 = `rgb(${rgbValues} / 0.20)`;
      const c30 = `rgb(${rgbValues} / 0.30)`;
      const c37 = `rgb(${rgbValues} / 0.37)`;

      const expectedZ1 = `0 1px 4px 0 ${c37}`;
      const expectedZ2 = `0 2px 2px 0 ${c20}, 0 6px 10px 0 ${c30}`;
      const expectedZ3 = `0 11px 7px 0 ${c19}, 0 13px 25px 0 ${c30}`;
      const expectedZ4 = `0 14px 12px 0 ${c17}, 0 20px 40px 0 ${c30}`;
      const expectedZ5 = `0 17px 17px 0 ${c15}, 0 27px 55px 0 ${c30}`;
      const expectedInner = `inset 0 2px 4px 0 ${c20}`;
      const expectedNone = '0 0 rgb(0, 0 / 0, 0)';

      // Check the three separate rule objects
      const [shadowResults, dropShadowResults, innerShadowResults] = shadowRules;

      // Check shadow rules
      expect(shadowResults['--shadow-*']).toBe('initial');
      expect(shadowResults['--shadow-z1']).toBe(expectedZ1);
      expect(shadowResults['--shadow-z2']).toBe(expectedZ2);
      expect(shadowResults['--shadow']).toBe(expectedZ2);
      expect(shadowResults['--shadow-z3']).toBe(expectedZ3);
      expect(shadowResults['--shadow-z4']).toBe(expectedZ4);
      expect(shadowResults['--shadow-z5']).toBe(expectedZ5);
      expect(shadowResults['--shadow-none']).toBe(expectedNone);

      // Check drop-shadow rules
      expect(dropShadowResults['--drop-shadow-*']).toBe('initial');
      expect(dropShadowResults['--drop-shadow-z1']).toBe(expectedZ1);
      expect(dropShadowResults['--drop-shadow-z2']).toBe(expectedZ2);
      expect(dropShadowResults['--drop-shadow']).toBe(expectedZ2);
      expect(dropShadowResults['--drop-shadow-z3']).toBe(expectedZ3);
      expect(dropShadowResults['--drop-shadow-z4']).toBe(expectedZ4);
      expect(dropShadowResults['--drop-shadow-z5']).toBe(expectedZ5);
      expect(dropShadowResults['--drop-shadow-none']).toBe(expectedNone);

      // Check inner-shadow rules
      expect(innerShadowResults['--inner-shadow-*']).toBe('initial');
      expect(innerShadowResults['--inner-shadow']).toBe(expectedInner);
      expect(innerShadowResults['--inner-shadow-none']).toBe(expectedNone);
    });
  });
});
