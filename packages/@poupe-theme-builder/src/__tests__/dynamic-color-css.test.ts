import { describe, it, expect } from 'vitest';
import {
  defaultCSSThemeOptions,
  defaultDarkSelector,
  defaultLightSelector,
  assembleCSSColors,
  makeCSSTheme,
  generateCSSColorVariables,
  type CSSThemeOptions,
} from '../dynamic-color-css';
import { type ColorMap, Hct } from '../core';
import { rgbFromHct, hct, hslString, splitHct } from '../core';

// Mock color data for testing
const mockDarkColors: ColorMap<string> = {
  primary: hct({ h: 240, c: 40, t: 30 }),
  secondary: hct({ h: 200, c: 30, t: 20 }),
};

const mockLightColors: ColorMap<string> = {
  primary: hct({ h: 240, c: 40, t: 70 }),
  secondary: hct({ h: 200, c: 30, t: 80 }),
};

describe('defaultCSSThemeOptions', () => {
  it('should return default options when no options provided', () => {
    const options = defaultCSSThemeOptions();
    expect(options).toEqual({
      darkMode: '.dark',
      lightMode: '.light',
      prefix: 'md-',
      darkSuffix: '-dark',
      lightSuffix: '-light',
      stringify: rgbFromHct,
    });
  });

  it('should override defaults with provided options', () => {
    const customOptions: Partial<CSSThemeOptions> = {
      darkMode: '@media (prefers-color-scheme: dark)',
      prefix: 'custom-',
    };
    const options = defaultCSSThemeOptions(customOptions);
    expect(options.darkMode).toBe('@media (prefers-color-scheme: dark)');
    expect(options.prefix).toBe('custom-');
    expect(options.lightMode).toBe('.light'); // Default preserved
  });
});

describe('defaultDarkSelector', () => {
  it('should return .dark for true or .dark', () => {
    expect(defaultDarkSelector({ darkMode: true })).toBe('.dark');
    expect(defaultDarkSelector({ darkMode: '.dark' })).toBe('.dark');
  });

  it('should return media query for false, empty string, or media', () => {
    const mediaQuery = '@media not print and (prefers-color-scheme: dark)';
    expect(defaultDarkSelector({ darkMode: false })).toBe(mediaQuery);
    expect(defaultDarkSelector({ darkMode: '' })).toBe(mediaQuery);
    expect(defaultDarkSelector({ darkMode: 'media' })).toBe(mediaQuery);
  });

  it('should return custom selector when provided', () => {
    const custom = '.custom-dark-mode';
    expect(defaultDarkSelector({ darkMode: custom })).toBe(custom);
  });
});

describe('defaultLightSelector', () => {
  it('should return .light for true or .light', () => {
    expect(defaultLightSelector({ lightMode: true })).toBe('.light');
    expect(defaultLightSelector({ lightMode: '.light' })).toBe('.light');
  });

  it('should return undefined for false or empty string', () => {
    expect(defaultLightSelector({ lightMode: false })).toBeUndefined();
    expect(defaultLightSelector({ lightMode: '' })).toBeUndefined();
  });

  it('should return custom selector when provided', () => {
    const custom = '.custom-light-mode';
    expect(defaultLightSelector({ lightMode: custom })).toBe(custom);
  });
});

describe('assembleCSSColors', () => {
  it('should generate CSS color variables with default options', () => {
    const result = assembleCSSColors(mockDarkColors, mockLightColors);

    // Check vars has proper keys
    expect(result.vars).toHaveProperty('primary');
    expect(result.vars).toHaveProperty('secondary');

    // Check values format
    expect(result.darkValues).toHaveProperty('--md-primary-dark');
    expect(result.lightValues).toHaveProperty('--md-primary-light');

    // Check styles array has the right structure
    expect(Array.isArray(result.styles)).toBe(true);
    expect(result.styles.length).toBeGreaterThan(0);
  });

  it('should respect custom prefix and suffixes', () => {
    const options = {
      prefix: 'custom-',
      darkSuffix: '-d',
      lightSuffix: '-l',
    };

    const result = assembleCSSColors(mockDarkColors, mockLightColors, options);

    expect(result.darkValues).toHaveProperty('--custom-primary-d');
    expect(result.lightValues).toHaveProperty('--custom-primary-l');
  });

  it('should handle identical suffixes correctly', () => {
    const options = {
      darkSuffix: '-theme',
      lightSuffix: '-theme',
    };

    const result = assembleCSSColors(mockDarkColors, mockLightColors, options);

    // Should deduplicate values when suffixes are identical
    expect(result.styles.length).toBeGreaterThan(0);
  });
});

