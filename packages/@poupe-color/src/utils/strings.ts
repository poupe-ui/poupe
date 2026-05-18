/**
 * Uppercase the first character of `s` and preserve the rest, with a
 * literal-string-typed result via TypeScript's intrinsic
 * `Capitalize<S>`. Pairs naturally with template-literal role-name
 * construction (e.g. building an `onFoo` key from `'foo'`).
 */
export const capitalize = <S extends string>(s: S): Capitalize<S> =>
  (s.charAt(0).toUpperCase() + s.slice(1)) as Capitalize<S>;

/**
 * Convert a string to camelCase.
 *
 * Handles delimiter-separated forms (kebab-case, snake_case, space-
 * separated) and internal capitalisation patterns like `BGColor` →
 * `bgColor` / `HTMLElement` → `htmlElement`. Vendor-prefix leading
 * hyphens (`-webkit-foo`) are stripped before conversion.
 *
 * Mirrors `camelCase` in `@poupe/css/utils.ts` verbatim — kept in sync
 * so a future `@poupe/utils` extraction can collapse both sources to
 * one definition.
 */
export function camelCase(s: string): string {
  if (!s || s === '-' || s === '_') {
    return '';
  }

  let result = s.trim().replace(/^-/, '');

  result = result.replaceAll(/[-_\s]+([a-zA-Z\d])/g, (_, c: string) => c.toUpperCase());

  result = result
    .replaceAll(/[A-Z]+(?=[A-Z][a-z])/g, (match) => match.toLowerCase())
    .replaceAll(/^[A-Z]+/g, (match) => match.toLowerCase());

  return result;
}
