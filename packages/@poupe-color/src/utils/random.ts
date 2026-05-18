import { random } from 'colord';

import type { ARGB } from '../types';

import { argbFromColord } from './argb';

/**
 * Generate a random opaque colour as an {@link ARGB}.
 *
 * Used as the floor for the Recipe primary seed when no preset in the
 * resolved chain provides one. The rolled value lands on the Theme as
 * `source` so callers can persist or canonicalise it.
 *
 * Returns `ARGB` rather than the underlying `Colord` so callers don't
 * have to take a direct dependency on `colord` for the input-side
 * type — the package's public surface is `ARGB` end-to-end.
 *
 * @throws when `colord`'s `random()` returns an invalid colour.
 */
export const getRandomColor = (): ARGB => {
  const c = random();
  if (!c.isValid()) {
    throw new TypeError('Failed to generate random color');
  }
  return argbFromColord(c);
};
