/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest';
import { Hct } from '../../core';
import { makeTheme } from '../theme';

describe('makeTheme with options', () => {
  const primaryColor = Hct.fromInt(0xFF_67_50_A4);
  const colors = {
    primary: primaryColor,
    brand: '#00FF00',
  };

  describe('useColorMix option', () => {
    it('should include state colors by default', () => {
      const theme = makeTheme(colors);

      // Check for standard state colors
      expect((theme.dark as any)['primary-hover']).toBeDefined();
      expect((theme.dark as any)['primary-focus']).toBeDefined();
      expect((theme.dark as any)['primary-pressed']).toBeDefined();
      expect((theme.dark as any)['primary-dragged']).toBeDefined();
      expect((theme.dark as any)['primary-disabled']).toBeDefined();

      // Check for custom color state colors
      expect((theme.dark as any)['brand-hover']).toBeDefined();
      expect((theme.dark as any)['brand-focus']).toBeDefined();

      // Same for light theme
      expect((theme.light as any)['primary-hover']).toBeDefined();
      expect((theme.light as any)['brand-hover']).toBeDefined();
    });

    it('should not include state colors when useColorMix is true', () => {
      const theme = makeTheme(colors, 'content', 0, { useColorMix: true });

      // Check that state colors are not included
      expect((theme.dark as any)['primary-hover']).toBeUndefined();
      expect((theme.dark as any)['primary-focus']).toBeUndefined();
      expect((theme.dark as any)['primary-pressed']).toBeUndefined();
      expect((theme.dark as any)['primary-dragged']).toBeUndefined();
      expect((theme.dark as any)['primary-disabled']).toBeUndefined();

      // Check that base colors are still included
      expect(theme.dark.primary).toBeDefined();
      expect((theme.dark as any)['on-primary']).toBeDefined();
      expect((theme.dark as any).brand).toBeDefined();
      expect((theme.dark as any)['on-brand']).toBeDefined();
    });

    it('should work with legacy parameters', () => {
      // Test backward compatibility with old signature
      const theme1 = makeTheme(colors, 'vibrant', 0.5);
      expect((theme1.dark as any)['primary-hover']).toBeDefined();

      // Test with extra options
      const theme2 = makeTheme(colors, 'vibrant', 0.5, { useColorMix: false });
      expect((theme2.dark as any)['primary-hover']).toBeDefined();

      // Both should produce similar results for base colors
      expect(theme1.dark.primary.toInt()).toBe(theme2.dark.primary.toInt());
    });

    it('should work with extra options parameter', () => {
      const theme = makeTheme(colors, 'expressive', 0.2, {
        useColorMix: false,
      });

      expect((theme.dark as any)['primary-hover']).toBeDefined();
      expect(theme.darkScheme.contrastLevel).toBe(0.2);
    });
  });

  describe('getStateColorMixParams', () => {
    it('should be exported from core', async () => {
      const { getStateColorMixParams } = await import('../../core');
      expect(getStateColorMixParams).toBeDefined();
    });

    it('should return correct params for base colors', async () => {
      const { getStateColorMixParams } = await import('../../core');

      const params = getStateColorMixParams('primary', 'hover');
      expect(params).toEqual({
        state: 'hover',
        baseColor: 'primary',
        onColor: 'on-primary',
        opacityPercent: 8,
      });
    });

    it('should return correct params for on-colors', async () => {
      const { getStateColorMixParams } = await import('../../core');

      const params = getStateColorMixParams('on-primary', 'disabled');
      expect(params).toEqual({
        state: 'disabled',
        baseColor: 'primary',
        onColor: 'on-primary',
        opacityPercent: 38, // Uses onDisabled opacity
      });
    });

    it('should work with prefix', async () => {
      const { getStateColorMixParams } = await import('../../core');

      const params = getStateColorMixParams('primary', 'focus', '--md-');
      expect(params).toEqual({
        state: 'focus',
        baseColor: '--md-primary',
        onColor: '--md-on-primary',
        opacityPercent: 12,
      });
    });
  });
});
