import { describe, it, expect } from 'vitest';
import {
  color,
  asRGB,
  asHSL,
  asHCL,
  asHCT,
  asLab,
  asHSV,
  isLab,
  isRGB,
  isHSL,
  isHCL,
} from '../color';

import {
  type HSLColor,
  rgb as rgbFactory,
  hsl as hslFactory,
  hcl as hclFactory,
  lab as labFactory,
} from 'd3-color';

import { rgbaFromARGB } from '../../core/utils';

describe('D3 color conversions', () => {
  describe('color function', () => {
    it('should handle CSS color strings', () => {
      const result = color('red');
      expect(result).toBeDefined();
      expect(result instanceof rgbFactory.prototype.constructor).toBe(true);
      expect(result).toHaveProperty('r', 255);
      expect(result).toHaveProperty('g', 0);
      expect(result).toHaveProperty('b', 0);
    });

    it('should handle 32-bit ARGB numbers', () => {
      // 0xFFFF0000 = opaque red in ARGB format
      const result = color(0xFF_FF_00_00);
      expect(result).toBeDefined();
      expect(result instanceof rgbFactory.prototype.constructor).toBe(true);
      expect(result).toHaveProperty('r', 255);
      expect(result).toHaveProperty('g', 0);
      expect(result).toHaveProperty('b', 0);
    });

    it('should handle RGB objects', () => {
      const result = color({ r: 255, g: 0, b: 0, opacity: 1 });
      expect(result).toBeDefined();
      expect(result instanceof rgbFactory.prototype.constructor).toBe(true);
      expect(result).toHaveProperty('r', 255);
      expect(result).toHaveProperty('g', 0);
      expect(result).toHaveProperty('b', 0);
    });

    it('should handle Lab objects', () => {
      const result = color({ l: 50, a: 80, b: 67, opacity: 1 });
      expect(result).toBeDefined();
      expect(result instanceof labFactory.prototype.constructor).toBe(true);
      expect(result).toHaveProperty('l', 50);
      expect(result).toHaveProperty('a', 80);
      expect(result).toHaveProperty('b', 67);
    });

    it('should handle HCL objects', () => {
      const result = color({ h: 0, c: 100, l: 50, opacity: 1 });
      expect(result).toBeDefined();
      expect(result instanceof hclFactory.prototype.constructor).toBe(true);
      expect(result).toHaveProperty('h', 0);
      expect(result).toHaveProperty('c', 100);
      expect(result).toHaveProperty('l', 50);
    });

    it('should handle HSL objects', () => {
      const result = color({ h: 0, s: 1, l: 0.5, opacity: 1 });
      expect(result).toBeDefined();
      expect(result instanceof hslFactory.prototype.constructor).toBe(true);
      expect(result).toHaveProperty('h', 0);
      expect(result).toHaveProperty('s', 1);
      expect(result).toHaveProperty('l', 0.5);
    });

    it('should handle HSV objects', () => {
      const result = color({ h: 0, s: 1, v: 1, opacity: 1 });
      expect(result).toBeDefined();
      expect(result instanceof hslFactory.prototype.constructor).toBe(true);
      // HSV(0, 1, 1) should approximately convert to HSL(0, 1, 0.5)
      expect(result).toHaveProperty('h', 0);
      expect(result).toHaveProperty('s', 1);
      expect((result as HSLColor).l).toBeCloseTo(0.5, 1);
    });

    it('should handle D3 RGBColor objects', () => {
      const d3Color = rgbFactory(255, 0, 0);
      const result = color(d3Color);
      expect(result).toBe(d3Color);
      expect(result instanceof rgbFactory.prototype.constructor).toBe(true);
    });

    it('should handle D3 LABColor objects', () => {
      const d3Color = labFactory(50, 80, 67);
      const result = color(d3Color);
      expect(result).toBe(d3Color);
      expect(result instanceof labFactory.prototype.constructor).toBe(true);
    });

    it('should handle D3 HSLColor objects', () => {
      const d3Color = hslFactory(0, 1, 0.5);
      const result = color(d3Color);
      expect(result).toBe(d3Color);
      expect(result instanceof hslFactory.prototype.constructor).toBe(true);
    });

    it('should handle D3 HCLColor objects', () => {
      const d3Color = hclFactory(0, 100, 50);
      const result = color(d3Color);
      expect(result).toBe(d3Color);
      expect(result instanceof hclFactory.prototype.constructor).toBe(true);
    });

    it('should return undefined for invalid input', () => {
      // eslint-disable-next-line unicorn/no-null, @typescript-eslint/no-explicit-any
      expect(color(null as any)).toBeUndefined();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(color(undefined as any)).toBeUndefined();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(color({} as any)).toBeUndefined();
      expect(color('invalid-color')).toBeUndefined();
    });
  });

  describe('object identity preservation', () => {
    it('should return the same object reference when a D3 color is passed', () => {
      // Test with RGB color
      const rgbColor = rgbFactory(100, 150, 200);
      const resultRgb = color(rgbColor);
      expect(resultRgb).toBe(rgbColor); // Check object identity with toBe

      // Test with HSL color
      const hslColor = hslFactory(210, 0.5, 0.6);
      const resultHsl = color(hslColor);
      expect(resultHsl).toBe(hslColor);

      // Test with HCL color
      const hclColor = hclFactory(270, 30, 80);
      const resultHcl = color(hclColor);
      expect(resultHcl).toBe(hclColor);

      // Test with Lab color
      const labColor = labFactory(70, 20, 30);
      const resultLab = color(labColor);
      expect(resultLab).toBe(labColor);
    });

    it('should create new objects for non-D3 color inputs', () => {
      // Plain object with RGB properties
      const rgbLike = { r: 100, g: 150, b: 200 };
      const resultRgb = color(rgbLike);
      expect(resultRgb).not.toBe(rgbLike);
      expect(resultRgb instanceof rgbFactory.prototype.constructor).toBe(true);

      // Plain object with Lab properties
      const labLike = { l: 70, a: 20, b: 30 };
      const resultLab = color(labLike);
      expect(resultLab).not.toBe(labLike);
      expect(resultLab instanceof labFactory.prototype.constructor).toBe(true);

      // CSS color string
      const cssString = '#64a0c8'; // This is RGB(100, 160, 200)
      const resultCss = color(cssString);
      expect(typeof resultCss).not.toBe('string');
      expect(resultCss instanceof rgbFactory.prototype.constructor).toBe(true);

      // ARGB number
      const argbNumber = 0xFF_64_96_C8;
      const resultArgb = color(argbNumber);
      expect(typeof resultArgb).not.toBe('number');
      expect(resultArgb instanceof rgbFactory.prototype.constructor).toBe(true);
    });
  });

  describe('asLab function', () => {
    it('should convert custom Lab objects to D3 LabColor', () => {
      const myColor = { l: 70, a: 20, b: 30, opacity: 0.5 };
      const result = asLab(myColor);

      expect(result instanceof labFactory.prototype.constructor).toBe(true);
      expect(result.l).toBe(70);
      expect(result.a).toBe(20);
      expect(result.b).toBe(30);
      expect(result.opacity).toBe(0.5);
    });

    it('should handle Lab objects without opacity', () => {
      const myColor = { l: 70, a: 20, b: 30 };
      const result = asLab(myColor);

      expect(result.opacity).toBe(1); // Default opacity
    });
  });

  describe('asRGB function', () => {
    it('should convert custom RGB objects to D3 RGBColor', () => {
      const myColor = { r: 255, g: 128, b: 64, opacity: 0.5 };
      const result = asRGB(myColor);

      expect(result instanceof rgbFactory.prototype.constructor).toBe(true);
      expect(result.r).toBe(255);
      expect(result.g).toBe(128);
      expect(result.b).toBe(64);
      expect(result.opacity).toBe(0.5);
    });

    it('should handle RGB objects without opacity', () => {
      const myColor = { r: 255, g: 128, b: 64 };
      const result = asRGB(myColor);

      expect(result.opacity).toBe(1); // Default opacity
    });
  });

  describe('asHSL function', () => {
    it('should convert custom HSL objects to D3 HSLColor', () => {
      const myColor = { h: 120, s: 0.75, l: 0.5, opacity: 0.8 };
      const result = asHSL(myColor);

      expect(result instanceof hslFactory.prototype.constructor).toBe(true);
      expect(result.h).toBe(120);
      expect(result.s).toBe(0.75);
      expect(result.l).toBe(0.5);
      expect(result.opacity).toBe(0.8);
    });

    it('should handle HSL objects without opacity', () => {
      const myColor = { h: 120, s: 0.75, l: 0.5 };
      const result = asHSL(myColor);

      expect(result.opacity).toBe(1); // Default opacity
    });
  });

  describe('asHSV function', () => {
    it('should convert custom HSV objects to D3 HSLColor', () => {
      const myColor = { h: 120, s: 0.8, v: 0.9, opacity: 0.7 };
      const result = asHSV(myColor);

      expect(result instanceof hslFactory.prototype.constructor).toBe(true);
      expect(result.h).toBe(120);
      // HSV(120, 0.8, 0.9) should convert to something in HSL space
      // We can verify the conversion formula: l = v * (1 - s/2)
      const expectedL = 0.9 * (1 - 0.8 / 2); // = 0.9 * 0.6 = 0.54
      expect(result.l).toBeCloseTo(expectedL, 2);
      expect(result.opacity).toBe(0.7);
    });

    it('should handle HSV objects without opacity', () => {
      const myColor = { h: 120, s: 0.8, v: 0.9 };
      const result = asHSV(myColor);

      expect(result.opacity).toBe(1); // Default opacity
    });

    it('should handle edge cases', () => {
      // When v=0, the color is black regardless of h and s
      const black = asHSV({ h: 0, s: 1, v: 0 });
      expect(black.l).toBe(0);
      expect(black.s).toBe(0);

      // When s=0, the color is grayscale
      const gray = asHSV({ h: 0, s: 0, v: 0.5 });
      expect(gray.l).toBe(0.5);
      expect(gray.s).toBe(0);
    });
  });

  describe('asHCL function', () => {
    it('should convert custom HCL objects to D3 HCLColor', () => {
      const myColor = { h: 60, c: 80, l: 70, opacity: 0.9 };
      const result = asHCL(myColor);

      expect(result instanceof hclFactory.prototype.constructor).toBe(true);
      expect(result.h).toBe(60);
      expect(result.c).toBe(80);
      expect(result.l).toBe(70);
      expect(result.opacity).toBe(0.9);
    });

    it('should handle HCL objects without opacity', () => {
      const myColor = { h: 60, c: 80, l: 70 };
      const result = asHCL(myColor);

      expect(result.opacity).toBe(1); // Default opacity
    });
  });

  describe('asHCT function', () => {
    it('should convert custom HCT objects to D3 HCLColor', () => {
      const myColor = { h: 240, c: 50, t: 60, opacity: 0.7 };
      const result = asHCT(myColor);

      expect(result instanceof hclFactory.prototype.constructor).toBe(true);
      expect(result.h).toBe(240);
      expect(result.c).toBe(50);
      expect(result.l).toBe(60); // note: 't' maps to 'l' in HCLColor
      expect(result.opacity).toBe(0.7);
    });

    it('should handle HCT objects without opacity', () => {
      const myColor = { h: 240, c: 50, t: 60 };
      const result = asHCT(myColor);

      expect(result.opacity).toBe(1); // Default opacity
    });
  });

  describe('type checking functions', () => {
    it('should correctly identify Lab color instances', () => {
      const labInstance = labFactory(50, 80, 67);
      const rgbInstance = rgbFactory(100, 150, 200);

      expect(isLab(labInstance)).toBe(true);
      expect(isLab(rgbInstance)).toBe(false);
      expect(isLab({ l: 50, a: 80, b: 67 })).toBe(false);
    });

    it('should correctly identify RGB color instances', () => {
      const rgbInstance = rgbFactory(100, 150, 200);
      const hslInstance = hslFactory(210, 0.5, 0.6);

      expect(isRGB(rgbInstance)).toBe(true);
      expect(isRGB(hslInstance)).toBe(false);
      expect(isRGB({ r: 100, g: 150, b: 200 })).toBe(false);
    });

    it('should correctly identify HSL color instances', () => {
      const hslInstance = hslFactory(210, 0.5, 0.6);
      const hclInstance = hclFactory(270, 30, 80);

      expect(isHSL(hslInstance)).toBe(true);
      expect(isHSL(hclInstance)).toBe(false);
      expect(isHSL({ h: 210, s: 0.5, l: 0.6 })).toBe(false);
    });

    it('should correctly identify HCL color instances', () => {
      const hclInstance = hclFactory(270, 30, 80);
      const labInstance = labFactory(50, 80, 67);

      expect(isHCL(hclInstance)).toBe(true);
      expect(isHCL(labInstance)).toBe(false);
      expect(isHCL({ h: 270, c: 30, l: 80 })).toBe(false);
    });
  });

  describe('color instantiation methods', () => {
    it('should correctly identify color class instances', () => {
      const rgbInstance = rgbFactory(100, 150, 200);
      const hslInstance = hslFactory(210, 0.5, 0.6);
      const hclInstance = hclFactory(270, 30, 80);
      const labInstance = labFactory(50, 80, 67);

      expect(rgbInstance instanceof rgbFactory.prototype.constructor).toBe(true);
      expect(hslInstance instanceof hslFactory.prototype.constructor).toBe(true);
      expect(hclInstance instanceof hclFactory.prototype.constructor).toBe(true);
      expect(labInstance instanceof labFactory.prototype.constructor).toBe(true);

      expect(rgbInstance instanceof hslFactory.prototype.constructor).toBe(false);
      expect(hslInstance instanceof hclFactory.prototype.constructor).toBe(false);
      expect(hclInstance instanceof rgbFactory.prototype.constructor).toBe(false);
      expect(labInstance instanceof hslFactory.prototype.constructor).toBe(false);
    });
  });

  describe('integration with rgbaFromARGB', () => {
    it('should correctly convert ARGB values', () => {
      // 0xFF00FF00 = opaque green in ARGB format
      const rgba = rgbaFromARGB(0xFF_00_FF_00);
      const result = asRGB(rgba);

      expect(result.r).toBe(0);
      expect(result.g).toBe(255);
      expect(result.b).toBe(0);
      expect(result.opacity).toBe(1);
    });

    it('should handle transparency in ARGB values', () => {
      // 0x80FF0000 = semi-transparent red in ARGB format
      const rgba = rgbaFromARGB(0x80_FF_00_00);
      const result = asRGB(rgba);

      expect(result.r).toBe(255);
      expect(result.g).toBe(0);
      expect(result.b).toBe(0);
      expect(result.opacity).toBeCloseTo(0.5, 1); // Alpha 0x80 = ~0.5 opacity
    });
  });
});
