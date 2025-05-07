import {
  validShade,
} from '../theme/shades';

export * from '../utils';

export function getShadeValue(value: unknown, negative: boolean = false): number | undefined {
  if (typeof value !== 'number' || Math.round(value) !== value) {
    return undefined;
  } else if (validShade(value)) {
    return value;
  } else if (negative && validShade(-value)) {
    return -value;
  }
  return undefined;
}

export function getStringValue(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value;
  }
  return undefined;
}

export function getBooleanValue(value: unknown): boolean | undefined {
  if (typeof value === 'boolean') {
    return value;
  } else if (value === 'true') {
    return true;
  } else if (value === 'false') {
    return false;
  }

  return undefined;
}
export function debugLog(enabled: boolean, ...a: unknown[]) {
  if (enabled) {
    console.log(logPrefix, ...a);
  }
}

export function warnLog(...a: unknown[]) {
  console.warn(logPrefix, ...a);
}

const logPrefix = '@poupe/tailwindcss/flat';
