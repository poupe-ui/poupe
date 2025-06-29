# AGENT.md - @poupe/vue

This file provides package-specific guidance for the @poupe/vue package.
For general monorepo guidelines, see the [root AGENT.md](../../AGENT.md).

## Package Overview

@poupe/vue is a Vue 3 component library implementing Material Design 3
principles with TailwindCSS v4 integration. It provides accessible,
customizable UI components with full TypeScript support and auto-import
capabilities.

## Package-Specific Commands

In addition to [common commands](../../AGENT.md#common-commands-all-packages):

```bash
pnpm preview      # Preview built application (unique to @poupe/vue)
```

## Build Configuration

Unlike other packages that use `unbuild`, @poupe/vue uses **Vite** for
better Vue component handling:

- Library mode with four entry points:
  - `index`
  - `config`
  - `resolver`
  - `theme-scheme`
- Vue plugin with DevTools support
- TypeScript declarations via `vite-plugin-dts`
- TailwindCSS v4 integration via `@tailwindcss/vite`
- PostCSS with autoprefixer

## Package Structure

```text
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

- **Naming**: Components do NOT use prefixes in the source code
  - Component files: `button.vue`, `card.vue`, `navigation-rail.vue`
  - Export names: `Button`, `Card`, `NavigationRail`
  - The 'P' prefix is only added by @poupe/nuxt auto-import
- **Props**: Export both default export and typed props interface
- **TypeScript**: Use `defineProps` with proper types
- **Tests**: Include tests in colocated `__tests__` directory
- **Accessibility**: ARIA attributes and keyboard navigation are
  mandatory

### Styling System

- Use TailwindCSS v4 with @poupe/tailwindcss plugin
- Use `tailwind-variants` (tv) for complex component styling
- Prefer tailwind-variants over inline classes in templates
- Use surface utilities for background/text color pairing
- Use interactive-surface-* utilities for MD3 state layers
- Apply Material Design elevation shadows (z1-z5)

## Key Components

### Current Components

- **Button**: Material Design 3 button with interactive states
- **Card**: Content container with optional interactive states
- **Icon**: Icon wrapper component
- **Input**: Form input wrapper with interactive states
- **Placeholder**: Development placeholder component
- **Surface**: Base container component with MD3 surface variants
  - Supports both surface and container variants
  - Interactive states with proper state layers
  - Shape, shadow, border, and padding customization
  - Global defaults integration via usePoupe

### Theme Components (Separate Export)

- **PThemeScheme**: Theme color scheme visualization component
  - Exported via `@poupe/vue/theme-scheme`
  - Used for visualizing and debugging theme colors
  - Auto-imported by @poupe/nuxt module

### Story Components (Separate Export)

- **StoryViewer**: Main container for component documentation
  - Exported via `@poupe/vue/story-viewer`
  - Responsive sidebar navigation
  - Supports nested story structure
- **StorySection**: Content sections with title and description
- **StoryShowcase**: Flexible layout for displaying component variants

### Component Patterns

- Use slots for flexible content composition
- Implement variant props for different styles
- Support color prop with Material Design color tokens
- Provide proper TypeScript interfaces for props

### Using usePoupeMergedProps

Components should follow this pattern for merging props with defaults:

```typescript
// Define props without withDefaults
const directProps = defineProps<ComponentProps>();

// Define component defaults
const componentDefaults: Partial<ComponentProps> = {
  role: 'surface',
  variant: 'base',
  // ... other defaults
};

// Merge props with global defaults
const props = computed(() =>
  usePoupeMergedProps(directProps, 'componentName', componentDefaults),
);

// Use props.value in the template and computed properties
```

## Composables

### usePoupe

Global configuration and defaults composable:

- Provides centralized configuration for all Poupe components
- Supports theme settings (dark mode, custom colors)
- Accessibility options (reducedMotion, highContrast)
- Ripple effect configuration
- Integrates with Nuxt module via app.config.ts
- Uses provide/inject pattern for configuration distribution
- Components can augment the PoupeOptions interface for type safety
- Includes usePoupeMergedProps helper for three-level prop merging
- Extendable interface for component-specific defaults

### useRipple

Material Design ripple effect composable:

- Handles mouse and touch events to create ripple animations
- Configurable color, opacity, duration, and bounded behavior
- Automatically cleans up ripples after animation completes
- Integrates with the `.ripple-effect` utility from @poupe/tailwindcss
- Used by interactive components for tactile feedback

### usePasswordToggle

Password visibility toggle composable:

- Manages show/hide password state
- Provides appropriate icon based on visibility
- Returns reactive type attribute for input elements

### usePoupeIcons

Icon management composable:

- Provides access to Poupe's icon library
- Returns reactive icon definitions
- Used internally by components

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

- **Runtime**:
  - Workspace: @poupe/theme-builder, @poupe/tailwindcss
  - External:
  - vue
  - @iconify/vue
  - @unhead/vue
  - defu
  - reka-ui
  - tailwind-merge
  - tailwind-variants
  - tailwindcss
- **Development**: TypeScript, Vite, Vitest, ESLint, Vue Test Utils
- **Note**: See package.json for specific versions

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

5. **Screenshot helpers**:
   - `pnpm screenshot` - Manual screenshots (requires running dev server)
   - `pnpm screenshot:auto` - Automated screenshots with dev server management
   - Screenshots are saved in gitignored `screenshots/` directory
   - Supports dark mode, mobile viewport, and multiple screen sizes
   - **Custom screenshot tests**: Use `screenshot-core.ts` for advanced scenarios:

     ```typescript
     import {
       initializeScreenshot,
       navigateToComponent,
       captureScreenshot,
       cleanup,
     } from './screenshot-core';

     // Example: Take screenshot with custom interactions
     const context = await initializeScreenshot({ fullPage: true });
     await navigateToComponent(context, 'fab');
     // Perform custom actions with context.page
     await context.page.click('button[title="Show code"]');
     await captureScreenshot(context.page, 'custom-screenshot.png');
     await cleanup(context);
     ```

   - **Test scripts**:
     - `pnpm tsx src/scripts/test-expand-code.ts fab` - Screenshot with code
     - `pnpm tsx src/scripts/test-expand-code-auto.ts fab --all` - Auto + code

## Build Process

1. Vite compiles TypeScript and Vue components
2. Build outputs to `dist/` directory
3. Type definitions generated automatically
4. CSS assets bundled with components
5. Supports both ESM and CJS formats

## Package-Specific Guidelines

### DO (Package-Specific)

- Use the existing variant system for component variations
- Use semantic HTML and ARIA attributes appropriately
- Include tests in colocated `__tests__` directories
- Export both default and typed props for components

### DON'T (Package-Specific)

- Override Material Design principles without justification
- Skip accessibility requirements (ARIA, keyboard navigation)
- Create components without proper TypeScript interfaces

## Development Tools

### Screenshot Helpers

The package includes Playwright-based screenshot tools for capturing component states:

1. **Manual screenshots** (`pnpm screenshot`):
   - Requires dev server running separately
   - Usage: `pnpm screenshot [component] [filename] [options]`
   - Options: `--dark`, `--mobile`, `--full-page`, `--all-viewports`

2. **Automated screenshots** (`pnpm screenshot:auto`):
   - Automatically manages dev server lifecycle
   - Same options as manual tool
   - Perfect for CI/CD pipelines

3. **Custom screenshot tests**:
   - Use `screenshot-core.ts` module for advanced testing scenarios
   - Provides low-level APIs for browser control and screenshot capture
   - Example test scripts in `src/scripts/test-*.ts`

All screenshots are saved in the gitignored `screenshots/` directory.

#### Using screenshot-core for debugging

The `screenshot-core.ts` module exports reusable functions for creating custom
screenshot tests:

- `initializeScreenshot(options)` - Set up browser and page
- `navigateToComponent(context, component)` - Navigate to specific story
- `captureScreenshot(page, filename, options)` - Take and save screenshot
- `captureMultipleViewports(context, filename, options)` - Multi-viewport shots
- `cleanup(context)` - Clean up browser resources

This is useful for debugging visual issues that require specific interactions
before capturing.

#### Creating custom debug scripts for component issues

When debugging component interaction issues (e.g., click handlers, state management),
create temporary test scripts using the `screenshot-core` module:

```typescript
#!/usr/bin/env tsx
import {
  initializeScreenshot,
  navigateToComponent,
  captureScreenshot,
  cleanup,
} from './screenshot-core';

async function debugComponent() {
  const context = await initializeScreenshot({ fullPage: true });

  try {
    // Navigate to component story
    await navigateToComponent(context, 'component-name');
    // Or use direct navigation: await context.page.goto(`${context.baseUrl}#component-name`);

    // Find and interact with elements
    const element = await context.page.locator('[data-testid="element-id"]');
    await element.click();

    // Check state changes
    const isVisible = await element.isVisible();
    console.log('Element visible:', isVisible);

    // Capture screenshot
    await captureScreenshot(context.page, 'debug-screenshot.png');
  } finally {
    await cleanup(context);
  }
}

await debugComponent();
```

Common debugging patterns:

- **Click issues**: Check `pointer-events`, z-index, and overlapping elements
- **State management**: Verify v-model bindings and internal state sync
- **Visibility**: Use `isVisible()` and check computed styles
- **Automated testing**: Create `*-auto.ts` variants that manage dev server

Run debug scripts: `pnpm tsx src/scripts/test-[name].ts`
Clean up after debugging: Delete temporary test files when issue is resolved

## Story Components Best Practices

When working with the StoryViewer components:

1. **StoryRenderer**: Uses computed properties for proper reactivity
   - The `:is` directive accepts the computed `componentToRender` property
   - Handles both component definitions and render functions automatically.

2. **Creating Stories**: Use the utility functions from `story/utils.ts`
   - `createStory()` for individual component examples
   - `createStoryGroup()` for organizing related examples

3. **Interactive States**: All components should support MD3 state layers
   - Use `containerInteractiveVariants` for interactive components
   - Include hover, focus, pressed, and disabled states
   - Transition timing uses `--md-state-transition-duration` CSS variable

## Debugging

- **ESLint issues**: `DEBUG=eslint:eslint pnpm lint`
- **Type errors**: Check `tsconfig.json` settings
- **Build issues**: Run `pnpm clean` then rebuild
- **Test failures**: Use `--reporter=verbose` flag
- **Story viewer issues**: Check browser console for render errors
