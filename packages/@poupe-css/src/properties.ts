import {
  kebabCase,
  pairs,
} from './utils';

export type CSSProperties<K extends string = string> = Record<K, CSSValue>;
export type CSSValue = string | number | boolean | (string | number | boolean)[];

/**
 * Configuration options for CSS properties stringification.
 */
export type CSSPropertiesOptions = {
  /** Indentation string, defaults to two spaces. */
  indent?: string
  /** Prefix string added before each line, defaults to empty string. */
  prefix?: string
  /** New line character, defaults to LF. */
  newLine?: string
  /** Whether to format output on a single line, defaults to false. */
  inline?: boolean
  /** Maximum number of properties to format on a single line, defaults to 1. */
  singleLineThreshold?: number
};

/**
 * Converts a CSSProperties object into a formatted CSS string representation.
 *
 * @param object - The CSSProperties object to stringify.
 * @param options - Configuration options for string formatting.
 * @returns A string representing the CSS properties enclosed in curly braces.
 * @remarks no newLine at the end to aid composition.
 */
export function stringifyCSSProperties<K extends string>(
  object: CSSProperties<K>,
  options?: CSSPropertiesOptions,
): string {
  const {
    indent = '  ',
    prefix = '',
    newLine = '\n',
    inline = false,
    singleLineThreshold = 1,
  } = options || {};

  const lines = formatCSSProperties(object);

  // Handle empty blocks with a simple format
  if (lines.length === 0) {
    return '{}';
  }

  // Handle inline mode or when property count is below threshold
  if (inline || lines.length <= singleLineThreshold) {
    return `{ ${lines.join('; ')} }`;
  }

  // Standard multiline format
  return `{${newLine}${prefix}${indent}${lines.join(`;${newLine}${prefix}${indent}`)}${newLine}${prefix}}`;
}

/**
 * Formats a CSSProperties object into an array of CSS property strings.
 *
 * @param object - The CSSProperties object to format.
 * @returns An array of strings, where each string is a CSS property in the format "key: value;".
 */
export function formatCSSProperties<K extends string>(object: CSSProperties<K>): string[] {
  const propertyMap = new Map<string, string>();
  for (const [key, value] of properties(object)) {
    const kebabKey = kebabCase(key);
    const useComma = !spaceDelimitedProperties.has(kebabKey);
    const formattedValue = formatCSSValue(value, useComma);
    propertyMap.set(kebabKey, formattedValue);
  }

  const lines: string[] = [];
  for (const [key, value] of propertyMap) {
    lines.push(`${key}: ${value}`);
  }
  return lines;
}

/**
 * Formats a CSS value into a string representation.
 *
 * @param value - The CSS value to format, which can be a single value or an array of values.
 * @param useComma - Flag to determine whether array values should be comma-separated (true)
 *                   or space-separated (false). Defaults to true.
 * @returns A formatted string representation of the CSS value.
 * @remarks

 * - For array values, elements are joined with commas or spaces based on the useComma parameter.
 * - The choice between commas and spaces depends on the CSS property being formatted.
 * - Properties like 'font-family' use commas while properties like 'margin' use spaces.
 */
export function formatCSSValue(value: CSSValue, useComma = true): string {
  if (Array.isArray(value)) {
    return value.map(v => quoted(v)).join(useComma ? ', ' : ' ');
  }
  return quoted(value);
}

/**
 * Encloses a CSS value in double quotes if it is a string containing spaces,
 * except for CSS functions which should not be quoted.
 *
 * @param v - The CSS value to process.
 * @returns The processed CSS value as a string.
 * @example
 * quoted('Open Sans')         // Returns "\"Open Sans\""
 * quoted('rgb(255, 0, 0)')    // Returns "rgb(255, 0, 0)" (no quotes - CSS function)
 * quoted(16)                  // Returns "16"
 * quoted(true)                // Returns "true"
 */
export function quoted(v: CSSValue): string {
  if (typeof v === 'boolean') {
    return v ? 'true' : 'false';
  } else if (typeof v === 'string') {
    // Check if this is a CSS function (contains parentheses)
    const isCssFunction = /^[a-zA-Z-]+\(.*\)$/.test(v.trim());

    // Only quote strings with spaces that are not CSS functions
    if (v.includes(' ') && !isCssFunction) {
      return `"${v}"`;
    }
  }
  return String(v);
}

/**
 * Generates a sequence of valid CSS property key-value pairs from a CSSProperties object.
 *
 * @param object - The object containing CSS properties.
 * @returns A generator of valid key-value CSS property pairs.
 * @remarks Filters out invalid or empty CSS property values, returning only valid entries.
 */
export function* properties<K extends string>(object: CSSProperties<K>): Generator<[K, CSSValue]> {
  for (const [key, value] of pairs(object)) {
    if (Array.isArray(value) ? (value.length > 0 && value.every(v => isValidValue(v))) : isValidValue(value)) {
      yield [key, value as CSSValue];
    }
  }
}

/**
 * Checks if a CSS value is valid.
 * A value is considered valid if it is a non-empty string or a number.
 *
 * @param value - The value to check.
 * @returns True if the value is valid, false otherwise.
 */
function isValidValue(value: unknown): boolean {
  if (typeof value === 'string')
    return value !== '';
  return typeof value === 'number';
}

/**
 * A set of CSS properties that typically have space-delimited values.
 * These properties often require multiple values to be specified in a single declaration.
 *
 * @remarks
 * When formatting CSS values for these properties, values are space-separated rather than comma-separated.
 * For example:
 * - margin: 10px 20px 30px 40px    (spaces between values)
 * - padding: 5px 10px              (spaces between values)
 * - font: bold 16px Arial          (spaces between values)
 *
 * This differs from comma-separated properties like font-family:
 * - font-family: Arial, Helvetica, sans-serif  (commas between values)
 */
export const spaceDelimitedProperties: ReadonlySet<string> = new Set([
  'animation',
  'background',
  'box-shadow',
  'flex',
  'font',
  'grid-auto-columns',
  'grid-auto-flow',
  'grid-auto-rows',
  'grid-gap',
  'grid-template-areas',
  'grid-template-columns',
  'grid-template-rows',
  'list-style',
  'margin',
  'padding',
  'text-decoration',
  'text-shadow',
  'transform',
  'transition',
]);
