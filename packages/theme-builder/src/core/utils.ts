export type { KebabCase } from 'type-fest';

export type Prettify<T> = {
  [K in keyof T]: T[K];
};

/** @returns the type of a property of the object */
export type PropType<T, K extends keyof T> = T[K];

/** @returns a given string converted to kebab-case */
export function kebabCase(s: string): string {
  return s
    // handle multiple uppercase letters (e.g., XMLHttpRequest -> xml-http-request)
    .replaceAll(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    // handle camelCase
    .replaceAll(/([a-z])([A-Z])/g, '$1-$2')
    // handle snakeCase
    .replaceAll(/[\s_]+/g, '-')
    .toLowerCase();
}

/** Converts a number to an unsigned 32-bit integer */
export const uint32 = (n: number) => n >>> 0;

/** Converts a number to an unsigned 8-bit integer */
export const uint8 = (n: number) => (n >>> 0) & 0xFF;

/** @returns a typed array of keys of the object */
export const unsafeKeys = Object.keys as <T>(object: T) => Array<keyof T>;
