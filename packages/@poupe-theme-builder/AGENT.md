# @poupe/theme-builder Package Agent Guidelines

## Build/Lint/Test Commands
- Build: `pnpm build`
- Type check: `pnpm type-check`
- Lint: `pnpm lint`
- Test: `pnpm test`
- Test watch mode: `pnpm dev`
- Development build (stub): `pnpm dev:prepare`
- Clean: `pnpm clean`
- Publish lint check: `pnpm publint`
- Full pre-publish check: `pnpm prepack`

## Code Style Guidelines (.editorconfig)
- Use UTF-8 charset
- Unix line endings (LF)
- Use spaces for indentation in TypeScript/JavaScript/JSON files (2 spaces)
- Use tabs for other files (8 spaces width)
- Always insert final newline
- Trim trailing whitespace
- Single quotes for strings
- Always use semicolons
- Use 1tbs (one true brace style)
- Use tsdoc for TypeScript/JavaScript comments
- Follow existing naming patterns (camelCase for variables/functions, PascalCase for types/interfaces)
- Keep lines shorter than 78 characters
- Only reference symbols and packages you know exist
- Use markdown reference variables for links in documentation

## Package Structure
```
src/
├── core/          # Core theme building functionality
├── css/           # Dynamic color CSS generation
├── server/        # Server-side utilities
├── theme/         # Theme definition and configuration
├── from-image.ts  # Theme extraction from images
└── index.ts       # Main entry point
```

## Exports
- **Main**: Theme builder with design token management
- **Core**: Core theme building functionality (`./core`)
- **Server**: Server-side utilities for theme generation (`./server`)

## Design Token System
- **Material Design 3**: Full Material Design 3 color system support
- **Dynamic Colors**: Generate themes from seed colors or images
- **CSS Variables**: Export design tokens as CSS custom properties
- **TypeScript Types**: Full type safety for theme definitions

## Color Management
- **@poupe/material-color-utilities**: Google's Material Design color algorithms
- **colord**: Advanced color manipulation and conversion
- **Dynamic Theme Generation**: Create cohesive color schemes from single seed colors
- **Image-based Themes**: Extract color palettes from source images

## Testing
- Unit tests in `src/__tests__/` directory
- Test theme generation, color utilities, and type safety
- Use Vitest for testing framework
- Run specific test: `pnpm vitest run src/path/to/file.test.ts`

## Dependencies
- **Runtime**: `@poupe/css`, `@poupe/material-color-utilities`, `colord`, `defu`, `type-fest`
- **Build**: TypeScript, Unbuild, Vitest, ESLint

## Common Tasks
1. **Adding new theme tokens**: Modify theme definitions → run `pnpm build`
2. **Color system updates**: Update Material Design utilities → test color generation
3. **Testing changes**: `pnpm dev` (watch mode) or `pnpm test` (single run)
4. **Type checking**: `pnpm type-check`
5. **Linting**: `pnpm lint` (auto-fixes issues)

## Build Process
1. Unbuild compiles TypeScript and bundles modules
2. Outputs: `dist/index.mjs`, `dist/core.mjs`, `dist/server.mjs`
3. Type definitions generated automatically
4. Sourcemaps included for debugging

## Development Notes
- Theme builder is framework-agnostic - works with any CSS-in-JS solution
- Supports both static and dynamic theme generation
- Integrates with Material Design 3 specification
- Server utilities for build-time theme generation
