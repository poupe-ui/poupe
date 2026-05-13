# Changelog

All notable changes to `@poupe/rolldown-vue-css` will be documented
in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Refactor plugin state into a `Context` class with private
  fields (`cssByVirtualID`, `pendingWrites`, `specifier`),
  explicit lifecycle methods (`reset`, `capture`, `render`,
  `flush`), and named accessors for each map: `pushCapture` /
  `peekCapture` / `purgeCaptures` for the capture map;
  `pushOutput` / `drainOutputs` / `pendingOutputCount` for the
  output queue. The factory `vueCSS()` becomes a thin wrapper
  that constructs a `Context` and delegates each hook to it.
  Pure string transforms (`cssFileNameFor`, `rewriteWithImport`)
  move out to module-scope helpers. No behaviour change — the
  public hook contract and warn paths are identical to 0.1.0.
- Apply the project's ID-naming convention to identifiers that
  hold module IDs (`cssByVirtualID`, `moduleID`).

### Added

- Public `Specifier` type alias for the `options.specifier`
  function signature (`(cssFileName: string) => string`). Callers
  can now type their own specifier implementations without
  inlining the shape.

## [0.1.0] - 2026-05-11

### Added

- Initial release.
- Rolldown 1.x plugin that emits each Vue SFC `<style>` block as a
  sibling `.css` file written next to the per-component output
  module, and rewrites the module to side-effect import the asset.
  CSP-clean by construction — no runtime `<style>` injection, so
  consumers with hardened `style-src` policies keep working.
- Three plugin phases:
  - `transform` captures CSS from the
    `?vue&type=style&lang.css` virtual modules that
    `unplugin-vue` emits and returns an empty JS module.
  - `renderChunk` queues a sibling `.css` write and prepends a
    side-effect import resolved by the `specifier` option.
  - `writeBundle` flushes the CSS files via `fs.writeFile`,
    bypassing rolldown's asset pipeline (which routes `.css`
    filenames passed to `emitFile` into its removed CSS pipeline
    and aborts under rolldown/rolldown#4271).
- Default `specifier` returns `./<basename>` — fine for downstream
  Vite, webpack, or Rsbuild. For rolldown self-bundle pipelines
  (e.g. obuild's post-build size measurement) supply a bare
  specifier that resolves via package self-reference and add a
  matching `./styles/*.css` entry to the package's `exports`.

### Dependencies

- Runtime: consola ^3.4.2.
- Peer: rolldown 1.x.
- Engines: node ≥ 20.19.2, pnpm ≥ 10.33.0.
