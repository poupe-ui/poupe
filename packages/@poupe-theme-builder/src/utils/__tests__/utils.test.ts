import { describe, it, expect } from 'vitest';
import { kebabCase, uint32, uint8, unsafeKeys } from '../utils';

describe('kebabCase', () => {
  it('should convert camelCase to kebab-case', () => {
    expect(kebabCase('camelCase')).toBe('camel-case');
    expect(kebabCase('anotherCamelCase')).toBe('another-camel-case');
  });

  it('should convert PascalCase to kebab-case', () => {
    expect(kebabCase('PascalCase')).toBe('pascal-case');
    expect(kebabCase('AnotherPascalCase')).toBe('another-pascal-case');
  });

  it('should handle multiple uppercase letters correctly', () => {
    expect(kebabCase('XMLHttpRequest')).toBe('xml-http-request');
    expect(kebabCase('CPUUsage')).toBe('cpu-usage');
  });

  it('should convert snake_case to kebab-case', () => {
    expect(kebabCase('snake_case')).toBe('snake-case');
    expect(kebabCase('another_snake_case')).toBe('another-snake-case');
  });

  it('should handle spaces and convert to kebab-case', () => {
    expect(kebabCase('space case')).toBe('space-case');
    expect(kebabCase('multiple space case')).toBe('multiple-space-case');
  });

  it('should handle mixed cases correctly', () => {
    expect(kebabCase('mixedCase_with_snake')).toBe('mixed-case-with-snake');
    expect(kebabCase('Mixed Case_withSnake')).toBe('mixed-case-with-snake');
  });
});

describe('uint32', () => {
  it('should convert numbers to unsigned 32-bit integers', () => {
    expect(uint32(0)).toBe(0);
    expect(uint32(1)).toBe(1);
    expect(uint32(2_147_483_647)).toBe(2_147_483_647); // Max signed 32-bit integer
    expect(uint32(4_294_967_295)).toBe(4_294_967_295); // Max unsigned 32-bit integer
  });

  it('should handle negative numbers correctly', () => {
    expect(uint32(-1)).toBe(4_294_967_295);
    expect(uint32(-2)).toBe(4_294_967_294);
  });

  it('should wrap around for values larger than max uint32', () => {
    expect(uint32(4_294_967_296)).toBe(0); // Max uint32 + 1 wraps to 0
    expect(uint32(4_294_967_297)).toBe(1);
  });
});

describe('uint8', () => {
  it('should convert numbers to unsigned 8-bit integers', () => {
    expect(uint8(0)).toBe(0);
    expect(uint8(127)).toBe(127); // Max signed 8-bit integer
    expect(uint8(255)).toBe(255); // Max unsigned 8-bit integer
  });

  it('should handle negative numbers correctly', () => {
    expect(uint8(-1)).toBe(255);
    expect(uint8(-2)).toBe(254);
  });

  it('should wrap around for values larger than max uint8', () => {
    expect(uint8(256)).toBe(0); // Max uint8 + 1 wraps to 0
    expect(uint8(257)).toBe(1);
  });

  it('should handle larger numbers by taking the lowest 8 bits', () => {
    expect(uint8(300)).toBe(44); // 300 % 256 = 44
    expect(uint8(511)).toBe(255);
    expect(uint8(512)).toBe(0);
  });
});

describe('unsafeKeys', () => {
  it('should return keys of an object', () => {
    const object = { a: 1, b: 2, c: 3 };
    expect(unsafeKeys(object)).toEqual(['a', 'b', 'c']);
  });

  it('should handle empty objects', () => {
    expect(unsafeKeys({})).toEqual([]);
  });

  it('should handle objects with symbol keys', () => {
    const sym = Symbol('test');
    const object = { a: 1, [sym]: 2 };
    // Symbol keys are not included in Object.keys
    expect(unsafeKeys(object)).toEqual(['a']);
  });

  it('should handle arrays', () => {
    const array = [1, 2, 3];
    // For arrays, keys are the indices as strings
    expect(unsafeKeys(array)).toEqual(['0', '1', '2']);
  });
});
