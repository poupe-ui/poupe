import type {
  SeedOptions,
  SeedValue,
} from '../types';

/**
 * Expand a {@link SeedOptions} to its canonical {@link SeedValue}
 * form. Returns `undefined` when the input slot is unset, or when
 * the object form carries an `undefined` value (only reachable via
 * TypeScript bypass) — callers can treat the single `=== undefined`
 * guard as proof that `.value` is materially present.
 *
 * `defaultBlend` controls the resolved `blend` when neither the
 * bare-value form nor an explicit `blend` flag fixes it. Call sites
 * pass `true` for baseline harmonisation, `false` for per-mode
 * overlays — required at every call so the baseline-vs-overlay
 * intent is visible.
 */
export const expandSeed = (
  v: SeedOptions | undefined,
  defaultBlend: boolean,
): SeedValue | undefined => {
  if (v === undefined) return undefined;
  if (typeof v === 'number') return { value: v, blend: defaultBlend };
  if (v.value === undefined) return undefined;
  return { value: v.value, blend: v.blend ?? defaultBlend };
};
