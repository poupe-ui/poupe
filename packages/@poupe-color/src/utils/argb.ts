import {
  Hct,
} from '@poupe/material-color-utilities';

import {
  Colord,
  colord,
} from 'colord';

import {
  type ARGB,
  asARGB,
} from '../types';

/**
 * Pack an RGB byte triple as an opaque {@link ARGB}.
 *
 * Each channel is assumed to be a u8 (0–255) from a trusted source —
 * e.g. `colord.rgba`. No validation. Alpha is stamped to `0xFF`; `>>> 0`
 * recovers the unsigned u32 after `| 0xFF_00_00_00` produces a signed
 * int32. The brand cast skips `asARGB`'s re-validation by construction.
 */
const rgbAsARGB = (r: number, g: number, b: number): ARGB =>
  ((0xFF_00_00_00 | (r << 16) | (g << 8) | b) >>> 0) as ARGB;

/**
 * Pack a validated {@link Colord} as an opaque {@link ARGB}.
 *
 * Reads `c.rgba` and drops the alpha channel at the boundary —
 * `@poupe/color` themes are opaque. The caller must have already
 * confirmed `c.isValid()`; this helper performs no re-validation and
 * exists only to share the `rgba`-destructure-then-pack body between
 * {@link argbFromColord} and {@link argb}'s string-fallthrough branch.
 */
const colordAsARGB = (c: Colord): ARGB => {
  const { r, g, b } = c.rgba;
  return rgbAsARGB(r, g, b);
};

/**
 * @returns the {@link ARGB} corresponding to the given `Hct`.
 *
 * MCU-constructed HCT values already carry the canonical u32 ARGB
 * (alpha `0xFF` for opaque); the call is a thin stamp.
 */
export const argbFromHCT = (c: Hct): ARGB => asARGB(c.toInt());

/**
 * @returns the opaque {@link ARGB} corresponding to the given
 * {@link Colord}'s RGB channels. Source alpha (if any) is dropped at the
 * boundary — `@poupe/color` themes are opaque. Throws on an invalid Colord
 * instance (e.g. produced from invalid input).
 */
export const argbFromColord = (c: Colord): ARGB => {
  if (!c.isValid()) {
    throw new TypeError('argb: invalid Colord instance');
  }
  return colordAsARGB(c);
};

/**
 * @returns the opaque {@link ARGB} corresponding to `color`, dispatching
 * by input type: numbers stamp through {@link asARGB}, `Hct` instances
 * route through {@link argbFromHCT}, `Colord` instances through
 * {@link argbFromColord}, and string forms are parsed by colord
 * (CSS hex `#abc` / `#aabbcc` / `#aabbccaa` — alpha last per CSS
 * Color Module Level 4 — plus CSS functional forms like `rgb(...)`
 * / `hsl(...)`).
 *
 * The string branch is the validating catch-all: any value (including
 * TS-bypass `bigint`, `boolean`, `null`, plain objects) routes through
 * `colord(...)` and fails the validity check with a clean
 * `argb: invalid color, got <value>` message that echoes the original
 * input. The dispatcher validates here rather than delegating to
 * {@link argbFromColord} so the error names what the caller passed,
 * not the intermediate Colord wrapper.
 *
 * Every branch yields the canonical `0xFFRRGGBB` shape — input alpha is
 * dropped at the boundary in line with `@poupe/color`'s opaque-palette
 * convention.
 */
export const argb = (color: Colord | Hct | number | string): ARGB => {
  if (typeof color === 'number') {
    return asARGB(color);
  } else if (color instanceof Hct) {
    return argbFromHCT(color);
  } else if (color instanceof Colord) {
    return argbFromColord(color);
  }

  const c = colord(color);
  if (!c.isValid()) {
    throw new TypeError(`argb: invalid color, got ${color}`);
  }
  return colordAsARGB(c);
};
