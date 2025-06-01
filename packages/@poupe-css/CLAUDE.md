# CLAUDE.md - @poupe/css

This file provides package-specific guidance for the @poupe/css package.
For general monorepo guidelines, see the [root CLAUDE.md](../../CLAUDE.md).

## Package Overview

@poupe/css is a TypeScript utility library for CSS property manipulation
and formatting. It provides type-safe CSS property parsing, formatting,
and conversion utilities that form the foundation for other Poupe UI
packages.

## Package Structure

```
src/
├── __tests__/        # Unit tests
├── index.ts          # Main exports
├── format.ts         # CSS formatting utilities
├── types.ts          # TypeScript type definitions
└── parse.ts          # CSS parsing utilities
```

## Key Features

- **Type-safe CSS properties**: Full TypeScript support for CSS property
  names and values
- **Property parsing**: Parse CSS property strings into structured data
- **Property formatting**: Convert structured data back to CSS strings
- **Unit conversions**: Handle CSS unit conversions and calculations
- **No runtime dependencies**: Lightweight utility library

## API Overview

The package exports utilities for:
- CSS property name validation and normalization
- CSS value parsing and validation
- CSS unit detection and conversion
- CSS color format handling
- CSS shorthand property expansion

## Testing Guidelines

- Tests located in `src/__tests__/`
- Focus on edge cases for CSS parsing
- Test various CSS property formats
- Ensure type safety in all utilities

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