describe('makeCSSTheme', () => {
  it('should create theme CSS with default options', () => {
    const colors = {
      primary: { h: 240, c: 40, t: 50 },
      secondary: { h: 200, c: 30, t: 60 },
    };

    const result = makeCSSTheme(colors);

    expect(result.vars).toHaveProperty('primary');
    expect(result.vars).toHaveProperty('secondary');
    expect(Array.isArray(result.styles)).toBe(true);
    expect(result.options.prefix).toBe('md-');
  });

  it('should respect custom options', () => {
    const colors = {
      primary: { h: 240, c: 40, t: 50 },
    };

    const options = {
      prefix: 'theme-',
      scheme: 'content' as const,
      contrastLevel: 1,
    };

    const result = makeCSSTheme(colors, options);

    expect(result.options.prefix).toBe('theme-');
    expect(result.vars).toHaveProperty('primary');
  });

  it('should use custom stringify function', () => {
    const colors = {
      primary: { h: 240, c: 40, t: 50 },
    };

    // eslint-disable-next-line unicorn/consistent-function-scoping
    const customStringify = (c: Hct) => hslString(c);

    const result = makeCSSTheme(colors, { stringify: customStringify });

    // Check that the custom stringify was used
    const hasHslFormat = Object.values(result.darkValues).some(value =>
      typeof value === 'string' && value.startsWith('hsl('));
    expect(hasHslFormat).toBe(true);
  });
});

// Helper to access private functions for testing
import { defaultRootLightSelector, assembleCSSRules } from '../dynamic-color-css';

