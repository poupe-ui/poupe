# Poupe UI Framework Agent Guidelines

## Build/Lint/Test Commands
- Build: `pnpm build`
- Type check: `pnpm type-check`
- Lint: `pnpm lint`
- Test: `pnpm test`
- Run single test: `pnpm vitest run src/path/to/file.test.ts`
- Test watch mode: `pnpm dev`
- Test watch mode (Nuxt): `pnpm test:watch`
- Clean: `pnpm clean`

## Code Style Guidelines
- Use 2-space indentation for TypeScript/JavaScript files
- Use single quotes for strings
- Always use semicolons
- Use 1tbs (one true brace style)
- Type definitions should not use delimiters in multiline definitions
- Imports should be grouped with related imports in the same block
- Arrow functions require parentheses
- Use strict TypeScript mode with proper type annotations
- use tsdoc for Typescript/Javascript comments
- Consistently use ES modules (type: module)
- Follow existing naming patterns (camelCase for variables/functions, PascalCase for types/interfaces)
- Vue components use Vue 3 composition API
- Use workspace dependencies with `workspace:^` version specifier
- Use vitest for Typescript/JavaScript tests
- Keep lines shorted than 78 characters
- Only reference symbols and packages you know exist
