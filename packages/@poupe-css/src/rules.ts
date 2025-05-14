import {
  pairs,
} from './utils';

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
 * This is a type alias for the union of all possible values in a CSSRules object.
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
 *
 * @example
 * ```
 * // Simple example of stringifying CSS rules
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
 *
 */
export function stringifyCSSRules(
  rules: CSSRules | CSSRuleObject = {},
  options: CSSRulesFormatOptions & {
    /**
     * Character(s) to use for line breaks.
     * @defaultValue `'\n'`
     */
    newLine?: string
  } = {}): string {
  const {
    newLine = '\n',
  } = options;

  return formatCSSRules(rules, options).join(newLine);
}

/**
 * Formats CSS rule objects into an array of formatted lines.
 *
 * This function processes a CSS rule object and returns an array of strings,
 * where each string represents a line in the formatted CSS output. It handles
 * various value types including strings, numbers, arrays, and nested objects.
 *
 * @param rules - The CSS rules to format
 * @param options - Configuration options for formatting
 * @returns An array of strings, each representing a line in the formatted CSS
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
 *
 */
export function formatCSSRules(rules: CSSRules | CSSRuleObject = {}, options: CSSRulesFormatOptions = {}): string[] {
  const {
    indent = '  ',
    prefix = '',
    valid = defaultValidCSSRule,
  } = options;

  const out: string[] = [];
  const nextOptions: CSSRulesFormatOptions = {
    ...options,
    prefix: prefix + indent,
  };

  for (const [key, value] of pairs(rules, valid)) {
    if (atRuleException(key, value)) {
      // at-function
      out.push(`${prefix}${key};`);
    } else if (typeof value === 'number') {
      out.push(`${prefix}${key}: ${value};`);
    } else if (typeof value === 'string') {
      // string, omit empty.
      if (value) {
        out.push(`${prefix}${key}: ${value};`);
      }
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        continue;
      } else if (typeof value[0] === 'string') {
        // multi-value
        const useComma = !spaceDelimitedProperties.has(key);
        const inner = formatCSSValue(value as string[], useComma);
        if (inner) {
          out.push(`${prefix}${key}: ${inner};`);
        }
      } else {
        // nested, omit empty
        const inner = formatCSSRulesArray(value, nextOptions);
        if (inner) {
          out.push(`${prefix}${key} {`, ...inner, `${prefix}}`);
        }
      }
    } else if (value) {
      // nested, omit empty
      const inner = formatCSSRules(value, nextOptions);
      if (inner) {
        out.push(`${prefix}${key} {`, ...inner, `${prefix}}`);
      }
    }
  }

  return out;
}

/**
 * Formats an array of CSS rules into indented lines recursively.
 *
 * This function handles arrays of strings or nested rule objects and formats them
 * into an array of lines for output.
 *
 * @param rules - The array of CSS rules to format
 * @param options - Configuration options for formatting
 * @returns An array of strings, each representing a line in the formatted CSS
 */
export function formatCSSRulesArray(rules: (string | CSSRules | CSSRuleObject)[] = [], options: CSSRulesFormatOptions = {}): string[] {
  const out: string[] = [];

  for (const value of rules) {
    if (typeof value === 'string') {
      // string, preserve empty for whitespace.
      if (value || out.length > 0) {
        out.push(value ? `${value};` : '');
      }
    } else {
      // object
      out.push(...formatCSSRules(value, options));
    }
  }
  return out;
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
export function defaultValidCSSRule(key: string, value: CSSRulesValue): boolean {
  if (key === '' || value === undefined || value === null) {
    return false;
  }
  return true;
}

/**
 * Special handling for CSS at-rules with empty content.
 *
 * At-rules (rules starting with `@`) with empty content are treated differently:
 * - Empty at-rules (like `@import`, `@charset`) are rendered as a single line with semicolon
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
