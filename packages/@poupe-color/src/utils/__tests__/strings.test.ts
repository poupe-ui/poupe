// cspell:words khtml

import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  camelCase,
  capitalize,
} from '../strings';

// Rows mirrored from `@poupe/css`'s camelCase suite; the two
// implementations are kept identical for a future `@poupe/utils`
// extraction.
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

describe('capitalize', () => {
  it('uppercases the first character', () => {
    expect(capitalize('foo')).toBe('Foo');
    expect(capitalize('bar')).toBe('Bar');
  });

  it('preserves the remainder verbatim', () => {
    expect(capitalize('fooBar')).toBe('FooBar');
    expect(capitalize('hello world')).toBe('Hello world');
  });

  it('passes already-capitalised strings through', () => {
    expect(capitalize('Foo')).toBe('Foo');
    expect(capitalize('ABC')).toBe('ABC');
  });

  it('handles single characters', () => {
    expect(capitalize('a')).toBe('A');
    expect(capitalize('A')).toBe('A');
  });

  it('handles empty strings', () => {
    expect(capitalize('')).toBe('');
  });
});
