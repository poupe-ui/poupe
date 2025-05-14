/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/consistent-function-scoping */
import { describe, it, expect } from 'vitest';
import { camelCase, defaultValidPair, kebabCase, keys, pairs, unsafeKeys } from './utils';

describe('defaultValidPair', () => {
  it('returns true for valid key-value pairs', () => {
    expect(defaultValidPair('valid', 'value')).toBe(true);
    expect(defaultValidPair('valid', 0)).toBe(true);
    expect(defaultValidPair('valid', false)).toBe(true);
    expect(defaultValidPair('valid', {})).toBe(true);
    expect(defaultValidPair('valid', [])).toBe(true);
  });

  it('returns false for null or undefined values', () => {
    expect(defaultValidPair('key', null)).toBe(false);
    expect(defaultValidPair('key', undefined)).toBe(false);
  });

  it('returns false if key contains spaces', () => {
    expect(defaultValidPair('invalid key', 'value')).toBe(false);
  });

  it('returns false if key starts with underscore', () => {
    expect(defaultValidPair('_hidden', 'value')).toBe(false);
  });
});

describe('pairs', () => {
  it('yields valid key-value pairs', () => {
    const object = {
      'valid1': 'value1',
      'valid2': 'value2',
      '_hidden': 'hidden',
      'invalid space': 'space',

      'empty': null,
    };

    const result = [...pairs(object)];
    expect(result).toHaveLength(2);
    expect(result).toContainEqual(['valid1', 'value1']);
    expect(result).toContainEqual(['valid2', 'value2']);
  });

  it('respects custom validation function', () => {
    const object = {
      valid: 'value',
      _prefixed: 'still-valid-with-custom-validator',
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const customValidator = (key: string, _value: unknown) =>
      key !== 'invalid';

    const result = [...pairs(object, customValidator)];
    expect(result).toHaveLength(2);
    expect(result).toContainEqual(['valid', 'value']);
    expect(result).toContainEqual(['_prefixed', 'still-valid-with-custom-validator']);
  });

  it('handles empty objects', () => {
    const object = {};
    const result = [...pairs(object)];
    expect(result).toHaveLength(0);
  });

  it('handles objects with all invalid entries', () => {
    const object = {
      '_hidden1': 'value1',
      '_hidden2': 'value2',
      'invalid key': 'value3',

      'null1': null,
      'undefined1': undefined,
    };
    const result = [...pairs(object)];
    expect(result).toHaveLength(0);
  });
});

describe('kebabCase', () => {
  it('converts camelCase to kebab-case', () => {
    expect(kebabCase('camelCase')).toBe('camel-case');
    expect(kebabCase('multipleWords')).toBe('multiple-words');
  });

  it('converts PascalCase to kebab-case', () => {
    expect(kebabCase('PascalCase')).toBe('pascal-case');
    expect(kebabCase('HTMLElement')).toBe('html-element');
  });

  it('converts snake_case to kebab-case', () => {
    expect(kebabCase('snake_case')).toBe('snake-case');
    expect(kebabCase('multiple_words_here')).toBe('multiple-words-here');
  });

  it('handles spaces correctly', () => {
    expect(kebabCase('with spaces')).toBe('with-spaces');
    expect(kebabCase('  multiple  spaces  ')).toBe('multiple-spaces');
  });

  it('handles multiple uppercase letters correctly', () => {
    expect(kebabCase('XMLHttpRequest')).toBe('xml-http-request');
    expect(kebabCase('BGColor')).toBe('bg-color');
  });

  it('adds leading hyphen to vendor prefixes', () => {
    expect(kebabCase('WebkitTransition')).toBe('-webkit-transition');
    expect(kebabCase('MozBorderRadius')).toBe('-moz-border-radius');
    expect(kebabCase('MsFlexbox')).toBe('-ms-flexbox');
    expect(kebabCase('OAnimation')).toBe('-o-animation');
    expect(kebabCase('KhtmlUserSelect')).toBe('-khtml-user-select');
  });

  it('handles complex vendor prefixed properties', () => {
    expect(kebabCase('WebkitTapHighlightColor')).toBe('-webkit-tap-highlight-color');
    expect(kebabCase('MozOsxFontSmoothing')).toBe('-moz-osx-font-smoothing');
    expect(kebabCase('MsImeAlign')).toBe('-ms-ime-align');
  });
});

describe('camelCase', () => {
  it('converts kebab-case to camelCase', () => {
    expect(camelCase('kebab-case')).toBe('kebabCase');
    expect(camelCase('multiple-words-here')).toBe('multipleWordsHere');
  });

  it('converts PascalCase to camelCase', () => {
    expect(camelCase('PascalCase')).toBe('pascalCase');
    expect(camelCase('HTMLElement')).toBe('htmlElement');
  });

  it('converts snake_case to camelCase', () => {
    expect(camelCase('snake_case')).toBe('snakeCase');
    expect(camelCase('multiple_words_here')).toBe('multipleWordsHere');
  });

  it('handles spaces correctly', () => {
    expect(camelCase('with spaces')).toBe('withSpaces');
    expect(camelCase('  multiple  spaces  ')).toBe('multipleSpaces');
  });

  it('handles multiple uppercase letters correctly', () => {
    expect(camelCase('XML-http-request')).toBe('xmlHttpRequest');
    expect(camelCase('BGColor')).toBe('bgColor');
  });

  it('handles vendor prefixes correctly', () => {
    expect(camelCase('-webkit-transition')).toBe('webkitTransition');
    expect(camelCase('-moz-border-radius')).toBe('mozBorderRadius');
    expect(camelCase('-ms-flexbox')).toBe('msFlexbox');
    expect(camelCase('-o-animation')).toBe('oAnimation');
    expect(camelCase('-khtml-user-select')).toBe('khtmlUserSelect');
  });

  it('handles complex vendor prefixed properties', () => {
    expect(camelCase('-webkit-tap-highlight-color')).toBe('webkitTapHighlightColor');
    expect(camelCase('-moz-osx-font-smoothing')).toBe('mozOsxFontSmoothing');
  });

  it('preserves already camelCase strings', () => {
    expect(camelCase('alreadyCamel')).toBe('alreadyCamel');
    expect(camelCase('anotherCamelCase')).toBe('anotherCamelCase');
  });

  it('handles multiple delimiters', () => {
    expect(camelCase('mix-of_different delimiters')).toBe('mixOfDifferentDelimiters');
    expect(camelCase('multiple--hyphens__underscores')).toBe('multipleHyphensUnderscores');
  });

  it('handles empty strings and edge cases', () => {
    expect(camelCase('')).toBe('');
    expect(camelCase('-')).toBe('');
    expect(camelCase('_')).toBe('');
  });
});

describe('unsafeKeys', () => {
  it('returns keys from an object', () => {
    const object = { a: 1, b: 2, c: 3 };
    expect(unsafeKeys(object)).toEqual(['a', 'b', 'c']);
  });

  it('returns empty array for empty object', () => {
    const object = {};
    expect(unsafeKeys(object)).toEqual([]);
  });
});

describe('keys', () => {
  it('yields all keys from an object', () => {
    const object = { a: 1, b: 2, c: 3 };
    const result = [...keys(object)];
    expect(result).toEqual(['a', 'b', 'c']);
  });

  it('yields empty array for empty object', () => {
    const object = {};
    const result = [...keys(object)];
    expect(result).toEqual([]);
  });

  it('respects validation function', () => {
    const object = { a: 1, b: 2, c: 3 };
    const valid = (key: string) => key !== 'b';
    const result = [...keys(object, valid)];
    expect(result).toEqual(['a', 'c']);
  });

  it('skips non-own properties', () => {
    const proto = { inherited: true };
    const object = Object.create(proto);
    object.own = true;
    const result = [...keys(object)];
    expect(result).toEqual(['own']);
  });
});
