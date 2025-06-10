import { defu } from 'defu';
import { pairs } from './utils';

import {
  formatCSSValue,
  spaceDelimitedProperties,
} from './properties';

/**
 * Represents a structured CSS rule set that can contain nested rules.
 *
 * This type allows for representing complex CSS structures including:
 * - Simple property/value pairs
 * - At-rules (like `@media`, `@keyframes`)
 * - Nested rule sets
 * - Arrays of values or rule sets
 *
 * @example
 * ```
 * // Example CSS rule structure
 * const rules = {
 *   body: {
 *     color: 'red',
 *     fontSize: '16px',
 *     '@media (max-width: 768px)': {
 *       fontSize: '14px'
 *     }
 *   }
 * };
 * ```
 */
export type CSSRules = {
  [name: string]: null | string | string[] | CSSRules | CSSRules[]
};

/**
 * Represents the possible value types that can be assigned to a CSS rule.
 *
 * This is a type alias for the union of all possible values in a CSSRules
 * object.
 */
export type CSSRulesValue = CSSRules[string];

/**
 * Configuration options for formatting CSS rules.
 */
export interface CSSRulesFormatOptions {
  /**
       * Indentation string to use for each level of nesting.
       * @defaultValue `'  '` (two spaces)
       */
  indent?: string

  /**
       * Prefix string added before each line.
       * @defaultValue `''` (empty string)
       */
  prefix?: string

  /**
       * Optional validation function to determine which rules to include.
       * @param key - The rule name/selector
       * @param value - The rule value
       * @returns `true` if the rule should be included, `false` otherwise
       */
  valid?: (key: string, value: CSSRulesValue) => boolean
}

/**
 * A subset of CSSRules that is compatible with tailwindcss plugin API.
 *
 * This type is more restrictive than CSSRules:
 * - It doesn't allow null values
 * - It uses itself for nested rules rather than the broader CSSRules type
 */
export type CSSRuleObject = {
  [key: string]: string | string[] | CSSRuleObject
};

/**
 * Converts a CSS rule object into a formatted string representation.
 *
 * This function takes a CSS rule object and returns a formatted string with
 * proper indentation and nesting.
 *
 * @param rules - The CSS rules to stringify
 * @param options - Configuration options for string formatting
 * @returns A string representing the CSS rules with proper formatting
 * @remarks a newLine is not appended at the end to aid composition.
 *
 * @example
 * ```
 * // Simple example of converting CSS rules to string format
 * const rules = {
 *   'body': {
 *     'color': 'red',
 *     'font-size': '16px'
 *   }
 * };
 *
 * const result = stringifyCSSRules(rules);
 * // Result will be:
 * // body {
 * //   color: red;
 * //   font-size: 16px;
 * // };
 * ```
 */
export function stringifyCSSRules(
  rules: CSSRules | CSSRuleObject = {},
  options: CSSRulesFormatOptions & {
    /**
     * Character(s) to use for line breaks.
     * @defaultValue `'\n'`
     */
    newLine?: string
  } = {},
): string {
  const {
    newLine = '\n',
  } = options;

  return formatCSSRules(rules, options).join(newLine);
}

/**
 * Formats CSS rule objects into an array of formatted lines.
 *
 * This function processes a CSS rule object and returns an array of strings,
 * where each string represents a line in the formatted CSS output. It
 * handles various value types including strings, numbers, arrays, and nested
 * objects.
 *
 * @param rules - The CSS rules to format
 * @param options - Configuration options for formatting
 * @returns An array of strings, each representing a line in the formatted
 *   CSS
 *
 * @example
 * ```
 * const rules = {
 *   'body': {
 *     'color': 'red'
 *   }
 * };
 *
 * const lines = formatCSSRules(rules);
 * // Returns: ['body {', '  color: red;', '}']
 * ```
 */
export function formatCSSRules(
  rules: CSSRules | CSSRuleObject = {},
  options: CSSRulesFormatOptions = {},
): string[] {
  return [...generateCSSRules(rules, options)];
}

