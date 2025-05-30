import { describe, it, expect } from 'vitest';

import {
  processCSSSelectors,
  expandSelectorAlias,
} from '../selectors';

describe('expandSelectorAlias', () => {
  it('should expand built-in aliases', () => {
    expect(expandSelectorAlias('media'))
      .toBe('@media (prefers-color-scheme: dark)');
    expect(expandSelectorAlias('dark'))
      .toBe('@media (prefers-color-scheme: dark)');
    expect(expandSelectorAlias('light'))
      .toBe('@media (prefers-color-scheme: light)');
    expect(expandSelectorAlias('mobile'))
      .toBe('@media (max-width: 768px)');
  });

  it('should use custom aliases when provided', () => {
    const customAliases = {
      custom: '@media (min-width: 1200px)',
      print: '@media print',
    };

    expect(expandSelectorAlias('custom', customAliases))
      .toBe('@media (min-width: 1200px)');
    expect(expandSelectorAlias('print', customAliases))
      .toBe('@media print');
  });

  it('should return original selector if no alias found', () => {
    expect(expandSelectorAlias('.test')).toBe('.test');
    expect(expandSelectorAlias('@media (max-width: 500px)'))
      .toBe('@media (max-width: 500px)');
  });

  it('should handle whitespace properly', () => {
    expect(expandSelectorAlias('  media  '))
      .toBe('@media (prefers-color-scheme: dark)');
  });
});

describe('processCSSSelectors', () => {
  it('should handle single string selectors', () => {
    expect(processCSSSelectors('.test')).toEqual(['.test, .test *']);
  });

  it('should handle single string with commas when allowCommaPassthrough is true', () => {
    expect(processCSSSelectors('.test, .other')).toEqual(['.test, .other']);
  });

  it('should add star variants when allowCommaPassthrough is false', () => {
    expect(processCSSSelectors('.test, .other', { allowCommaPassthrough: false }))
      .toEqual(['.test, .other, .test, .other *']);
  });

  it('should handle arrays with consecutive selectors', () => {
    const result = processCSSSelectors(['.test1', '.test2']);
    expect(result).toEqual(['.test1, .test1 *, .test2, .test2 *']);
  });

  it('should merge consecutive selectors with star variants', () => {
    const result = processCSSSelectors(['.test1', '.test2']);
    expect(result).toEqual(['.test1, .test1 *, .test2, .test2 *']);
  });

  it('should stack at-rules separately', () => {
    const result = processCSSSelectors([
      '@media (prefers-color-scheme: dark)',
      '@media (max-width: 768px)',
    ]);
    expect(result).toEqual([
      '@media (prefers-color-scheme: dark)',
      '@media (max-width: 768px)',
    ]);
  });

  it('should handle mixed selectors and at-rules', () => {
    const result = processCSSSelectors([
      '.dark',
      '@media (prefers-color-scheme: dark)',
      '.custom',
    ]);
    expect(result).toEqual([
      '.dark, .dark *',
      '@media (prefers-color-scheme: dark)',
      '.custom, .custom *',
    ]);
  });

  it('should disable star variants when addStarVariants is false', () => {
    const result = processCSSSelectors(['.test1', '.test2'], { addStarVariants: false });
    expect(result).toEqual(['.test1, .test2']);
  });

  it('should return undefined for empty array', () => {
    expect(processCSSSelectors([])).toBeUndefined();
  });

  it('should expand selector aliases', () => {
    const result = processCSSSelectors(['.test', 'media']);
    expect(result).toEqual([
      '.test, .test *',
      '@media (prefers-color-scheme: dark)',
    ]);
  });

  it('should return undefined for empty arrays', () => {
    expect(processCSSSelectors([])).toBeUndefined();
  });

  it('should expand aliases in single strings', () => {
    expect(processCSSSelectors('media'))
      .toEqual(['@media (prefers-color-scheme: dark)']);
  });

  it('should use custom aliases when provided', () => {
    const customAliases = { custom: '@media (min-width: 1200px)' };
    const result = processCSSSelectors('custom', { aliases: customAliases });
    expect(result).toEqual(['@media (min-width: 1200px)']);
  });

  it('should expand aliases in arrays', () => {
    const result = processCSSSelectors(['.test', 'mobile']);
    expect(result).toEqual([
      '.test, .test *',
      '@media (max-width: 768px)',
    ]);
  });
});
