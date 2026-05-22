/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from 'vitest';

import { Variant } from '@poupe/color';

import {
  argb as argbFromColor,
} from '../../core';

import {
  recipeFromThemeColors,
} from '../recipe';

import {
  type ThemeColors,
} from '../types';

describe('recipeFromThemeColors', () => {
  describe('primary', () => {
    it('extracts a bare string primary as ARGB', () => {
      const recipe = recipeFromThemeColors({ primary: '#FF0000' });
      expect(recipe.seeds.primary).toBe(argbFromColor('#FF0000'));
    });

    it('extracts a { value } primary', () => {
      const recipe = recipeFromThemeColors({
        primary: { value: '#FF0000' },
      });
      expect(recipe.seeds.primary).toBe(argbFromColor('#FF0000'));
    });

    it('throws TypeError on a missing primary value', () => {
      expect(
        () => recipeFromThemeColors({ primary: undefined } as any),
      ).toThrow(TypeError);
    });
  });

  describe('core slots', () => {
    it('routes optional core slots through under their declared keys', () => {
      const input: ThemeColors<never> = {
        primary: '#FF0000',
        neutralVariant: '#00FF00',
        error: '#0000FF',
      };
      const recipe = recipeFromThemeColors(input);
      expect(recipe.seeds.neutralVariant).toBe(argbFromColor('#00FF00'));
      expect(recipe.seeds.error).toBe(argbFromColor('#0000FF'));
    });

    it('emits bare ARGB when harmonize defaults to true', () => {
      const recipe = recipeFromThemeColors({
        primary: '#FF0000',
        secondary: { value: '#00FF00' },
      });
      expect(recipe.seeds.secondary).toBe(argbFromColor('#00FF00'));
    });

    it('emits bare ARGB when harmonize is explicitly true', () => {
      const recipe = recipeFromThemeColors({
        primary: '#FF0000',
        secondary: { value: '#00FF00', harmonize: true },
      });
      expect(recipe.seeds.secondary).toBe(argbFromColor('#00FF00'));
    });

    it('emits { value, blend: false } when harmonize is false', () => {
      const recipe = recipeFromThemeColors({
        primary: '#FF0000',
        secondary: { value: '#00FF00', harmonize: false },
      });
      expect(recipe.seeds.secondary).toEqual({
        blend: false,
        value: argbFromColor('#00FF00'),
      });
    });

    it('skips undefined core slots', () => {
      const recipe = recipeFromThemeColors({
        primary: '#FF0000',
        secondary: undefined,
      } as any);
      expect('secondary' in recipe.seeds).toBe(false);
    });
  });

  describe('extras', () => {
    it('camelCases kebab-case extra keys', () => {
      const recipe = recipeFromThemeColors<'brand-hero'>({
        'primary': '#FF0000',
        'brand-hero': '#00FF00',
      });
      expect(recipe.seeds.brandHero).toBe(argbFromColor('#00FF00'));
    });

    it('applies the same harmonize→blend rule to extras', () => {
      const recipe = recipeFromThemeColors<'brand'>({
        primary: '#FF0000',
        brand: { value: '#00FF00', harmonize: false },
      });
      expect(recipe.seeds.brand).toEqual({
        blend: false,
        value: argbFromColor('#00FF00'),
      });
    });
  });

  describe('options', () => {
    it.each([
      ['tonalSpot', Variant.TONAL_SPOT],
      ['neutral', Variant.NEUTRAL],
      ['expressive', Variant.EXPRESSIVE],
      ['vibrant', Variant.VIBRANT],
      ['fidelity', Variant.FIDELITY],
      ['monochrome', Variant.MONOCHROME],
      ['rainbow', Variant.RAINBOW],
      ['fruitSalad', Variant.FRUIT_SALAD],
    ] as const)('pairs %s with its Variant + 2025', (key, variant) => {
      const recipe = recipeFromThemeColors(
        { primary: '#FF0000' },
        key,
      );
      expect(recipe.variant).toBe(variant);
      expect(recipe.specVersion).toBe('2025');
    });

    it('pairs content with CONTENT + 2021', () => {
      const recipe = recipeFromThemeColors(
        { primary: '#FF0000' },
        'content',
      );
      expect(recipe.variant).toBe(Variant.CONTENT);
      expect(recipe.specVersion).toBe('2021');
    });

    it('falls back to content + 2021 on an unknown scheme key', () => {
      const recipe = recipeFromThemeColors(
        { primary: '#FF0000' },
        'made-up' as any,
      );
      expect(recipe.variant).toBe(Variant.CONTENT);
      expect(recipe.specVersion).toBe('2021');
    });

    it('falls back to content + 2021 on an explicit undefined scheme', () => {
      const recipe = recipeFromThemeColors(
        { primary: '#FF0000' },
        undefined,
      );
      expect(recipe.variant).toBe(Variant.CONTENT);
      expect(recipe.specVersion).toBe('2021');
    });

    it('falls back to content + 2021 on an omitted scheme', () => {
      const recipe = recipeFromThemeColors({ primary: '#FF0000' });
      expect(recipe.variant).toBe(Variant.CONTENT);
      expect(recipe.specVersion).toBe('2021');
    });

    it('passes contrastLevel through to contrast', () => {
      const recipe = recipeFromThemeColors(
        { primary: '#FF0000' },
        'content',
        0.5,
      );
      expect(recipe.contrast).toBe(0.5);
    });
  });
});
