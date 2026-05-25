/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from 'vitest';
import { Hct, Variant } from '../../core';
import { makeDynamicScheme } from '../colors';
import { makeTheme } from '../theme';

describe('makeTheme with options', () => {
  const primaryColor = Hct.fromInt(0xFF_67_50_A4);
  const colors = {
    primary: primaryColor,
    brand: '#00FF00',
  };

  describe('useColorMix option', () => {
    it('includes state colors by default', () => {
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

    it('omits state colors when useColorMix is true', () => {
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

    it('accepts the legacy positional signature', () => {
      // Test backward compatibility with old signature
      const theme1 = makeTheme(colors, 'vibrant', 0.5);
      expect((theme1.dark as any)['primary-hover']).toBeDefined();

      // Test with extra options
      const theme2 = makeTheme(colors, 'vibrant', 0.5, { useColorMix: false });
      expect((theme2.dark as any)['primary-hover']).toBeDefined();

      // Both should produce similar results for base colors
      expect(theme1.dark.primary.toInt()).toBe(theme2.dark.primary.toInt());
    });

    it('accepts the trailing extra-options parameter', () => {
      const theme = makeTheme(colors, 'expressive', 0.2, {
        useColorMix: false,
      });

      expect((theme.dark as any)['primary-hover']).toBeDefined();
      expect(theme.darkScheme.contrastLevel).toBe(0.2);
    });
  });

  describe('scheme option', () => {
    it.each([
      ['monochrome', Variant.MONOCHROME],
      ['neutral', Variant.NEUTRAL],
      ['tonalSpot', Variant.TONAL_SPOT],
      ['vibrant', Variant.VIBRANT],
      ['expressive', Variant.EXPRESSIVE],
      ['fidelity', Variant.FIDELITY],
      ['content', Variant.CONTENT],
      ['rainbow', Variant.RAINBOW],
      ['fruitSalad', Variant.FRUIT_SALAD],
      ['cmf', Variant.CMF],
    ] as const)('routes scheme %s to its variant', (scheme, expected) => {
      const theme = makeTheme(colors, scheme);
      expect(theme.darkScheme.variant).toBe(expected);
      expect(theme.lightScheme.variant).toBe(expected);
    });
  });

  describe('specVersion option', () => {
    it.each([
      ['tonalSpot', '2025'],
      ['vibrant', '2025'],
      ['expressive', '2025'],
      ['neutral', '2025'],
      ['content', '2021'],
      ['fidelity', '2021'],
      ['monochrome', '2021'],
      ['rainbow', '2021'],
      ['fruitSalad', '2021'],
      ['cmf', '2026'],
    ] as const)('default spec for %s is %s', (scheme, expected) => {
      const theme = makeTheme(colors, scheme);
      expect(theme.darkScheme.specVersion).toBe(expected);
      expect(theme.lightScheme.specVersion).toBe(expected);
    });

    it.each([
      'tonalSpot',
      'vibrant',
      'expressive',
      'neutral',
    ] as const)('explicit 2021 override on %s is honoured', (scheme) => {
      const theme = makeTheme(colors, scheme, 0, { specVersion: '2021' });
      expect(theme.darkScheme.specVersion).toBe('2021');
      expect(theme.lightScheme.specVersion).toBe('2021');
    });

    it.each([
      'content',
      'fidelity',
      'monochrome',
      'rainbow',
      'fruitSalad',
    ] as const)('MCU silently forces %s to 2021 even when 2025 is requested', (scheme) => {
      const theme = makeTheme(colors, scheme, 0, { specVersion: '2025' });
      expect(theme.darkScheme.specVersion).toBe('2021');
      expect(theme.lightScheme.specVersion).toBe('2021');
    });

    it.each([
      'tonalSpot',
      'vibrant',
      'expressive',
      'neutral',
    ] as const)('MCU downgrades %s from explicit 2026 to 2025', (scheme) => {
      const theme = makeTheme(colors, scheme, 0, { specVersion: '2026' });
      expect(theme.darkScheme.specVersion).toBe('2025');
      expect(theme.lightScheme.specVersion).toBe('2025');
    });

    it.each([
      'content',
      'fidelity',
      'monochrome',
      'rainbow',
      'fruitSalad',
    ] as const)('MCU forces %s to 2021 even when 2026 is requested', (scheme) => {
      const theme = makeTheme(colors, scheme, 0, { specVersion: '2026' });
      expect(theme.darkScheme.specVersion).toBe('2021');
      expect(theme.lightScheme.specVersion).toBe('2021');
    });

    it.each([
      [undefined],
      [{ specVersion: '2021' } as const],
      [{ specVersion: '2025' } as const],
      [{ specVersion: '2026' } as const],
    ])('MCU forces cmf to 2026 (%j)', (extra) => {
      const theme = makeTheme(colors, 'cmf', 0, extra);
      expect(theme.darkScheme.specVersion).toBe('2026');
      expect(theme.lightScheme.specVersion).toBe('2026');
    });
  });

  describe('unsupported variant', () => {
    it('makeDynamicScheme refuses TS-bypass variants with TypeError', () => {
      expect(() => makeDynamicScheme(primaryColor, 99 as Variant, 0, false))
        .toThrow(new TypeError('unsupported variant: 99'));
    });
  });

  describe('getStateColorMixParams', () => {
    it('is re-exported from core', async () => {
      const { getStateColorMixParams } = await import('../../core');
      expect(getStateColorMixParams).toBeDefined();
    });

    it('returns correct params for base colors', async () => {
      const { getStateColorMixParams } = await import('../../core');

      const params = getStateColorMixParams('primary', 'hover');
      expect(params).toEqual({
        state: 'hover',
        baseColor: 'primary',
        onColor: 'on-primary',
        opacityPercent: 8,
      });
    });

    it('returns correct params for on-colors', async () => {
      const { getStateColorMixParams } = await import('../../core');

      const params = getStateColorMixParams('on-primary', 'disabled');
      expect(params).toEqual({
        state: 'disabled',
        baseColor: 'primary',
        onColor: 'on-primary',
        opacityPercent: 38, // Uses onDisabled opacity
      });
    });

    it('honours a custom prefix', async () => {
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
