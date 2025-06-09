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
  it('should register scrim-z-* utility with matchUtilities', () => {
    const theme = makeTheme(withDefaultThemeOptions({}));
    const components = makeThemeComponents(theme);

    // Find the component object containing scrim-z-*
    const componentWithScrimZ = components.find(comp => 'scrim-z-*' in comp);
    expect(componentWithScrimZ).toBeDefined();

    const { api, matchUtilitiesMock } = createMockPluginAPI();

    // Process the scrim-z-* utility
    const scrimZValue = componentWithScrimZ!['scrim-z-*'];
    const result = doMatchUtility(api, 'scrim-z-*', scrimZValue);

    expect(result).toBe(true);
    expect(matchUtilitiesMock).toHaveBeenCalledOnce();

    // Verify the registered utility
    const [utilities, options] = matchUtilitiesMock.mock.calls[0];
    expect(Object.keys(utilities)).toEqual(['scrim-z']);
    expect(options?.type).toBe('number');

    // Test the generated CSS
    const scrimZFunction = utilities['scrim-z'];
    const generatedCSS = scrimZFunction('1250', { modifier: null });
    expect(generatedCSS).toEqual({
      '@apply scrim': {},
      'z-index': '1250',
      '--md-scrim-opacity': '32%',
    });
  });

  it('should handle arbitrary values for scrim-z utility', () => {
    const theme = makeTheme(withDefaultThemeOptions({}));
    const components = makeThemeComponents(theme);

    const componentWithScrimZ = components.find(comp => 'scrim-z-*' in comp);
    const { api, matchUtilitiesMock } = createMockPluginAPI();

    doMatchUtility(api, 'scrim-z-*', componentWithScrimZ!['scrim-z-*']);

    const [utilities] = matchUtilitiesMock.mock.calls[0];
    const scrimZFunction = utilities['scrim-z'];

    // Test various arbitrary values
    expect(scrimZFunction('100', { modifier: null })).toEqual({
      '@apply scrim': {},
      'z-index': '100',
      '--md-scrim-opacity': '32%',
    });

    expect(scrimZFunction('var(--custom-z)', { modifier: null })).toEqual({
      '@apply scrim': {},
      'z-index': 'var(--custom-z)',
      '--md-scrim-opacity': '32%',
    });

    expect(scrimZFunction('calc(1000 + 250)', { modifier: null })).toEqual({
      '@apply scrim': {},
      'z-index': 'calc(1000 + 250)',
      '--md-scrim-opacity': '32%',
    });
  });

  it('should handle opacity modifiers for scrim-z utility', () => {
    const theme = makeTheme(withDefaultThemeOptions({}));
    const components = makeThemeComponents(theme);

    const componentWithScrimZ = components.find(comp => 'scrim-z-*' in comp);
    const { api, matchUtilitiesMock } = createMockPluginAPI();

    doMatchUtility(api, 'scrim-z-*', componentWithScrimZ!['scrim-z-*']);

    const [utilities, options] = matchUtilitiesMock.mock.calls[0];
    const scrimZFunction = utilities['scrim-z'];

    // Verify modifier support is enabled
    expect(options?.modifiers).toBe('any');

    // Test without modifier (default 32% opacity)
    expect(scrimZFunction('1000', { modifier: null })).toEqual({
      '@apply scrim': {},
      'z-index': '1000',
      '--md-scrim-opacity': '32%',
    });

    // Test with opacity modifier - sets custom opacity via CSS custom property
    expect(scrimZFunction('1000', { modifier: '50' })).toEqual({
      '@apply scrim': {},
      'z-index': '1000',
      '--md-scrim-opacity': '50%',
    });

    // Test with different opacity
    expect(scrimZFunction('2000', { modifier: '75' })).toEqual({
      '@apply scrim': {},
      'z-index': '2000',
      '--md-scrim-opacity': '75%',
    });
  });

  it('should not register non-dynamic utilities with matchUtilities', () => {
    const { api, matchUtilitiesMock } = createMockPluginAPI();

    // Test static scrim utility
    const result = doMatchUtility(api, 'scrim', {
      '@apply fixed inset-0 bg-scrim/32': {},
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
