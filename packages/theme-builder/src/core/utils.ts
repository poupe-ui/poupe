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

/** @returns a typed array of keys of the object */
export const unsafeKeys = Object.keys as <T>(object: T) => Array<keyof T>;
