/* cSpell:words AARRGGBB */

/**
 * Opaque 32-bit ARGB colour integer (`0xFFRRGGBB`).
 *
 * MCU represents colours as `0xAARRGGBB`; `@poupe/color` constrains the
 * alpha byte to `0xFF`. {@link asARGB} stamps `0xFF` into the high byte
 * regardless of input alpha, so every `ARGB` in `@poupe/color` carries
 * `alpha = 0xFF`. Transparency is a render-time concern (CSS), not a
 * palette-time one.
 *
 * Branded so a plain `number` cannot accidentally stand in for a colour
 * at the type level. The brand carries no runtime cost — at runtime an
 * `ARGB` is exactly the unsigned 32-bit integer MCU's `Hct.fromInt`,
 * `argbFromHex`, and `DynamicScheme` getters all use.
 *
 * Use {@link asARGB} to stamp a number at a trust boundary; reach for
 * {@link argb} when the input is non-numeric (hex strings, CSS colour
 * syntax, `Hct` / `Colord` instances).
 */
export type ARGB = number & { readonly __brand: 'ARGB' };

/**
 * Stamp a `number` as an opaque {@link ARGB}.
 *
 * Validates that the input is a u32 unsigned integer (`0 <= n <= 0xFFFFFFFF`)
 * and forces the alpha byte to `0xFF`. Bare RGB ints (`0x00RRGGBB`) and
 * MCU outputs (`0xFFRRGGBB`) both stamp cleanly; a translucent input
 * (`0x80RRGGBB`) loses its alpha at this boundary by design.
 */
export const asARGB = (n: number): ARGB => {
  if (!Number.isInteger(n)) {
    throw new TypeError(`asARGB: expected u32, got ${n}`);
  }
  if (n < 0 || n > 0xFF_FF_FF_FF) {
    throw new RangeError(`asARGB: expected u32, got ${n}`);
  }
  // Keep the low 24 RGB bits, stamp 0xFF into the high byte. `>>> 0`
  // recovers the unsigned representation after `| 0xFF000000` produces a
  // signed-negative int32.
  return (((n & 0x00_FF_FF_FF) | 0xFF_00_00_00) >>> 0) as ARGB;
};
