import { expect, test } from 'vitest';

import {
  uint32,
} from './utils';

import {
  argb,
  hct,
  hex,
} from './colors';

test('argb', () => {
  expect(hex(hct({ r: 0x34, g: 0x56, b: 0x67 }))).eq('#345667');
  expect(argb(hct({ r: 0x34, g: 0x56, b: 0x67 }))).eq(uint32(0xFF_34_56_67));
});
