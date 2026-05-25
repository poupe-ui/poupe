import { describe, expect, it } from 'vitest';
import { type SpecVersion, Variant } from '../../core';
import {
  type DynamicSchemeKey,
  dynamicSchemes,
  getAcceptedSpecVersions,
  variantSpecAcceptance,
} from '../data';

describe('dynamicSchemes', () => {
  it('covers all 10 MCU 0.4 variants', () => {
    expect(Object.keys(dynamicSchemes).length).toBe(10);
  });
});

describe('variantSpecAcceptance', () => {
  it('has an entry for every scheme in dynamicSchemes', () => {
    for (const variant of Object.values(dynamicSchemes)) {
      expect(getAcceptedSpecVersions(variant).length).toBeGreaterThan(0);
    }
  });

  it('keeps every row ordered ascending', () => {
    // resolveSpecVersion's downgrade loop assumes ascending order;
    // a row like ['2025', '2021'] would silently mis-pick.
    for (const [variantKey, accepted] of Object.entries(variantSpecAcceptance)) {
      const name = Variant[Number(variantKey)];
      for (let i = 1; i < accepted.length; i++) {
        expect(
          accepted[i] > accepted[i - 1],
          `${name} row out of order at index ${i}: ${JSON.stringify(accepted)}`,
        ).toBe(true);
      }
    }
  });
});

describe('getAcceptedSpecVersions', () => {
  const rows: ReadonlyArray<[DynamicSchemeKey, readonly SpecVersion[]]> = [
    ['monochrome', ['2021']],
    ['neutral', ['2021', '2025']],
    ['tonalSpot', ['2021', '2025']],
    ['vibrant', ['2021', '2025']],
    ['expressive', ['2021', '2025']],
    ['fidelity', ['2021']],
    ['content', ['2021']],
    ['rainbow', ['2021']],
    ['fruitSalad', ['2021']],
    ['cmf', ['2026']],
  ];

  it.each(rows)('%s → %j', (name, accepted) => {
    expect(getAcceptedSpecVersions(dynamicSchemes[name])).toEqual(accepted);
  });

  it('returns empty for an unknown variant', () => {
    // 99 is past the Variant enum's max (CMF = 9).
    expect(getAcceptedSpecVersions(99 as Variant)).toEqual([]);
  });

  it('pins variantSpecAcceptance row count to 10', () => {
    expect(Object.keys(variantSpecAcceptance).length).toBe(10);
  });
});
