import { describe, it, expect } from 'vitest';
import { onVariant } from '../on-variant';

describe('onVariant', () => {
  it('should apply single variant to class string', () => {
    const result = onVariant('hover', {
      base: 'bg-blue-500',
    });
    expect(result.base).toBe('hover:bg-blue-500');
  });

  it('should apply multiple variants', () => {
    const result = onVariant(['hover', 'focus'], {
      base: 'bg-blue-500',
    });
    expect(result.base).toEqual(['hover:bg-blue-500', 'focus:bg-blue-500']);
  });

  it('should handle multiple class names', () => {
    const result = onVariant('hover', {
      base: 'bg-blue-500 text-white',
    });
    expect(result.base).toEqual(['hover:bg-blue-500', 'hover:text-white']);
  });

  it('should handle array of class names', () => {
    const result = onVariant('hover', {
      base: ['bg-blue-500', 'text-white'],
    });
    expect(result.base).toEqual(['hover:bg-blue-500', 'hover:text-white']);
  });

  it('should handle nested arrays', () => {
    const result = onVariant('hover', {
      base: [['bg-blue-500'], ['text-white']],
    });
    expect(result.base).toEqual(['hover:bg-blue-500', 'hover:text-white']);
  });

  it('should handle empty strings', () => {
    const result = onVariant('hover', {
      base: '',
    });
    expect(result.base).toBeUndefined();
  });

  it('should handle empty variants', () => {
    const result = onVariant('', {
      base: 'bg-blue-500',
    });
    expect(result.base).toBeUndefined();
  });

  it('should handle multiple properties', () => {
    const result = onVariant('hover', {
      base: 'bg-blue-500',
      active: 'bg-blue-700',
    });
    expect(result.base).toBe('hover:bg-blue-500');
    expect(result.active).toBe('hover:bg-blue-700');
  });

  it('should trim variant names', () => {
    const result = onVariant(' hover ', {
      base: 'bg-blue-500',
    });
    expect(result.base).toBe('hover:bg-blue-500');
  });

  it('should handle falsy values in arrays', () => {
    const result = onVariant('hover', {
      // eslint-disable-next-line unicorn/no-null
      base: ['bg-blue-500', null, undefined, ''],
    });
    expect(result.base).toBe('hover:bg-blue-500');
  });
});
