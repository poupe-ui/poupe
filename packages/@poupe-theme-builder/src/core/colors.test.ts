import { expect, test, it, describe } from 'vitest';
import { Hct } from '@material/material-color-utilities';
import { uint32 } from './utils';

import {
  type Color,

  argb,
  hct,
  hex,
  argbFromHct,
  argbFromRgbaColor,
  argbFromHctColor,
  argbFromColord,
  argbFromString,
  splitArgb,
  colordFromArgb,
  colordFromHct,
  colord,
  hctFromArgb,
  hctFromRgbaColor,
  hctFromColord,
  hctFromString,
  splitHct,
  hslFromColord,
  hslFromArgb,
  hslFromHct,
  hslString,
  hexFromColord,
  hexFromArgb,
  hexFromHct,
  hexFromHctColor,
} from './colors';

import { extend } from 'colord';
import namesPlugin from 'colord/plugins/names';
import labPlugin from 'colord/plugins/lab';
extend([namesPlugin, labPlugin]);

function expectColorsSimilar(color1: Color, color2: Color, threshold = 0.01) {
  const c1 = colord(color1);
  const c2 = colord(color2);

  const difference = c1.delta(c2);
  expect(difference, `difference between ${c1.toRgbString()} and ${c2.toRgbString()}`).toBeLessThanOrEqual(threshold);
}

describe('Color Conversions', () => {
  // Common test color values
  const testRgb = { r: 0x34, g: 0x56, b: 0x67 };
  const testHex = '#345667';
  const testArgb = uint32(0xFF_34_56_67);
  const testHct = Hct.fromInt(testArgb);
  const testHctValues = { h: testHct.hue, c: testHct.chroma, t: testHct.tone };

  test('argb conversions', () => {
    expect(argb(testHct)).eq(testArgb);
    expect(argb(testRgb)).eq(testArgb);
    expect(argb(testHex)).eq(testArgb);
    expect(argb(testArgb)).eq(testArgb);
    expect(argb(testHctValues)).eq(testArgb);

    // Test with alpha channel
    const rgbWithAlpha = { ...testRgb, a: 0.5 };
    const argbWithAlpha = uint32(0x80_34_56_67);
    expect(argb(rgbWithAlpha)).eq(argbWithAlpha);

    // Test individual conversion functions
    expect(argbFromHct(testHct)).eq(testArgb);
    expect(argbFromRgbaColor(testRgb)).eq(testArgb);
    expect(argbFromHctColor(testHctValues)).eq(testArgb);
    expect(argbFromColord(colord(testRgb))).eq(testArgb);
    expect(argbFromString(testHex)).eq(testArgb);
  });

  test('hex conversions', () => {
    expect(hex(testHct)).eq(testHex);
    expect(hex(testRgb)).eq(testHex);
    expect(hex(testArgb)).eq(testHex);
    expect(hex(testHctValues)).eq(testHex);

    // Test individual conversion functions
    expect(hexFromHct(testHct)).eq(testHex);
    expect(hexFromArgb(testArgb)).eq(testHex);
    expect(hexFromColord(colord(testRgb))).eq(testHex);
    expect(hexFromHctColor(testHctValues)).eq(testHex);
  });

  test('hct conversions', () => {
    const hctResult = hct(testRgb);

    // Use delta comparisons instead of direct numeric comparisons
    // for better perceptual assessment
    const originalColor = colordFromArgb(testArgb);
    const convertedColor = colordFromArgb(hctResult.toInt());

    // We expect the colors to be perceptually identical (very small delta)
    expectColorsSimilar(originalColor, convertedColor, 0.001);

    expect(hctFromArgb(testArgb).toInt()).eq(testHct.toInt());
    expect(hctFromRgbaColor(testRgb).toInt()).eq(testHct.toInt());
    expect(hctFromColord(colord(testRgb)).toInt()).eq(testHct.toInt());
    expect(hctFromString(testHex).toInt()).eq(testHct.toInt());
  });

  test('colord conversions', () => {
    expect(colord(testHct).toHex().toLowerCase()).eq(testHex);
    expect(colord(testRgb).toHex().toLowerCase()).eq(testHex);
    expect(colord(testArgb).toHex().toLowerCase()).eq(testHex);

    expect(colordFromArgb(testArgb).toHex().toLowerCase()).eq(testHex);
    expect(colordFromHct(testHct).toHex().toLowerCase()).eq(testHex);
  });

  test('hsl conversions', () => {
    const hslValue = hslFromColord(colord(testRgb));
    expect(hslFromArgb(testArgb)).toMatchObject(hslValue);
    expect(hslFromHct(testHct)).toMatchObject(hslValue);
  });

  test('splitting functions', () => {
    const splitArgbResult = splitArgb(testArgb);
    expect(splitArgbResult).toMatchObject(testRgb);

    const splitHctResult = splitHct(testHct);
    expect(splitHctResult).toMatchObject(testHctValues);
  });
});