/**
 * Formats an array of CSS rules into an array of formatted string lines.
 *
 * This function processes various CSS rule representations recursively and
 * converts them into strings representing CSS code with proper formatting.
 * It handles:
 *
 * - String values (treated as direct CSS with semicolons added)
 * - Empty strings (converted to blank lines for spacing if appropriate)
 * - CSS rule objects (recursively processed with formatCSSRules)
 * - Empty rule objects (possibly generating blank lines)
 *
 * The function maintains proper whitespace by tracking whether the last
 * inserted item was a blank line to avoid consecutive empty lines.
 *
 * @param rules - The array of CSS rules to format (strings or rule objects)
 * @param options - Configuration options for formatting
 * @returns An array of strings, each representing a line in the formatted
 *   CSS
 *
 * @example
 * ```
 * // Mixed strings and objects
 * formatCSSRulesArray([
 *   'display: block',
 *   { color: 'red' },
 *   '',
 *   { fontSize: '16px' }
 * ]);
 * // Returns: ['display: block;', 'color: red;', '', 'fontSize: 16px;']
 * ```
 */
export function formatCSSRulesArray(
  rules: (string | CSSRules | CSSRuleObject)[] = [],
  options: CSSRulesFormatOptions = {},
): string[] {
  return [...generateCSSRulesArray(rules, options)];
}

/**
 * Default validation function for CSS rules.
 *
 * Determines if a CSS rule key-value pair should be included in the output.
 * By default, a rule is valid if:
 * - The key is not an empty string
 * - The value is neither undefined nor null
 *
 * @param key - The rule key/selector to validate
 * @param value - The rule value to validate
 * @returns `true` if the rule should be included, `false` otherwise
 */
export function defaultValidCSSRule(
  key: string,
  value: CSSRulesValue,
): boolean {
  if (key === '' || value === undefined || value === null) {
    return false;
  }
  return true;
}

/**
 * Special handling for CSS at-rules with empty content.
 *
 * At-rules (rules starting with `@`) with empty content are treated
 * differently:
 * - Empty at-rules (like `@import`, `@charset`) are rendered as a single
 *   line with semicolon
 * - Normal CSS rules with empty content would be omitted entirely
 *
 * @example
 * `@supports (display: grid) {}` becomes `@supports (display: grid);`
 */
function atRuleException(key: string, value: CSSRulesValue): boolean {
  if (!key.startsWith('@') || value === null) {
    return false;
  } else if (Array.isArray(value)) {
    return value.length === 0;
  } else if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  } else {
    return false;
  }
}

/**
 * Generator version of formatCSSRulesArray that yields lines as they're
 * generated. This avoids building arrays in memory and is more efficient for
 * large files.
 *
 * @param rules - The array of CSS rules to format
 * @param options - Configuration options for formatting
 * @returns Generator that yields individual CSS lines without line
 *   endings
 */
export function* generateCSSRulesArray(
  rules: (string | CSSRules | CSSRuleObject)[] = [],
  options: CSSRulesFormatOptions = {},
): Generator<string, void, unknown> {
  // Track if the last item was a blank line to avoid consecutive empty lines
  let wasBlankLine = true;

  for (const value of rules) {
    if (typeof value === 'string') {
      // String rule, preserve empty for whitespace
      if (value) {
        yield `${value};`;
        wasBlankLine = false;
      } else if (!wasBlankLine) {
        yield '';
        wasBlankLine = true;
      }
    } else if (value !== null && value !== undefined) {
      // Object rule
      let hasContent = false;
      const innerLines: string[] = [];

      // Collect to check if empty (we need to peek ahead)
      for (const line of generateCSSRules(value, options)) {
        innerLines.push(line);
        hasContent = true;
      }

      if (hasContent) {
        for (const line of innerLines) {
          yield line;
        }
        wasBlankLine = false;
      } else if (!wasBlankLine) {
        yield '';
        wasBlankLine = true;
      }
    }
  }
}

/**
 * Generator version of formatCSSRules that yields lines as they're
 * generated.
 *
 * @param rules - The CSS rules to format
 * @param options - Configuration options for formatting
 * @returns Generator that yields individual CSS lines without line
 *   endings
 */
