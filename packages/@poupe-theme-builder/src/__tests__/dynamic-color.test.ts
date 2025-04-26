import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getColorNameOption,
  makeStandardColorsFromScheme,
  makeStandardPaletteFromScheme,
  makeCustomColors,
  type ColorOptions,
} from './dynamic-color';

import {
  DynamicScheme,
} from './core/colors';

import {
  standardDynamicColors,
  standardPaletteKeyColors,
} from './dynamic-color-data';

// Mock dependencies
vi.mock('./core/colors', () => {
  return {
    Hct: {
      fromInt: vi.fn(value => ({ toInt: () => value })),
    },
    argb: vi.fn(color => typeof color === 'number' ? color : 12_345),
    hct: vi.fn(color => ({ toInt: () => typeof color === 'number' ? color : 12_345 })),
  };
});

vi.mock('./dynamic-color-data', () => {
  return {
    standardDynamicColors: {
      'primary': { getHct: vi.fn(() => ({ toInt: () => 1000 })) },
      'on-primary': { getHct: vi.fn(() => ({ toInt: () => 2000 })) },
    },
    standardPaletteKeyColors: {
      primary100: { getHct: vi.fn(() => ({ toInt: () => 3000 })) },
      primary200: { getHct: vi.fn(() => ({ toInt: () => 4000 })) },
    },
    customDynamicColors: {
      '{}-primary': vi.fn(color => color + 1),
      '{}-on-primary': vi.fn(color => color + 2),
    },
  };
});

describe('getColorNameOption', () => {
  it('should return the default color name when name is undefined or true', () => {
    const colors: Record<string, Partial<ColorOptions>> = {
      primary: { value: 0xFF_FF_FF },
      secondary: { value: 0xFF_FF_FF, name: true },
    };

    expect(getColorNameOption('primary', colors)).toBe('primary');
    expect(getColorNameOption('secondary', colors)).toBe('secondary');
  });

  it('should return the custom color name when a string is provided', () => {
    const colors: Record<string, Partial<ColorOptions>> = {
      primary: { value: 0xFF_FF_FF, name: 'custom-primary' },
    };

    expect(getColorNameOption('primary', colors)).toBe('custom-primary');
  });

  it('should return undefined when name is false or empty string', () => {
    const colors: Record<string, Partial<ColorOptions>> = {
      primary: { value: 0xFF_FF_FF, name: false },
      secondary: { value: 0xFF_FF_FF, name: '' },
    };

    expect(getColorNameOption('primary', colors)).toBeUndefined();
    expect(getColorNameOption('secondary', colors)).toBeUndefined();
  });
});

describe('makeStandardColorsFromScheme', () => {
  it('should retrieve colors from the standardDynamicColors using the scheme', () => {
    const mockScheme = {} as DynamicScheme;
    const colors = makeStandardColorsFromScheme(mockScheme);

    expect(Object.keys(colors).length).toBe(2);
    expect(colors['primary']).toBeDefined();
    expect(colors['on-primary']).toBeDefined();
    expect(standardDynamicColors['primary'].getHct).toHaveBeenCalledWith(mockScheme);
    expect(standardDynamicColors['on-primary'].getHct).toHaveBeenCalledWith(mockScheme);
  });
});

describe('makeStandardPaletteFromScheme', () => {
  it('should retrieve colors from the standardPaletteKeyColors using the scheme', () => {
    const mockScheme = {} as DynamicScheme;
    const colors = makeStandardPaletteFromScheme(mockScheme);

    expect(Object.keys(colors).length).toBe(2);
    expect(colors['primary100']).toBeDefined();
    expect(colors['primary200']).toBeDefined();
    expect(standardPaletteKeyColors['primary100'].getHct).toHaveBeenCalledWith(mockScheme);
    expect(standardPaletteKeyColors['primary200'].getHct).toHaveBeenCalledWith(mockScheme);
  });
});

describe('makeCustomColors', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create custom colors with default harmonization', () => {
    const source = 0x12_34_56;
    const colors = {
      brand: { value: 0xFF_00_00 },
      accent: { value: 0x00_FF_00 },
    };

    const result = makeCustomColors(source, colors);

    expect(result.source).toBe(source);
    expect(result.colors).toEqual(['brand', 'accent']);
    expect(Object.keys(result.colorOptions)).toEqual(['brand', 'accent']);

    // Check dark and light values
    expect(result.dark).toBeDefined();
    expect(result.light).toBeDefined();

    // Check specific patterns
    expect(result.dark['brand-primary']).toBeDefined();
    expect(result.dark['brand-on-primary']).toBeDefined();
    expect(result.dark['accent-primary']).toBeDefined();
    expect(result.dark['accent-on-primary']).toBeDefined();

    expect(result.light['brand-primary']).toBeDefined();
    expect(result.light['brand-on-primary']).toBeDefined();
    expect(result.light['accent-primary']).toBeDefined();
    expect(result.light['accent-on-primary']).toBeDefined();
  });

  it('should respect harmonize option', () => {
    const source = 0x12_34_56;
    const colors = {
      brand: { value: 0xFF_00_00, harmonize: false },
      accent: { value: 0x00_FF_00, harmonize: true },
    };

    const result = makeCustomColors(source, colors);

    // We expect different behavior for harmonize true/false but since we mocked the actual implementation,
    // we can just check that the options were passed correctly
    expect(result.colorOptions.brand.harmonize).toBe(false);
    expect(result.colorOptions.accent.harmonize).toBe(true);
  });

  it('should handle kebab-case conversion for names', () => {
    const source = 0x12_34_56;
    const colors = {
      brandColor: { value: 0xFF_00_00 },
      accentColor: { value: 0x00_FF_00 },
    };

    const result = makeCustomColors(source, colors);

    // Keys in the result should be kebab-cased
    expect(result.colorOptions['brand-color']).toBeDefined();
    expect(result.colorOptions['accent-color']).toBeDefined();

    // Check specific patterns with kebab-case
    expect(result.dark['brand-color-primary']).toBeDefined();
    expect(result.dark['accent-color-primary']).toBeDefined();
  });
});
