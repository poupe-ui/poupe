/* eslint-disable unicorn/no-null */
import { describe, expect, it, vi } from 'vitest';
import { makeThemeComponents } from '../components';
import { makeTheme } from '../theme';
import { withDefaultThemeOptions } from '../options';
import { doMatchUtility } from '../plugin';
import type { PluginAPI } from '../utils';

// Mock PluginAPI
const createMockPluginAPI = () => {
  const matchUtilitiesMock = vi.fn();
  const api: Partial<PluginAPI> = {
    matchUtilities: matchUtilitiesMock,
  };
  return { api: api as PluginAPI, matchUtilitiesMock };
};

describe('plugin matchUtilities integration', () => {
  it('should register scrim-* utility with matchUtilities', () => {
    const theme = makeTheme(withDefaultThemeOptions({}));
    const components = makeThemeComponents(theme);

    // Find the component object containing scrim-*
    const componentWithScrim = components.find(comp => 'scrim-*' in comp);
    expect(componentWithScrim).toBeDefined();

    const { api, matchUtilitiesMock } = createMockPluginAPI();

    // Process the scrim-* utility
    const scrimValue = componentWithScrim!['scrim-*'];
    const result = doMatchUtility(api, 'scrim-*', scrimValue);

    expect(result).toBe(true);
    expect(matchUtilitiesMock).toHaveBeenCalledOnce();

    // Verify the registered utility
    const [utilities, options] = matchUtilitiesMock.mock.calls[0];
    expect(Object.keys(utilities)).toEqual(['scrim']);
    expect(options?.type).toBe('number');

    // Test the generated CSS
    const scrimFunction = utilities['scrim'];
    const generatedCSS = scrimFunction('1250', { modifier: null });
    expect(generatedCSS).toEqual({
      '@apply fixed inset-0': {},
      'z-index': '1250',
      'background-color': 'rgb(var(--md-scrim-rgb) / var(--md-scrim-opacity, 32%))',
      '--md-scrim-opacity': '32%',
    });
  });

  it('should handle arbitrary values for scrim utility', () => {
    const theme = makeTheme(withDefaultThemeOptions({}));
    const components = makeThemeComponents(theme);

    const componentWithScrim = components.find(comp => 'scrim-*' in comp);
    const { api, matchUtilitiesMock } = createMockPluginAPI();

    doMatchUtility(api, 'scrim-*', componentWithScrim!['scrim-*']);

    const [utilities] = matchUtilitiesMock.mock.calls[0];
    const scrimFunction = utilities['scrim'];

    // Test various arbitrary values
    expect(scrimFunction('100', { modifier: null })).toEqual({
      '@apply fixed inset-0': {},
      'z-index': '100',
      'background-color': 'rgb(var(--md-scrim-rgb) / var(--md-scrim-opacity, 32%))',
      '--md-scrim-opacity': '32%',
    });

    expect(scrimFunction('var(--custom-z)', { modifier: null })).toEqual({
      '@apply fixed inset-0': {},
      'z-index': 'var(--custom-z)',
      'background-color': 'rgb(var(--md-scrim-rgb) / var(--md-scrim-opacity, 32%))',
      '--md-scrim-opacity': '32%',
    });

    expect(scrimFunction('calc(1000 + 250)', { modifier: null })).toEqual({
      '@apply fixed inset-0': {},
      'z-index': 'calc(1000 + 250)',
      'background-color': 'rgb(var(--md-scrim-rgb) / var(--md-scrim-opacity, 32%))',
      '--md-scrim-opacity': '32%',
    });
  });

  it('should handle opacity modifiers for scrim utility', () => {
    const theme = makeTheme(withDefaultThemeOptions({}));
    const components = makeThemeComponents(theme);

    const componentWithScrim = components.find(comp => 'scrim-*' in comp);
    const { api, matchUtilitiesMock } = createMockPluginAPI();

    doMatchUtility(api, 'scrim-*', componentWithScrim!['scrim-*']);

    const [utilities, options] = matchUtilitiesMock.mock.calls[0];
    const scrimFunction = utilities['scrim'];

    // Verify modifier support is enabled
    expect(options?.modifiers).toBe('any');

    // Test without modifier (default 32% opacity)
    expect(scrimFunction('1000', { modifier: null })).toEqual({
      '@apply fixed inset-0': {},
      'z-index': '1000',
      'background-color': 'rgb(var(--md-scrim-rgb) / var(--md-scrim-opacity, 32%))',
      '--md-scrim-opacity': '32%',
    });

    // Test with opacity modifier - sets custom opacity via CSS custom property
    expect(scrimFunction('1000', { modifier: '50' })).toEqual({
      '@apply fixed inset-0': {},
      'z-index': '1000',
      'background-color': 'rgb(var(--md-scrim-rgb) / var(--md-scrim-opacity, 32%))',
      '--md-scrim-opacity': '50%',
    });

    // Test with different opacity
    expect(scrimFunction('2000', { modifier: '75' })).toEqual({
      '@apply fixed inset-0': {},
      'z-index': '2000',
      'background-color': 'rgb(var(--md-scrim-rgb) / var(--md-scrim-opacity, 32%))',
      '--md-scrim-opacity': '75%',
    });
  });

  it('should not register non-dynamic utilities with matchUtilities', () => {
    const { api, matchUtilitiesMock } = createMockPluginAPI();

    // Test static z-index utility (non-scrim utility)
    const result = doMatchUtility(api, 'z-modal', {
      'z-index': 'var(--md-z-modal)',
    });

    expect(result).toBe(false);
    expect(matchUtilitiesMock).not.toHaveBeenCalled();
  });

  it('should not register semantic z-index utilities with matchUtilities', () => {
    const theme = makeTheme(withDefaultThemeOptions({}));
    const components = makeThemeComponents(theme);

    const componentWithZIndex = components.find(comp => 'z-modal' in comp);
    expect(componentWithZIndex).toBeDefined();

    const { api, matchUtilitiesMock } = createMockPluginAPI();

    // Process semantic z-index utility (should not use matchUtilities)
    const result = doMatchUtility(api, 'z-modal', componentWithZIndex!['z-modal']);

    expect(result).toBe(false);
    expect(matchUtilitiesMock).not.toHaveBeenCalled();
  });
});
