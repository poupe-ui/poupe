# AGENT.md - @poupe/css

This file provides package-specific guidance for the @poupe/css package.
For general monorepo guidelines, see the [root AGENT.md](../../AGENT.md).

## Package Overview

@poupe/css is a TypeScript utility library for CSS property manipulation,
CSS rules formatting, and CSS-in-JS operations. It provides type-safe CSS
property parsing, formatting, conversion utilities, and efficient CSS
generation that form the foundation for other Poupe UI packages.

## Package Structure

```
src/
├── __tests__/        # Unit tests
│   ├── properties.test.ts    # CSS property tests
│   ├── rules.test.ts         # CSS rules & generator tests
│   ├── selectors.test.ts     # CSS selector tests
│   └── utils.test.ts         # Utility function tests
├── index.ts          # Main exports
├── properties.ts     # CSS property utilities
├── rules.ts          # CSS rules formatting & generators
├── selectors.ts      # CSS selector processing
└── utils.ts          # Utility functions
```

## Key Features

- **Type-safe CSS properties**: Full TypeScript support for CSS property
  names and values with kebab-case/camelCase conversion
- **CSS rules formatting**: Format nested CSS rule objects with proper
  indentation and structure
- **Streaming generators**: Memory-efficient CSS generation for large files
  using generator functions
- **CSS selector processing**: Handle CSS selectors, at-rules, and
  responsive aliases
- **CSS-in-JS support**: Utilities for CSS-in-JS libraries and frameworks
- **No runtime dependencies**: Lightweight utility library

## API Categories

The package exports utilities organized into these categories:

### CSS Properties
- Property validation and normalization
- Value parsing and validation
- Array value formatting (comma vs space-separated)
- Property stringification with options

### CSS Rules
- Nested CSS rule object formatting
- Both array-based and generator-based implementations
- Support for at-rules and media queries
- Property normalization (camelCase to kebab-case) with smart detection
- Deep rule manipulation (get/set at paths)
- Rule renaming and transformation

### CSS Selectors
- Selector alias expansion (mobile, tablet, dark, etc.)
- At-rule processing
- Responsive design utilities

### Utilities
- Case conversion (camelCase ↔ kebab-case)
- Object iteration with validation
- Type-safe key/value pair processing

## Performance Considerations

The package provides both array-based and generator-based implementations:

- **Array functions** (`formatCSSRules`, `formatCSSRulesArray`):
  - Convenient for small to medium CSS
  - Returns complete arrays
  - Good for immediate consumption

- **Generator functions** (`generateCSSRules`, `generateCSSRulesArray`):
  - Memory-efficient for large CSS generation
  - Lazy evaluation, yields lines as generated
  - Ideal for streaming responses or very large CSS files

Both implementations produce identical output and are tested together.

## Testing Guidelines

- Tests located in `src/__tests__/`
- Uses shared test utilities to verify both array and generator
  implementations produce identical results
- Focus on edge cases for CSS parsing and formatting
- Test various CSS property formats and nested structures
- Ensure type safety in all utilities
- Use `testBothImplementations` helper for dual testing

## Integration Notes

This package is used by:
- @poupe/theme-builder for CSS generation and server responses
- @poupe/tailwindcss for utility generation
- @poupe/vue for runtime CSS manipulation

## Build Output

Builds to both ESM and CJS formats:
- `dist/index.mjs` - ES modules
- `dist/index.cjs` - CommonJS
- `dist/index.d.ts` - TypeScript definitions

## Development Notes

- The array-based functions are implemented as wrappers around the
  generator functions to eliminate code duplication
- Generator functions are the source of truth for CSS formatting logic
- Property normalization via `normalizeProperties` option smartly detects
  CSS properties vs selectors/at-rules using the `mayNormalize()` helper
- All CSS property names are automatically converted between camelCase
  and kebab-case as needed
- Vendor prefixes (like `-webkit-`) are handled correctly in conversions
- At-rules (`@media`, `@keyframes`) and selectors (`.class`, `#id`) are
  never normalized to preserve their validity

## Property Normalization

The `normalizeProperties` option enables automatic camelCase to kebab-case
conversion for CSS properties while intelligently preserving selectors and at-rules:

**What gets normalized:**
- CSS properties: `fontSize` → `font-size`, `backgroundColor` → `background-color`
- Properties in all contexts: top-level, nested in selectors, nested in at-rules

**What stays unchanged:**
- At-rules: `@media (max-width: 768px)`, `@keyframes slideIn`, `@supports (display: grid)`
- CSS selectors: `.button`, `#header`, `:hover`, `body h1`
- Complex selectors with spaces: `nav ul li`

**Implementation:**
- Uses `mayNormalize(key: string): string` helper that returns either the original
  key or the kebab-case version based on context
- Applied in `generateCSSRules()` for all property types (strings, numbers, arrays)
- Seamlessly integrated with existing space vs comma-delimited property handling