export function* generateCSSRules(
  rules: CSSRules | CSSRuleObject = {},
  options: CSSRulesFormatOptions = {},
): Generator<string, void, unknown> {
  const {
    indent = '  ',
    prefix = '',
    valid = defaultValidCSSRule,
  } = options;

  const nextOptions: CSSRulesFormatOptions = {
    ...options,
    prefix: prefix + indent,
  };

  for (const [key, value] of pairs(rules, valid)) {
    if (atRuleException(key, value)) {
      // at-function
      yield `${prefix}${key};`;
    } else if (typeof value === 'number') {
      yield `${prefix}${key}: ${value};`;
    } else if (typeof value === 'string') {
      // string, omit empty
      if (value) {
        yield `${prefix}${key}: ${value};`;
      }
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        // Skip empty arrays
      } else if (typeof value[0] === 'string') {
        // multi-value
        const useComma = !spaceDelimitedProperties.has(key);
        const inner = formatCSSValue(value as string[], useComma);
        if (inner) {
          yield `${prefix}${key}: ${inner};`;
        }
      } else {
        // nested rules array
        let hasContent = false;
        const innerLines: string[] = [];

        // Collect to check if empty
        for (const line of generateCSSRulesArray(value, nextOptions)) {
          innerLines.push(line);
          hasContent = true;
        }

        if (hasContent) {
          yield `${prefix}${key} {`;
          for (const line of innerLines) {
            yield line;
          }
          yield `${prefix}}`;
        }
      }
    } else if (value) {
      // nested rules object
      let hasContent = false;
      const innerLines: string[] = [];

      // Collect to check if empty
      for (const line of generateCSSRules(value, nextOptions)) {
        innerLines.push(line);
        hasContent = true;
      }

      if (hasContent) {
        yield `${prefix}${key} {`;
        for (const line of innerLines) {
          yield line;
        }
        yield `${prefix}}`;
      }
    }
  }
}

/**
 * Interleaves an array of CSS rule objects with empty objects.
 *
 * @param rules - An array of CSS rule objects to be interleaved
 * @returns An array with the original rules spaced out with empty objects
 *
 * @example
 * ```
 * // Input: [{ color: 'red' }, { background: 'blue' }]
 * // Output: [{ color: 'red' }, {}, { background: 'blue' }]
 * ```
 */
export function interleavedRules(rules: CSSRules[]): CSSRules[] {
  if (rules.length === 0) return [];

  const size = rules.length * 2 - 1;
  const out: Array<CSSRules> = Array.from({ length: size }, () => ({}));

  let i = 0;
  for (const entry of rules) {
    out[i] = entry;
    i += 2;
  }

  return out;
}

/**
 * Renames the keys in a CSS rules object using the provided function.
 *
 * @param rules - The CSS rules object whose keys should be renamed
 * @param fn - A function that takes an original key name and returns a new
 *   key name (or falsy value to skip)
 * @returns A new CSS rules object with renamed keys
 *
 * @example
 * ```
 * // Input: { '.button': { color: 'blue' } }, key => `@utility
 * //   ${key.slice(1)}`
 * // Output: { '@utility button': { color: 'blue' } }
 * ```
 */
export function renameRules(
  rules: CSSRules,
  fn: (name: string) => string,
): CSSRules {
  if (!fn) return rules;

  const map = new Map<string, CSSRules[string]>();
  for (const [key, value] of pairs(rules)) {
    const k2 = fn(key);
    if (k2) map.set(k2, value);
  }

  return Object.fromEntries(map);
}

