/* imports */
import {
  hexString,
  StandardPaletteKey,
  standardPaletteKeys,
} from '@poupe/theme-builder';

import {
  withKnownColor,
} from './default-colors';

import {
  getShades,
} from './shades';

import {
  type Color,
  type ThemeColorOptions,
} from './types';

/* re-exports */
export {
  getShades,
  validShade,
} from './shades';

export * from '../utils';

/** @returns true if the given prefix is valid for theme CSS variables */
export function validThemePrefix(prefix: string): boolean {
  return !prefix || prefixRegex.test(prefix);
}

const prefixRegex = /^([a-z][0-9a-z]*)(-[a-z][0-9a-z]*)*-?$/;

/** @returns true if the given suffix is valid for theme CSS variables */
export function validThemeSuffix(suffix: string): boolean {
  return !suffix || suffixRegex.test(suffix);
}

const suffixRegex = /^(-?[a-z][0-9a-z]*)(-[a-z][0-9a-z]*)*$/;

/** @returns true if the name is a valid kebab-case color name */
export function validColorName(name: string): boolean {
  return colorNameRegex.test(name);
}

const colorNameRegex = /^([a-z][0-9a-z]*)(-[a-z][0-9a-z]*)*$/;

/**
 * Validates color options for a theme color.
 *
 * @param name - The name of the color
 * @param options - Theme color configuration options
 * @returns true if color options are valid, false otherwise
 */
export function validColorOptions(name: string, options: ThemeColorOptions): boolean {
  const { ok: shadeOK } = getShades(options.shades);
  if (!shadeOK) {
    return false;
  }

  const { ok: colorOK } = getColor(name, options.value);
  return colorOK;
}

const isStandardKeyName = (name: string): boolean => standardPaletteKeys.includes(name as StandardPaletteKey);

export function getColor(name: string, value: Color | undefined): { ok: boolean; color?: string } {
  let v = value || (isStandardKeyName(name) ? undefined : name);
  if (v === undefined) {
    // standard keys can be undefined.
    // primary will take {@link defaultPrimaryColor},
    // and the other colors will take the generated value.
    return { ok: true };
  }

  // handle named colours early
  v = withKnownColor(v);

  try {
    return { ok: true, color: hexString(v) };
  } catch {
    return { ok: false };
  }
}

export function defaultPrefix(name: string, prefix: string): string {
  return name === 'DEFAULT' ? prefix : `${prefix}-${name}`;
}

export function debugLog(enabled: boolean = false, ...a: unknown[]) {
  if (enabled && typeof console !== 'undefined' && typeof console.log === 'function') {
    console.log(logPrefix, ...a);
  }
}

export function warnLog(...a: unknown[]) {
  if (typeof console !== 'undefined' && typeof console.warn === 'function') {
    console.warn(logPrefix, ...a);
  }
}

const logPrefix = '@poupe/tailwindcss';
