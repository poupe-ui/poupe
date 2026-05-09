# AGENTS.md - @poupe/rolldown-vue-css

This file provides package-specific guidance for the
@poupe/rolldown-vue-css package. For general monorepo
guidelines, see the [root AGENTS.md](../../AGENTS.md).

## Package Overview

A [Rolldown](https://rolldown.rs) plugin that emits each Vue
SFC `<style>` block as a per-component CSS build asset and
rewrites the per-component output module to side-effect import
that asset. CSP-clean by construction — no runtime
`<style>` injection.

Runtime style-tag injection is classed as inline-style by the
browser and is blocked under strict `style-src` CSP. Emitting
build-time assets and deferring CSS handling to the consumer's
bundler avoids the issue entirely.

## Package Structure

```text
src/
├── __tests__/        # Unit tests
│   └── index.test.ts
└── index.ts          # Plugin factory and public types
```

## Public API

- `vueCSS(options?)` — named export. Returns a Rolldown
  `Plugin`.
- `VueCSSOptions` — option type. The only field is `specifier`,
  a function `(cssFileName: string) => string` that maps each
  emitted CSS asset's filename (relative to the output dir) to
  the import specifier the chunk references. Defaults to
  `./<basename>` — see *Specifier choice* below.

The public name uses upper-case `CSS` (acronym), matching the
spec usage; lower-case `Css` is not a word.

## Status

Initial implementation. The plugin emits per-component CSS
files next to their `.mjs` chunks and rewrites those chunks to
side-effect import the CSS asset.

## How it works

A `buildStart` hook resets the per-invocation Maps so re-runs
(watch mode, sequential bundles in one process) do not carry
state from the previous build. The asset emission itself runs
in three phases:

1. **`transform`** matches virtual modules whose id matches the
   `?vue&type=style` contract `unplugin-vue` emits, captures the
   CSS source against the virtual id in a closure-scoped Map,
   and returns an empty `js` module so the import becomes a
   no-op in the bundled chunk. `moduleType: 'js'` is forced
   because the virtual id ends in `lang.css`, which would
   otherwise route through Rolldown's removed CSS pipeline.

2. **`renderChunk`** walks each chunk's `moduleIds`, gathers
   captured CSS blocks for modules in that chunk, queues a write
   of a sibling `.css` file whose path mirrors the chunk's
   `.mjs` path, and prepends a side-effect import (specifier
   resolved by `options.specifier`) to the chunk so the
   consumer's bundler resolves the asset via standard CSS
   import handling.

3. **`writeBundle`** flushes the queued CSS files to disk via
   `fs.writeFile`. This bypasses Rolldown's asset pipeline,
   which routes any `.css` filename given to `emitFile` into
   its removed CSS pipeline and aborts under #4271.

Rolldown removed CSS-as-import handling
([rolldown/rolldown#4271](https://github.com/rolldown/rolldown/issues/4271)),
so the plugin cannot ask Rolldown to resolve a `.css` import
itself. The three-phase split is required: phase one captures
the CSS bytes; phase two queues the side-effect import; phase
three writes the asset bytes to disk after the chunks are
emitted.

## Specifier choice

The default specifier is `./<basename(cssFileName)>` — works
with most downstream bundlers (Vite, webpack, Rsbuild) but
**fails when the chunks are themselves re-bundled by another
Rolldown without a CSS plugin**. The most common case in this
monorepo is `obuild`'s post-build `distSize` measurement, which
calls `rolldown(...)` with `external: id => id[0] !== '.'` —
relative `.css` imports stay internal and the second Rolldown
errors on them.

For Rolldown-based pipelines (anything obuild-driven), pass a
specifier that produces a bare module path resolvable via the
package's own `exports` field, e.g.

```ts
vueCSS({ specifier: (css) => `@poupe/vue/styles/${css}` })
```

paired with `"./styles/*.css": "./dist/*.css"` in the
package's `exports`. Bare specifiers are externalised by
`distSize` and resolved by consumer bundlers via package self-
reference.

## Diagnostics

Build-time warnings and errors use
[`consola`](https://github.com/unjs/consola) directly
(`consola.warn(...)`, `consola.error(...)`) — no DEV gate, no
`tryWarn`-style wrapper. The plugin runs only at build time,
so warnings should always surface; the runtime DEV gating that
`@poupe/vue/utils.tryWarn` applies to browser code is
unnecessary here.

## Testing Guidelines

- Tests live in `src/__tests__/`.
- The plugin's behaviour is best exercised end-to-end through a
  real Rolldown bundle of a synthetic SFC; surface-only tests
  catch typos but not regressions in the asset/import handshake.

## Build Output

```text
dist/index.mjs    # ES module
dist/index.d.mts  # TypeScript definitions
```
