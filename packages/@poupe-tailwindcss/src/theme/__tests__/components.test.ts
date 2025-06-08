import { describe, it, expect, vi } from 'vitest';

import {
  makeSurfaceComponents,
  assembleSurfaceComponent,
  makeSurfaceName,
} from '../components';

import {
  makeThemeFromPartialOptions,
} from '../plugin';

describe('makeSurfaceComponents', () => {
  it('should return empty object when surfacePrefix is disabled', () => {
    const theme = makeThemeFromPartialOptions({ surfacePrefix: '' });
    const result = makeSurfaceComponents(theme);

    expect(result).toEqual({});
  });

  it('should create surface components for color pairs', () => {
    const theme = makeThemeFromPartialOptions({});
    const result = makeSurfaceComponents(theme);

    // Should have surfaces for colors with on- counterparts
    expect(Object.keys(result).length).toBeGreaterThan(0);
  });

  it('should apply tailwindPrefix to bg- and text- utilities', () => {
    const theme = makeThemeFromPartialOptions({});
    const result = makeSurfaceComponents(theme, 'tw-');

    // Find a surface component and check its @apply directives
    const surfaces = Object.values(result);
    expect(surfaces.length).toBeGreaterThan(0);

    const firstSurface = surfaces[0];
    const applyRule = Object.keys(firstSurface)[0];
    expect(applyRule).toMatch(/tw-bg-|tw-text-/);
  });

  it('should handle custom surfacePrefix', () => {
    const theme = makeThemeFromPartialOptions({ surfacePrefix: 'surface-' });
    const result = makeSurfaceComponents(theme);

    const keys = Object.keys(result);
    const hasSurfacePrefix = keys.some(key => key.startsWith('surface-'));
    expect(hasSurfacePrefix).toBe(true);
  });

  it('should call debugLog when debug is enabled', () => {
    // Mock console.log to prevent debug output during test
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const theme = makeThemeFromPartialOptions({ debug: true });
    expect(() => makeSurfaceComponents(theme)).not.toThrow();

    // Verify that debugLog was called
    expect(consoleLogSpy).toHaveBeenCalled();

    // Clean up the spy
    consoleLogSpy.mockRestore();
  });

  it('should create fixed color combinations', () => {
    const theme = makeThemeFromPartialOptions({
      colors: {
        'primary': { value: '#1976d2' },
        'primary-fixed': { value: '#e3f2fd' },
        'primary-fixed-dim': { value: '#bbdefb' },
        'on-primary-fixed': { value: '#001f3f' },
        'on-primary-fixed-variant': { value: '#004080' },
      },
    });
    const result = makeSurfaceComponents(theme);

    // Should create standard combination
    expect(result['surface-primary-fixed']).toBeDefined();

    // Should create special combinations without redundant 'fixed' in names
    expect(result['surface-primary-fixed-variant']).toEqual({
      '@apply bg-primary-fixed text-on-primary-fixed-variant': {},
    });
    expect(result['surface-primary-fixed-dim']).toEqual({
      '@apply bg-primary-fixed-dim text-on-primary-fixed': {},
    });
    expect(result['surface-primary-fixed-dim-variant']).toEqual({
      '@apply bg-primary-fixed-dim text-on-primary-fixed-variant': {},
    });
  });
});

describe('assembleSurfaceComponent', () => {
  it('should extend bg- with text- when surfacePrefix equals bgPrefix', () => {
    const result = assembleSurfaceComponent('primary', 'on-primary', 'bg-', 'text-', 'bg-');

    expect(result).toEqual({
      key: 'bg-primary',
      value: {
        '@apply text-on-primary': {},
      },
    });
  });

  it('should combine bg- and text- when surfacePrefix differs from bgPrefix', () => {
    const result = assembleSurfaceComponent('primary', 'on-primary', 'bg-', 'text-', 'surface-');

    expect(result).toEqual({
      key: 'surface-primary',
      value: {
        '@apply bg-primary text-on-primary': {},
      },
    });
  });

  it('should handle tailwind prefix in bg and text prefixes', () => {
    const result = assembleSurfaceComponent('secondary', 'on-secondary', 'tw-bg-', 'tw-text-', 'surface-');

    expect(result).toEqual({
      key: 'surface-secondary',
      value: {
        '@apply tw-bg-secondary tw-text-on-secondary': {},
      },
    });
  });
});

describe('makeSurfaceName', () => {
  it('should add prefix to color name', () => {
    expect(makeSurfaceName('primary', 'surface-')).toBe('surface-primary');
    expect(makeSurfaceName('secondary', 'bg-')).toBe('bg-secondary');
  });

  it('should prevent prefix duplication when color already starts with prefix', () => {
    expect(makeSurfaceName('surface-primary', 'surface-')).toBe('surface-primary');
    expect(makeSurfaceName('bg-secondary', 'bg-')).toBe('bg-secondary');
  });

  it('should prevent duplication when colorName- equals prefix', () => {
    expect(makeSurfaceName('surface', 'surface-')).toBe('surface');
    expect(makeSurfaceName('bg', 'bg-')).toBe('bg');
  });

  it('should handle empty prefix', () => {
    expect(makeSurfaceName('primary', '')).toBe('primary');
  });

  it('should handle edge cases', () => {
    expect(makeSurfaceName('', 'surface-')).toBe('surface-');
    expect(makeSurfaceName('color', 'prefix')).toBe('prefixcolor');
  });
});
