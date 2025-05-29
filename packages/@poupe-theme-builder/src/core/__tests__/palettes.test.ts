/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Blend } from '@poupe/material-color-utilities';

import {
  hct,
} from '../colors';

import {
  makeTonalPalette,
  makeCustomColor,
  makeCustomColorFromPalette,
} from '../palettes';

import {
  Hct,
  TonalPalette,
} from '../types';

// Mock dependencies
vi.mock('@poupe/material-color-utilities', () => ({
  Blend: {
    harmonize: vi.fn(),
  },
}));

vi.mock('../colors', () => ({
  hct: vi.fn(),
}));

vi.mock('../types', () => ({
  TonalPalette: {
    fromHct: vi.fn(),
    fromHueAndChroma: vi.fn(),
  },
}));

describe('palettes', () => {
  const mockHct = {
    toInt: vi.fn(() => 0xFF_00_00),
    hue: 10,
    chroma: 50,
  } as unknown as Hct;

  const mockTonalPalette = {
    getHct: vi.fn((tone: number) => ({
      tone,
      hue: 10,
      chroma: 50,
    } as Hct)),
  } as unknown as TonalPalette;

  beforeEach(() => {
    vi.clearAllMocks();
    (hct as any).mockReturnValue(mockHct);
    (TonalPalette.fromHct as any).mockReturnValue(mockTonalPalette);
    (TonalPalette.fromHueAndChroma as any).mockReturnValue(mockTonalPalette);
    (Blend.harmonize as any).mockReturnValue(0xFF_88_00);
  });

  describe('makeTonalPalette', () => {
    it('should create palette from color without harmonization (defaults to isKeyColor=true)', () => {
      const color = '#ff0000';
      const result = makeTonalPalette(color);

      expect(hct).toHaveBeenCalledWith(color);
      expect(TonalPalette.fromHct).toHaveBeenCalledWith(mockHct);
      expect(TonalPalette.fromHueAndChroma).not.toHaveBeenCalled();
      expect(result).toBe(mockTonalPalette);
    });

    it('should create palette with harmonization', () => {
      const color = '#ff0000';
      const harmonizeTarget = mockHct;

      makeTonalPalette(color, harmonizeTarget);

      expect(Blend.harmonize).toHaveBeenCalledWith(0xFF_00_00, 0xFF_00_00);
      expect(hct).toHaveBeenCalledTimes(2); // Original + harmonized
    });

    it('should use fromHct when isKeyColor is true', () => {
      const color = '#ff0000';

      makeTonalPalette(color, undefined, true);

      expect(TonalPalette.fromHct).toHaveBeenCalledWith(mockHct);
      expect(TonalPalette.fromHueAndChroma).not.toHaveBeenCalled();
    });

    it('should use fromHueAndChroma when isKeyColor is false', () => {
      const color = '#ff0000';

      makeTonalPalette(color, undefined, false);

      expect(TonalPalette.fromHueAndChroma).toHaveBeenCalledWith(10, 50);
      expect(TonalPalette.fromHct).not.toHaveBeenCalled();
    });
  });

  describe('makeCustomColor', () => {
    it('should create custom color without harmonization (defaults to isKeyColor=true)', () => {
      const color = '#ff0000';
      const name = 'test-color';

      const result = makeCustomColor(color, undefined, name);

      expect(result.name).toBe(name);
      expect(result.tones).toBe(mockTonalPalette);
      expect(result.light).toBeDefined();
      expect(result.dark).toBeDefined();
      expect(TonalPalette.fromHct).toHaveBeenCalled();
      expect(TonalPalette.fromHueAndChroma).not.toHaveBeenCalled();
    });

    it('should create custom color with harmonization', () => {
      const color = '#ff0000';
      const harmonizeTarget = mockHct;

      makeCustomColor(color, harmonizeTarget);

      expect(Blend.harmonize).toHaveBeenCalled();
    });
    it('should pass isKeyColor parameter when true', () => {
      const color = '#ff0000';

      makeCustomColor(color, undefined, undefined, true);

      expect(TonalPalette.fromHct).toHaveBeenCalled();
      expect(TonalPalette.fromHueAndChroma).not.toHaveBeenCalled();
    });

    it('should pass isKeyColor parameter when false', () => {
      const color = '#ff0000';

      makeCustomColor(color, undefined, undefined, false);

      expect(TonalPalette.fromHueAndChroma).toHaveBeenCalled();
      expect(TonalPalette.fromHct).not.toHaveBeenCalled();
    });
  });

  describe('makeCustomColorFromPalette', () => {
    it('should create custom color from palette', () => {
      const name = 'test-color';

      const result = makeCustomColorFromPalette(mockTonalPalette, name);

      expect(result.name).toBe(name);
      expect(result.tones).toBe(mockTonalPalette);
    });

    it('should create light color configuration', () => {
      const result = makeCustomColorFromPalette(mockTonalPalette);

      expect(mockTonalPalette.getHct).toHaveBeenCalledWith(40); // color
      expect(mockTonalPalette.getHct).toHaveBeenCalledWith(100); // onColor
      expect(mockTonalPalette.getHct).toHaveBeenCalledWith(90); // colorContainer
      expect(mockTonalPalette.getHct).toHaveBeenCalledWith(10); // onColorContainer

      expect(result.light.color).toEqual({ tone: 40, hue: 10, chroma: 50 });
      expect(result.light.onColor).toEqual({ tone: 100, hue: 10, chroma: 50 });
      expect(result.light.colorContainer).toEqual({ tone: 90, hue: 10, chroma: 50 });
      expect(result.light.onColorContainer).toEqual({ tone: 10, hue: 10, chroma: 50 });
    });

    it('should create dark color configuration', () => {
      const result = makeCustomColorFromPalette(mockTonalPalette);

      expect(mockTonalPalette.getHct).toHaveBeenCalledWith(80); // color
      expect(mockTonalPalette.getHct).toHaveBeenCalledWith(20); // onColor
      expect(mockTonalPalette.getHct).toHaveBeenCalledWith(30); // colorContainer
      expect(mockTonalPalette.getHct).toHaveBeenCalledWith(90); // onColorContainer

      expect(result.dark.color).toEqual({ tone: 80, hue: 10, chroma: 50 });
      expect(result.dark.onColor).toEqual({ tone: 20, hue: 10, chroma: 50 });
      expect(result.dark.colorContainer).toEqual({ tone: 30, hue: 10, chroma: 50 });
      expect(result.dark.onColorContainer).toEqual({ tone: 90, hue: 10, chroma: 50 });
    });

    it('should handle undefined name', () => {
      const result = makeCustomColorFromPalette(mockTonalPalette);

      expect(result.name).toBeUndefined();
    });
  });
});
