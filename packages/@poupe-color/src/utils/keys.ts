/**
 * A type-safe wrapper around `Object.keys` that preserves the
 * object's key types.
 *
 * Mirrors `unsafeKeys` in `@poupe/css/utils.ts` verbatim — kept in
 * sync so a future `@poupe/utils` extraction can collapse both
 * sources to one definition.
 *
 * The "unsafe" name reflects that the cast is stronger than the
 * runtime guarantee: a `Record<'a' | 'b', V>` may carry extra
 * keys that the typed result pretends are absent. Reach for
 * `keys` when iteration is fine.
 *
 * @returns a typed array of keys of the object
 */
export const unsafeKeys = Object.keys as <T>(object: T) => Array<keyof T>;

/**
 * A generator function that yields keys of an object that pass an
 * optional validation function.
 *
 * Iterates through all own properties of the given object and yields
 * each key that passes the optional validation function.
 *
 * Mirrors `keys` in `@poupe/css/utils.ts` verbatim — kept in sync so
 * a future `@poupe/utils` extraction can collapse both sources to
 * one definition.
 *
 * @param object - The object to iterate over
 * @param valid - Optional validation function that determines which
 *   keys to yield
 * @returns A generator of valid keys from the object
 */
export function* keys<T, K extends keyof T>(object: T, valid?: (key: keyof T) => boolean): Generator<K> {
  for (const key of unsafeKeys(object)) {
    if (typeof key === 'string' && Object.prototype.hasOwnProperty.call(object, key) && (valid?.(key) ?? true)) {
      yield key as K;
    }
  }
}
