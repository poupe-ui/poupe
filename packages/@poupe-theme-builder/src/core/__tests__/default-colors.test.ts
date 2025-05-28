/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/no-null */
import { describe, it, expect } from 'vitest';
import { defaultColors, withKnownColor } from '../default-colors';

describe('defaultColors', () => {
  it('should contain all major CSS named colors', () => {
    // Test a representative sample of colors from each category
    expect(defaultColors.red).toBe('#ff0000');
    expect(defaultColors.blue).toBe('#0000ff');
    expect(defaultColors.green).toBe('#008000');
    expect(defaultColors.white).toBe('#ffffff');
    expect(defaultColors.black).toBe('#000000');
    expect(defaultColors.gray).toBe('#808080');
  });

  it('should contain specific CSS named colors from each category', () => {
    // Reds
    expect(defaultColors.crimson).toBe('#dc143c');
    expect(defaultColors.firebrick).toBe('#b22222');

    // Pinks
    expect(defaultColors.pink).toBe('#ffc0cb');
    expect(defaultColors.hotpink).toBe('#ff69b4');

    // Oranges
    expect(defaultColors.orange).toBe('#ffa500');
    expect(defaultColors.coral).toBe('#ff7f50');

    // Yellows
    expect(defaultColors.yellow).toBe('#ffff00');
    expect(defaultColors.gold).toBe('#ffd700');

    // Purples
    expect(defaultColors.purple).toBe('#800080');
    expect(defaultColors.violet).toBe('#ee82ee');
    expect(defaultColors.indigo).toBe('#4b0082');

    // Greens
    expect(defaultColors.lime).toBe('#00ff00');
    expect(defaultColors.forestgreen).toBe('#228b22');
    expect(defaultColors.teal).toBe('#008080');

    // Blues/Cyans
    expect(defaultColors.cyan).toBe('#00ffff');
    expect(defaultColors.navy).toBe('#000080');
    expect(defaultColors.skyblue).toBe('#87ceeb');

    // Browns
    expect(defaultColors.brown).toBe('#a52a2a');
    expect(defaultColors.chocolate).toBe('#d2691e');
    expect(defaultColors.tan).toBe('#d2b48c');

    // Grays
    expect(defaultColors.silver).toBe('#c0c0c0');
    expect(defaultColors.darkgray).toBe('#a9a9a9');
    expect(defaultColors.lightgray).toBe('#d3d3d3');
  });

  it('should have duplicate colors for CSS aliases', () => {
    // These are the same color with different names
    expect(defaultColors.cyan).toBe(defaultColors.aqua);
    expect(defaultColors.fuchsia).toBe(defaultColors.magenta);
  });

  it('should contain all hex values in correct format', () => {
    for (const color of Object.values(defaultColors)) {
      expect(color).toMatch(/^#[0-9a-f]{6}([0-9a-f]{2})?$/);
    }
  });

  it('should have expected number of colors', () => {
    // CSS Color Module Level 4 defines 147 named colors
    // This includes 2 duplicate pairs (cyan/aqua, fuchsia/magenta), 7 gray/grey aliases, plus transparent = 149 entries total
    const colorCount = Object.keys(defaultColors).length;
    expect(colorCount).toBe(149);
  });

  it('should contain specific edge case colors', () => {
    // Special colors that are commonly tested
    expect(defaultColors.transparent).toBe('#00000000'); // Special transparent color
    expect(defaultColors.rebeccapurple).toBe('#663399'); // Modern addition to CSS
    expect(defaultColors.cornflowerblue).toBe('#6495ed'); // Commonly used
  });
});

describe('withKnownColor', () => {
  describe('CSS named color conversion', () => {
    it('should convert lowercase CSS named colors to hex', () => {
      expect(withKnownColor('red')).toBe('#ff0000');
      expect(withKnownColor('blue')).toBe('#0000ff');
      expect(withKnownColor('green')).toBe('#008000');
      expect(withKnownColor('white')).toBe('#ffffff');
      expect(withKnownColor('black')).toBe('#000000');
    });

    it('should convert uppercase CSS named colors to hex', () => {
      expect(withKnownColor('RED')).toBe('#ff0000');
      expect(withKnownColor('BLUE')).toBe('#0000ff');
      expect(withKnownColor('GREEN')).toBe('#008000');
      expect(withKnownColor('WHITE')).toBe('#ffffff');
      expect(withKnownColor('BLACK')).toBe('#000000');
    });

    it('should convert mixed case CSS named colors to hex', () => {
      expect(withKnownColor('Red')).toBe('#ff0000');
      expect(withKnownColor('Blue')).toBe('#0000ff');
      expect(withKnownColor('CornflowerBlue')).toBe('#6495ed');
      expect(withKnownColor('DarkSlateGray')).toBe('#2f4f4f');
      expect(withKnownColor('lightGray')).toBe('#d3d3d3');
    });

    it('should handle compound color names', () => {
      expect(withKnownColor('darkred')).toBe('#8b0000');
      expect(withKnownColor('lightblue')).toBe('#add8e6');
      expect(withKnownColor('mediumseagreen')).toBe('#3cb371');
      expect(withKnownColor('palevioletred')).toBe('#db7093');
      expect(withKnownColor('lightgoldenrodyellow')).toBe('#fafad2');
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
      expect(withKnownColor('red-color')).toBe('red-color');
      expect(withKnownColor('blue_shade')).toBe('blue_shade');
      expect(withKnownColor('color123')).toBe('color123');
      expect(withKnownColor('red color')).toBe('red color');
      expect(withKnownColor('red!')).toBe('red!');
    });

    it('should return non-string inputs unchanged', () => {
      expect(withKnownColor(0xFF_00_00)).toBe(0xFF_00_00);
      expect(withKnownColor(123)).toBe(123);
      expect(withKnownColor(null as any)).toBe(null);
      expect(withKnownColor(undefined as any)).toBe(undefined);
      expect(withKnownColor({ r: 255, g: 0, b: 0 } as any)).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('should return empty string unchanged', () => {
      expect(withKnownColor('')).toBe('');
    });
  });

  describe('edge cases', () => {
    it('should handle CSS aliases correctly', () => {
      expect(withKnownColor('cyan')).toBe('#00ffff');
      expect(withKnownColor('aqua')).toBe('#00ffff');
      expect(withKnownColor('fuchsia')).toBe('#ff00ff');
      expect(withKnownColor('magenta')).toBe('#ff00ff');
    });

    it('should be case insensitive for all supported colors', () => {
      // Test a variety of case combinations
      expect(withKnownColor('cornflowerblue')).toBe('#6495ed');
      expect(withKnownColor('CORNFLOWERBLUE')).toBe('#6495ed');
      expect(withKnownColor('CornflowerBlue')).toBe('#6495ed');
      expect(withKnownColor('cornFlowerBlue')).toBe('#6495ed');
      expect(withKnownColor('CORNFLOWER_BLUE')).toBe('CORNFLOWER_BLUE'); // Underscore makes it invalid
    });

    it('should handle longest color names', () => {
      expect(withKnownColor('lightgoldenrodyellow')).toBe('#fafad2');
      expect(withKnownColor('LIGHTGOLDENRODYELLOW')).toBe('#fafad2');
    });

    it('should handle shortest color names', () => {
      expect(withKnownColor('red')).toBe('#ff0000');
      expect(withKnownColor('tan')).toBe('#d2b48c');
    });
  });

  describe('performance and consistency', () => {
    it('should return consistent results for multiple calls', () => {
      const testColor = 'cornflowerblue';
      const result1 = withKnownColor(testColor);
      const result2 = withKnownColor(testColor);
      const result3 = withKnownColor(testColor.toUpperCase());

      expect(result1).toBe(result2);
      expect(result1).toBe(result3);
      expect(result1).toBe('#6495ed');
    });

    it('should not modify the original input', () => {
      const originalInput = 'BLUE';
      const result = withKnownColor(originalInput);

      expect(originalInput).toBe('BLUE'); // Should not be modified
      expect(result).toBe('#0000ff');
    });
  });
});
