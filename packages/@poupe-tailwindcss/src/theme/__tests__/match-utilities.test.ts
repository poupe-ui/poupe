/* eslint-disable unicorn/no-null */
import { describe, expect, it } from 'vitest';
import { asMatchUtility } from '../match-utilities';

describe('asMatchUtility', () => {
  it('should return undefined for non-dynamic utilities', () => {
    const result = asMatchUtility('scrim', { '@apply fixed inset-0 bg-scrim/32': {} });
    expect(result).toBeUndefined();
  });

  it('should return undefined for utilities without --value() patterns', () => {
    const result = asMatchUtility('scrim-z-base', {
      '@apply scrim': {},
      'z-index': 'var(--md-z-scrim-base)',
    });
    expect(result).toBeUndefined();
  });

  it('should convert scrim-z-* utility correctly', () => {
    const result = asMatchUtility('scrim-z-*', {
      '@apply scrim': {},
      'z-index': '--value(integer, [integer])',
    });

    expect(result).toBeDefined();
    expect(result?.name).toBe('scrim-z');
    expect(result?.options?.type).toBe('number');

    // Test the value function
    const cssResult = result?.value?.('100', { modifier: null });
    expect(cssResult).toEqual({
      '@apply scrim': {},
      'z-index': '100',
    });
  });

  it('should handle multiple --value() patterns in a single utility', () => {
    const result = asMatchUtility('text-stroke-*', {
      '-webkit-text-stroke-width': '--value(integer)px',
      '-webkit-text-stroke-color': '--value(color, [color])',
    });

    expect(result).toBeDefined();
    expect(result?.name).toBe('text-stroke');

    // Test the value function - it should use the same value for all properties
    const cssResult = result?.value?.('#ff0000', { modifier: null });
    expect(cssResult).toEqual({
      '-webkit-text-stroke-width': '#ff0000',
      '-webkit-text-stroke-color': '#ff0000',
    });
  });

  it('should preserve static CSS rules alongside dynamic ones', () => {
    const result = asMatchUtility('custom-*', {
      '@apply flex items-center': {},
      'background-color': 'red',
      'width': '--value(length, [length])',
      'height': '--value(length)',
    });

    expect(result).toBeDefined();
    expect(result?.name).toBe('custom');

    const cssResult = result?.value?.('2rem', { modifier: null });
    expect(cssResult).toEqual({
      '@apply flex items-center': {},
      'background-color': 'red',
      'width': '2rem',
      'height': '2rem',
    });
  });

  it('should map types to matchUtilities options correctly', () => {
    const testCases = [
      { type: 'integer', expectedType: 'number' },
      { type: 'number', expectedType: 'number' },
      { type: 'length', expectedType: 'length' },
      { type: 'color', expectedType: 'color' },
      { type: 'percentage', expectedType: 'percentage' },
      { type: 'url', expectedType: 'url' },
      { type: 'any', expectedType: 'any' },
      { type: 'unknown-type', expectedType: 'any' },
    ];

    for (const { type, expectedType } of testCases) {
      const result = asMatchUtility('test-*', {
        property: `--value(${type})`,
      });

      expect(result?.options?.type).toBe(expectedType);
    }
  });

  it('should handle --value() with square bracket notation', () => {
    const result = asMatchUtility('opacity-*', {
      opacity: '--value([percentage])',
    });

    expect(result).toBeDefined();
    expect(result?.name).toBe('opacity');
    expect(result?.options?.type).toBe('percentage');
  });

  it('should handle complex --value() patterns', () => {
    const result = asMatchUtility('shadow-*', {
      'box-shadow': '0 0 0 --value(length) var(--shadow-color)',
    });

    expect(result).toBeDefined();
    expect(result?.name).toBe('shadow');

    const cssResult = result?.value?.('4px', { modifier: null });
    expect(cssResult).toEqual({
      'box-shadow': '4px',
    });
  });

  it('should handle --value() with multiple type syntax correctly', () => {
    // In Tailwind v4, --value(integer, [integer]) means accept both
    // bare values (scrim-z-100) and arbitrary values (scrim-z-[100])
    // Since matchUtilities handles arbitrary values automatically,
    // we only need to extract the base type
    const result = asMatchUtility('scrim-z-*', {
      '@apply scrim': {},
      'z-index': '--value(integer, [integer])',
    });

    expect(result).toBeDefined();
    expect(result?.name).toBe('scrim-z');
    expect(result?.options?.type).toBe('number'); // integer maps to number

    // The value function should work the same regardless
    const cssResult = result?.value?.('1250', { modifier: null });
    expect(cssResult).toEqual({
      '@apply scrim': {},
      'z-index': '1250',
    });
  });

  it('should handle opacity modifiers for scrim-z utility with --modifier patterns', () => {
    const result = asMatchUtility('scrim-z-*', {
      '@apply scrim': {},
      'z-index': '--value(integer, [integer])',
      '--md-scrim-opacity': '--modifier([percentage])',
    });

    expect(result).toBeDefined();
    expect(result?.options?.modifiers).toBe('any');

    // Test without modifier - uses default opacity (32%)
    const cssResultNoModifier = result?.value?.('1000', { modifier: null });
    expect(cssResultNoModifier).toEqual({
      '@apply scrim': {},
      'z-index': '1000',
      '--md-scrim-opacity': '32%',
    });

    // Test with modifier - uses custom opacity
    const cssResultWithModifier = result?.value?.('1000', { modifier: '50' });
    expect(cssResultWithModifier).toEqual({
      '@apply scrim': {},
      'z-index': '1000',
      '--md-scrim-opacity': '50%',
    });

    // Test with different opacity
    const cssResultDifferentOpacity = result?.value?.('2000', { modifier: '75' });
    expect(cssResultDifferentOpacity).toEqual({
      '@apply scrim': {},
      'z-index': '2000',
      '--md-scrim-opacity': '75%',
    });
  });

  it('should not apply modifier handling to non-scrim utilities', () => {
    const result = asMatchUtility('shadow-*', {
      'box-shadow': '--value(length)',
    });

    expect(result).toBeDefined();

    // Non-scrim utilities should ignore modifiers
    const cssResult = result?.value?.('4px', { modifier: '50' });
    expect(cssResult).toEqual({
      'box-shadow': '4px',
    });
  });

  it('should parse --modifier([percentage]) patterns correctly', () => {
    const result = asMatchUtility('opacity-*', {
      'opacity': '--value(number)',
      '--opacity-level': '--modifier([percentage])',
    });

    expect(result).toBeDefined();
    expect(result?.name).toBe('opacity');
    expect(result?.options?.modifiers).toBe('any');

    // Test without modifier
    const cssResultNoModifier = result?.value?.('0.5', { modifier: null });
    expect(cssResultNoModifier).toEqual({
      'opacity': '0.5',
      '--opacity-level': '', // No default specified for non-scrim properties
    });

    // Test with modifier
    const cssResultWithModifier = result?.value?.('0.5', { modifier: '75' });
    expect(cssResultWithModifier).toEqual({
      'opacity': '0.5',
      '--opacity-level': '75%',
    });
  });

  it('should handle --modifier() with explicit default values', () => {
    const result = asMatchUtility('custom-*', {
      'width': '--value(length)',
      '--custom-prop': '--modifier([percentage], 50%)',
    });

    expect(result).toBeDefined();

    // Test without modifier - should use explicit default
    const cssResultNoModifier = result?.value?.('2rem', { modifier: null });
    expect(cssResultNoModifier).toEqual({
      'width': '2rem',
      '--custom-prop': '50%',
    });

    // Test with modifier
    const cssResultWithModifier = result?.value?.('2rem', { modifier: '25' });
    expect(cssResultWithModifier).toEqual({
      'width': '2rem',
      '--custom-prop': '25%',
    });
  });
});
