import { describe, it, expect } from 'vitest';
import { kebabCase, uint32, uint8, alphaFromArgb, redFromArgb, greenFromArgb, blueFromArgb } from '../utils';

describe('kebabCase', () => {
  it('should convert camelCase to kebab-case', () => {
    expect(kebabCase('camelCase')).toBe('camel-case');
    expect(kebabCase('anotherCamelCase')).toBe('another-camel-case');
  });

  it('should convert PascalCase to kebab-case', () => {
    expect(kebabCase('PascalCase')).toBe('pascal-case');
    expect(kebabCase('AnotherPascalCase')).toBe('another-pascal-case');
  });

  it('should handle multiple uppercase letters correctly', () => {
    expect(kebabCase('XMLHttpRequest')).toBe('xml-http-request');
    expect(kebabCase('CPUUsage')).toBe('cpu-usage');
  });

  it('should convert snake_case to kebab-case', () => {
    expect(kebabCase('snake_case')).toBe('snake-case');
    expect(kebabCase('another_snake_case')).toBe('another-snake-case');
  });

  it('should handle spaces and convert to kebab-case', () => {
    expect(kebabCase('space case')).toBe('space-case');
    expect(kebabCase('multiple space case')).toBe('multiple-space-case');
  });

  it('should handle mixed cases correctly', () => {
    expect(kebabCase('mixedCase_with_snake')).toBe('mixed-case-with-snake');
    expect(kebabCase('Mixed Case_withSnake')).toBe('mixed-case-with-snake');
  });
});

describe('uint32', () => {
  it('should convert numbers to unsigned 32-bit integers', () => {
    expect(uint32(0)).toBe(0);
    expect(uint32(1)).toBe(1);
    expect(uint32(2_147_483_647)).toBe(2_147_483_647); // Max signed 32-bit integer
    expect(uint32(4_294_967_295)).toBe(4_294_967_295); // Max unsigned 32-bit integer
  });

  it('should handle negative numbers correctly', () => {
    expect(uint32(-1)).toBe(4_294_967_295);
    expect(uint32(-2)).toBe(4_294_967_294);
  });

  it('should wrap around for values larger than max uint32', () => {
    expect(uint32(4_294_967_296)).toBe(0); // Max uint32 + 1 wraps to 0
    expect(uint32(4_294_967_297)).toBe(1);
  });
});

describe('uint8', () => {
  it('should convert numbers to unsigned 8-bit integers', () => {
    expect(uint8(0)).toBe(0);
    expect(uint8(127)).toBe(127); // Max signed 8-bit integer
    expect(uint8(255)).toBe(255); // Max unsigned 8-bit integer
  });

  it('should handle negative numbers correctly', () => {
    expect(uint8(-1)).toBe(255);
    expect(uint8(-2)).toBe(254);
  });

  it('should wrap around for values larger than max uint8', () => {
    expect(uint8(256)).toBe(0); // Max uint8 + 1 wraps to 0
    expect(uint8(257)).toBe(1);
  });

  it('should handle larger numbers by taking the lowest 8 bits', () => {
    expect(uint8(300)).toBe(44); // 300 % 256 = 44
    expect(uint8(511)).toBe(255);
    expect(uint8(512)).toBe(0);
  });
});

describe('alphaFromArgb', () => {
  it('should extract alpha channel from ARGB color', () => {
    expect(alphaFromArgb(0xFF_00_00_00)).toBe(255); // Fully opaque black
    expect(alphaFromArgb(0x00_FF_FF_FF)).toBe(0); // Fully transparent white
    expect(alphaFromArgb(0x80_FF_00_00)).toBe(128); // 50% transparent red
  });

  it('should handle edge cases correctly', () => {
    expect(alphaFromArgb(0)).toBe(0);
    expect(alphaFromArgb(0xFF_FF_FF_FF)).toBe(255);
    expect(alphaFromArgb(0x12_34_56_78)).toBe(18); // 0x12 = 18
  });
});

describe('redFromArgb', () => {
  it('should extract red channel from ARGB color', () => {
    expect(redFromArgb(0xFF_FF_00_00)).toBe(255); // Pure red
    expect(redFromArgb(0xFF_00_FF_00)).toBe(0); // Pure green
    expect(redFromArgb(0xFF_00_00_FF)).toBe(0); // Pure blue
    expect(redFromArgb(0xFF_80_00_00)).toBe(128); // Dark red
  });

  it('should handle edge cases correctly', () => {
    expect(redFromArgb(0)).toBe(0);
    expect(redFromArgb(0xFF_FF_FF_FF)).toBe(255);
    expect(redFromArgb(0x12_34_56_78)).toBe(52); // 0x34 = 52
  });
});

describe('greenFromArgb', () => {
  it('should extract green channel from ARGB color', () => {
    expect(greenFromArgb(0xFF_FF_00_00)).toBe(0); // Pure red
    expect(greenFromArgb(0xFF_00_FF_00)).toBe(255); // Pure green
    expect(greenFromArgb(0xFF_00_00_FF)).toBe(0); // Pure blue
    expect(greenFromArgb(0xFF_00_80_00)).toBe(128); // Dark green
  });

  it('should handle edge cases correctly', () => {
    expect(greenFromArgb(0)).toBe(0);
    expect(greenFromArgb(0xFF_FF_FF_FF)).toBe(255);
    expect(greenFromArgb(0x12_34_56_78)).toBe(86); // 0x56 = 86
  });
});

describe('blueFromArgb', () => {
  it('should extract blue channel from ARGB color', () => {
    expect(blueFromArgb(0xFF_FF_00_00)).toBe(0); // Pure red
    expect(blueFromArgb(0xFF_00_FF_00)).toBe(0); // Pure green
    expect(blueFromArgb(0xFF_00_00_FF)).toBe(255); // Pure blue
    expect(blueFromArgb(0xFF_00_00_80)).toBe(128); // Dark blue
  });

  it('should handle edge cases correctly', () => {
    expect(blueFromArgb(0)).toBe(0);
    expect(blueFromArgb(0xFF_FF_FF_FF)).toBe(255);
    expect(blueFromArgb(0x12_34_56_78)).toBe(120); // 0x78 = 120
  });
});

describe('ARGB color extraction integration', () => {
  it('should correctly extract all channels from a complex color', () => {
    const color = 0x80_FF_80_40; // 50% transparent, red=255, green=128, blue=64

    expect(alphaFromArgb(color)).toBe(128);
    expect(redFromArgb(color)).toBe(255);
    expect(greenFromArgb(color)).toBe(128);
    expect(blueFromArgb(color)).toBe(64);
  });

  it('should handle white color correctly', () => {
    const white = 0xFF_FF_FF_FF;

    expect(alphaFromArgb(white)).toBe(255);
    expect(redFromArgb(white)).toBe(255);
    expect(greenFromArgb(white)).toBe(255);
    expect(blueFromArgb(white)).toBe(255);
  });

  it('should handle black color correctly', () => {
    const black = 0xFF_00_00_00;

    expect(alphaFromArgb(black)).toBe(255);
    expect(redFromArgb(black)).toBe(0);
    expect(greenFromArgb(black)).toBe(0);
    expect(blueFromArgb(black)).toBe(0);
  });
});
