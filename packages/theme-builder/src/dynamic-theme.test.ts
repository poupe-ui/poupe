import { describe, it, expect } from 'vitest';
import {
  makeTheme,
  type ThemeColors,
} from './dynamic-theme';
import { Hct, hct, hexFromHct } from './core/colors';

describe('makeTheme', () => {
  it('should create a theme with default scheme and contrast level', () => {
    // Define a simple theme with primary color only
    const colors: ThemeColors<'secondary'> = {
      primary: hct('#6750A4'), // Material You default primary
      secondary: hct('#958DA5'),
    };

    // Generate the theme
    const theme = makeTheme(colors);

    // Check that the basic structure is correct
    expect(theme).toHaveProperty('source');
    expect(theme).toHaveProperty('colorOptions');
    expect(theme).toHaveProperty('darkScheme');
    expect(theme).toHaveProperty('lightScheme');
    expect(theme).toHaveProperty('darkPalette');
    expect(theme).toHaveProperty('lightPalette');
    expect(theme).toHaveProperty('dark');
    expect(theme).toHaveProperty('light');

    // Verify the source color matches our input
    expect(theme.source).toBeInstanceOf(Hct);
    expect(hexFromHct(theme.source)).toBe('#6750A4');

    // Verify color options has our input colors
    expect(theme.colorOptions).toHaveProperty('primary');
    expect(theme.colorOptions).toHaveProperty('secondary');

    // Verify the dark and light palettes include our custom colors
    expect(theme.darkPalette).toHaveProperty('primary');
    expect(theme.darkPalette).toHaveProperty('secondary');
    expect(theme.lightPalette).toHaveProperty('primary');
    expect(theme.lightPalette).toHaveProperty('secondary');
  });

  it('should create a theme with explicit scheme and contrast level', () => {
    // Define a theme with primary color
    const colors: ThemeColors<'secondary'> = {
      primary: hct('#6750A4'),
      secondary: hct('#958DA5'),
    };

    // Generate the theme with explicit scheme and contrast
    const theme = makeTheme(colors, 'vibrant', 0.5);

    // Check the theme has the right scheme
    expect(theme.darkScheme.name).toBe('vibrant');
    expect(theme.lightScheme.name).toBe('vibrant');

    // Contrast level affects the generated colors, so we can check
    // that a palette color exists and is an Hct instance
    expect(theme.darkPalette.primary).toBeInstanceOf(Hct);
    expect(theme.lightPalette.primary).toBeInstanceOf(Hct);
  });

  it('should handle color objects with options', () => {
    // Define a theme with color options
    const colors: ThemeColors<'accent'> = {
      primary: {
        value: hct('#6750A4'),
        harmonize: true,
      },
      accent: {
        value: hct('#EF5350'),
        name: 'custom-accent',
      },
    };

    const theme = makeTheme(colors);

    // Check that color options were preserved
    expect(theme.colorOptions.primary).toHaveProperty('harmonize', true);
    expect(theme.colorOptions.accent).toHaveProperty('name', 'custom-accent');

    // Check that the accent color was properly included in the palettes
    expect(theme.darkPalette).toHaveProperty('accent');
    expect(theme.lightPalette).toHaveProperty('accent');
  });

  it('should generate standard Material You dynamic colors', () => {
    const colors: ThemeColors<never> = {
      primary: hct('#6750A4'),
    };

    const theme = makeTheme(colors);

    // Standard Material You colors should be present
    // Light theme
    expect(theme.light).toHaveProperty('primary');
    expect(theme.light).toHaveProperty('on-primary');
    expect(theme.light).toHaveProperty('primary-container');
    expect(theme.light).toHaveProperty('on-primary-container');
    expect(theme.light).toHaveProperty('surface');
    expect(theme.light).toHaveProperty('surface-variant');

    // Dark theme
    expect(theme.dark).toHaveProperty('primary');
    expect(theme.dark).toHaveProperty('on-primary');
    expect(theme.dark).toHaveProperty('primary-container');
    expect(theme.dark).toHaveProperty('on-primary-container');
    expect(theme.dark).toHaveProperty('surface');
    expect(theme.dark).toHaveProperty('surface-variant');
  });
});