/**
 * Sets a CSS rule object at a specified path within a target object,
 * merging with existing objects and creating intermediate objects as needed.
 *
 * This function allows for deep setting of CSS rules in a nested object
 * structure. It can handle both string paths for top-level assignments and
 * array paths for nested assignments. When the target path already contains
 * an object, the new object is merged with the existing one, with new values
 * taking precedence.
 *
 * The function is overloaded to provide type safety for both general
 * `CSSRules` objects and TailwindCSS-compatible `CSSRuleObject` types.
 *
 * @param target - The target CSS rules object to modify
 * @param path - Either a string key for direct assignment or an array of
 *   string keys for nested assignment
 * @param object - The CSS rule object to set at the specified path
 * @returns The modified target object (same type as input)
 * @remarks The target object is modified in place, returned reference is
 *   only a convenience.
 *
 * @example
 * ```
 * // Direct assignment
 * setDeepRule(rules, 'button', { color: 'blue' });
 * // Result: { button: { color: 'blue' } }
 *
 * // Nested assignment
 * setDeepRule(rules, ['components', 'button'], { color: 'blue' });
 * // Result: { components: { button: { color: 'blue' } } }
 *
 * // Merging with existing object (new values take precedence)
 * const rules = { button: { color: 'red', margin: '5px' } };
 * setDeepRule(rules, 'button', { color: 'blue', padding: '10px' });
 * // Result: { button: { color: 'blue', margin: '5px', padding: '10px' } }
 * ```
 */
export function setDeepRule(
  target: CSSRuleObject,
  path: string | string[],
  object: CSSRuleObject,
): CSSRuleObject;
export function setDeepRule(
  target: CSSRules,
  path: string | string[],
  object: CSSRules,
): CSSRules;
export function setDeepRule(
  target: CSSRules,
  path: string | string[],
  object: CSSRules,
): CSSRules {
  let p: CSSRules = target;
  let lastKey = '';

  if (Array.isArray(path)) {
    if (path.length === 0) return target;

    // Create nested objects for all but the last path segment
    for (let i = 0; i < path.length - 1; i++) {
      const k = path[i];
      if (p[k] === undefined) {
        p[k] = {} as CSSRules;
      } else if (typeof p[k] !== 'object' || p[k] === null) {
        throw new Error(
          `Invalid path at segment ${i}: "${k}" in path: `
          + `${path.join('.')}: ${typeof p[k]}`,
        );
      }

      p = p[k] as CSSRules;
    }

    // Assign the obj to the last path segment
    lastKey = path.at(-1) as string;
  } else {
    lastKey = path;
  }

  p[lastKey] = defu(object, p[lastKey] ?? {} as typeof object);

  return target;
}

/**
 * Retrieves a CSS rule value from a specified path within a target object.
 *
 * This function allows for deep retrieval of CSS rules from a nested object
 * structure. It can handle both string paths for top-level access and array
 * paths for nested access.
 *
 * The function is overloaded to provide type safety for both general
 * `CSSRules` objects and TailwindCSS-compatible `CSSRuleObject` types.
 *
 * @param target - The target CSS rules object to search within
 * @param path - Either a string key for direct access or an array of
 *   string keys for nested access
 * @returns The value at the specified path, or `undefined` if the path
 *   does not exist
 *
 * @example
 * ```
 * const rules = {
 *   components: { button: { color: 'blue' } },
 *   utils: ['clearfix', 'sr-only']
 * };
 *
 * // Direct access
 * getDeepRule(rules, 'utils');
 * // Result: ['clearfix', 'sr-only']
 *
 * // Nested access
 * getDeepRule(rules, ['components', 'button', 'color']);
 * // Result: 'blue'
 *
 * // Non-existent path
 * getDeepRule(rules, ['components', 'header']);
 * // Result: undefined
 *
 * // Root access (empty array)
 * getDeepRule(rules, []);
 * // Result: { components: { ... }, utils: [...] }
 * ```
 */
export function getDeepRule(
  target: CSSRuleObject,
  path: string | string[],
): CSSRuleObject | undefined;
export function getDeepRule(
  target: CSSRules,
  path: string | string[],
): CSSRulesValue | undefined;
export function getDeepRule(
  target: CSSRules,
  path: string | string[],
): CSSRulesValue | undefined {
  const segments = typeof path === 'string' ? [path] : path;

  if (segments.length === 0) {
    // Empty path returns the target object itself
    return target;
  }

  let current: CSSRulesValue = target;
  for (const key of segments) {
    if (typeof current !== 'object' || current === null
      || !Object.prototype.hasOwnProperty.call(current, key)) {
      return undefined;
    }
    current = (current as CSSRules)[key];
  }

  return current;
}