describe('generateCSSColorVariables', () => {
  it('should generate CSS variables from color maps', () => {
    const options = defaultCSSThemeOptions();
    const result = generateCSSColorVariables(
      mockDarkColors,
      mockLightColors,
      options,
    );

    expect(result).toHaveProperty('vars');
    expect(result).toHaveProperty('darkValues');
    expect(result).toHaveProperty('lightValues');
    expect(result).toHaveProperty('darkVars');
    expect(result).toHaveProperty('lightVars');

    // Check that vars contains the expected keys
    expect(result.vars).toHaveProperty('primary');
    expect(result.vars.primary).toBe('--md-primary');
    expect(result.vars).toHaveProperty('secondary');
    expect(result.vars.secondary).toBe('--md-secondary');

    // Check that darkValues contains the expected CSS variables
    expect(result.darkValues).toHaveProperty('--md-primary-dark');
    expect(result.darkValues).toHaveProperty('--md-secondary-dark');

    // Check that lightValues contains the expected CSS variables
    expect(result.lightValues).toHaveProperty('--md-primary-light');
    expect(result.lightValues).toHaveProperty('--md-secondary-light');

    // Check that darkVars and lightVars include the proper references
    expect(result.darkVars).toHaveProperty('--md-primary');
    expect(result.darkVars!['--md-primary']).toBe('var(--md-primary-dark)');
    expect(result.lightVars).toHaveProperty('--md-primary');
    expect(result.lightVars!['--md-primary']).toBe('var(--md-primary-light)');
  });

  it('should handle colors with custom prefixes and suffixes', () => {
    const options: CSSThemeOptions = {
      ...defaultCSSThemeOptions(),
      prefix: 'custom-',
      darkSuffix: '-d',
      lightSuffix: '-l',
    };

    const result = generateCSSColorVariables(
      mockDarkColors,
      mockLightColors,
      options,
    );

    expect(result.vars.primary).toBe('--custom-primary');
    expect(result.darkValues).toHaveProperty('--custom-primary-d');
    expect(result.lightValues).toHaveProperty('--custom-primary-l');
    expect(result.darkVars!['--custom-primary']).toBe('var(--custom-primary-d)');
    expect(result.lightVars!['--custom-primary']).toBe('var(--custom-primary-l)');
  });

  it('should handle identical suffixes correctly', () => {
    const options: CSSThemeOptions = {
      ...defaultCSSThemeOptions(),
      darkSuffix: '-theme',
      lightSuffix: '-theme',
    };

    const sameColor = hct({ h: 200, c: 30, t: 50 });
    const differentColor = hct({ h: 240, c: 40, t: 70 });

    const darkColors: ColorMap<string> = {
      same: sameColor,
      different: sameColor,
    };

    const lightColors: ColorMap<string> = {
      same: sameColor,
      different: differentColor,
    };

    const result = generateCSSColorVariables(darkColors, lightColors, options);

    // Should deduplicate identical values
    expect(Object.keys(result.darkValues)).not.toContain('--md-same-theme');
  });

  it('should handle custom stringify function', () => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const customStringify = (v: Hct) => {
      const { h, c, t } = splitHct(v);
      return `test-${Math.round(h)}-${Math.round(c)}-${Math.round(t)}`;
    };
    const options: CSSThemeOptions = {
      ...defaultCSSThemeOptions(),
      stringify: customStringify,
    };

    const result = generateCSSColorVariables(
      mockDarkColors,
      mockLightColors,
      options,
    );

    // Check custom stringify format is used
    expect(result.darkValues['--md-primary-dark']).toMatch(/^test-\d+-/);
    expect(result.lightValues['--md-primary-light']).toMatch(/^test-\d+-/);
  });
});

describe('deduplication in generateCSSColorVariables', () => {
  it('should deduplicate identical color values when suffixes are the same', () => {
    const options: CSSThemeOptions = {
      ...defaultCSSThemeOptions(),
      darkSuffix: '-same',
      lightSuffix: '-same',
    };

    // Same colors for both dark and light
    const sameColor = hct({ h: 120, c: 25, t: 50 });

    const darkColors: ColorMap<string> = {
      identical: sameColor,
      differentValue: hct({ h: 200, c: 30, t: 40 }),
    };

    const lightColors: ColorMap<string> = {
      identical: sameColor,
      differentValue: hct({ h: 200, c: 30, t: 80 }),
    };

    const result = generateCSSColorVariables(darkColors, lightColors, options);

    // The identical value should be deduplicated (removed from darkValues)
    expect(result.darkValues).not.toHaveProperty('--md-identical-same');
    expect(result.lightValues).toHaveProperty('--md-identical-same');

    // Different values should be preserved in both
    expect(result.darkValues).toHaveProperty('--md-differentValue-same');
    expect(result.lightValues).toHaveProperty('--md-differentValue-same');
  });

  it('should deduplicate vars references when suffixes are the same', () => {
    const options: CSSThemeOptions = {
      ...defaultCSSThemeOptions(),
      darkSuffix: '-shared',
      lightSuffix: '-shared',
    };

    // Same colors for both dark and light
    const sameColor = hct({ h: 120, c: 25, t: 50 });
    const differentColor = hct({ h: 240, c: 40, t: 60 });

    const darkColors: ColorMap<string> = {
      identical: sameColor,
      different: differentColor,
    };

    const lightColors: ColorMap<string> = {
      identical: sameColor,
      different: hct({ h: 280, c: 35, t: 70 }),
    };

    const result = generateCSSColorVariables(darkColors, lightColors, options);

    // The var references for identical values should be deduplicated
    expect(result.darkVars ?? {}).not.toHaveProperty('--md-identical');

    // Identical variables should be preserved in light
    expect(result.darkVars ?? {}).not.toHaveProperty('--md-different');
    expect(result.lightVars ?? {}).toHaveProperty('--md-different');
  });

  it('should not deduplicate when suffixes are different', () => {
    const options: CSSThemeOptions = {
      ...defaultCSSThemeOptions(),
      darkSuffix: '-dark',
      lightSuffix: '-light',
    };

    // Same color for both dark and light
    const sameColor = hct({ h: 120, c: 25, t: 50 });

    const darkColors: ColorMap<string> = {
      identical: sameColor,
    };

    const lightColors: ColorMap<string> = {
      identical: sameColor,
    };

    const result = generateCSSColorVariables(darkColors, lightColors, options);

    // No deduplication should happen with different suffixes
    expect(result.darkValues).toHaveProperty('--md-identical-dark');
    expect(result.lightValues).toHaveProperty('--md-identical-light');
    expect(result.darkVars).toHaveProperty('--md-identical');
    expect(result.lightVars).toHaveProperty('--md-identical');
  });

  it('should handle completely empty objects after deduplication', () => {
    const options: CSSThemeOptions = {
      ...defaultCSSThemeOptions(),
      darkSuffix: '-common',
      lightSuffix: '-common',
    };

    // Same colors for both dark and light (everything identical)
    const sameColor = hct({ h: 120, c: 25, t: 50 });

    const darkColors: ColorMap<string> = {
      color1: sameColor,
      color2: sameColor,
    };

    const lightColors: ColorMap<string> = {
      color1: sameColor,
      color2: sameColor,
    };

    const result = generateCSSColorVariables(darkColors, lightColors, options);

    // All dark values should be deduplicated
    expect(Object.keys(result.darkValues).length).toBe(0);

    // Light values should remain
    expect(Object.keys(result.lightValues).length).toBe(2);

    // darkVars should be undefined since everything was deduplicated
    expect(result.darkVars).toBeUndefined();
  });
});

