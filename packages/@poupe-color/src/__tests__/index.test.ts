import { describe, expect, it } from 'vitest';

import pkg from '../../package.json';
import { VERSION } from '../index';

describe('@poupe/color', () => {
  it('re-exports the package version from package.json', () => {
    expect(VERSION).toBe(pkg.version);
  });
});
