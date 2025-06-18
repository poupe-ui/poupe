import { describe, expect, it } from 'vitest';
import { Hct, Variant } from '@poupe/material-color-utilities';
import {
  makeStandardColorsFromScheme,
  makeCustomColors,
  makeDynamicScheme,
} from '../colors';
import {
  makeStandardStateVariants,
  makeCustomStateVariants,
} from '../states';

describe('theme state variants', () => {
  describe('makeStandardStateVariants', () => {
    it('should generate state variants for standard theme colors', () => {
      const source = Hct.fromInt(0xFF_67_50_A4);
      const scheme = makeDynamicScheme(source, Variant.VIBRANT, 0, false);
      const colors = makeStandardColorsFromScheme(scheme);

      const variants = makeStandardStateVariants(colors);

      // Check that variants exist for all main interactive colors
      expect(variants['primary-hover']).toBeInstanceOf(Hct);
      expect(variants['primary-focus']).toBeInstanceOf(Hct);
      expect(variants['primary-pressed']).toBeInstanceOf(Hct);
      expect(variants['primary-dragged']).toBeInstanceOf(Hct);
      expect(variants['primary-disabled']).toBeInstanceOf(Hct);

      expect(variants['secondary-hover']).toBeInstanceOf(Hct);
      expect(variants['tertiary-hover']).toBeInstanceOf(Hct);
      expect(variants['error-hover']).toBeInstanceOf(Hct);
      expect(variants['surface-hover']).toBeInstanceOf(Hct);
      expect(variants['surface-variant-hover']).toBeInstanceOf(Hct);

      // Check container variants
      expect(variants['primary-container-hover']).toBeInstanceOf(Hct);
      expect(variants['secondary-container-hover']).toBeInstanceOf(Hct);
      expect(variants['tertiary-container-hover']).toBeInstanceOf(Hct);
      expect(variants['error-container-hover']).toBeInstanceOf(Hct);
    });
  });

  describe('makeCustomStateVariants', () => {
    it('should generate state variants for custom colors', () => {
      const source = Hct.fromInt(0xFF_67_50_A4);
      const customColors = makeCustomColors(source, {
        brand: { value: '#00FF00' },
        accent: { value: '#FF0000', harmonize: false },
      });

      const darkVariants = makeCustomStateVariants(customColors.dark);
      const lightVariants = makeCustomStateVariants(customColors.light);

      // Check dark theme variants
      expect(darkVariants['brand-hover']).toBeInstanceOf(Hct);
      expect(darkVariants['brand-focus']).toBeInstanceOf(Hct);
      expect(darkVariants['brand-pressed']).toBeInstanceOf(Hct);
      expect(darkVariants['brand-dragged']).toBeInstanceOf(Hct);
      expect(darkVariants['brand-disabled']).toBeInstanceOf(Hct);

      expect(darkVariants['accent-hover']).toBeInstanceOf(Hct);
      expect(darkVariants['brand-container-hover']).toBeInstanceOf(Hct);
      expect(darkVariants['accent-container-hover']).toBeInstanceOf(Hct);

      // Check light theme variants
      expect(lightVariants['brand-hover']).toBeInstanceOf(Hct);
      expect(lightVariants['accent-hover']).toBeInstanceOf(Hct);
    });

    it('should handle colors without containers', () => {
      const customColors = {
        'simple': Hct.fromInt(0xFF_00_FF_00),
        'on-simple': Hct.fromInt(0xFF_00_00_00),
      };

      const variants = makeCustomStateVariants(customColors);

      expect(variants['simple-hover']).toBeInstanceOf(Hct);
      expect(variants['simple-focus']).toBeInstanceOf(Hct);

      // Should not have container variants
      expect(variants['simple-container-hover' as keyof typeof variants]).toBeUndefined();
    });

    it('should handle complex custom color sets', () => {
      const customColors = {
        'brand': Hct.fromInt(0xFF_00_FF_00),
        'brand-container': Hct.fromInt(0xFF_E8_F5_E9),
        'on-brand': Hct.fromInt(0xFF_00_00_00),
        'on-brand-container': Hct.fromInt(0xFF_1B_5E_20),
        'accent': Hct.fromInt(0xFF_FF_00_00),
        'accent-container': Hct.fromInt(0xFF_FF_EB_EE),
        'on-accent': Hct.fromInt(0xFF_FF_FF_FF),
        'on-accent-container': Hct.fromInt(0xFF_B7_1C_1C),
      };

      const variants = makeCustomStateVariants(customColors);

      // All base and container variants should exist
      expect(Object.keys(variants)).toContain('brand-hover');
      expect(Object.keys(variants)).toContain('brand-container-hover');
      expect(Object.keys(variants)).toContain('accent-hover');
      expect(Object.keys(variants)).toContain('accent-container-hover');

      // Check all state types exist
      const brandStates = ['hover', 'focus', 'pressed', 'dragged', 'disabled'];
      for (const state of brandStates) {
        expect(variants[`brand-${state}` as keyof typeof variants]).toBeInstanceOf(Hct);
        expect(variants[`brand-container-${state}` as keyof typeof variants]).toBeInstanceOf(Hct);
      }
    });
  });
});
