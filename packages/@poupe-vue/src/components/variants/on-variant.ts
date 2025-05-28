import { unsafeKeys } from '@poupe/css';

import {
  type ClassValue,
} from 'tailwind-variants';

export const onVariant = <K extends string> (variant: string | string[], classes: Record<K, ClassValue>) => {
  const variants = Array.isArray(variant) ? variant : [variant];
  const out: Partial<typeof classes> = {};
  for (const name of unsafeKeys(classes)) {
    const v = applyCSSVariants(classes[name], variants);
    out[name] = v.length === 1 ? v[0] : (v.length > 1 ? v : undefined);
  }

  return out as typeof classes;
};

function applyCSSVariants(value: ClassValue, variants: string[]): string[] {
  const out: string[] = [];

  for (const variant of variants) {
    const v = variant.trim();
    if (v !== '')
      out.push(...applyCSSVariant(value, v));
  }

  return out;
}

function applyCSSVariant(value: ClassValue, variant: string): string[] {
  if (Array.isArray(value)) {
    return applyCSSVariantArray(value, variant);
  }

  if (typeof value === 'string') {
    const s = value.split(' ').filter((s: string) => s !== '');

    if (s.length === 1) {
      return [`${variant}:${s[0]}`];
    } else if (s.length > 1) {
      return applyCSSVariant(s, variant);
    }
  }

  return [];
}

function applyCSSVariantArray(values: ClassValue[], variant: string): string[] {
  const out: string[] = [];

  for (const value of values) {
    if (Array.isArray(value)) {
      out.push(...applyCSSVariantArray(value, variant));
    } else if (value) {
      out.push(...applyCSSVariant(value, variant));
    }
  }

  return out;
}
