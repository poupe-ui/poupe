import { describe, it, expect } from 'vitest';
import {
  uint32,
  uint8,
  alphaFromARGB,
  redFromARGB,
  greenFromARGB,
  blueFromARGB,
  rgbaFromARGB,
} from '../utils';

describe('Color utilities', () => {
  describe('uint32', () => {
    it('converts numbers to unsigned 32-bit integers', () => {
      expect(uint32(0)).toBe(0);
      expect(uint32(255)).toBe(255);
      expect(uint32(-1)).toBe(4_294_967_295); // 2^32 - 1
      expect(uint32(4_294_967_295)).toBe(4_294_967_295);
      expect(uint32(4_294_967_296)).toBe(0); // Overflow to 0
    });
  });

  describe('uint8', () => {
    it('converts numbers to unsigned 8-bit integers', () => {
      expect(uint8(0)).toBe(0);
      expect(uint8(255)).toBe(255);
      expect(uint8(256)).toBe(0); // Overflow to 0
      expect(uint8(-1)).toBe(255); // 2^8 - 1
      expect(uint8(300)).toBe(44); // 300 % 256 = 44
    });
  });

  describe('ARGB extraction functions', () => {
    // Common test values
    const opaqueRed = 0xFF_00_00_FF; // Alpha=255 (fully opaque), R=0, G=0, B=255 (blue)
    const semiTransparentGreen = 0x80_00_FF_00; // Alpha=128 (semi-transparent), R=0, G=255, B=0 (green)
    const fullyTransparentRed = 0x00_FF_00_00; // Alpha=0 (fully transparent), R=255, G=0, B=0 (red)

    describe('alphaFromARGB', () => {
      it('extracts alpha values correctly', () => {
        expect(alphaFromARGB(opaqueRed)).toBe(1);
        expect(alphaFromARGB(semiTransparentGreen)).toBe(128 / 255);
        expect(alphaFromARGB(fullyTransparentRed)).toBe(0);
      });
    });

    describe('redFromARGB', () => {
      it('extracts red component correctly', () => {
        expect(redFromARGB(opaqueRed)).toBe(0);
        expect(redFromARGB(semiTransparentGreen)).toBe(0);
        expect(redFromARGB(fullyTransparentRed)).toBe(255);
        expect(redFromARGB(0xFF_AB_12_34)).toBe(0xAB);
      });
    });

    describe('greenFromARGB', () => {
      it('extracts green component correctly', () => {
        expect(greenFromARGB(opaqueRed)).toBe(0);
        expect(greenFromARGB(semiTransparentGreen)).toBe(255);
        expect(greenFromARGB(fullyTransparentRed)).toBe(0);
        expect(greenFromARGB(0xFF_AB_CD_34)).toBe(0xCD);
      });
    });

    describe('blueFromARGB', () => {
      it('extracts blue component correctly', () => {
        expect(blueFromARGB(opaqueRed)).toBe(255);
        expect(blueFromARGB(semiTransparentGreen)).toBe(0);
        expect(blueFromARGB(fullyTransparentRed)).toBe(0);
        expect(blueFromARGB(0xFF_AB_CD_EF)).toBe(0xEF);
      });
    });

    describe('rgbaFromARGB', () => {
      it('converts ARGB to RGBColor with opacity when needed', () => {
        // Test with full opacity
        expect(rgbaFromARGB(opaqueRed)).toEqual({
          r: 0,
          g: 0,
          b: 255,
        });

        // Test with partial opacity
        expect(rgbaFromARGB(semiTransparentGreen)).toEqual({
          r: 0,
          g: 255,
          b: 0,
          opacity: 128 / 255,
        });

        // Test with forced opacity=1
        expect(rgbaFromARGB(opaqueRed, true)).toEqual({
          r: 0,
          g: 0,
          b: 255,
          opacity: 1,
        });

        // Test with zero alpha (defaults to 1)
        expect(rgbaFromARGB(fullyTransparentRed)).toEqual({
          r: 255,
          g: 0,
          b: 0,
          opacity: 0,
        });
      });
    });
  });
});
