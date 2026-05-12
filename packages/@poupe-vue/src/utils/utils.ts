/** @returns a typed array of keys of the object */
export const unsafeKeys = Object.keys as <T>(object: T) => Array<keyof T>;

/**
 * Shape of `import.meta` we read at runtime. Vite injects
 * `import.meta.env.DEV` at build time; downstream type-check passes that
 * cross into this file (without `vite/client` augmentation) see `env`
 * as `undefined`, which is the safe no-op for `tryWarn`.
 */
type ViteImportMeta = {
  env?: {
    DEV?: boolean
  }
};

/**
 * Safely log a warning message in development mode.
 * @param message - The warning message to log
 */
export function tryWarn(message: string): void {
  if (typeof console === 'undefined' || !console.warn) return;
  const { env } = import.meta as ViteImportMeta;
  if (env?.DEV) console.warn(message);
}