describe('Alpha Value Handling', () => {
  // Base color for all alpha tests
  const baseRgb = { r: 0x34, g: 0x56, b: 0x67 };

  test('alpha value in 0-1 range', () => {
    const alphaValues = [0, 0.25, 0.5, 0.75, 1];

    for (const alpha of alphaValues) {
      const rgbWithAlpha = { ...baseRgb, a: alpha };
      const alphaInt = Math.round(alpha * 255);
      const expectedArgb = uint32((alphaInt << 24) | 0x34_56_67);

      // Test the argb function directly
      expect(argb(rgbWithAlpha)).eq(expectedArgb);

      // Test round-trip conversion through colord
      expect(argb(colord(rgbWithAlpha))).eq(expectedArgb);

      // Test round-trip conversion through Hct
      const hctColor = hct(rgbWithAlpha);
      const hctWithAlpha = {
        h: hctColor.hue,
        c: hctColor.chroma,
        t: hctColor.tone,
        a: alpha,
      };
      expect(argb(hctWithAlpha)).eq(expectedArgb);
    }
  });

  test('alpha value in 0-255 range', () => {
    const alpha255Values = [0, 64, 128, 192, 255];

    for (const alpha255 of alpha255Values) {
      const alpha = alpha255 / 255;
      const rgbWith255Alpha = { ...baseRgb, a: alpha255 };
      const expectedArgb = uint32((alpha255 << 24) | 0x34_56_67);

      // Test the argb function with 0-255 alpha
      expect(argb(rgbWith255Alpha)).eq(expectedArgb);

      // Conversion to colord and back should preserve alpha
      const colorObject = colord(rgbWith255Alpha);
      const rgba = colorObject.rgba;
      expect(rgba.a).toBeCloseTo(alpha, 2);

      // Test alpha normalization in the argb function
      expect(argb({ ...baseRgb, a: alpha255 })).eq(expectedArgb);
    }
  });

  test('alpha value handling in HCT colors', () => {
    const baseHct = hct(baseRgb);
    const baseHctValues = { h: baseHct.hue, c: baseHct.chroma, t: baseHct.tone };

    // Test with 0-1 alpha
    const hctWithDecimalAlpha = { ...baseHctValues, a: 0.5 };
    const expectedDecimalArgb = uint32(0x80_34_56_67);
    expect(argb(hctWithDecimalAlpha)).eq(expectedDecimalArgb);

    // Test with 0-255 alpha
    const hctWith255Alpha = { ...baseHctValues, a: 128 };
    const expected255Argb = uint32(0x80_34_56_67);
    expect(argb(hctWith255Alpha)).eq(expected255Argb);
  });

  test('alpha preservation in round-trip conversions', () => {
    // Start with an RGB color with alpha
    const startRgb = { ...baseRgb, a: 0.5 };
    const expectedArgb = uint32(0x80_34_56_67);

    // Convert through various formats and back
    const argbValue = argb(startRgb);
    expect(argbValue).eq(expectedArgb);

    // ARGB → Colord → ARGB
    const fromColord = argb(colord(argbValue));
    expect(fromColord).eq(expectedArgb);

    // ARGB → HCT → ARGB
    const fromHct = argb(hct(argbValue));
    expect(fromHct).eq(expectedArgb);

    // RGB → Hex → RGB (note: hex doesn't support alpha in this implementation)
    const hexValue = hex(startRgb);
    const fromHex = argb({ ...colord(hexValue).rgba, a: 0.5 });
    expect(fromHex).eq(expectedArgb);
  });

  test('default alpha value behavior', () => {
    // When alpha is undefined, it should default to 1 (fully opaque)
    const rgbNoAlpha = baseRgb; // No alpha specified
    const expectedFullOpacity = uint32(0xFF_34_56_67);
    expect(argb(rgbNoAlpha)).eq(expectedFullOpacity);

    // Explicitly setting undefined should be the same as not setting
    const rgbUndefinedAlpha = { ...baseRgb, a: undefined };
    expect(argb(rgbUndefinedAlpha)).eq(expectedFullOpacity);
  });

  test('special alpha edge cases', () => {
    // Alpha = 0 (completely transparent)
    const transparentRgb = { ...baseRgb, a: 0 };
    const expectedTransparentArgb = uint32(0x00_34_56_67);
    expect(argb(transparentRgb)).eq(expectedTransparentArgb);

    // Negative alpha should be clamped to 0
    const negativeAlphaRgb = { ...baseRgb, a: -0.5 };
    expect(argb(negativeAlphaRgb)).eq(expectedTransparentArgb);

    // Alpha > 1 (decimal) but < 255 should be treated as 0-255 scale
    const alpha200Rgb = { ...baseRgb, a: 200 };
    const expectedAlpha200Argb = uint32(0xC8_34_56_67); // 0xC8 = 200
    expect(argb(alpha200Rgb)).eq(expectedAlpha200Argb);

    // Alpha > 255 should be clamped to 255
    const excessiveAlphaRgb = { ...baseRgb, a: 300 };
    const expectedMaxAlphaArgb = uint32(0xFF_34_56_67);
    expect(argb(excessiveAlphaRgb)).eq(expectedMaxAlphaArgb);
  });
});

