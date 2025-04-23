import { describe, it, expect, vi } from 'vitest';
import { Hct } from '../core';
import * as dynamicTheme from '../dynamic-theme';
import {
  makeSurfaceKeys,
  makeInteractiveKeys,
  makeInteractiveColors,
  interactiveColors,
} from '../dynamic-color-interactive';

// Mock the makeColorMix function from dynamic-theme
vi.mock('../dynamic-theme', () => ({
  makeColorMix: vi.fn((fg, bg, amount) => {
    // Simple mock implementation that returns a new Hct object
    // In a real implementation, this would actually mix the colors
    return { ...fg, _isMixed: true, amount };
  }),
}));

// Mock the Hct class/constructor
vi.mock('../core', () => ({
  Hct: class MockHct {
    constructor(public h: number, public c: number, public t: number) {}
  },
}));

describe('makeSurfaceKeys', () => {
  it('should filter keys to only include those with "on-" prefixed versions', () => {
    // Arrange
    const keys = ['surface', 'on-surface', 'primary', 'secondary', 'on-primary'];

    // Act
    const result = makeSurfaceKeys(keys);

    // Assert
    expect(result).toEqual(['surface', 'primary']);
    expect(result).not.toContain('secondary');
    expect(result).not.toContain('on-surface');
    expect(result).not.toContain('on-primary');
  });

  it('should return an empty array when no keys have "on-" versions', () => {
    // Arrange
    const keys = ['primary', 'secondary', 'tertiary'];

    // Act
    const result = makeSurfaceKeys(keys);

    // Assert
    expect(result).toEqual([]);
  });

  it('should handle an empty array input', () => {
    // Arrange
    const keys: string[] = [];

    // Act
    const result = makeSurfaceKeys(keys);

    // Assert
    expect(result).toEqual([]);
  });
});

describe('makeInteractiveKeys', () => {
  it('should generate interactive key variants for surface keys', () => {
    // Arrange
    const keys = ['surface', 'on-surface', 'primary', 'on-primary'];

    // Act
    const result = makeInteractiveKeys(keys);

    // Assert
    // Should have 8 keys: 2 surfaces * 4 interactive states
    expect(result).toHaveLength(8);

    // Check specific keys
    expect(result).toContain('surface-hover');
    expect(result).toContain('surface-focus');
    expect(result).toContain('surface-dragged');
    expect(result).toContain('surface-disabled');
    expect(result).toContain('primary-hover');
    expect(result).toContain('primary-focus');
    expect(result).toContain('primary-dragged');
    expect(result).toContain('primary-disabled');
  });

  it('should return an empty array when no surface keys exist', () => {
    // Arrange
    const keys = ['primary', 'secondary', 'tertiary'];

    // Act
    const result = makeInteractiveKeys(keys);

    // Assert
    expect(result).toEqual([]);
  });
});

describe('interactiveColors', () => {
  it('should have all required interactive state templates', () => {
    // Assert
    expect(interactiveColors).toHaveProperty('{}-hover');
    expect(interactiveColors).toHaveProperty('{}-focus');
    expect(interactiveColors).toHaveProperty('{}-dragged');
    expect(interactiveColors).toHaveProperty('{}-disabled');
  });

  it('should call makeColorMix with the right parameters', () => {
    // Arrange
    const mockFg = Hct.from(0, 0, 0);
    const mockBg = Hct.from(180, 50, 50);
    const makeColorMixSpy = vi.spyOn(dynamicTheme, 'makeColorMix');

    // Act
    interactiveColors['{}-hover'](mockFg, mockBg);

    // Assert
    expect(makeColorMixSpy).toHaveBeenCalledWith(mockFg, mockBg, 12);
  });
});

describe('makeInteractiveColors', () => {
  it('should generate interactive color variants for surface colors', () => {
    // Arrange
    const colors = {
      'surface': Hct.from(0, 0, 98), // Light surface
      'on-surface': Hct.from(0, 0, 10), // Dark text on surface
      'primary': Hct.from(200, 70, 50), // Blue primary
      'on-primary': Hct.from(0, 0, 100), // White text on primary
      'secondary': Hct.from(150, 50, 50), // No "on-secondary", should be skipped
    };

    // Act
    const result = makeInteractiveColors(colors);

    // Assert
    // Should have 8 keys: 2 surfaces * 4 interactive states
    expect(Object.keys(result)).toHaveLength(8);

    // Check specific keys exist
    expect(result).toHaveProperty('surface-hover');
    expect(result).toHaveProperty('surface-focus');
    expect(result).toHaveProperty('surface-dragged');
    expect(result).toHaveProperty('surface-disabled');
    expect(result).toHaveProperty('primary-hover');
    expect(result).toHaveProperty('primary-focus');
    expect(result).toHaveProperty('primary-dragged');
    expect(result).toHaveProperty('primary-disabled');

    // Should not have the original colors
    expect(result).not.toHaveProperty('surface');
    expect(result).not.toHaveProperty('on-surface');

    // Should not have keys for colors without "on-" versions
    expect(result).not.toHaveProperty('secondary-hover');
  });

  it('should handle missing foreground or background colors', () => {
    // Arrange - missing on-tertiary
    const colors = {
      'surface': Hct.from(0, 0, 98),
      'on-surface': Hct.from(0, 0, 10),
      'tertiary': Hct.from(300, 60, 60),
      // on-tertiary is missing
    };

    // Act
    const result = makeInteractiveColors(colors);

    // Assert
    // Should only have surface variants, not tertiary
    expect(Object.keys(result)).toHaveLength(4);
    expect(result).toHaveProperty('surface-hover');
    expect(result).not.toHaveProperty('tertiary-hover');
  });

  it('should return an empty object when no surface keys exist', () => {
    // Arrange
    const colors = {
      primary: Hct.from(200, 70, 50),
      secondary: Hct.from(150, 50, 50),
    };

    // Act
    const result = makeInteractiveColors(colors);

    // Assert
    expect(Object.keys(result)).toHaveLength(0);
  });
});
