import type {
  SpecVersion,
  Variant,
} from '../types';

/**
 * Pipeline-internal substrate carrying the global Recipe fields that
 * drive both variant palette derivation (`palettes.ts`) and per-mode
 * DynamicScheme construction (`modal.ts`).
 *
 * Mirrors `Recipe`'s scalar fields one-for-one; `Theme` exposes the
 * same triple at top level. The palette layer reads only
 * `specVersion` and `variant`; the modal layer additionally consumes
 * `contrast`. Sharing one shape lets `computeTheme` build the
 * substrate object once and thread it through both layers.
 *
 * `S` mirrors `Recipe<K, S>`'s spec slot so the literal flows into
 * `buildModalTheme<K, S>` and on to `ModalTheme<K, S>` / `ModalRoles<K, S>`,
 * gating the spec-dependent `*Dim` slots on `'2021'`.
 */
export type ThemeSubstrate<S extends SpecVersion = SpecVersion> = {
  readonly contrast: number
  readonly specVersion: S
  readonly variant: Variant
};
