import { describe, expect, it } from 'vitest';
import { Hct } from '@poupe/material-color-utilities';
import {
  stateLayerOpacities,
  makeStateLayerColors,
  makeStateVariants,
  getStateColorMixParams,
} from '../states';
import { makeColorMix } from '../mix';

describe('states', () => {
  describe('stateLayerOpacities', () => {
    it('should have correct opacity values', () => {
      expect(stateLayerOpacities.hover).toBe(0.08);
      expect(stateLayerOpacities.focus).toBe(0.12);
      expect(stateLayerOpacities.pressed).toBe(0.12);
      expect(stateLayerOpacities.dragged).toBe(0.16);
      expect(stateLayerOpacities.disabled).toBe(0.12);
      expect(stateLayerOpacities.onDisabled).toBe(0.38);
    });
  });

  describe('makeStateLayerColors', () => {
    it('should generate state layer colors for a color pair', () => {
      const primary = Hct.fromInt(0xFF_67_50_A4); // Material You primary
      const onPrimary = Hct.fromInt(0xFF_FF_FF_FF); // White

      const states = makeStateLayerColors(primary, onPrimary);

      expect(states.hover).toBeInstanceOf(Hct);
      expect(states.focus).toBeInstanceOf(Hct);
      expect(states.pressed).toBeInstanceOf(Hct);
      expect(states.dragged).toBeInstanceOf(Hct);
      expect(states.disabled).toBeInstanceOf(Hct);
      expect(states.onDisabled).toBeInstanceOf(Hct);
    });

    it('should mix colors at correct opacity ratios', () => {
      const base = Hct.fromInt(0xFF_00_00_00); // Black
      const on = Hct.fromInt(0xFF_FF_FF_FF); // White

      const states = makeStateLayerColors(base, on);

      // Verify that the colors are mixed correctly
      const expectedHover = makeColorMix(base, on, 0.08);
      const expectedFocus = makeColorMix(base, on, 0.12);

      expect(states.hover.toInt()).toBe(expectedHover.toInt());
      expect(states.focus.toInt()).toBe(expectedFocus.toInt());
    });
  });

  describe('makeStateVariants', () => {
    it('should generate state variants for color pairs', () => {
      const colors = {
        primary: Hct.fromInt(0xFF_67_50_A4),
        secondary: Hct.fromInt(0xFF_95_8D_A5),
      };

      const onColors = {
        'on-primary': Hct.fromInt(0xFF_FF_FF_FF),
        'on-secondary': Hct.fromInt(0xFF_1C_1B_1F),
      };

      const variants = makeStateVariants(colors, onColors);

      // Check primary variants
      expect(variants['primary-hover']).toBeInstanceOf(Hct);
      expect(variants['primary-focus']).toBeInstanceOf(Hct);
      expect(variants['primary-pressed']).toBeInstanceOf(Hct);
      expect(variants['primary-dragged']).toBeInstanceOf(Hct);
      expect(variants['primary-disabled']).toBeInstanceOf(Hct);
      expect(variants['on-primary-disabled']).toBeInstanceOf(Hct);

      // Check secondary variants
      expect(variants['secondary-hover']).toBeInstanceOf(Hct);
      expect(variants['secondary-focus']).toBeInstanceOf(Hct);
      expect(variants['secondary-pressed']).toBeInstanceOf(Hct);
      expect(variants['secondary-dragged']).toBeInstanceOf(Hct);
      expect(variants['secondary-disabled']).toBeInstanceOf(Hct);
      expect(variants['on-secondary-disabled']).toBeInstanceOf(Hct);
    });

    it('should throw error if on-color is missing', () => {
      const colors = {
        primary: Hct.fromInt(0xFF_67_50_A4),
      };

      const onColors = {} as Record<`on-${string}`, Hct>;

      expect(() => makeStateVariants(colors, onColors)).toThrow('Missing on-color for primary');
    });

    it('should handle custom color names', () => {
      const colors = {
        brand: Hct.fromInt(0xFF_00_FF_00),
        accent: Hct.fromInt(0xFF_FF_00_00),
      };

      const onColors = {
        'on-brand': Hct.fromInt(0xFF_00_00_00),
        'on-accent': Hct.fromInt(0xFF_FF_FF_FF),
      };

      const variants = makeStateVariants(colors, onColors);

      expect(variants['brand-hover']).toBeInstanceOf(Hct);
      expect(variants['accent-hover']).toBeInstanceOf(Hct);
    });
  });

  describe('getStateColorMixParams', () => {
    it('should return correct params for base colors', () => {
      const params = getStateColorMixParams('primary', 'hover');
      expect(params).toEqual({
        state: 'hover',
        baseColor: 'primary',
        onColor: 'on-primary',
        opacityPercent: 8,
      });
    });

    it('should return correct params for different states', () => {
      expect(getStateColorMixParams('primary', 'focus').opacityPercent).toBe(12);
      expect(getStateColorMixParams('primary', 'pressed').opacityPercent).toBe(12);
      expect(getStateColorMixParams('primary', 'dragged').opacityPercent).toBe(16);
      expect(getStateColorMixParams('primary', 'disabled').opacityPercent).toBe(12);
    });

    it('should handle on-colors correctly', () => {
      const params = getStateColorMixParams('on-primary', 'disabled');
      expect(params).toEqual({
        state: 'disabled',
        baseColor: 'primary',
        onColor: 'on-primary',
        opacityPercent: 38, // Uses onDisabled opacity for on-colors
      });
    });

    it('should handle container colors', () => {
      const params = getStateColorMixParams('primary-container', 'hover');
      expect(params).toEqual({
        state: 'hover',
        baseColor: 'primary-container',
        onColor: 'on-primary-container',
        opacityPercent: 8,
      });
    });

    it('should apply prefix correctly', () => {
      const params = getStateColorMixParams('secondary', 'focus', '--md-');
      expect(params).toEqual({
        state: 'focus',
        baseColor: '--md-secondary',
        onColor: '--md-on-secondary',
        opacityPercent: 12,
      });
    });

    it('should handle on-container colors with prefix', () => {
      const params = getStateColorMixParams('on-tertiary-container', 'disabled', 'var(--');
      expect(params).toEqual({
        state: 'disabled',
        baseColor: 'var(--tertiary-container',
        onColor: 'var(--on-tertiary-container',
        opacityPercent: 38,
      });
    });
  });
});
