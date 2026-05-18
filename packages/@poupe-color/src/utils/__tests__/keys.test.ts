import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  keys,
  unsafeKeys,
} from '../keys';

const notB = (key: string) => key !== 'b';

// Rows mirrored from `@poupe/css`'s `keys` / `unsafeKeys` suites;
// the two implementations are kept identical for a future
// `@poupe/utils` extraction.
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
    const result = [...keys(object, notB)];
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