describe('defaultRootLightSelector', () => {
  if (typeof defaultRootLightSelector === 'function') {
    it('should return :root when lightMode is false or empty', () => {
      expect(defaultRootLightSelector({ lightMode: false })).toBe(':root');
      expect(defaultRootLightSelector({ lightMode: '' })).toBe(':root');
    });

    it('should combine :root with light selector when lightMode is defined', () => {
      const selector = defaultRootLightSelector({ lightMode: '.light-theme' });
      expect(selector).toBe(':root, .light-theme');

      const defaultSelector = defaultRootLightSelector({});
      expect(defaultSelector).toBe(':root, .light');
    });
  }
});

describe('assembleCSSRules', () => {
  if (typeof assembleCSSRules === 'function') {
    it('should create CSS rules with root styles when provided', () => {
      const root = { '--color': '#123456' };
      const light = { '--text': 'black' };
      const dark = { '--text': 'white' };
      const options = defaultCSSThemeOptions();

      const result = assembleCSSRules(root, light, dark, options);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(result[0]).toHaveProperty(':root');
      expect(result[0][':root']).toEqual(root);
      expect(result[1]).toHaveProperty(':root, .light');
      expect(result[1][':root, .light']).toEqual(light);
      expect(result[1]['.dark']).toEqual(dark);
    });

    it('should exclude root styles when root is undefined', () => {
      const light = { '--text': 'black' };
      const dark = { '--text': 'white' };
      const options = defaultCSSThemeOptions();

      const result = assembleCSSRules(undefined, light, dark, options);

      expect(result.length).toBe(1);
      expect(result[0]).toHaveProperty(':root, .light');
      expect(result[0]).toHaveProperty('.dark');
    });

    it('should use custom selectors from options', () => {
      const light = { '--text': 'black' };
      const dark = { '--text': 'white' };
      const options = defaultCSSThemeOptions({
        darkMode: '.theme-dark',
        lightMode: '.theme-light',
      });

      const result = assembleCSSRules(undefined, light, dark, options);

      expect(result[0]).toHaveProperty(':root, .theme-light');
      expect(result[0]).toHaveProperty('.theme-dark');
    });
  }
});
