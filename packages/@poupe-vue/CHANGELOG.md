# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.6.4] - 2026-05-25

### Fixed

- Button clicks are no longer swallowed by the
  `.ripple-effect` utility's `pointer-events: none`. The
  class belongs on the ripple particle `<span>`s, not the
  Button host. `useRipple` was also bound to a
  `display: contents` wrapper instead of the real
  `<button>`, so its inline-style mutations were no-ops
  and particles never rendered. Surface now exposes its
  rendered root via `defineExpose({ rootElement })`; Button
  forwards a template ref to Surface, binds `useRipple` to
  the actual `<button>`, renders the particles as direct
  children, and drops the ghost wrapper.

## [0.6.3] - 2026-05-23

### Fixed

- `createPoupe()` and `usePoupe()` now share a single
  `poupeInjectionKey` identity across the package's
  subpath entries. obuild's per-audience bundling previously
  inlined `Symbol('poupe')` into every subpath, so
  components from `.` injected one Symbol while
  composables from `./composables` provided a
  different one — `inject()` missed and `usePoupe()`
  returned `undefined` even when the plugin was
  installed. Composables are now emitted as a
  `type: 'transform'` entry (file-by-file under
  `dist/composables/`); a rolldown plugin externalises
  every `./composables` / `../composables` runtime
  import to the bare specifier
  `@poupe/vue/composables[/<rest>]`, resolved
  identically from any output location via the
  package's own `exports` map. Same shape collapses
  the duplicated `PoupeComponentDefaults` declaration
  across audience `.d.mts` files.

### Added

- `./composables/*` subpath in `exports` so the
  externalised composables specifiers resolve at
  consumer side. Also gives consumers a direct entry
  point to specific composables.

### Changed

- Composables (`useIcons`, `usePassword`, `usePoupe`,
  `useRipple`) declare explicit return types — the
  `--isolatedDeclarations` floor oxc-transform's dts
  pipeline enforces. The composables' return shapes
  and `useRipple`'s `Ripple` interface are part of
  the public surface as a result.
- `unplugin-vue-components` moves to `peerDependencies`
  (`^28.0.0`) with `optional: true`, mirroring the
  existing `vue-router` shape. The type-only import
  in `src/resolver/index.ts` leaks into the public
  `dist/resolver/index.d.mts` surface; a
  devDependency-only placement made the type
  unresolvable for consumers who installed only
  `@poupe/vue`. The devDependency entry stays for
  local type-check/build/test.

### Internal

- Drop the explicit
  `external: ['unplugin-vue-components']` line from
  `build.config.ts`. obuild's auto-external from
  `peerDependencies` now covers it.

### Dependencies

- `tailwindcss` peer `^4.1.11 → ^4.3.0`;
  `@tailwindcss/vite` devDep `^4.1.11 → ^4.3.0`.
- `vite` devDep `^6.4.2 → ^8.0.14`. `unplugin-vue@7.2`
  pulls vite 8 internally, so keeping vite on `^6.4.2`
  left the workspace with two vite versions and a
  plugin-shape mismatch in `vitest.config.ts`.
- `vitest` devDep `^3.2.4 → ^4.1.7`.

## [0.6.2] - 2026-05-13

### Fixed

- Declare `@poupe/css` and `vue-router` in `package.json`.
  `@poupe/css` is called at runtime; `vue-router` is consumed
  as a type by the story-viewer component. Both were satisfied
  by the workspace's `shamefully-hoist` flag but missing from
  the manifest. `@poupe/css` joins `dependencies` as
  `workspace:^`; `vue-router` joins `devDependencies` and
  `peerDependencies` as `^4.0.0` with
  `peerDependenciesMeta.optional = true`.
- Resolve `contentPath()`'s package directory through
  `node:url`'s `fileURLToPath` + `pathe.dirname`. The previous
  form (`dirname(new URL(import.meta.url).pathname)`) left a
  leading slash before drive letters on Windows (`/C:/...`),
  breaking `contentGlobs()` for consumers who pasted it into a
  tailwindcss `content` config.

### Dependencies

- Add `obuild`, `unplugin-vue`, `@kagal/cross-test`,
  `@poupe/rolldown-vue-css`, `@tailwindcss/vite`.
- Drop `@vitejs/plugin-vue`, `vite-plugin-dts`,
  `vite-plugin-vue-devtools`, `autoprefixer`,
  `@tailwindcss/postcss`, `pathe`.

### Internal

- Migrate build pipeline from vite to obuild + rolldown,
  aligning @poupe/vue with the rest of the workspace. Vue
  SFC `<style>` blocks emit as sibling `.css` files
  alongside each audience's chunk; the chunks auto-import
  their stylesheet via bare specifier
  (`@poupe/vue/<aud>/index.css`). Public exports unchanged;
  dist layout moves to per-subpath nested
  (`dist/<aud>/index.mjs`).
