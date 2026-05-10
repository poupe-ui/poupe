import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  extendedRoles,
  modes,
  requiredStandardRoles,
  specDependentRoles,
  specsWithDim,
  standardRoles,
} from '../theme';

const noDuplicates = (array: readonly string[]): void => {
  expect(new Set(array).size).toBe(array.length);
};

describe('modes', () => {
  it('lists dark then light', () => {
    expect([...modes]).toEqual(['dark', 'light']);
  });

  it('has no duplicates', () => {
    noDuplicates(modes);
  });
});

describe('extendedRoles', () => {
  it('lists the seven on-surface accessors in declared order', () => {
    expect([...extendedRoles]).toEqual([
      'onSurfaceBright',
      'onSurfaceContainer',
      'onSurfaceContainerHigh',
      'onSurfaceContainerHighest',
      'onSurfaceContainerLow',
      'onSurfaceContainerLowest',
      'onSurfaceDim',
    ]);
  });

  it('has no duplicates', () => {
    noDuplicates(extendedRoles);
  });

  it('is disjoint from the standard role catalogue', () => {
    // ExtendedRole and StandardRole address different role surfaces;
    // any collision would let a non-MCU-backed name shadow an MCU
    // accessor silently.
    const standard = new Set<string>(standardRoles);
    for (const role of extendedRoles) {
      expect(standard.has(role)).toBe(false);
    }
  });
});

describe('specDependentRoles', () => {
  it('lists the *Dim quartet in MCU-natural family order', () => {
    expect([...specDependentRoles]).toEqual([
      'primaryDim',
      'secondaryDim',
      'tertiaryDim',
      'errorDim',
    ]);
  });

  it('has no duplicates', () => {
    noDuplicates(specDependentRoles);
  });
});

describe('specsWithDim', () => {
  it('lists the spec versions that ship the *Dim quartet', () => {
    // Source of truth for both the type-level `SpecDependentRole<S>`
    // gate and the runtime `dropSpecDependent` filter in
    // `theme/roles.ts`. Extend in lockstep with `specDependentRoles`
    // when MCU ships a new spec that carries the quartet.
    expect([...specsWithDim]).toEqual(['2025', '2026']);
  });

  it('has no duplicates', () => {
    noDuplicates(specsWithDim);
  });
});

describe('requiredStandardRoles', () => {
  it('lists every required role in MCU-natural family order', () => {
    expect([...requiredStandardRoles]).toEqual([
      // surface family
      'background',
      'inverseOnSurface',
      'inverseSurface',
      'onBackground',
      'onSurface',
      'onSurfaceVariant',
      'outline',
      'outlineVariant',
      'scrim',
      'shadow',
      'surface',
      'surfaceBright',
      'surfaceContainer',
      'surfaceContainerHigh',
      'surfaceContainerHighest',
      'surfaceContainerLow',
      'surfaceContainerLowest',
      'surfaceDim',
      'surfaceTint',
      'surfaceVariant',
      // primary family
      'inversePrimary',
      'onPrimary',
      'onPrimaryContainer',
      'onPrimaryFixed',
      'onPrimaryFixedVariant',
      'primary',
      'primaryContainer',
      'primaryFixed',
      'primaryFixedDim',
      // secondary family
      'onSecondary',
      'onSecondaryContainer',
      'onSecondaryFixed',
      'onSecondaryFixedVariant',
      'secondary',
      'secondaryContainer',
      'secondaryFixed',
      'secondaryFixedDim',
      // tertiary family
      'onTertiary',
      'onTertiaryContainer',
      'onTertiaryFixed',
      'onTertiaryFixedVariant',
      'tertiary',
      'tertiaryContainer',
      'tertiaryFixed',
      'tertiaryFixedDim',
      // error family
      'error',
      'errorContainer',
      'onError',
      'onErrorContainer',
      // palette key colours
      'errorPaletteKeyColor',
      'neutralPaletteKeyColor',
      'neutralVariantPaletteKeyColor',
      'primaryPaletteKeyColor',
      'secondaryPaletteKeyColor',
      'tertiaryPaletteKeyColor',
    ]);
  });

  it('has no duplicates', () => {
    noDuplicates(requiredStandardRoles);
  });
});

describe('standardRoles', () => {
  it('is required followed by spec-dependent', () => {
    expect([...standardRoles]).toEqual([
      ...requiredStandardRoles,
      ...specDependentRoles,
    ]);
  });

  it('has no duplicates across components', () => {
    noDuplicates(standardRoles);
  });
});
