/**
 * Wrap a unary function in a per-call memo cache.
 *
 * The returned function caches results keyed by the argument's `Map`
 * identity (value equality for primitives, reference equality for
 * objects). Each `memoize(fn)` call produces a fresh cache, so the
 * memo is scoped to one logical batch of work — typical use is
 * inside a function that needs to deduplicate expensive conversions
 * across a small number of slots, e.g. an `ARGB → Hct` round-trip
 * across the baseline-plus-per-mode slots when computing a theme.
 *
 * The cache has no eviction. Suitable only for batches with a bounded
 * key set.
 */
export const memoize = <K, V>(fn: (k: K) => V): ((k: K) => V) => {
  const cache = new Map<K, V>();
  return (k) => {
    if (cache.has(k)) return cache.get(k) as V;
    const v = fn(k);
    cache.set(k, v);
    return v;
  };
};
