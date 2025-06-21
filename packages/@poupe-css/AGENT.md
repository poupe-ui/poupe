# AGENT.md - @poupe/css

This file provides package-specific guidance for the @poupe/css package.
For general monorepo guidelines, see the [root AGENT.md](../../AGENT.md).

## Package Overview

@poupe/css is a TypeScript utility library for CSS property manipulation
and formatting. It provides type-safe CSS property parsing, formatting,
and conversion utilities that form the foundation for other Poupe UI
packages.

## Package Structure

```text
src/
├── __tests__/        # Unit tests
│   ├── properties.test.ts
│   ├── rules.test.ts
│   ├── selectors.test.ts
│   └── utils.test.ts
├── index.ts          # Main exports
├── properties.ts     # CSS property utilities
├── rules.ts          # CSS rules formatting
├── selectors.ts      # CSS selector processing
└── utils.ts          # Utility functions
```

## Key Features

- **Type-safe CSS properties**: Full TypeScript support for CSS property
  names and values
- **CSS rules formatting**: Format nested CSS rule objects with proper
  indentation
- **Memory-efficient generators**: Generator functions for large CSS files
- **Property parsing**: Parse CSS property strings into structured data
- **Property formatting**: Convert structured data back to CSS strings
- **Unit conversions**: Handle CSS unit conversions and calculations
- **Minimal dependencies**: Only uses `defu` for deep merging

## API Overview

The package exports utilities for:

- CSS property manipulation and formatting
- CSS rules and nested object formatting
- CSS selector processing and expansion
- CSS unit conversions and calculations
- Case conversion (camelCase ↔ kebab-case)
- Type-safe CSS value handling
- Property name normalization (camelCase to kebab-case) with intelligent
  preservation of selectors and at-rules

## Performance Considerations

The package provides both array-based and generator-based implementations:

- **Array functions** (`formatCSSRules`, `formatCSSRulesArray`):
  - Convenient for small to medium CSS
  - Returns complete arrays
  - Good for immediate consumption

- **Generator functions** (`generateCSSRules`, `generateCSSRulesArray`):
  - Memory-efficient for large CSS generation
  - Lazy evaluation, yields lines as generated
  - Ideal for streaming or writing large CSS files

Both implementations produce identical output and the array functions use
generators internally.

## Testing Guidelines

- Tests located in `src/__tests__/`
- Focus on edge cases for CSS parsing
- Test various CSS property formats
- Ensure type safety in all utilities
- Verify array and generator functions produce identical output

## Integration Notes

This package is used by:

- @poupe/theme-builder for CSS generation
- @poupe/tailwindcss for utility generation
- @poupe/vue for runtime CSS manipulation

## Build Output

Builds to both ESM and CJS formats:

- `dist/index.mjs` - ES modules
- `dist/index.cjs` - CommonJS
- `dist/index.d.ts` - TypeScript definitions
