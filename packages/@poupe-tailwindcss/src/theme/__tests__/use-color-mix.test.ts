import { describe, expect, test } from 'vitest';

import { makeTheme, makeThemeBases, withDefaultThemeOptions } from '../index';

describe('useColorMix option', () => {
  test('useColorMix true passes useColorMix to theme builder', () => {
    const options = withDefaultThemeOptions({
      useColorMix: true,
      colors: { primary: '#6750A4' },
    });

    const theme = makeTheme(options);

    // Verify theme was created without state colors
    expect(theme.options.useColorMix).toBe(true);
  });

  test('useColorMix false (default) generates pre-computed state colors', () => {
    const options = withDefaultThemeOptions({
      colors: { primary: '#6750A4' },
    });

    const theme = makeTheme(options);

    // Verify default behavior
    expect(theme.options.useColorMix).toBe(false);
  });

  test('generates CSS color-mix variables when useColorMix is true', () => {
    const options = withDefaultThemeOptions({
      useColorMix: true,
      colors: { primary: '#6750A4' },
    });

    const theme = makeTheme(options);
    const bases = makeThemeBases(theme);

    // Find the :root rule
    const rootRule = bases.find(rule => ':root' in rule);
    expect(rootRule).toBeDefined();

    const rootStyles = rootRule![':root'] as Record<string, string>;

    // Debug: log keys to see what's available
    const stateColorKeys = Object.keys(rootStyles).filter(key => key.includes('-hover') || key.includes('-focus'));
    expect(stateColorKeys.length).toBeGreaterThan(0);

    // Check for state color variables with color-mix
    expect(rootStyles['--md-primary-hover']).toBeDefined();
    expect(rootStyles['--md-primary-hover']).toMatch(/color-mix\(in srgb,.*var\(--md-primary\).*8%.*var\(--md-on-primary\)\)/);
    expect(rootStyles['--md-primary-focus']).toMatch(/color-mix\(in srgb,.*var\(--md-primary\).*12%.*var\(--md-on-primary\)\)/);
    expect(rootStyles['--md-primary-pressed']).toMatch(/color-mix\(in srgb,.*var\(--md-primary\).*12%.*var\(--md-on-primary\)\)/);
    expect(rootStyles['--md-primary-dragged']).toMatch(/color-mix\(in srgb,.*var\(--md-primary\).*16%.*var\(--md-on-primary\)\)/);
    expect(rootStyles['--md-primary-disabled']).toMatch(/color-mix\(in srgb,.*var\(--md-primary\).*12%.*var\(--md-on-primary\)\)/);
  });

  test('generates CSS color-mix variables when omitTheme is true', () => {
    const options = withDefaultThemeOptions({
      omitTheme: true,
      colors: { primary: '#6750A4' },
    });

    const theme = makeTheme(options);
    const bases = makeThemeBases(theme);

    // Find the :root rule
    const rootRule = bases.find(rule => ':root' in rule);
    expect(rootRule).toBeDefined();

    const rootStyles = rootRule![':root'] as Record<string, string>;

    // When omitTheme is true, state colors should still be generated
    expect(rootStyles['--md-primary-hover']).toMatch(/color-mix\(in srgb,.*var\(--md-primary\).*8%.*var\(--md-on-primary\)\)/);
    expect(rootStyles['--md-secondary-hover']).toMatch(/color-mix\(in srgb,.*var\(--md-secondary\).*8%.*var\(--md-on-secondary\)\)/);
    expect(rootStyles['--md-tertiary-hover']).toMatch(/color-mix\(in srgb,.*var\(--md-tertiary\).*8%.*var\(--md-on-tertiary\)\)/);
    expect(rootStyles['--md-error-hover']).toMatch(/color-mix\(in srgb,.*var\(--md-error\).*8%.*var\(--md-on-error\)\)/);
  });

  test('includes custom palette colors in state color generation', () => {
    const options = withDefaultThemeOptions({
      useColorMix: true,
      colors: {
        primary: '#6750A4',
        brand: '#FF5722',
      },
    });

    const theme = makeTheme(options);
    const bases = makeThemeBases(theme);

    // Find the :root rule
    const rootRule = bases.find(rule => ':root' in rule);
    expect(rootRule).toBeDefined();

    const rootStyles = rootRule![':root'] as Record<string, string>;

    // Check for custom color state variables
    expect(rootStyles['--md-brand-hover']).toMatch(/color-mix\(in srgb,.*var\(--md-brand\).*8%.*var\(--md-on-brand\)\)/);
    expect(rootStyles['--md-brand-focus']).toMatch(/color-mix\(in srgb,.*var\(--md-brand\).*12%.*var\(--md-on-brand\)\)/);
    expect(rootStyles['--md-brand-pressed']).toMatch(/color-mix\(in srgb,.*var\(--md-brand\).*12%.*var\(--md-on-brand\)\)/);
  });
});
