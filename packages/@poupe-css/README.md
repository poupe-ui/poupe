# @poupe/css

[![jsDocs.io][jsdocs-badge]][jsdocs-url]
[![npm version][npm-badge]][npm-url]
[![License: MIT][license-badge]][license-url]

A TypeScript utility library for CSS property manipulation, formatting, and
CSS-in-JS operations.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [API Reference](#api-reference)
  - [Types](#types)
  - [CSS Property Functions](#css-property-functions)
  - [CSS Rules Functions](#css-rules-functions)
  - [Utility Functions](#utility-functions)
- [Integration with Poupe Ecosystem](#integration-with-poupe-ecosystem)
- [Requirements](#requirements)
- [License](#license)

## Features

- 🛠️ Utilities for manipulating CSS properties
- 🔄 Bidirectional conversion between camelCase and kebab-case CSS properties
- 📝 Format CSS for use in JavaScript
- 🎨 CSS-in-JS helpers and type definitions
- 📦 Lightweight, tree-shakable API
- 🧩 Support for nested CSS rules and at-rules

## Installation

```bash
npm install -D @poupe/css
```

```bash
yarn add -D @poupe/css
```

```bash
pnpm add -D @poupe/css
```

## API Reference

The library exports several categories of utilities:

- **Case Conversion**: Functions for converting between different CSS naming
  conventions
- **CSS Stringification**: Tools to convert CSS objects to strings
- **CSS Variables**: Utilities for working with CSS custom properties
- **CSS Rules**: Functions for handling nested CSS rule objects
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
  /** Max properties to format on a single line, defaults to 1. */
  singleLineThreshold?: number
}
```

#### `CSSRules`
Represents a structured CSS rule set that can contain nested rules:
```typescript
type CSSRules = {
  [name: string]: null | string | string[] | CSSRules | CSSRules[]
};
```

#### `CSSRuleObject`
A more restrictive subset of CSSRules that is compatible with TailwindCSS
plugin API:
```typescript
type CSSRuleObject = {
  [key: string]: string | string[] | CSSRuleObject
};
```

#### `CSSRulesFormatOptions`
Configuration options for formatting CSS rules:
```typescript
interface CSSRulesFormatOptions {
  /** Indentation string for each level of nesting, defaults to two spaces. */
  indent?: string
  /** Prefix string added before each line, defaults to empty string. */
  prefix?: string
  /** Optional validation function to determine which rules to include. */
  valid?: (key: string, value: CSSRulesValue) => boolean
}
```

### CSS Property Functions

#### `stringifyCSSProperties<K extends string>`
`(object: CSSProperties<K>, options?: CSSPropertiesOptions): string`
Converts a CSSProperties object into a formatted CSS string representation
with proper indentation. Property values are intelligently formatted based on
their type and the CSS property name - space-delimited properties (like
margin, padding) use spaces between multiple values, while other properties
use commas.

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
// "{ font-size: 16px; background-color: red; margin: 10 20px 30px 40px;
//   font-family: Arial, sans-serif }"
```

#### `formatCSSProperties<K extends string>(object: CSSProperties<K>): string[]`
Formats a CSS properties object into an array of CSS property strings.
Automatically handles deduplication of properties, where later declarations
override earlier ones while preserving the original insertion order.

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
//   "margin: 10, 20px, 30px"
// ]
```

#### `formatCSSValue(value: CSSValue, useComma = true): string`
Formats a CSS value into a string. If the value is an array:
- By default, it joins the elements with commas (appropriate for properties
  like `font-family`)
- When `useComma` is set to `false`, it uses spaces (appropriate for
  properties like `margin` or `padding`)

The function automatically handles quoting strings that contain spaces (except
CSS functions like `rgb()` or `calc()`), enclosing them in double quotes.

```typescript
import { formatCSSValue } from '@poupe/css';

formatCSSValue('16px'); // "16px"
formatCSSValue('Open Sans'); // "\"Open Sans\""
formatCSSValue([10, '20px', '30px']); // "10, 20px, 30px" (comma-separated)
formatCSSValue([10, '20px', '30px'], false); // "10 20px 30px" (space-separated)
formatCSSValue('rgb(255, 0, 0)'); // "rgb(255, 0, 0)" - Not quoted despite
formatCSSValue('calc(100% - 20px)'); // "calc(100% - 20px)" - Not quoted
```

#### `properties<K extends string>`
`(object: CSSProperties<K>): Generator<[K, CSSValue]>`
Generates a sequence of valid CSS property key-value pairs from a
CSSProperties object.
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

### CSS Rules Functions

#### `stringifyCSSRules(rules: CSSRules | CSSRuleObject, options?): string`
Converts a CSS rule object into a formatted string representation with proper
indentation and nesting.

```typescript
import { stringifyCSSRules } from '@poupe/css';

const rules = {
  'body': {
    'color': 'red',
    'font-size': '16px',
    '@media (max-width: 768px)': {
      'font-size': '14px'
    }
  },
  '.container': {
    'max-width': '1200px',
    'margin': ['0', 'auto']
  }
};

const cssString = stringifyCSSRules(rules);
// Output:
// body {
//   color: red;
//   font-size: 16px;
//   @media (max-width: 768px) {
//     font-size: 14px;
//   }
// }
// .container {
//   max-width: 1200px;
//   margin: 0 auto;
// }
```

#### `formatCSSRules(rules: CSSRules | CSSRuleObject, options?): string[]`
Processes a CSS rule object and returns an array of strings, where each
string represents a line in the formatted CSS output.

```typescript
import { formatCSSRules } from '@poupe/css';

const rules = {
  'body': {
    'color': 'red',
    'font-size': '16px'
  }
};

const lines = formatCSSRules(rules);
// Returns: ['body {', '  color: red;', '  font-size: 16px;', '}']

// Custom indentation
const indentedLines = formatCSSRules(rules, { indent: '    ' });
// Returns: ['body {', '    color: red;', '    font-size: 16px;', '}']
```

#### `formatCSSRulesArray`
`(rules: (string | CSSRules | CSSRuleObject)[], options?): string[]`
Formats an array of CSS rules into indented lines recursively.

```typescript
import { formatCSSRulesArray } from '@poupe/css';

const rulesArray = [
  { 'color': 'red' },
  { 'font-size': '16px' },
  'font-weight: bold',
  {
    '@media (max-width: 768px)': {
      'font-size': '14px'
    }
  }
];

const lines = formatCSSRulesArray(rulesArray);
// Returns lines with proper indentation for each rule
```

#### `defaultValidCSSRule(key: string, value: CSSRulesValue): boolean`
Default validation function that determines if a CSS rule key-value pair
should be included in the output. A rule is considered valid if the key is
not empty and the value is neither undefined nor null.

```typescript
import { defaultValidCSSRule } from '@poupe/css';

// Use with custom rule validation
const customValid = (key, value) => {
  return defaultValidCSSRule(key, value) && !key.startsWith('_');
};
```

#### `interleavedRules(rules: CSSRules[]): CSSRules[]`
Interleaves an array of CSS rule objects with empty objects, useful for
creating spacing between rule blocks in the output.

```typescript
import { interleavedRules } from '@poupe/css';

const rules = [
  { '.button': { color: 'blue' } },
  { '.input': { border: '1px solid gray' } }
];

const spacedRules = interleavedRules(rules);
// Returns:
// [
//   { '.button': { color: 'blue' } },
//   {}, // Empty object for spacing
//   { '.input': { border: '1px solid gray' } }
// ]

// When stringified, this creates an empty line between rule blocks
```

#### `renameRules(rules: CSSRules, fn: (name: string) => string): CSSRules`
Renames the keys in a CSS rules object using the provided function, allowing
for advanced selector manipulation.

```typescript
import { renameRules } from '@poupe/css';

const rules = {
  '.button': { color: 'blue' },
  '.input': { border: '1px solid gray' }
};

// Add a prefix to all selectors
const prefixedRules = renameRules(rules, key => `.prefix ${key}`);
// Returns:
// {
//   '.prefix .button': { color: 'blue' },
//   '.prefix .input': { border: '1px solid gray' }
// }

// Transform selectors to utility classes
const utilityRules = renameRules(rules, key => `@utility ${key.slice(1)}`);
// Returns:
// {
//   '@utility button': { color: 'blue' },
//   '@utility input': { border: '1px solid gray' }
// }

// Return falsy from the function to skip/remove a rule
const filteredRules = renameRules(rules, key =>
  key.includes('button') ? key : null);
// Returns:
// {
//   '.button': { color: 'blue' }
// }
```

#### `setDeepRule(target, path, object)`
Sets a CSS rule object at a specified path within a target object,
merging with existing objects and creating intermediate objects as needed.
This function is overloaded to provide type safety for both general
`CSSRules` objects and TailwindCSS-compatible `CSSRuleObject` types.

```typescript
import { setDeepRule } from '@poupe/css';

const rules = {};

// Direct assignment
setDeepRule(rules, 'button', { color: 'blue' });
// Result: { button: { color: 'blue' } }

// Nested assignment
setDeepRule(rules, ['components', 'button'], { color: 'blue' });
// Result: { components: { button: { color: 'blue' } } }

// Merging with existing object (new values take precedence)
const existingRules = { button: { color: 'red', margin: '5px' } };
setDeepRule(existingRules, 'button', { color: 'blue', padding: '10px' });
// Result: { button: { color: 'blue', margin: '5px', padding: '10px' } }
```

#### `getDeepRule(target, path)`
Retrieves a CSS rule value from a specified path within a target object.
This function is overloaded to provide type safety for both general
`CSSRules` objects and TailwindCSS-compatible `CSSRuleObject` types.

```typescript
import { getDeepRule } from '@poupe/css';

const rules = {
  components: { button: { color: 'blue' } },
  utils: ['clearfix', 'sr-only']
};

// Direct access
getDeepRule(rules, 'utils');
// Result: ['clearfix', 'sr-only']

// Nested access
getDeepRule(rules, ['components', 'button', 'color']);
// Result: 'blue'

// Non-existent path
getDeepRule(rules, ['components', 'header']);
// Result: undefined

// Root access (empty array)
getDeepRule(rules, []);
// Result: { components: { ... }, utils: [...] }
```

### CSS Selector Functions

#### `expandSelectorAlias(selector: string, aliases?: Record<string, string>): string`

Expands selector aliases into their full forms using built-in or custom
aliases.

Built-in aliases include:
- `'media'` → `'@media (prefers-color-scheme: dark)'`
- `'dark'` → `'@media (prefers-color-scheme: dark)'`
- `'light'` → `'@media (prefers-color-scheme: light)'`
- `'mobile'` → `'@media (max-width: 768px)'`
- `'tablet'` → `'@media (min-width: 769px) and (max-width: 1024px)'`
- `'desktop'` → `'@media (min-width: 1025px)'`

```typescript
import { expandSelectorAlias } from '@poupe/css';

// Using built-in aliases
expandSelectorAlias('media'); // '@media (prefers-color-scheme: dark)'
expandSelectorAlias('mobile'); // '@media (max-width: 768px)'

// Using custom aliases
const customAliases = {
  'print': '@media print',
  'landscape': '@media (orientation: landscape)'
};
expandSelectorAlias('print', customAliases); // '@media print'

// Non-aliased selectors pass through unchanged
expandSelectorAlias('.my-class'); // '.my-class'
```

#### `processCSSSelectors(selectors: string | string[], options?: ProcessCSSSelectorOptions): string[] | undefined`

Processes CSS selectors and at-rules, handling both strings and arrays.
Merges consecutive selectors with OR and adds * variants, while keeping
at-rules stacked separately. Returns `undefined` if no valid selectors are
found.

```typescript
import { processCSSSelectors } from '@poupe/css';

// Single string selector
processCSSSelectors('.test');
// Result: ['.test, .test *']

// Array of selectors
processCSSSelectors(['.dark', '.custom']);
// Result: ['.dark, .dark *, .custom, .custom *']

// Comma-separated selectors pass through (when allowCommaPassthrough is true)
processCSSSelectors('.test, .other');
// Result: ['.test, .other']

// Disable star variants
processCSSSelectors(['.test1', '.test2'], { addStarVariants: false });
// Result: ['.test1, .test2']

// Use custom aliases
const customAliases = { 'custom': '@media (min-width: 1200px)' };
processCSSSelectors('custom', { aliases: customAliases });
// Result: ['@media (min-width: 1200px), @media (min-width: 1200px) *']

// Mixed selectors and aliases
processCSSSelectors(['.test', 'mobile'], { addStarVariants: false });
// Result: ['.test', '@media (max-width: 768px)']

// At-rules are kept separate
processCSSSelectors([
  '.dark',
  '@media (max-width: 768px)',
  '.mobile'
]);
// Result: [
//   '.dark, .dark *',
//   '@media (max-width: 768px)',
//   '.mobile, .mobile *'
// ]

// Returns undefined for empty arrays
processCSSSelectors([]); // undefined

// Alias expansion with single string
processCSSSelectors('media');
// Result: ['@media (prefers-color-scheme: dark), @media (prefers-color-scheme: dark) *']

// Disable comma pass-through
processCSSSelectors('.test, .other', { allowCommaPassthrough: false });
// Result: ['.test, .other, .test, .other *']
```

### Utility Functions

#### `unsafeKeys<T>(object: T): Array<keyof T>`

A type-safe wrapper around Object.keys for preserving the object's key types.

#### `keys<T, K extends keyof T>`
`(object: T, valid?: (key: keyof T) => boolean): Generator<K>`

A generator function that yields keys of an object that pass an optional
validation function.

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

#### `pairs<K extends string, T>`
`(object: Record<K, T>, valid?: (k: K, v: T) => boolean): Generator<[K, T]>`

A generator function that yields valid key-value pairs from an object. Allows
providing a custom validation function to determine which pairs to include.

```typescript
import { pairs } from '@poupe/css';

const obj = { color: 'red', fontSize: '16px', _private: 'hidden', empty: '' };

// Use with default validation (excludes keys starting with underscore and
// null/empty values)
for (const [key, value] of pairs(obj)) {
  console.log(`${key}: ${value}`); // "color: red", "fontSize: 16px"
}

// Use with custom validation
const customValid = (key: string, value: unknown) =>
  typeof value === 'string' && value.length > 3;
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

#### `camelCase(s: string): string`

Converts a given string to camelCase:
- Transforms kebab-case, PascalCase, and snake_case to camelCase
- Properly handles vendor prefixes by removing the leading hyphen
- Correctly handles acronyms and preserves internal capitalization

```typescript
import { camelCase } from '@poupe/css';

camelCase('kebab-case');      // 'kebabCase'
camelCase('PascalCase');      // 'pascalCase'
camelCase('snake_case');      // 'snakeCase'
camelCase('-webkit-transition'); // 'webkitTransition'
camelCase('HTMLElement');     // 'htmlElement'
camelCase('BGColor');         // 'bgColor'
```

## Usage Examples

### Case Conversion Example

```typescript
import { kebabCase, camelCase } from '@poupe/css';

// Kebab-case to camelCase
const camelProperty = camelCase('background-color'); // 'backgroundColor'

// CamelCase to kebab-case
const kebabProperty = kebabCase('backgroundColor'); // 'background-color'

// Useful for converting between CSS and JavaScript property names
const styleObject = {
  backgroundColor: 'red',
  fontSize: '16px'
};

// Convert to CSS properties
const cssProperties = Object.entries(styleObject).map(
  ([key, value]) => `${kebabCase(key)}: ${value};`
);
// ['background-color: red;', 'font-size: 16px;']
```

### CSS Selector Processing Example

```typescript
import { processCSSSelectors, expandSelectorAlias } from '@poupe/css';

// Theme-aware selector processing
const darkModeSelectors = processCSSSelectors(['.dark', 'media']);
// Result: ['.dark, .dark *', '@media (prefers-color-scheme: dark)']

// Custom aliases for responsive design
const customAliases = {
  'wide': '@media (min-width: 1440px)',
  'touch': '@media (hover: none) and (pointer: coarse)'
};

const responsiveSelectors = processCSSSelectors(
  ['mobile', 'wide'],
  { aliases: customAliases }
);
// Result: ['@media (max-width: 768px)', '@media (min-width: 1440px)']

// Expand individual aliases
expandSelectorAlias('tablet');
// '@media (min-width: 769px) and (max-width: 1024px)'
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

<!-- Badge references -->
[jsdocs-badge]: https://img.shields.io/badge/jsDocs.io-reference-blue
[jsdocs-url]: https://www.jsdocs.io/package/@poupe/css
[npm-badge]: https://img.shields.io/npm/v/@poupe/css.svg
[npm-url]: https://www.npmjs.com/package/@poupe/css
[license-badge]: https://img.shields.io/badge/License-MIT-blue.svg
[license-url]: ../../LICENCE.txt
