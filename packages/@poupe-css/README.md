# @poupe/css

[![jsDocs.io](https://img.shields.io/badge/jsDocs.io-reference-blue)](https://www.jsdocs.io/package/@poupe/css)

A TypeScript utility library for CSS property manipulation and formatting.

## Installation

```bash
npm install @poupe/css
```

## API Reference

### Types

#### `CSSValue`
Represents a valid CSS property value:
```typescript
type CSSValue = string | number | (string | number)[];
```

#### `CSSProperties<K extends string = string>`
A typed record of CSS properties:
```typescript
type CSSProperties<K extends string = string> = Record<K, CSSValue>;
```

#### `CSSPropertiesOptions`
Configuration options for CSS properties stringification:
```typescript
type CSSPropertiesOptions = {
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
}
```

### CSS Property Functions

#### `stringifyCSSProperties<K extends string>(object: CSSProperties<K>, options?: CSSPropertiesOptions): string`
Converts a CSSProperties object into a formatted CSS string representation with proper indentation.

```typescript
import { stringifyCSSProperties } from '@poupe/css';

const styles = {
  fontSize: '16px',
  backgroundColor: 'red',
  margin: [10, '20px', '30px', '40px']
};

// Default multi-line formatting
const cssString = stringifyCSSProperties(styles);
// "{
//   font-size: 16px;
//   background-color: red;
//   margin: 10, 20px, 30px, 40px;
//   }"

// Inline formatting
const inlineCSS = stringifyCSSProperties(styles, { inline: true });
// "{ font-size: 16px; background-color: red; margin: 10, 20px, 30px, 40px }"

// Custom indentation and prefix
const customCSS = stringifyCSSProperties(styles, { 
  indent: '    ',
  prefix: '  ',
  singleLineThreshold: 3
});
// "{
//       font-size: 16px;
//       background-color: red;
//       margin: 10, 20px, 30px, 40px;
//   }"
```

#### `formatCSSProperties<K extends string>(object: CSSProperties<K>): string[]`
Formats a CSS properties object into an array of CSS property strings.

```typescript
import { formatCSSProperties } from '@poupe/css';

const styles = {
  fontSize: '16px',
  backgroundColor: 'red',
  margin: [10, '20px', '30px', '40px']
};

const cssLines = formatCSSProperties(styles);
// [
//   "font-size: 16px",
//   "background-color: red",
//   "margin: 10, 20px, 30px, 40px"
// ]
```

#### `formatCSSValue(value: CSSValue): string`
Formats a CSS value into a string. If the value is an array, it joins the elements with a comma and a space.
If the value is a string containing spaces, it encloses the string in double quotes.

```typescript
import { formatCSSValue } from '@poupe/css';

formatCSSValue('16px'); // "16px"
formatCSSValue('Open Sans'); // "\"Open Sans\""
formatCSSValue([10, '20px', '30px']); // "10, 20px, 30px"
```

#### `properties<K extends string>(object: CSSProperties<K>): Generator<[K, CSSValue]>`
Generates a sequence of valid CSS property key-value pairs from a CSSProperties object.
Filters out invalid or empty CSS property values.

```typescript
import { properties } from '@poupe/css';

const styles = {
  fontSize: '16px',
  backgroundColor: 'red',
  _private: 'hidden',
  empty: ''
};

// Iterate through valid properties only
for (const [key, value] of properties(styles)) {
  console.log(`${key}: ${value}`);
}
// Output:
// fontSize: 16px
// backgroundColor: red
```

### Utility Functions

#### `unsafeKeys<T>(object: T): Array<keyof T>`
A type-safe wrapper around Object.keys that preserves the object's key types.

#### `keys<T, K extends keyof T>(object: T, valid?: (key: keyof T) => boolean): Generator<K>`
A generator function that yields keys of an object that pass an optional validation function.

#### `pairs<K extends string, T1, T2>(object: Record<K, T1>, valid?: (k: K, v: T1) => boolean): Generator<[K, T2]>`
A generator function that yields valid key-value pairs from an object.

#### `defaultValidPair<K extends string, T>(key: K, value: T): boolean`
Validates if a key-value pair meets default criteria:
- The value is neither null nor undefined
- The key doesn't contain spaces
- The key doesn't start with an underscore (_)

#### `kebabCase(s: string): string`
Converts a given string to kebab-case:
- Transforms camelCase, PascalCase, and snake_case to kebab-case
- Adds leading hyphen to recognized vendor prefixes

```typescript
import { kebabCase } from '@poupe/css';

kebabCase('XMLHttpRequest'); // 'xml-http-request'
kebabCase('camelCase');      // 'camel-case'
kebabCase('snake_case');     // 'snake-case'
kebabCase('WebkitTransition'); // '-webkit-transition'
```

## License

MIT licensed.
