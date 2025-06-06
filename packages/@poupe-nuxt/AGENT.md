# AGENT.md - @poupe/nuxt

This file provides package-specific guidance for the @poupe/nuxt package.
For general monorepo guidelines, see the [root AGENT.md](../../AGENT.md).

## Package Overview

@poupe/nuxt is a Nuxt module that provides seamless integration of the
Poupe UI Framework into Nuxt applications. It handles auto-imports, theme
configuration, color mode integration, and SSR support.

## Package Structure

```
src/
├── runtime/           # Runtime code (client & server)
│   ├── components/   # Nuxt-specific components
│   ├── composables/  # Nuxt composables
│   └── plugins/      # Nuxt plugins
├── module.ts         # Main module definition
├── types.ts          # TypeScript definitions
└── utils.ts          # Module utilities

playground/           # Development playground
├── app.vue          # Root application component (uses NuxtPage)
├── nuxt.config.ts   # Playground config
├── pages/           # Application pages
│   ├── index.vue    # Home page
│   └── stories.vue  # Stories viewer page
├── components/      # Playground components
│   ├── story-viewer.vue # Component stories viewer
│   └── story-compat.ts  # Story/Variant compatibility components
├── plugins/         # Nuxt plugins
│   └── story-components.client.ts # Register story components
└── public/          # Static assets
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
pnpm dev          # Start playground dev server
```

### Stories Viewer

The playground includes a built-in stories viewer to showcase and test all Poupe UI components:
- Navigate to `/stories` to view all components from @poupe/vue
- Browse components in the sidebar
- View different variants and states of each component
- No external dependencies required

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
- Check hydration mismatches in browser console