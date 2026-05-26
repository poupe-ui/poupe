import {
  extendedRoles,
  type PaletteKey,
  paletteKeys,
  type SeedOptions,
  standardRoles,
} from '../types';
import { keys } from '../utils';

const PALETTE_KEY_SET: ReadonlySet<string> = new Set<string>(paletteKeys);
const ROLE_NAME_SET: ReadonlySet<string> = new Set<string>([
  ...standardRoles,
  ...extendedRoles,
]);

/**
 * Partition a unified seeds map into core-palette and extra-palette
 * subsets, rejecting names that collide with MCU's standard or
 * extended role catalogues.
 *
 * Baseline and per-mode overlay paths both carry `SeedOptions`-valued
 * maps; the contextual `blend` default differs downstream, not here.
 * Routing is by name:
 *
 * - `k ∈ {@link paletteKeys}` → core slot.
 * - `k ∈ {@link standardRoles} ∪ {@link extendedRoles}` → throws.
 *   Those names address tone-selected role outputs, not palette
 *   inputs; the tone map is the right knob.
 * - otherwise → extra slot (four-quad palette under `K`).
 *
 * Undefined values pass through without routing — a cascade-revert
 * sentinel is not a colliding name.
 *
 * @throws TypeError on a seed name colliding with the standard or
 *   extended role catalogue.
 */
export const splitSeeds = <K extends string = never>(
  seeds: undefined | { readonly [P in (K | PaletteKey)]?: SeedOptions },
): {
  readonly core: Partial<Record<PaletteKey, SeedOptions>>
  readonly extra: Partial<Record<K, SeedOptions>>
} => {
  const core: Partial<Record<PaletteKey, SeedOptions>> = {};
  const extra: Partial<Record<K, SeedOptions>> = {};

  if (!seeds) return { core, extra };

  for (const k of keys(seeds)) {
    const value = seeds[k];
    if (value === undefined) continue;

    const name = k as string;
    if (PALETTE_KEY_SET.has(name)) {
      core[k as PaletteKey] = value;
    } else if (ROLE_NAME_SET.has(name)) {
      throw new TypeError(
        `splitSeeds: tonal-palette seed name '${name}' collides with ` +
        'the standard or extended role catalogue — those roles are ' +
        'tone-selected outputs, pin them via the tone map instead',
      );
    } else {
      extra[k as K] = value;
    }
  }

  return { core, extra };
};

/**
 * Validate three extras maps for palette symmetry and return the
 * unified key set in alphabetical order.
 *
 * Symmetry rule: every extra name must appear on baseline (whose
 * palette covers any missing overlay), or on both per-mode overlays
 * (each mode carries its own raw palette). Half-defined extras — one
 * overlay only, no baseline counterpart — would leave
 * `ModalTheme<K>.${K}Palette` unset on the other mode while the type
 * contract pins it required, so they throw here before any palette
 * work runs.
 *
 * The returned list is the alphabetically-sorted union of declared
 * names across the three maps — a deterministic iteration anchor for
 * downstream `buildModalTheme` loops, regardless of declaration order.
 * Undefined-value entries have already been dropped by
 * {@link splitSeeds}, so every key in the result is materially
 * present on at least one map. An empty list signals the "no extras
 * anywhere" shape directly.
 *
 * @throws TypeError naming every offending key and the only overlay
 *   that declared it.
 */
export const pickExtraKeys = <V, K extends string>(
  baseline: Partial<Record<K, V>>,
  dark: Partial<Record<K, V>>,
  light: Partial<Record<K, V>>,
): readonly K[] => {
  const violations: string[] = [];
  const seen = new Set<K>();

  for (const k of keys(baseline)) seen.add(k);

  for (const k of keys(dark)) {
    seen.add(k);
    if (baseline[k] !== undefined) continue;
    if (light[k] !== undefined) continue;
    violations.push(`'${k as string}' on dark only`);
  }
  for (const k of keys(light)) {
    seen.add(k);
    if (baseline[k] !== undefined) continue;
    if (dark[k] !== undefined) continue;
    violations.push(`'${k as string}' on light only`);
  }

  if (violations.length > 0) {
    throw new TypeError(
      `computeTheme: asymmetric extra palette seeds — ${violations.join(', ')}. ` +
      'Extras must be declared on baseline seeds or on both per-mode overlays.',
    );
  }

  return ([...seen] as K[]).toSorted();
};
