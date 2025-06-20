/** @returns a typed array of keys of the object */
export const unsafeKeys = Object.keys as <T>(object: T) => Array<keyof T>;

/**
 * Safely log a warning message in development mode
 * @param message - The warning message to log
 */
export function tryWarn(message: string): void {
  if (import.meta.env.DEV && typeof console !== 'undefined' && console.warn) {
    console.warn(message);
  }
}
