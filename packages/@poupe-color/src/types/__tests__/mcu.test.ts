import {
  describe,
  expect,
  it,
} from 'vitest';

import { paletteKeys } from '../mcu';

describe('paletteKeys', () => {
  it('lists the six MCU palette names in MCU-natural order', () => {
    expect([...paletteKeys]).toEqual([
      'primary',
      'secondary',
      'tertiary',
      'neutral',
      'neutralVariant',
      'error',
    ]);
  });

  it('has no duplicate entries', () => {
    expect(new Set(paletteKeys).size).toBe(paletteKeys.length);
  });
});