describe('Edge Cases', () => {
  test('boundary values', () => {
    // Test black and white
    expect(hex({ r: 0, g: 0, b: 0 })).eq('#000000');
    expect(hex({ r: 255, g: 255, b: 255 })).eq('#ffffff');

    // Test out of range RGB values (should be clamped)
    expect(argb({ r: -10, g: 300, b: 150 })).eq(argb({ r: 0, g: 255, b: 150 }));
  });

  test('css color formats', () => {
    // Test different CSS color format inputs
    expect(argb('rgb(52, 86, 103)')).eq(uint32(0xFF_34_56_67));
    expect(argb('rgba(52, 86, 103, 0.5)')).eq(uint32(0x80_34_56_67));

    // Use color distance for approximate color comparison
    const hslColor = argb('hsl(200, 33%, 30%)');
    const hexColor = argb('#345667');
    expectColorsSimilar(hslColor, hexColor);

    // Test named colors
    expect(hex('red')).eq('#ff0000');
    expect(hex('transparent')).eq('#00000000');
    expect(argb('transparent')).eq(uint32(0x00_00_00_00));
  });
});

describe('hslString utility', () => {
  // --- Tests with alpha = true (default) ---
  describe('when alpha parameter is true (default)', () => {
    it('should return HSL string for a color without alpha', () => {
      const color: Color = '#ff0000'; // Red
      // colord('#ff0000').toHsl() -> { h: 0, s: 100, l: 50, a: 1 }
      expect(hslString(color)).toBe('hsl(0, 100%, 50%)');
    });

    it('should return HSL string for a color with alpha = 1', () => {
      const color: Color = 'rgba(0, 0, 255, 1)'; // Blue with alpha 1
      // colord('rgba(0, 0, 255, 1)').toHsl() -> { h: 240, s: 100, l: 50, a: 1 }
      expect(hslString(color)).toBe('hsl(240, 100%, 50%)');
    });

    it('should return HSLA string for a color with alpha < 1 (RGB input)', () => {
      const color: Color = 'rgba(0, 255, 0, 0.5)'; // Green with 50% alpha
      // colord('rgba(0, 255, 0, 0.5)').toHsl() -> { h: 120, s: 100, l: 50, a: 0.5 }
      expect(hslString(color)).toBe('hsla(120, 100%, 50%, 0.5)');
    });

    it('should return HSLA string for a color with alpha < 1 (HSL input)', () => {
      const color: Color = { h: 300, s: 75, l: 60, a: 0.25 }; // Magenta-ish with 25% alpha
      expect(hslString(color)).toBe('hsla(300, 75%, 60%, 0.25)');
    });

    it('should return HSLA string for a color with alpha < 1 (Hex input with alpha)', () => {
      const color: Color = '#ff880080'; // Orange with 50% alpha (80 hex = 128 dec = 0.5)
      // colord('#ff880080').toHsl() -> { h: 32, s: 100, l: 50, a: 0.5 }
      expect(hslString(color)).toBe('hsla(32, 100%, 50%, 0.5)');
    });

    it('should handle black correctly', () => {
      const color: Color = '#000000';
      expect(hslString(color)).toBe('hsl(0, 0%, 0%)');
    });

    it('should handle white correctly', () => {
      const color: Color = '#ffffff';
      expect(hslString(color)).toBe('hsl(0, 0%, 100%)');
    });
  });

  // --- Tests with alpha = false ---
  describe('when alpha parameter is false', () => {
    it('should return HSL string for a color without alpha', () => {
      const color: Color = '#ffff00'; // Yellow
      // colord('#ffff00').toHsl() -> { h: 60, s: 100, l: 50, a: 1 }
      expect(hslString(color, false)).toBe('hsl(60, 100%, 50%)');
    });

    it('should return HSL string even for a color with alpha < 1 (RGB input)', () => {
      const color: Color = 'rgba(0, 255, 0, 0.5)'; // Green with 50% alpha
      // colord('rgba(0, 255, 0, 0.5)').toHsl() -> { h: 120, s: 100, l: 50, a: 0.5 }
      // Alpha should be ignored
      expect(hslString(color, false)).toBe('hsl(120, 100%, 50%)');
    });

    it('should return HSL string even for a color with alpha < 1 (HSL input)', () => {
      const color: Color = { h: 300, s: 75, l: 60, a: 0.25 }; // Magenta-ish with 25% alpha
      // Alpha should be ignored
      expect(hslString(color, false)).toBe('hsl(300, 75%, 60%)');
    });

    it('should return HSL string even for a color with alpha < 1 (Hex input with alpha)', () => {
      const color: Color = '#ff880080'; // Orange with 50% alpha
      // colord('#ff880080').toHsl() -> { h: 32, s: 100, l: 50, a: 0.5 }
      // Alpha should be ignored
      expect(hslString(color, false)).toBe('hsl(32, 100%, 50%)');
    });

    it('should handle black correctly when alpha is false', () => {
      const color: Color = 'rgba(0, 0, 0, 0.7)';
      expect(hslString(color, false)).toBe('hsl(0, 0%, 0%)');
    });

    it('should handle white correctly when alpha is false', () => {
      const color: Color = 'hsla(0, 0%, 100%, 0.1)';
      expect(hslString(color, false)).toBe('hsl(0, 0%, 100%)');
    });
  });
});
