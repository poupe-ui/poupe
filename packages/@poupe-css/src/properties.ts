import {
  kebabCase,
  pairs,
} from './utils';

export type CSSProperties<K extends string = string> = Record<K, CSSValue>;
export type CSSValue = string | number | (string | number)[];

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
    const formattedValue = formatCSSValue(value);
    propertyMap.set(kebabKey, formattedValue);
  }

  const lines: string[] = [];
  for (const [key, value] of propertyMap) {
    lines.push(`${key}: ${value}`);
  }
  return lines;
}

/**
 * Formats a CSS value into a string.
 * If the value is an array, it joins the elements with a comma and a space.
 * If the value is a string containing spaces, it encloses the string in double quotes.
 *
 * @param value - The CSS value to format.
 * @returns The formatted CSS value as a string.
 */
export function formatCSSValue(value: CSSValue): string {
  if (Array.isArray(value)) {
    return value.map(v => quoted(v)).join(', ');
  }
  return quoted(value);
}

/**
 * Encloses a CSS value in double quotes if it is a string containing spaces.
 * Otherwise, converts the value to a string.
 *
 * @param v - The CSS value to process.
 * @returns The processed CSS value as a string.
 */
function quoted(v: CSSValue): string {
  if (typeof v === 'string' && v.includes(' ')) {
    return `"${v}"`;
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
