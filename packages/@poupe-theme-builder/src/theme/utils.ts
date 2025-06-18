export {
  camelCase,
} from '@poupe/css';

export * from '../core/index';
export * from '../core/utils';

/**
 * Checks if an object is non-empty (has at least one own property).
 *
 * @param obj - The object to check
 * @returns true if the object exists and has at least one key
 */
export function isNonEmpty<T extends Record<string, unknown>>(
  object?: T,
): object is T {
  return !!object && Object.keys(object).length > 0;
}
