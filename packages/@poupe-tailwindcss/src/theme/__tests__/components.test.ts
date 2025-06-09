import { describe, it, expect, vi } from 'vitest';

import {
  makeSurfaceComponents,
  makeThemeComponents,
  makeZIndexComponents,
  assembleSurfaceComponent,
  makeSurfaceName,
} from '../components';

import {
  makeThemeFromPartialOptions,
} from '../plugin';

describe('makeThemeComponents', () => {
  it('should return an array of component objects', () => {
    const theme = makeThemeFromPartialOptions({});
    const result = makeThemeComponents(theme);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
  });

  it('should respect tailwindPrefix parameter', () => {
    const theme = makeThemeFromPartialOptions({});
    const result = makeThemeComponents(theme, 'tw-');

    // Should pass prefix to makeSurfaceComponents
    const surfaceComponents = result[0];
    // The actual prefixing is tested in makeSurfaceComponents tests
    expect(surfaceComponents).toBeDefined();
  });
});

describe('makeZIndexComponents', () => {
  it('should create dynamic scrim-* utility with modifier support', () => {
    const theme = makeThemeFromPartialOptions({ themePrefix: 'md-' });
    const result = makeZIndexComponents(theme);

    expect(result['scrim-*']).toEqual({
      '@apply fixed inset-0': {},
      'z-index': '--value(integer, [integer])',
      'background-color': 'rgb(var(--md-scrim-rgb) / var(--md-scrim-opacity, 32%))',
      '--md-scrim-opacity': '--modifier([percentage])',
    });
  });

  it('should create semantic scrim utilities with opacity modifier', () => {
    const theme = makeThemeFromPartialOptions({ themePrefix: 'md-' });
    const result = makeZIndexComponents(theme);

    const scrimNames = ['base', 'content', 'drawer', 'modal', 'elevated', 'system'];
    for (const name of scrimNames) {
      expect(result[`scrim-${name}`]).toEqual({
        '@apply fixed inset-0': {},
        'z-index': `var(--md-z-scrim-${name})`,
        'background-color': 'rgb(var(--md-scrim-rgb) / var(--md-scrim-opacity, 32%))',
        '--md-scrim-opacity': '--modifier([percentage])',
      });
    }
  });

  it('should support opacity modifiers for all scrim utilities', () => {
    const theme = makeThemeFromPartialOptions({ themePrefix: 'md-' });
    const result = makeZIndexComponents(theme);

    const scrimUtilities = Object.entries(result).filter(([key]) => key.includes('scrim'));

    for (const [, value] of scrimUtilities) {
      expect(value['--md-scrim-opacity']).toBe('--modifier([percentage])');
      expect(value['@apply fixed inset-0']).toEqual({});
      expect(value['background-color']).toContain('--md-scrim-rgb');
    }

    // Should have 7 scrim utilities total (scrim-* plus 6 semantic ones)
    expect(scrimUtilities).toHaveLength(7);
  });

  it('should create semantic z-index utilities', () => {
    const theme = makeThemeFromPartialOptions({ themePrefix: 'test-' });
    const result = makeZIndexComponents(theme);

    const zNames = ['navigation-persistent', 'navigation-floating', 'navigation-top', 'drawer', 'modal', 'snackbar', 'tooltip'];
    for (const name of zNames) {
      expect(result[`z-${name}`]).toEqual({
        'z-index': `var(--test-z-${name})`,
      });
    }
  });

  it('should use theme prefix correctly', () => {
    const theme = makeThemeFromPartialOptions({ themePrefix: 'custom-' });
    const result = makeZIndexComponents(theme);

    expect(result['scrim-modal']['z-index']).toBe('var(--custom-z-scrim-modal)');
    expect(result['z-drawer']['z-index']).toBe('var(--custom-z-drawer)');
  });

  it('should generate unified scrim utilities with z-index support', () => {
    const theme = makeThemeFromPartialOptions({ themePrefix: 'md-' });
    const result = makeZIndexComponents(theme);

    // Verify semantic scrim utilities exist
    expect(result['scrim-base']).toBeDefined();
    expect(result['scrim-modal']).toBeDefined();
    expect(result['scrim-drawer']).toBeDefined();
    expect(result['scrim-content']).toBeDefined();
    expect(result['scrim-elevated']).toBeDefined();
    expect(result['scrim-system']).toBeDefined();

    // Verify arbitrary z-index utility exists as scrim-*
    expect(result['scrim-*']).toBeDefined();
    expect(result['scrim-*']['z-index']).toBe('--value(integer, [integer])');
    expect(result['scrim-*']['background-color']).toContain('--md-scrim-rgb');

    // Verify old scrim-z-* naming does NOT exist
    expect(result['scrim-z-*']).toBeUndefined();
  });

  it('should use --md-scrim-rgb variable for background color in scrim utilities', () => {
    const theme = makeThemeFromPartialOptions({});
    const result = makeZIndexComponents(theme);

    const scrimArbitrary = result['scrim-*'];
    const scrimSemantic = result['scrim-modal'];

    // Both should use --md-scrim-rgb variable instead of rgb(from ...)
    expect(scrimArbitrary['background-color']).toContain('rgb(var(--md-scrim-rgb)');
    expect(scrimArbitrary['background-color']).not.toContain('rgb(from');
    expect(scrimArbitrary['background-color']).toContain('var(--md-scrim-opacity, 32%)');

    expect(scrimSemantic['background-color']).toContain('rgb(var(--md-scrim-rgb)');
    expect(scrimSemantic['background-color']).not.toContain('rgb(from');
    expect(scrimSemantic['background-color']).toContain('var(--md-scrim-opacity, 32%)');
  });
});

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
