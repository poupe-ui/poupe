import { mkdir, writeFile } from 'node:fs/promises';

import type { Plugin, RenderedChunk } from 'rolldown';
import consola from 'consola';
import { basename, dirname, resolve } from 'pathe';

// Anchored on the `?vue&type=style` substring `unplugin-vue` emits;
// the trailing `(?:&|$)` lets the match terminate at the next query
// segment (`&index=`, `&lang.css`, `&scoped`) or end of id.
const STYLE_QUERY = /\?vue&type=style(?:&|$)/;
const JS_OUTPUT_EXT = /\.[mc]?js$/;

/**
 * Maps a chunk's CSS asset filename (relative to the output directory)
 * to the module specifier string the chunk should import.
 */
export type Specifier = (cssFileName: string) => string;

const basenameSpecifier: Specifier = (cssFileName) =>
  './' + basename(cssFileName);

export interface VueCSSOptions {
  /**
   * Maps each chunk's CSS asset filename (relative to the output
   * directory) to the module specifier prepended at the top of the
   * chunk via a side-effect `import`. Defaults to
   * `./<basename(cssFileName)>`.
   *
   * The relative default works for downstream bundlers (Vite,
   * webpack, Rsbuild) but **fails when the chunks are re-bundled by
   * another rolldown without a CSS plugin** (e.g. obuild's
   * `distSize` measurement, which uses
   * `external: id => id[0] !== '.'` — rolldown/rolldown#4271). For
   * such pipelines, return a bare specifier resolved via your
   * package's `exports` (package self-reference).
   */
  specifier?: Specifier
}

const cssFileNameFor = (chunk: RenderedChunk): string | undefined => {
  if (!JS_OUTPUT_EXT.test(chunk.fileName)) return undefined;
  return chunk.fileName.replace(JS_OUTPUT_EXT, '.css');
};

// `map: null` signals that the chunk's prior sourcemap is no longer
// aligned (prepending a line shifts every subsequent mapping by
// one). Rolldown treats this as "no map for this step" rather than
// silently letting the stale map ride.
const rewriteWithImport = (
  specifier: Specifier,
  code: string,
  cssFileName: string,
): { code: string; map: null } => {
  const importSpec = specifier(cssFileName);
  return {
    code: `import ${JSON.stringify(importSpec)};\n${code}`,
    // eslint-disable-next-line unicorn/no-null
    map: null,
  };
};

class Context {
  private readonly cssByVirtualID = new Map<string, string>();
  private readonly pendingWrites = new Map<string, string>();
  private readonly specifier: Specifier;

  constructor(options: VueCSSOptions) {
    this.specifier = options.specifier ?? basenameSpecifier;
  }

  // Reset per-build state so re-invocations (watch mode, sequential
  // builds in one process) don't carry captures from the previous
  // run.
  reset(): void {
    this.purgeCaptures();
    this.drainOutputs();
  }

  capture(
    code: string,
    id: string,
  ): undefined | { code: string; moduleType: 'js' } {
    if (!STYLE_QUERY.test(id)) return undefined;
    this.pushCapture(id, code);
    // `moduleType: 'js'` is forced because the virtual id ends in
    // `lang.css`, which would otherwise route through rolldown's
    // removed CSS pipeline (rolldown/rolldown#4271).
    return { code: '', moduleType: 'js' };
  }

  render(
    code: string,
    chunk: RenderedChunk,
  ): undefined | { code: string; map: null } {
    const parts = this.collectCSS(chunk);
    if (parts.length === 0) return undefined;
    const cssFileName = cssFileNameFor(chunk);
    if (cssFileName === undefined) {
      consola.warn(
        `vue-css: chunk ${chunk.fileName} carries ` +
        `${parts.length} CSS block(s) but its filename is not ` +
        '.js/.mjs/.cjs; skipping',
      );
      return undefined;
    }
    this.pushOutput(cssFileName, parts.join('\n'), chunk.fileName);
    return rewriteWithImport(this.specifier, code, cssFileName);
  }

  async flush(outDirectory: string | undefined): Promise<void> {
    if (this.pendingOutputCount() === 0) return;
    if (outDirectory === undefined) {
      consola.warn(
        'vue-css: writeBundle called without options.dir; ' +
        `skipping ${this.pendingOutputCount()} pending CSS file(s)`,
      );
      this.drainOutputs();
      return;
    }
    await Promise.all(
      this.drainOutputs().map(async ([cssFileName, cssText]) => {
        const outPath = resolve(outDirectory, cssFileName);
        await mkdir(dirname(outPath), { recursive: true });
        await writeFile(outPath, cssText, 'utf8');
      }),
    );
  }

  private collectCSS(chunk: RenderedChunk): string[] {
    const parts: string[] = [];
    for (const moduleID of chunk.moduleIds) {
      const css = this.peekCapture(moduleID);
      if (css !== undefined) parts.push(css);
    }
    return parts;
  }

  // -- captures (per-build CSS keyed by SFC virtual id) --

  private pushCapture(id: string, css: string): void {
    this.cssByVirtualID.set(id, css);
  }

  private peekCapture(id: string): string | undefined {
    return this.cssByVirtualID.get(id);
  }

  private purgeCaptures(): void {
    this.cssByVirtualID.clear();
  }

  // -- outputs (CSS files queued for write) --

  private pushOutput(
    cssFileName: string,
    cssText: string,
    chunkName: string,
  ): void {
    const existing = this.pendingWrites.get(cssFileName);
    if (existing === undefined) {
      this.pendingWrites.set(cssFileName, cssText);
      return;
    }
    if (existing === cssText) return;
    // Two chunks compute the same cssFileName (e.g. `foo.mjs` and
    // `foo.cjs` from a dual-format build) but disagree on the CSS
    // payload — usually a code-split misconfiguration. Warn loudly
    // and keep the first content rather than silently overwriting.
    consola.warn(
      `vue-css: ${cssFileName} already queued by another chunk ` +
      'with different content; keeping the first ' +
      `(this chunk: ${chunkName})`,
    );
  }

  private drainOutputs(): Array<[string, string]> {
    const entries = [...this.pendingWrites];
    this.pendingWrites.clear();
    return entries;
  }

  private pendingOutputCount(): number {
    return this.pendingWrites.size;
  }
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
 * 1. `transform` intercepts the `?vue&type=style&lang.css` virtual
 *    modules that `unplugin-vue` emits, records each block's CSS keyed
 *    by the virtual id, and returns an empty JS module so the import
 *    becomes a no-op in the bundled chunk.
 *
 * 2. `renderChunk` walks each chunk's `moduleID`s, gathers any
 *    captured CSS blocks, queues a write of a sibling `.css` file
 *    whose path mirrors the chunk's `.mjs` path, and prepends a
 *    side-effect import resolved by `options.specifier` — or the
 *    `./<basename>` default when omitted — so the consumer's bundler
 *    resolves the asset via standard CSS import handling.
 *
 * 3. `writeBundle` flushes the queued CSS files to disk. This bypasses
 *    rolldown's asset pipeline (which routes any `.css` filename
 *    given to `emitFile` into its removed CSS pipeline and aborts
 *    under #4271) and writes the bytes directly with `fs.writeFile`.
 */
export function vueCSS(options: VueCSSOptions = {}): Plugin {
  const context = new Context(options);
  return {
    name: 'vue-css',
    buildStart() {
      context.reset();
    },
    transform(code, id) {
      return context.capture(code, id);
    },
    renderChunk(code, chunk) {
      return context.render(code, chunk);
    },
    async writeBundle(options) {
      await context.flush(options.dir);
    },
  };
}
