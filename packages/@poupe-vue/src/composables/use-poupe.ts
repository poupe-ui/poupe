import type { InjectionKey, App } from 'vue';
import { inject, provide, reactive } from 'vue';
import type { ButtonDefaults } from '../components/button/button.types';
import type { PSurfaceProps } from '../components/surface/surface.props';

export interface PoupeComponentDefaults {
  button?: ButtonDefaults
  card?: {
    variant?: string
    elevation?: string
    interactive?: boolean
  }
  input?: {
    variant?: string
    color?: string
    size?: string
  }
  checkbox?: {
    color?: string
    size?: string
  }
  radio?: {
    color?: string
    size?: string
  }
  switch?: {
    color?: string
    size?: string
  }
  list?: {
    variant?: string
  }
  surface?: {
    elevation?: PSurfaceProps['elevation']
    shape?: PSurfaceProps['shape']
    color?: PSurfaceProps['color']
  }
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
