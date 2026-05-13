# @poupe/rolldown-vue-css

[![jsDocs.io][jsdocs-badge]][jsdocs-url]
[![npm version][npm-badge]][npm-url]
[![License: MIT][license-badge]][license-url]

A [Rolldown](https://rolldown.rs) plugin that emits each Vue
SFC `<style>` block as a per-component CSS build asset, so
consumer bundlers handle the styles via standard CSS imports
instead of runtime `<style>` injection.

## Table of Contents

- [Features](#features)
- [Why](#why)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Integration with Poupe Ecosystem](#integration-with-poupe-ecosystem)
- [Requirements](#requirements)
- [Licence](#licence)

## Features

- 🛡️ CSP-safe: emits SFC `<style>` blocks as real `.css` assets
  instead of runtime `<style>` injection
- 📦 Per-component CSS file alongside each `.mjs` chunk; consumer
  bundlers (Vite, webpack, Rsbuild, Nuxt) treat it like any
  imported stylesheet
- 🔗 Configurable import specifier — defaults to `./<basename>`,
  override for package self-reference when chunks are re-bundled
  by another rolldown (e.g. `obuild`'s `distSize`)
- ⚙️ Three-phase plugin lifecycle (`transform`, `renderChunk`,
  `writeBundle`) — no asset emit, sidesteps rolldown's removed
  CSS pipeline (rolldown/rolldown#4271)
- 🧪 Unit tests cover the plugin hooks and multi-instance
  isolation

## Why

The `unplugin-vue` Rolldown adapter compiles each Vue SFC into a
JavaScript module that imports its `<style>` blocks as
`?vue&type=style&lang.css` virtual modules. Without a CSS
pipeline, Rolldown can't process those modules; the
straightforward workaround is to inline the CSS as a string and
inject it into `document.head` at runtime — but that triggers
strict `style-src` Content Security Policy violations and
silently breaks consumers that hardened their CSP.

`@poupe/rolldown-vue-css` solves this without weakening CSP:

- Emits each `<style>` block as a real `.css` asset alongside
  the per-component `.mjs` output.
- Rewrites the per-component module to side-effect import that
  asset.
- Lets the consumer's bundler (Vite, webpack, Rsbuild, Nuxt…)
  handle the CSS the way it handles every other CSS dependency.

## Installation

```bash
# npm
npm install -D @poupe/rolldown-vue-css

# yarn
yarn add -D @poupe/rolldown-vue-css

# pnpm
pnpm add -D @poupe/rolldown-vue-css
```

## Usage

```ts
import { defineBuildConfig } from 'obuild/config';
import VueRolldown from 'unplugin-vue/rolldown';
import { vueCSS } from '@poupe/rolldown-vue-css';

export default defineBuildConfig({
  entries: [
    {
      type: 'bundle',
      input: ['./src/components/button.vue', './src/index.ts'],
      rolldown: {
        plugins: [
          VueRolldown(),
          vueCSS({
            specifier: (css) => `@your/pkg/styles/${css}`,
          }),
        ],
      },
    },
  ],
});
```

The `specifier` controls the import path written into each
chunk. With the configuration above, `dist/components/button.mjs`
gains an `import "@your/pkg/styles/components/button.css";`
line at the top, and the file `dist/components/button.css` is
written next to it. Pair the plugin with a matching entry in
your package's `exports`:

```jsonc
{
  "exports": {
    "./styles/*.css": "./dist/*.css"
  }
}
```

so consumer bundlers (and rolldown's own re-bundle pass that
`obuild` runs for size measurement) resolve the import via
package self-reference.

## API

### `vueCSS(options?)`

Returns a Rolldown `Plugin`. Wire it after `unplugin-vue/rolldown`
(or whichever Vue SFC adapter you use); it intercepts the
`?vue&type=style&lang.css` virtual modules the adapter emits,
accumulates their CSS, writes a sibling `.css` file for each
chunk in `writeBundle`, and prepends a side-effect import at
the top of the chunk.

### Options

- **`specifier?: Specifier`** — a
  `(cssFileName: string) => string` function that maps a CSS
  asset's filename (relative to the output dir) to the module
  specifier that goes into the `import` statement. Defaults to
  `./<basename(cssFileName)>`. The `Specifier` type is exported
  for callers who want to name their own implementations.

  The default is suitable for downstream bundlers (Vite,
  webpack, Rsbuild) but **fails when the produced chunks are
  themselves re-bundled by another Rolldown without a CSS
  plugin** — most notably `obuild`'s post-build size
  measurement. For Rolldown-based pipelines, return a bare
  specifier that resolves via your package's `exports`, as
  shown above.

## Integration with Poupe Ecosystem

- [@poupe/css](../@poupe-css) - CSS utility library
- [@poupe/theme-builder](../@poupe-theme-builder) - Design tokens generation
- [@poupe/tailwindcss](../@poupe-tailwindcss) - TailwindCSS integration
- [@poupe/vue](../@poupe-vue) - Vue components library (primary consumer)
- [@poupe/nuxt](../@poupe-nuxt) - Nuxt integration

## Requirements

- Node.js >=20.19.2
- pnpm >=10.33.0
- rolldown 1.x (peer dependency)

## Licence

MIT licensed. See [LICENCE.txt](../../LICENCE.txt).

[jsdocs-badge]: https://img.shields.io/badge/jsDocs.io-reference-blue
[jsdocs-url]: https://www.jsdocs.io/package/@poupe/rolldown-vue-css
[npm-badge]: https://img.shields.io/npm/v/@poupe/rolldown-vue-css.svg
[npm-url]: https://www.npmjs.com/package/@poupe/rolldown-vue-css
[license-badge]: https://img.shields.io/badge/License-MIT-yellow.svg
[license-url]: https://opensource.org/licenses/MIT
