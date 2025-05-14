# @poupe/css

[![jsDocs.io](https://img.shields.io/badge/jsDocs.io-reference-blue)](https://www.jsdocs.io/package/@poupe/css)
[![npm version](https://img.shields.io/npm/v/@poupe/css.svg)](https://www.npmjs.com/package/@poupe/css)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../../LICENCE.txt)

A TypeScript utility library for CSS property manipulation, formatting, and CSS-in-JS operations.

## Features

- 🛠️ Utilities for manipulating CSS properties
- 🔄 Convert between camelCase and kebab-case CSS properties
- 📝 Format CSS for use in JavaScript
- 🎨 CSS-in-JS helpers and type definitions
- 📦 Lightweight, tree-shakable API

## Installation

```bash
npm install -D @poupe/css
# or
yarn add -D @poupe/css
# or
pnpm add -D @poupe/css
```

## API Reference

The library exports several categories of utilities:

- **Case Conversion**: Functions for converting between different CSS naming conventions
- **CSS Stringification**: Tools to convert CSS objects to strings
- **CSS Variables**: Utilities for working with CSS custom properties
- **Type Definitions**: TypeScript types for CSS properties

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
Property values are intelligently formatted based on their type and the CSS property name - space-delimited
properties (like margin, padding) use spaces between multiple values, while other properties use commas.

```typescript
import { stringifyCSSProperties } from '@poupe/css';

const styles = {
  fontSize: '16px',
  backgroundColor: 'red',
  margin: [10, '20px', '30px', '40px'],
  fontFamily: ['Arial', 'sans-serif']
};

// Default multi-line formatting
const cssString = stringifyCSSProperties(styles);
// "{
//   font-size: 16px;
//   background-color: red;
//   margin: 10 20px 30px 40px;
//   font-family: Arial, sans-serif;
// }"

// Inline formatting
const inlineCSS = stringifyCSSProperties(styles, { inline: true });
// "{ font-size: 16px; background-color: red; margin: 10 20px 30px 40px; font-family: Arial, sans-serif }"
```

#### `formatCSSProperties<K extends string>(object: CSSProperties<K>): string[]`
Formats a CSS properties object into an array of CSS property strings. Automatically handles deduplication of
properties, where later declarations override earlier ones while preserving the original insertion order.

```typescript
import { formatCSSProperties } from '@poupe/css';

const styles = {
  fontSize: '16px',
  backgroundColor: 'red',
  margin: [10, '20px', '30px', '40px'],
  // Later declarations override earlier ones:
  backgroundColor: 'blue'
};

const cssLines = formatCSSProperties(styles);
// [
//   "font-size: 16px",
//   "background-color: blue", // Note: red was overridden by blue
//   "margin: 10, 20px, 30px, 40px"
// ]
```

#### `formatCSSValue(value: CSSValue, useComma = true): string`
Formats a CSS value into a string. If the value is an array:
- By default, it joins the elements with commas (appropriate for properties like `font-family`)
- When `useComma` is set to `false`, it uses spaces (appropriate for properties like `margin` or `padding`)

The function automatically handles quoting strings that contain spaces (except CSS functions like
`rgb()` or `calc()`), enclosing them in double quotes.

```typescript
import { formatCSSValue } from '@poupe/css';

formatCSSValue('16px'); // "16px"
formatCSSValue('Open Sans'); // "\"Open Sans\""
formatCSSValue([10, '20px', '30px']); // "10, 20px, 30px" (comma-separated by default)
formatCSSValue([10, '20px', '30px'], false); // "10 20px 30px" (space-separated)
formatCSSValue('rgb(255, 0, 0)'); // "rgb(255, 0, 0)" - Not quoted despite spaces
formatCSSValue('calc(100% - 20px)'); // "calc(100% - 20px)" - Not quoted despite spaces
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

```typescript
import { keys } from '@poupe/css';

const obj = { a: 1, b: 2, _private: 3 };

// Use with default validation (includes all keys)
for (const key of keys(obj)) {
  console.log(key); // "a", "b", "_private"
}

// Use with custom validation
for (const key of keys(obj, k => !k.startsWith('_'))) {
  console.log(key); // "a", "b"
}
```

#### `pairs<K extends string, T>(object: Record<K, T>, valid?: (k: K, v: T) => boolean): Generator<[K, T]>`
A generator function that yields valid key-value pairs from an object. Allows providing a custom validation function
to determine which pairs to include.

```typescript
import { pairs } from '@poupe/css';

const obj = { color: 'red', fontSize: '16px', _private: 'hidden', empty: '' };

// Use with default validation (excludes keys starting with underscore and null/empty values)
for (const [key, value] of pairs(obj)) {
  console.log(`${key}: ${value}`); // "color: red", "fontSize: 16px"
}

// Use with custom validation
const customValid = (key: string, value: unknown) => typeof value === 'string' && value.length > 3;
for (const [key, value] of pairs(obj, customValid)) {
  console.log(`${key}: ${value}`); // "color: red", "_private: hidden"
}
```

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

## Integration with Poupe Ecosystem

- [@poupe/theme-builder](../@poupe-theme-builder) - Design tokens generation
- [@poupe/tailwindcss](../@poupe-tailwindcss) - TailwindCSS integration
- [@poupe/vue](../@poupe-vue) - Vue components library
- [@poupe/nuxt](../@poupe-nuxt) - Nuxt integration

## Requirements

- Node.js >=20.19.1
- TypeScript-friendly environment

## License

MIT licensed.
