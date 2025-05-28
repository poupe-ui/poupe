/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/no-null */
import { describe, it, expect } from 'vitest';
import { defaultColors, withKnownColor } from '../default-colors';

describe('defaultColors', () => {
  it('should contain all Tailwind CSS colors', () => {
    // Test neutral grays
    expect(defaultColors.slate).toBe('#64748b');
    expect(defaultColors.gray).toBe('#6b7280');
    expect(defaultColors.grey).toBe('#6b7280');
    expect(defaultColors.zinc).toBe('#71717a');
    expect(defaultColors.neutral).toBe('#737373');
    expect(defaultColors.stone).toBe('#78716c');

    // Test vibrant colors
    expect(defaultColors.red).toBe('#ef4444');
    expect(defaultColors.orange).toBe('#f97316');
    expect(defaultColors.amber).toBe('#f59e0b');
    expect(defaultColors.yellow).toBe('#eab308');
    expect(defaultColors.lime).toBe('#84cc16');
    expect(defaultColors.green).toBe('#22c55e');
    expect(defaultColors.emerald).toBe('#10b981');
    expect(defaultColors.teal).toBe('#14b8a6');
    expect(defaultColors.cyan).toBe('#06b6d4');
    expect(defaultColors.sky).toBe('#0ea5e9');
    expect(defaultColors.blue).toBe('#3b82f6');
    expect(defaultColors.indigo).toBe('#6366f1');
    expect(defaultColors.violet).toBe('#8b5cf6');
    expect(defaultColors.purple).toBe('#a855f7');
    expect(defaultColors.fuchsia).toBe('#d946ef');
    expect(defaultColors.pink).toBe('#ec4899');
    expect(defaultColors.rose).toBe('#f43f5e');

    // Test monochrome
    expect(defaultColors.black).toBe('#000');
    expect(defaultColors.white).toBe('#fff');
  });

  it('should have expected number of colors', () => {
    // Count actual colors: 6 neutrals (including grey alias) + 17 vibrant colors + 2 monochrome = 25 colors
    const colorCount = Object.keys(defaultColors).length;
    expect(colorCount).toBe(25);
  });

  it('should contain all hex values in correct format', () => {
    for (const color of Object.values(defaultColors)) {
      expect(color).toMatch(/^#[0-9a-f]{3,6}$/);
    }
  });

  it('should have consistent color families', () => {
    // Ensure neutral grays exist
    const neutrals = ['slate', 'gray', 'grey', 'zinc', 'neutral', 'stone'];
    for (const neutral of neutrals) {
      expect(defaultColors).toHaveProperty(neutral);
    }

    // Ensure vibrant colors exist
    const vibrants = [
      'red', 'orange', 'amber', 'yellow', 'lime', 'green',
      'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo',
      'violet', 'purple', 'fuchsia', 'pink', 'rose',
    ];
    for (const vibrant of vibrants) {
      expect(defaultColors).toHaveProperty(vibrant);
    }
  });
});

describe('withKnownColor', () => {
  describe('Tailwind CSS color conversion', () => {
    it('should convert Tailwind colors to hex (lowercase)', () => {
      expect(withKnownColor('blue')).toBe('#3b82f6');
      expect(withKnownColor('red')).toBe('#ef4444');
      expect(withKnownColor('green')).toBe('#22c55e');
      expect(withKnownColor('slate')).toBe('#64748b');
      expect(withKnownColor('gray')).toBe('#6b7280');
      expect(withKnownColor('grey')).toBe('#6b7280');
      expect(withKnownColor('zinc')).toBe('#71717a');
    });

    it('should convert Tailwind colors to hex (uppercase)', () => {
      expect(withKnownColor('BLUE')).toBe('#3b82f6');
      expect(withKnownColor('RED')).toBe('#ef4444');
      expect(withKnownColor('GREEN')).toBe('#22c55e');
      expect(withKnownColor('SLATE')).toBe('#64748b');
      expect(withKnownColor('ZINC')).toBe('#71717a');
    });

    it('should convert Tailwind colors to hex (mixed case)', () => {
      expect(withKnownColor('Blue')).toBe('#3b82f6');
      expect(withKnownColor('Red')).toBe('#ef4444');
      expect(withKnownColor('Green')).toBe('#22c55e');
      expect(withKnownColor('Slate')).toBe('#64748b');
      expect(withKnownColor('Zinc')).toBe('#71717a');
    });

    it('should prioritize Tailwind colors over CSS named colors', () => {
      // These colors exist in both palettes but should return Tailwind values
      expect(withKnownColor('red')).toBe('#ef4444'); // Tailwind red
      expect(withKnownColor('blue')).toBe('#3b82f6'); // Tailwind blue
      expect(withKnownColor('green')).toBe('#22c55e'); // Tailwind green
      expect(withKnownColor('cyan')).toBe('#06b6d4'); // Tailwind cyan
      expect(withKnownColor('purple')).toBe('#a855f7'); // Tailwind purple
    });
  });

  describe('CSS named color fallback', () => {
    it('should fall back to CSS named colors when not in Tailwind palette', () => {
      // These colors exist only in CSS named colors
      expect(withKnownColor('crimson')).toBe('#dc143c');
      expect(withKnownColor('navy')).toBe('#000080');
      expect(withKnownColor('forestgreen')).toBe('#228b22');
      expect(withKnownColor('cornflowerblue')).toBe('#6495ed');
      expect(withKnownColor('darkslategray')).toBe('#2f4f4f');
    });

    it('should handle CSS color aliases correctly', () => {
      // Tailwind doesn't include these, so should fall back to CSS
      expect(withKnownColor('aqua')).toBe('#00ffff'); // CSS alias for cyan
      expect(withKnownColor('magenta')).toBe('#ff00ff'); // CSS alias for fuchsia
    });

    it('should be case insensitive for CSS fallback colors', () => {
      expect(withKnownColor('crimson')).toBe('#dc143c');
      expect(withKnownColor('CRIMSON')).toBe('#dc143c');
      expect(withKnownColor('Crimson')).toBe('#dc143c');
      expect(withKnownColor('CornflowerBlue')).toBe('#6495ed');
      expect(withKnownColor('CORNFLOWERBLUE')).toBe('#6495ed');
    });
  });

  describe('non-color input handling', () => {
    it('should return hex colors unchanged', () => {
      expect(withKnownColor('#ff0000')).toBe('#ff0000');
      expect(withKnownColor('#123456')).toBe('#123456');
      expect(withKnownColor('#abc')).toBe('#abc');
      expect(withKnownColor('#FF00FF')).toBe('#FF00FF');
    });

    it('should return RGB/HSL strings unchanged', () => {
      expect(withKnownColor('rgb(255, 0, 0)')).toBe('rgb(255, 0, 0)');
      expect(withKnownColor('rgba(255, 0, 0, 0.5)')).toBe('rgba(255, 0, 0, 0.5)');
      expect(withKnownColor('hsl(0, 100%, 50%)')).toBe('hsl(0, 100%, 50%)');
      expect(withKnownColor('hsla(0, 100%, 50%, 0.5)')).toBe('hsla(0, 100%, 50%, 0.5)');
    });

    it('should return unknown color names unchanged', () => {
      expect(withKnownColor('unknowncolor')).toBe('unknowncolor');
      expect(withKnownColor('notacolor')).toBe('notacolor');
      expect(withKnownColor('invalidname')).toBe('invalidname');
    });

    it('should return strings with non-letter characters unchanged', () => {
      expect(withKnownColor('red-500')).toBe('red-500');
      expect(withKnownColor('blue_primary')).toBe('blue_primary');
      expect(withKnownColor('color123')).toBe('color123');
      expect(withKnownColor('red color')).toBe('red color');
      expect(withKnownColor('red!')).toBe('red!');
    });

    it('should return non-string inputs unchanged', () => {
      expect(withKnownColor(0xFF_00_00)).toBe(0xFF_00_00);
      expect(withKnownColor(123)).toBe(123);
      expect(withKnownColor(null as any)).toBe(null);
      expect(withKnownColor(undefined as any)).toBe(undefined);
      expect(withKnownColor({ r: 255, g: 0, b: 0 } as any))
        .toEqual({ r: 255, g: 0, b: 0 });
    });

    it('should return empty string unchanged', () => {
      expect(withKnownColor('')).toBe('');
    });
  });

  describe('consistency and performance', () => {
    it('should return consistent results for multiple calls', () => {
      const testColor = 'blue';
      const result1 = withKnownColor(testColor);
      const result2 = withKnownColor(testColor);
      const result3 = withKnownColor(testColor.toUpperCase());

      expect(result1).toBe(result2);
      expect(result1).toBe(result3);
      expect(result1).toBe('#3b82f6');
    });

    it('should not modify the original input', () => {
      const originalInput = 'BLUE';
      const result = withKnownColor(originalInput);

      expect(originalInput).toBe('BLUE'); // Should not be modified
      expect(result).toBe('#3b82f6');
    });

    it('should handle all Tailwind colors consistently', () => {
      // Test that all colors in defaultColors are handled correctly
      for (const [colorName, colorValue] of Object.entries(defaultColors)) {
        expect(withKnownColor(colorName)).toBe(colorValue);
        expect(withKnownColor(colorName.toUpperCase())).toBe(colorValue);
      }
    });
  });

  describe('semantic color usage', () => {
    it('should provide appropriate colors for semantic use cases', () => {
      // Error/danger colors
      expect(withKnownColor('red')).toBe('#ef4444');

      // Success colors
      expect(withKnownColor('green')).toBe('#22c55e');
      expect(withKnownColor('emerald')).toBe('#10b981');

      // Warning colors
      expect(withKnownColor('orange')).toBe('#f97316');
      expect(withKnownColor('amber')).toBe('#f59e0b');
      expect(withKnownColor('yellow')).toBe('#eab308');

      // Info colors
      expect(withKnownColor('blue')).toBe('#3b82f6');
      expect(withKnownColor('cyan')).toBe('#06b6d4');
      expect(withKnownColor('sky')).toBe('#0ea5e9');

      // Neutral colors
      expect(withKnownColor('slate')).toBe('#64748b');
      expect(withKnownColor('gray')).toBe('#6b7280');
    });
  });
});