- Add re-export bridges (`src/theme-scheme/index.ts`,
  `src/story-viewer/index.ts`) so obuild's
  source-mirrors-dist distName algorithm produces the
  existing audience shape.
- Rewrite `tryWarn` to narrow `import.meta.env` via a
  local type — downstream type-check passes (e.g.
  @poupe/nuxt's) no longer need vite's ambient
  augmentation just to read the DEV gate.
- Switch two SFC `@/composables/*` aliased imports
  (`icon.vue`, `input/wrapper.vue`) to relative paths;
  rolldown doesn't read tsconfig `paths`, so the alias is
  now type-only.
- Dev server uses `unplugin-vue/vite` to match the
  build-side SFC parser; `vitest.config.ts` is stand-alone
  (no longer merging vite's library config).

## [0.6.1] - 2026-05-10

### Fixed

- Guard empty `TouchList` in `useRipple` so multi-touch end
  events don't throw.
- Scan component entry points in `contentGlobs` so consumers
  receive the full utility set.
- Install `createPoupe()` in the dev playground main.ts
  (dev-only).
- Unblock workspace `dev:prepare` jiti chain.

### Changed

- Tighten button size-class types via `ButtonSize`.
- Bind the dev playground to `0.0.0.0`.

### Dependencies

- vue ^3.5.34, @iconify/vue ^5.0.1, @iconify-json/material-symbols
  ^1.2.71, @unhead/vue ^2.1.15, @vueuse/core ^13.9.0,
  tailwind-merge ^3.5.0, tailwindcss ^4.1.11.
- TypeScript 6.0.3, vue-tsc 3.2.8, vitest 3.2.4, eslint 9.39.4,
  @poupe/eslint-config ~0.9.1.

### Internal

- Replace screenshot-capture tooling with the chrome-devtools-mcp
  loop (developer workflow only).
- Workspace cspell pipeline.
- Standardised precommit/prepack/clean scripts and `prepare` hook.

## [0.6.0] - 2025-06-20

### Added

#### New Components

- **PSurface**: Base container component with Material Design 3 surface and
    container variants
  - Surface variants: all MD3 surface colors from dim to container-highest
  - Container variants: primary, secondary, tertiary, error
  - Shape system integration with size aliases and explicit variants
  - Interactive states with proper state layers
  - Shadow, border, and padding variants
  - Global defaults integration via usePoupe

- **PCard**: Material Design 3 card component built on PSurface
  - Convenience props for surface and container colors
  - Built-in header and footer slots
  - Title prop for quick card headers
  - Inherits all PSurface capabilities

#### New Composables

- **usePoupe**: Global configuration and defaults management
  - Provides app-wide component defaults via Vue's provide/inject
  - Supports theme configuration (dark mode, custom colors)
  - Accessibility options (reducedMotion, highContrast)
  - Ripple effect configuration
  - Extendable interface for component-specific defaults
  - Helper function `usePoupeMergedProps` for three-level prop merging
      (global < component < props)

- **useRipple**: Material Design ripple effect implementation
  - Handles mouse and touch events to create ripple animations
  - Configurable colour, opacity, duration, and bounded behaviour
  - Automatically cleans up ripples after animation completes
  - Integrates with the `.ripple-effect` utility from @poupe/tailwindcss

#### New Utilities

- **tryWarn**: Safe console warning utility for development mode
  - Only logs warnings in development
  - Prevents eslint no-undef errors
  - Guards against missing console.warn

#### Export Structure

- Created separate entry points for better tree-shaking:
  - `@poupe/vue/composables` - All composables
  - `@poupe/vue/components` - All components (re-export from main)

### Changed

#### PButton Component

- Complete refactor with Material Design 3 semantics
- New button types: text, outlined, filled, elevated, tonal
- Semantic color variants: base, primary, secondary, tertiary, error
- FAB (Floating Action Button) support with extended mode
- Icon button mode for icon-only buttons
- Toggle button capability with pressed state
- Leading and trailing icon support
- Improved size system with xs, sm, base, lg, xl
- Ripple effect integration
- Better prop organization and TypeScript interfaces

### Fixed

- Story viewer test slot props now have proper TypeScript types

### Developer Experience

- Added shared `mountWithPoupe` test utility for consistent component testing
- All component tests migrated to use the new test helper
- Improved type safety across all components
- Module augmentation for component defaults

### Internal

- Refactored all components to eliminate `withDefaults` usage
- Single source of truth for component defaults
- Improved prop naming: `directProps` for raw props, `props` for merged values
- Consistent three-level prop merging pattern across all components

## [0.5.5] - Previous Release

_Previous changelog entries..._
