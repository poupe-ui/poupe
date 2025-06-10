# AGENT.md - @poupe/nuxt

This file provides package-specific guidance for the @poupe/nuxt package.
For general monorepo guidelines, see the [root AGENT.md](../../AGENT.md).

## Package Overview

@poupe/nuxt is a Nuxt module that provides seamless integration of the
Poupe UI Framework into Nuxt applications. It handles auto-imports, theme
configuration, color mode integration, and SSR support.

## Package Structure

```text
src/
├── runtime/           # Runtime code (client & server)
│   ├── components/   # Nuxt-specific components
│   ├── composables/  # Nuxt composables
│   └── plugins/      # Nuxt plugins
├── module.ts         # Main module definition
├── types.ts          # TypeScript definitions
└── utils.ts          # Module utilities

playground/           # Development playground
├── app.vue          # Test application
├── nuxt.config.ts   # Playground config
└── pages/           # Test pages
```

## Key Features

- **Auto-imports**: Automatic component and composable imports
- **Color mode**: Integration with @nuxtjs/color-mode
- **SSR support**: Full server-side rendering compatibility
- **Theme persistence**: Theme state management across routes
- **Type safety**: Full TypeScript support with proper types

## Module Configuration

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@poupe/nuxt'],
  
  poupe: {
    // Auto-import components
    components: true,
    
    // Auto-import composables
    composables: true,
    
    // Component prefix (default: 'P')
    prefix: 'P',
    
    // Theme configuration
    theme: {
      defaultMode: 'light',
      colors: {
        primary: '#1976d2'
      }
    }
  }
})
```

## Development with Playground

The playground provides a full Nuxt app for testing:

```bash
cd playground
pnpm dev  # Start playground dev server
```

## Module Hooks

The module provides several Nuxt hooks:
- `poupe:config` - Modify Poupe configuration
- `poupe:theme` - Modify theme before generation
- `poupe:ready` - Module fully initialized

## Runtime Features

### Composables
- `usePoupeTheme()` - Access and modify theme
- `usePoupeColors()` - Get current color scheme
- `usePoupe()` - Main configuration composable

### Components
- Extends all @poupe/vue components
- Adds Nuxt-specific features (lazy loading, etc.)

## Testing Guidelines

- Test SSR compatibility
- Verify auto-imports work correctly
- Test color mode integration
- Ensure hydration works properly
- Test with different Nuxt configurations

## Dependencies

- **Runtime**:
  - Workspace: @poupe/css, @poupe/tailwindcss, @poupe/theme-builder, @poupe/vue
  - External: @nuxt/icon, @nuxtjs/color-mode, @tailwindcss/vite, tailwindcss
- **Development**: Nuxt 3.x, TypeScript, Vitest
- **Note**: See package.json for specific versions

## Integration Notes

- Requires Nuxt 3.x
- Integrates with @nuxtjs/color-mode
- Uses @poupe/vue components
- Supports Nuxt's nitro server

## Build Output

Module package includes:
- CommonJS module for Nuxt
- ESM runtime code
- TypeScript definitions
- Module templates

## Debugging Tips

- Check `.nuxt/poupe/` for generated files
- Use Nuxt DevTools to inspect module state
- Enable module debug mode in nuxt.config
- Check hydration mismatches in the browser console
