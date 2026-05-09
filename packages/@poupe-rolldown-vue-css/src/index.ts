import { mkdir, writeFile } from 'node:fs/promises';

import type { Plugin } from 'rolldown';
import consola from 'consola';
import { basename, dirname, resolve } from 'pathe';

// Anchored on the `?vue&type=style` substring `unplugin-vue` emits;
// the trailing `(?:&|$)` lets the match terminate at the next query
// segment (`&index=`, `&lang.css`, `&scoped`) or end of id.
const STYLE_QUERY = /\?vue&type=style(?:&|$)/;
const JS_OUTPUT_EXT = /\.[mc]?js$/;

export interface VueCSSOptions {
  /**
   * Maps a chunk's CSS asset filename (relative to the output directory)
   * to the module specifier the chunk should import.
   *
   * Default: `./<basename(cssFileName)>` — works with most downstream
   * bundlers (Vite, webpack, Rsbuild) but **fails when the chunks are
   * re-bundled by another rolldown without a CSS plugin** (e.g. obuild's
   * `distSize` measurement, which uses `external: id => id[0] !== '.'`).
   * For rolldown-based build pipelines, use a bare specifier such as
   * `@your/pkg/styles/${cssFileName}` and add a matching subpath to the
   * package's `exports` field, e.g.
   * `"./styles/*.css": "./dist/*.css"`.
   */
  specifier?: (cssFileName: string) => string
}

/**
 * Rolldown plugin that emits each Vue SFC `<style>` block as a sibling
 * `.css` file written next to the per-component output module and
 * rewrites that module to side-effect import the asset, so consumer
 * bundlers handle it like any other CSS dependency. CSP-clean by
 * construction — no runtime `<style>` injection.
 *
 * The plugin runs in three phases:
 *
 * 1. `transform` intercepts the `?vue&type=style&lang.css` virtual modules
 *    that `unplugin-vue` emits, records each block's CSS keyed by the
 *    virtual id, and returns an empty JS module so the import becomes a
 *    no-op in the bundled chunk. `moduleType: 'js'` is forced because the
 *    virtual id ends in `lang.css`, which would otherwise route through
 *    rolldown's removed CSS pipeline (rolldown/rolldown#4271).
 *
 * 2. `renderChunk` walks each chunk's `moduleIds`, gathers any captured
 *    CSS blocks, queues a write of a sibling `.css` file whose path
 *    mirrors the chunk's `.mjs` path, and prepends a side-effect
 *    import (specifier resolved by `options.specifier`) to the chunk so
 *    the consumer's bundler resolves the asset via standard CSS import
 *    handling.
 *
 * 3. `writeBundle` flushes the queued CSS files to disk. This bypasses
 *    rolldown's asset pipeline (which routes any `.css` filename
 *    given to `emitFile` into its removed CSS pipeline and aborts
 *    under #4271) and writes the bytes directly with `fs.writeFile`.
 */
export function vueCSS(options: VueCSSOptions = {}): Plugin {
  const specifier = options.specifier ?? ((css: string) => './' + basename(css));

  const cssByVirtualId = new Map<string, string>();
  const pendingWrites = new Map<string, string>();

  return {
    name: 'vue-css',
    buildStart() {
      // Reset per-build state so re-invocations (watch mode,
      // sequential builds in one process) don't carry style
      // captures from the previous run.
      cssByVirtualId.clear();
      pendingWrites.clear();
    },
    transform(code, id) {
      if (!STYLE_QUERY.test(id)) return undefined;
      cssByVirtualId.set(id, code);
      return { code: '', moduleType: 'js' };
    },
    renderChunk(code, chunk) {
      const parts: string[] = [];
      for (const moduleId of chunk.moduleIds) {
        const css = cssByVirtualId.get(moduleId);
        if (css !== undefined) parts.push(css);
      }
      if (parts.length === 0) return undefined;
      if (!JS_OUTPUT_EXT.test(chunk.fileName)) {
        consola.warn(
          `vue-css: chunk ${chunk.fileName} carries ` +
          `${parts.length} CSS block(s) but its filename is not ` +
          '.js/.mjs/.cjs; skipping',
        );
        return undefined;
      }
      const cssFileName = chunk.fileName.replace(JS_OUTPUT_EXT, '.css');
      const cssText = parts.join('\n');
      const existing = pendingWrites.get(cssFileName);
      if (existing === undefined) {
        pendingWrites.set(cssFileName, cssText);
      } else if (existing !== cssText) {
        // Two chunks compute the same cssFileName (e.g. `foo.mjs` and
        // `foo.cjs` from a dual-format build) but disagree on the CSS
        // payload — usually a code-split misconfiguration. Warn loudly
        // and keep the first content rather than silently overwriting.
        consola.warn(
          `vue-css: ${cssFileName} already queued by another chunk ` +
          'with different content; keeping the first ' +
          `(this chunk: ${chunk.fileName})`,
        );
      }
      const importSpec = specifier(cssFileName);
      // map: null signals that the chunk's prior sourcemap is no
      // longer aligned (prepending a line shifts every subsequent
      // mapping by one). Rolldown treats this as "no map for this
      // step" rather than silently letting the stale map ride.
      return {
        code: `import ${JSON.stringify(importSpec)};\n${code}`,
        // eslint-disable-next-line unicorn/no-null
        map: null,
      };
    },
    async writeBundle(options) {
      if (pendingWrites.size === 0) return;
      const outDirectory = options.dir;
      if (outDirectory === undefined) {
        consola.warn(
          'vue-css: writeBundle called without options.dir; ' +
          `skipping ${pendingWrites.size} pending CSS file(s)`,
        );
        pendingWrites.clear();
        return;
      }
      await Promise.all(
        [...pendingWrites].map(async ([cssFileName, cssText]) => {
          const outPath = resolve(outDirectory, cssFileName);
          await mkdir(dirname(outPath), { recursive: true });
          await writeFile(outPath, cssText, 'utf8');
        }),
      );
      pendingWrites.clear();
    },
  };
}
