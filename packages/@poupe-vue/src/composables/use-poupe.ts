import type { InjectionKey, App } from 'vue';
import { inject, provide, reactive } from 'vue';
import { defu } from 'defu';

/**
 * Extendable interface for component defaults
 * Components can augment this interface to add their own defaults
 *
 * @example
 * ```typescript
 * declare module '@poupe/vue' {
 *   interface PoupeComponentDefaults {
 *     button?: {
 *       variant?: string
 *       size?: string
 *       ripple?: boolean
 *     }
 *   }
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PoupeComponentDefaults {
  // This interface is intentionally empty and will be augmented by components
  // as they are implemented. This allows for gradual adoption and type safety.
}

export interface PoupeOptions {
  defaults?: PoupeComponentDefaults
  theme?: {
    dark?: boolean
    colors?: Record<string, string>
  }
  accessibility?: {
    reducedMotion?: boolean
    highContrast?: boolean
  }
  ripple?: {
    disabled?: boolean
    color?: string
    opacity?: number
    duration?: number
  }
}

export const poupeInjectionKey: InjectionKey<PoupeOptions> = Symbol('poupe');

/**
 * Creates a Poupe instance for the Vue app
 * Used by `@poupe/nuxt` to inject app-wide defaults
 */
export function createPoupe(options: PoupeOptions = {}) {
  const poupe = reactive(options);

  return {
    install(app: App) {
      app.provide(poupeInjectionKey, poupe);
    },
  };
}

/**
 * Use Poupe options in components
 * Provides access to global defaults set via app.config.ts
 */
export function usePoupe() {
  return inject(poupeInjectionKey);
}

/**
 * Helper to get component defaults with fallback
 */
export function usePoupeDefaults<T extends keyof PoupeComponentDefaults>(
  component: T,
): PoupeComponentDefaults[T] | undefined;
export function usePoupeDefaults<T>(component: string): T | undefined;
export function usePoupeDefaults(
  component: string,
): unknown {
  const poupe = usePoupe();
  return poupe?.defaults?.[component as keyof PoupeComponentDefaults];
}

/**
 * Provider for isolated Poupe instances (e.g., in stories)
 */
export function providePoupeOptions(options: PoupeOptions) {
  provide(poupeInjectionKey, reactive(options));
}

/**
 * Helper to merge component props with global defaults
 * Uses defu for deep merging with proper type inference
 *
 * @example
 * ```typescript
 * const finalProps = usePoupeMergeProps(props, 'button', {
 *   variant: 'filled',
 *   size: 'medium',
 * });
 * ```
 */
export function usePoupeMergeProps<T extends Record<string, unknown>>(
  props: T,
  componentName: keyof PoupeComponentDefaults,
  componentDefaults?: Partial<T>,
): T {
  const globalDefaults = usePoupeDefaults(componentName) as Partial<T> | undefined;

  // Merge order: global defaults < component defaults < props
  return defu(props, componentDefaults || {}, globalDefaults || {}) as T;
}

/**
 * Helper to create merged props with proper type inference
 * Ensures component defaults are properly typed
 *
 * @example
 * ```typescript
 * const mergedProps = usePoupeMergedProps(props, 'surface', {
 *   variant: 'surface',
 *   color: 'base',
 *   shape: 'none',
 *   // ... other defaults
 * });
 * ```
 */
export function usePoupeMergedProps<
  TProps extends Record<string, unknown>,
  TDefaults extends Partial<TProps>,
>(
  props: TProps,
  componentName: keyof PoupeComponentDefaults,
  componentDefaults: TDefaults,
): TProps & Required<TDefaults> {
  const globalDefaults = usePoupeDefaults(componentName) as Partial<TProps> | undefined;

  // defu merges in order: props > componentDefaults > globalDefaults
  // This ensures props override everything, component defaults override global
  return defu(props, componentDefaults, globalDefaults || {}) as TProps & Required<TDefaults>;
}
