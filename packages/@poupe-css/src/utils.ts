/**
 * A type-safe wrapper around Object.keys that preserves the object's key types.
 *
 * @returns a typed array of keys of the object
 */
export const unsafeKeys = Object.keys as <T>(object: T) => Array<keyof T>;

/**
 * A generator function that yields keys of an object that pass an optional validation function.
 *
 * Iterates through all own properties of the given object and yields
 * each key that passes the optional validation function.
 *
 * @param object - The object to iterate over
 * @param valid - Optional validation function that determines which keys to yield
 * @returns A generator of valid keys from the object
 */
export function* keys<T, K extends keyof T>(object: T, valid?: (key: keyof T) => boolean): Generator<K> {
  for (const key of unsafeKeys(object)) {
    if (typeof key === 'string' && Object.prototype.hasOwnProperty.call(object, key) && (valid?.(key) ?? true)) {
      yield key as K;
    }
  }
}

/**
 * Validates if a key-value pair meets default criteria.
 *
 * A key-value pair is considered valid when:
 * - The value is neither null nor undefined
 * - The key doesn't contain spaces
 * - The key doesn't start with an underscore (_)
 *
 * @param key - The key to validate
 * @param value - The value to validate
 * @returns true if the key-value pair is valid, false otherwise
 *
 */
export function defaultValidPair<K extends string, T = unknown>(key: K, value: T): boolean {
  return value !== null
    && value !== undefined
    && !key.includes(' ')
    && !key.startsWith('_');
}

/**
 * A generator function that yields valid key-value pairs from an object.
 *
 * Iterates through all own properties of the given object and yields
 * each key-value pair that passes the validation function.
 *
 * @param object - The object to iterate over
 * @param valid - Optional validation function that determines which key-value pairs to yield
 * @returns A generator of valid key-value pairs from the object
 */
export function* pairs<K extends string = string, T = unknown>(
  object: Record<K, T>,
  valid?: (k: K, v: T) => boolean,
): Generator<[K, T]> {
  for (const key of keys(object)) {
    const value = object[key];
    if (valid?.(key, value) ?? defaultValidPair(key, value))
      yield [key, value];
  }
}

/*
 * Converts a given string to kebab-case.
 *
 * Transforms various string formats (camelCase, PascalCase, snake_case)
 * into a lowercase string with words separated by hyphens.
 * Adds leading hyphen to recognized vendor prefixes.
 *
 * @param s - The input string to convert
 * @returns A kebab-case representation of the input string
 *
 * @example
 * kebabCase('XMLHttpRequest') // returns 'xml-http-request'
 * kebabCase('camelCase') // returns 'camel-case'
 * kebabCase('snake_case') // returns 'snake-case'
 * kebabCase('WebkitTransition') // returns '-webkit-transition'
 */
export function kebabCase(s: string): string {
  // Apply standard kebab-case transformations
  const kebabbed = s
    .trim()
    // handle multiple uppercase letters (e.g., XMLHttpRequest -> xml-http-request)
    .replaceAll(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    // handle camelCase
    .replaceAll(/([a-z])([A-Z])/g, '$1-$2')
    // handle snakeCase
    .replaceAll(/[\s_]+/g, '-')
    .toLowerCase();

  // Check for vendor prefixes using a regex and add leading hyphen if needed
  if (vendorPrefixPattern.test(kebabbed)) {
    return `-${kebabbed}`;
  }

  return kebabbed;
}

const vendorPrefixPattern = /^(webkit|moz|ms|o|khtml)-/;
