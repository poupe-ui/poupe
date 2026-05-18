import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { memoize } from '../memoize';

describe('memoize', () => {
  it('caches the result for repeat calls with the same key', () => {
    const fn = vi.fn((n: number): number => n * 2);
    const memo = memoize(fn);

    expect(memo(3)).toBe(6);
    expect(memo(3)).toBe(6);
    expect(memo(3)).toBe(6);

    // Three calls into the memo, one call into the underlying fn.
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('preserves reference identity on cache hits', () => {
    const memo = memoize((seed: string): { id: string } => ({ id: seed }));

    const first = memo('a');
    const second = memo('a');

    // Cache returns the same object instance, not a fresh allocation.
    expect(second).toBe(first);
  });

  it('scopes the cache to one `memoize` call', () => {
    const fn = vi.fn((n: number): number => n + 1);
    const memoA = memoize(fn);
    const memoB = memoize(fn);

    memoA(10);
    memoB(10);

    // Each `memoize` produces a fresh cache, so memoA's hit does not
    // satisfy memoB's call.
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('treats distinct keys independently', () => {
    const fn = vi.fn((n: number): number => n + 1);
    const memo = memoize(fn);

    expect(memo(1)).toBe(2);
    expect(memo(2)).toBe(3);
    expect(memo(1)).toBe(2);

    expect(fn).toHaveBeenCalledTimes(2);
  });
});
