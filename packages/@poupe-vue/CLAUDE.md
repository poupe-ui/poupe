# CLAUDE.md - @poupe/vue

This file provides package-specific guidance for the @poupe/vue package.
For general monorepo guidelines, see the [root CLAUDE.md](../../CLAUDE.md).

## Package Overview

@poupe/vue is a Vue 3 component library implementing Material Design 3
principles with TailwindCSS v4 integration. It provides accessible,
customizable UI components with full TypeScript support and auto-import
capabilities.

## Package-Specific Commands

In addition to [common commands](../../CLAUDE.md#common-commands-all-packages):

```bash
pnpm preview      # Preview built application (unique to @poupe/vue)
```

## Build Configuration

Unlike other packages that use `unbuild`, @poupe/vue uses **Vite** for
better Vue component handling:
- Library mode with three entry points: `index`, `config`, `resolver`
- Vue plugin with DevTools support
- TypeScript declarations via `vite-plugin-dts`
- TailwindCSS v4 integration via `@tailwindcss/vite`
- PostCSS with autoprefixer

## Package Structure

```
src/
├── __tests__/        # Package-level tests (resolver, etc.)
├── assets/           # CSS assets
│   └── css/         # Main CSS imports
├── components/       # Vue components
│   ├── __tests__/   # Component tests (colocated)
│   ├── input/       # Complex component modules
│   ├── theme/       # Theme-related components
│   │   └── scheme/  # Color scheme components
│   └── variants/    # Variant utility system
├── composables/      # Vue composables (use-*.ts)
├── utils/            # Utility functions
├── app.vue          # Demo application component
├── config.ts        # TailwindCSS config exports
├── index.ts         # Main library exports
├── main.ts          # Demo app entry point
└── resolver.ts      # Component auto-import resolver
```

## Component Development Guidelines

### Material Design 3 Principles
- All components follow Material Design 3 guidelines
- Use semantic color tokens (primary, secondary, tertiary, etc.)
- Implement tonal elevation for depth
- Support dynamic color themes

### Component Structure
- **Naming**: Components use 'P' prefix (e.g., PButton, PCard)
- **Props**: Export both default and typed props
- **TypeScript**: Use `defineProps` with proper types
- **Tests**: Include tests in colocated `__tests__` directory
- **Accessibility**: ARIA attributes and keyboard navigation are
  mandatory

### Styling System
- Use TailwindCSS v4 with @poupe/tailwindcss plugin
- Leverage the variant system for component variations
- Use surface utilities for background/text color pairing
- Apply Material Design elevation shadows (z1-z5)

## Key Components

### Current Components
- **PButton**: Material Design 3 button with multiple variants
- **PCard**: Content container with header/footer slots
- **PIcon**: Icon wrapper component
- **PInput**: Form input wrapper with label support
- **PPlaceholder**: Development placeholder component
- **PThemeScheme**: Theme color scheme provider

### Component Patterns
- Use slots for flexible content composition
- Implement variant props for different styles
- Support color prop with Material Design color tokens
- Provide proper TypeScript interfaces for props

## Integration Features

### Auto-import Support
- Export `PoupeResolver` for unplugin-vue-components
- Components are automatically importable without explicit
  imports
- Resolver handles 'P' prefix pattern matching

### TailwindCSS Configuration
- Export theme configuration via `@poupe/vue/config`
- Integrates with @poupe/tailwindcss plugin
- Provides consistent styling across projects

### Theme System
- Built on @poupe/theme-builder
- Reactive theme switching support
- Color scheme management components
- CSS variable-based theming

## Testing Guidelines

- Unit tests in `src/**/__tests__/` directories
- Test component rendering, props, and interactions
- Use Vitest with Vue Test Utils
- Run specific test: `pnpm vitest run src/path/to/file.test.ts`
- Maintain test coverage for all components

## Dependencies

- **Runtime**: `@poupe/theme-builder`, `vue`
- **Peer**: `vue@^3.5.13`
- **Development**: TypeScript, Vite, Vitest, ESLint, Vue Test
  Utils
- **Workspace**: Uses workspace protocol for internal dependencies

## Common Tasks

1. **Adding new component**: 
   - Create component in `src/components/`
   - Add tests in `src/components/__tests__/`
   - Export from `src/components/index.ts`
   - Update resolver if needed

2. **Updating theme integration**:
   - Modify theme components in `src/components/theme/`
   - Test with demo app (`pnpm dev`)
   
3. **Testing changes**:
   - `pnpm dev` for development with hot reload
   - `pnpm test` for test watch mode
   - `pnpm build` to verify production build

4. **Pre-release checks**:
   - `pnpm prepack` runs all validation steps
   - Ensures lint, type-check, test, and build pass

## Build Process

1. Vite compiles TypeScript and Vue components
2. Build outputs to `dist/` directory
3. Type definitions generated automatically
4. CSS assets bundled with components
5. Supports both ESM and CJS formats

## Important Notes

### DO:
- Run `pnpm lint` and `pnpm type-check` before committing
- Write tests for all new components
- Follow Material Design 3 guidelines
- Use the existing variant system for component variations
- Check existing components for patterns before creating new
  ones
- Use semantic HTML and ARIA attributes appropriately

### DON'T:
- Create new files unless necessary - prefer editing existing
  ones
- Use external libraries without checking if already available
- Ignore TypeScript errors or ESLint warnings
- Create documentation files unless explicitly requested
- Override Material Design principles without justification

## Debugging

- **ESLint issues**: `DEBUG=eslint:eslint pnpm lint`
- **Type errors**: Check `tsconfig.json` settings
- **Build issues**: Run `pnpm clean` then rebuild
- **Test failures**: Use `--reporter=verbose` flag

## Package-Specific Dependencies

- **Vue**: ^3.5.13 (peer dependency)
- **@poupe/theme-builder**: workspace:^ (runtime dependency)
- **TailwindCSS**: ^4.1 (for styling integration)
