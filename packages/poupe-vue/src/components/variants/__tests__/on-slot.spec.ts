import { describe, it, expect } from 'vitest';
import { onSlot } from '..';

describe('onSlot', () => {
  it('applies a variant to a single slot', () => {
    const variants = {
      foo: 'bar',
    };
    const result = onSlot('slot', variants);
    expect(result).toEqual({
      foo: {
        slot: 'bar',
      },
    });
  });

  it('applies a variant to multiple slots', () => {
    const variants = {
      foo: 'bar',
    };
    const result = onSlot(['slot1', 'slot2'], variants);
    expect(result).toEqual({
      foo: {
        slot1: 'bar',
        slot2: 'bar',
      },
    });
  });

  it('handles multiple variants', () => {
    const variants = {
      foo: 'bar',
      baz: 'qux',
    };
    const result = onSlot('slot', variants);
    expect(result).toEqual({
      foo: {
        slot: 'bar',
      },
      baz: {
        slot: 'qux',
      },
    });
  });

  it('handles empty variants object', () => {
    const variants = {};
    const result = onSlot('slot', variants);
    expect(result).toEqual({});
  });
});
