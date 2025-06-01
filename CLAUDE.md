# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working
with code in the Poupe UI Framework monorepo.

## Project Overview

Poupe UI Framework is a comprehensive Material Design 3 implementation
providing:
- CSS utilities and property manipulation (@poupe/css)
- Design token generation and theme management (@poupe/theme-builder)
- TailwindCSS v4 integration (@poupe/tailwindcss)
- Vue 3 component library (@poupe/vue)
- Nuxt module for seamless integration (@poupe/nuxt)

## Monorepo Structure

```
poupe/
├── packages/
│   ├── @poupe-css/           # CSS utilities library
│   ├── @poupe-nuxt/          # Nuxt module
│   │   └── playground/       # Nuxt development playground
│   ├── @poupe-tailwindcss/   # TailwindCSS v4 plugin
│   ├── @poupe-theme-builder/ # Theme token generation
│   └── @poupe-vue/           # Vue 3 components
├── scripts/                  # Build and utility scripts
├── test/                     # Root-level test utilities
├── pnpm-workspace.yaml       # Workspace configuration
└── vitest.workspace.ts       # Test configuration
```

## Common Commands (All Packages)

**Development:**
```bash
pnpm dev          # Start development mode (watch for changes)
pnpm build        # Build the package
pnpm test         # Run tests (watch mode in most packages)
pnpm clean        # Remove dist/ and node_modules/
```

**Code Quality:**
```bash
pnpm lint         # Run ESLint with auto-fix
pnpm type-check   # Check TypeScript types
pnpm prepack      # Full validation (lint, type-check, test, build, publint)
pnpm publint      # Check package publishing configuration
```

**Debugging:**
```bash
DEBUG=eslint:eslint pnpm lint    # Debug ESLint issues
```

**Monorepo Root Commands:**
```bash
pnpm build        # Build all packages
pnpm clean        # Clean all packages
pnpm lint         # Lint all packages
```

## Code Style Guidelines

All packages follow these conventions (enforced by .editorconfig and
ESLint):

- **Indentation**: 2 spaces for TypeScript/JavaScript/CSS/JSON
- **Line Endings**: Unix (LF)
- **Charset**: UTF-8
- **Quotes**: Single quotes for strings
- **Semicolons**: Always use semicolons
- **Brace Style**: 1tbs (one true brace style)
- **Arrow Functions**: Always use parentheses
- **Line Length**: Max 78 characters preferred
- **Comments**: Use TSDoc format for documentation
- **Module System**: ES modules (`type: "module"`)
- **Naming**: camelCase for variables/functions, PascalCase for
  types/interfaces
- **Final Newline**: Always insert
- **Trailing Whitespace**: Always trim

## Development Practices

### DO:
- Use workspace protocol (`workspace:^`) for internal dependencies
- Run `pnpm lint` and `pnpm type-check` before committing
- Write tests for all new functionality
- Follow Material Design 3 principles throughout
- Check existing code patterns before creating new ones
- Use semantic versioning for releases
- Keep packages focused on their specific purpose

### DON'T:
- Create files unless necessary - prefer editing existing ones
- Add external dependencies without careful consideration
- Ignore TypeScript errors or ESLint warnings
- Create documentation files unless explicitly requested
- Mix concerns between packages
- Use relative imports between packages (use workspace deps)

## Workspace Dependencies

When referencing other packages in the monorepo:
```json
{
  "dependencies": {
    "@poupe/css": "workspace:^"
  }
}
```

## Testing Guidelines

- All packages use Vitest for testing
- Test files: `*.test.ts` or `*.spec.ts`
- Tests located in `__tests__/` directories or colocated with source
- Run specific test: `pnpm vitest run path/to/test.ts`
- Coverage reports available via Vitest

## Build Systems

- **unbuild**: Used by @poupe/css, @poupe/theme-builder,
  @poupe/tailwindcss, @poupe/nuxt
- **vite**: Used by @poupe/vue for better Vue component handling

## Common Dependencies

- **TypeScript**: ~5.7.2 (strict mode enabled)
- **Vitest**: ^2.1.8 for testing
- **ESLint**: Via @poupe/eslint-config
- **Node.js**: >=20.19.2
- **pnpm**: >=10.10.0

## Material Design 3 Principles

All packages work together to implement Material Design 3:
- Dynamic color system with theme tokens
- Tonal elevation for depth perception
- Accessibility-first approach
- Responsive design patterns
- Consistent motion and interaction

## Package-Specific Guidelines

Each package has its own CLAUDE.md file with specific details:
- `packages/@poupe-css/CLAUDE.md` - CSS utilities specifics
- `packages/@poupe-theme-builder/CLAUDE.md` - Theme generation
  details
- `packages/@poupe-tailwindcss/CLAUDE.md` - TailwindCSS integration
- `packages/@poupe-vue/CLAUDE.md` - Vue component development
- `packages/@poupe-nuxt/CLAUDE.md` - Nuxt module configuration

Always check the package-specific CLAUDE.md for detailed guidance.

## Debugging Tips

1. **Build Issues**: Run `pnpm clean` then `pnpm build`
2. **Type Errors**: Check `tsconfig.json` references
3. **Test Failures**: Use `--reporter=verbose` flag
4. **Dependency Issues**: Verify workspace links with `pnpm list`
5. **ESLint Problems**: Use `DEBUG=eslint:eslint pnpm lint`

## Release Process

1. Run `pnpm prepack` in the package directory
2. Ensure all tests pass
3. Update version in package.json
4. Build and publish to npm

## Important Notes

- This is a monorepo managed by pnpm workspaces
- All packages are published independently to npm
- Maintain backwards compatibility within major versions
- Follow semantic versioning strictly
- Keep the public API surface minimal and well-documented
