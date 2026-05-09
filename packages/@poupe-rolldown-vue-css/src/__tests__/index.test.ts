import { mkdir, writeFile } from 'node:fs/promises';

import consola from 'consola';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { vueCSS } from '../index';

vi.mock('node:fs/promises', () => ({
  mkdir: vi.fn(),
  writeFile: vi.fn(),
}));

interface PluginLike {
  buildStart: (this: unknown) => unknown
  name: string
  renderChunk: (this: unknown, code: string, chunk: unknown) => unknown
  transform: (this: unknown, code: string, id: string) => unknown
  writeBundle: (this: unknown, options: unknown, bundle: unknown) => Promise<unknown>
}

const STYLE_ID_0 = '/abs/Foo.vue?vue&type=style&index=0&lang.css';
const STYLE_ID_1 = '/abs/Foo.vue?vue&type=style&index=1&lang.css';
const SCRIPT_ID = '/abs/Foo.vue?vue&type=script&setup=true&lang.ts';
const SOURCE_ID = '/abs/Foo.vue';

describe('vueCSS', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.mocked(mkdir).mockReset();
    vi.mocked(writeFile).mockReset();
  });

  it('returns a rolldown plugin with the expected name', () => {
    expect(vueCSS().name).toBe('vue-css');
  });

  describe('transform', () => {
    it('returns undefined for non-style ids', () => {
      const plugin = vueCSS() as unknown as PluginLike;
      expect(plugin.transform.call({}, 'export default {}', SOURCE_ID)).toBeUndefined();
      expect(plugin.transform.call({}, 'export default {}', SCRIPT_ID)).toBeUndefined();
    });

    it('returns an empty js module for style virtual ids', () => {
      const plugin = vueCSS() as unknown as PluginLike;
      expect(plugin.transform.call({}, '.foo { color: red; }', STYLE_ID_0))
        .toEqual({ code: '', moduleType: 'js' });
    });

    it('matches the bare ?vue&type=style form (regex end-of-string branch)', () => {
      const plugin = vueCSS() as unknown as PluginLike;
      expect(plugin.transform.call({}, '.bar { color: green; }', '/abs/Foo.vue?vue&type=style'))
        .toEqual({ code: '', moduleType: 'js' });
    });
  });

  describe('renderChunk', () => {
    it('returns undefined when no module in the chunk has captured CSS', () => {
      const plugin = vueCSS() as unknown as PluginLike;
      const result = plugin.renderChunk.call(
        {},
        'export default {};',
        { fileName: 'index.mjs', moduleIds: ['/abs/index.ts'] },
      );
      expect(result).toBeUndefined();
    });

    it('prepends a default `./<basename>.css` side-effect import for matched chunks', () => {
      const plugin = vueCSS() as unknown as PluginLike;
      plugin.transform.call({}, '.foo { color: red; }', STYLE_ID_0);

      const result = plugin.renderChunk.call(
        {},
        'export default {};',
        {
          fileName: 'components/foo.mjs',
          moduleIds: [STYLE_ID_0, SCRIPT_ID, SOURCE_ID],
        },
      );

      expect(result).toEqual({
        code: 'import "./foo.css";\nexport default {};',
        // eslint-disable-next-line unicorn/no-null
        map: null,
      });
    });

    it('uses the custom specifier when provided', () => {
      const plugin = vueCSS({
        specifier: (css) => `@poupe/vue/styles/${css}`,
      }) as unknown as PluginLike;
      plugin.transform.call({}, '.x {}', STYLE_ID_0);

      const result = plugin.renderChunk.call(
        {},
        'code',
        {
          fileName: 'components/theme/scheme/colors.mjs',
          moduleIds: [STYLE_ID_0],
        },
      ) as { code: string };

      expect(result.code).toMatch(
        /^import "@poupe\/vue\/styles\/components\/theme\/scheme\/colors\.css";\n/,
      );
    });

    it('handles .js and .cjs chunk extensions', () => {
      const plugin = vueCSS() as unknown as PluginLike;
      plugin.transform.call({}, '.x {}', STYLE_ID_0);

      const result = plugin.renderChunk.call(
        {},
        'code',
        { fileName: 'components/foo.cjs', moduleIds: [STYLE_ID_0] },
      ) as { code: string };
      expect(result.code).toMatch(/^import "\.\/foo\.css";\n/);
    });

    it('warns and skips when chunk filename has no js extension', () => {
      const plugin = vueCSS() as unknown as PluginLike;
      plugin.transform.call({}, '.foo {}', STYLE_ID_0);

      const warn = vi.spyOn(consola, 'warn').mockImplementation(() => {});
      const result = plugin.renderChunk.call(
        {},
        'code',
        { fileName: 'components/foo.html', moduleIds: [STYLE_ID_0] },
      );

      expect(result).toBeUndefined();
      expect(warn).toHaveBeenCalledOnce();
    });

    it('dedupes the write when two chunks queue the same cssFileName with identical content', async () => {
      const plugin = vueCSS() as unknown as PluginLike;
      plugin.transform.call({}, '.foo { color: red; }', STYLE_ID_0);

      const warn = vi.spyOn(consola, 'warn').mockImplementation(() => {});

      // The dual-format common case: `foo.mjs` and `foo.cjs` from the
      // same SFC graph compute the same cssFileName and the same CSS.
      const mjsResult = plugin.renderChunk.call(
        {},
        'export default {};',
        { fileName: 'components/foo.mjs', moduleIds: [STYLE_ID_0] },
      ) as { code: string };
      const cjsResult = plugin.renderChunk.call(
        {},
        'module.exports = {};',
        { fileName: 'components/foo.cjs', moduleIds: [STYLE_ID_0] },
      ) as { code: string };

      expect(mjsResult.code).toMatch(/^import "\.\/foo\.css";\n/);
      expect(cjsResult.code).toMatch(/^import "\.\/foo\.css";\n/);
      expect(warn).not.toHaveBeenCalled();

      vi.mocked(mkdir).mockResolvedValue(undefined);
      vi.mocked(writeFile).mockResolvedValue(undefined);
      await plugin.writeBundle.call({}, { dir: '/out' }, {});

      expect(writeFile).toHaveBeenCalledExactlyOnceWith(
        '/out/components/foo.css',
        '.foo { color: red; }',
        'utf8',
      );
    });

    it('warns and keeps the first when two chunks queue the same cssFileName with disjoint content', async () => {
      const plugin = vueCSS() as unknown as PluginLike;
      plugin.transform.call({}, '.a { color: red; }', STYLE_ID_0);
      plugin.transform.call({}, '.b { color: blue; }', STYLE_ID_1);

      // First chunk queues `components/foo.css` with just the .a payload.
      plugin.renderChunk.call(
        {},
        'export default {};',
        { fileName: 'components/foo.mjs', moduleIds: [STYLE_ID_0] },
      );

      // Second chunk hits the same cssFileName with disjoint content —
      // a pathological code-split that would silently drop CSS under the
      // previous overwrite-wins logic.
      const warn = vi.spyOn(consola, 'warn').mockImplementation(() => {});
      plugin.renderChunk.call(
        {},
        'module.exports = {};',
        { fileName: 'components/foo.cjs', moduleIds: [STYLE_ID_1] },
      );

      expect(warn).toHaveBeenCalledOnce();

      vi.mocked(mkdir).mockResolvedValue(undefined);
      vi.mocked(writeFile).mockResolvedValue(undefined);
      await plugin.writeBundle.call({}, { dir: '/out' }, {});

      expect(writeFile).toHaveBeenCalledExactlyOnceWith(
        '/out/components/foo.css',
        '.a { color: red; }',
        'utf8',
      );
    });
  });

  describe('writeBundle', () => {
    it('flushes a single captured CSS block to the resolved sibling path', async () => {
      const plugin = vueCSS() as unknown as PluginLike;
      plugin.transform.call({}, '.foo { color: red; }', STYLE_ID_0);
      plugin.renderChunk.call(
        {},
        'code',
        { fileName: 'components/foo.mjs', moduleIds: [STYLE_ID_0] },
      );

      vi.mocked(mkdir).mockResolvedValue(undefined);
      vi.mocked(writeFile).mockResolvedValue(undefined);

      await plugin.writeBundle.call({}, { dir: '/out' }, {});

      expect(mkdir).toHaveBeenCalledExactlyOnceWith('/out/components', { recursive: true });
      expect(writeFile).toHaveBeenCalledExactlyOnceWith(
        '/out/components/foo.css',
        '.foo { color: red; }',
        'utf8',
      );
    });

    it('concatenates multiple style blocks for the same SFC in moduleIds order', async () => {
      const plugin = vueCSS() as unknown as PluginLike;
      plugin.transform.call({}, '.a { color: red; }', STYLE_ID_0);
      plugin.transform.call({}, '.b { color: blue; }', STYLE_ID_1);
      plugin.renderChunk.call(
        {},
        'code',
        {
          fileName: 'components/foo.mjs',
          moduleIds: [STYLE_ID_0, STYLE_ID_1, SOURCE_ID],
        },
      );

      vi.mocked(mkdir).mockResolvedValue(undefined);
      vi.mocked(writeFile).mockResolvedValue(undefined);

      await plugin.writeBundle.call({}, { dir: '/out' }, {});

      expect(writeFile).toHaveBeenCalledExactlyOnceWith(
        '/out/components/foo.css',
        '.a { color: red; }\n.b { color: blue; }',
        'utf8',
      );
    });

    it('concatenates CSS from multiple SFCs sharing one chunk', async () => {
      const FOO_STYLE = '/abs/Foo.vue?vue&type=style&index=0&lang.css';
      const BAR_STYLE = '/abs/Bar.vue?vue&type=style&index=0&lang.css';
      const plugin = vueCSS() as unknown as PluginLike;
      plugin.transform.call({}, '.foo { color: red; }', FOO_STYLE);
      plugin.transform.call({}, '.bar { color: blue; }', BAR_STYLE);
      plugin.renderChunk.call(
        {},
        'code',
        {
          fileName: 'shared.mjs',
          moduleIds: [FOO_STYLE, '/abs/Foo.vue', BAR_STYLE, '/abs/Bar.vue'],
        },
      );

      vi.mocked(mkdir).mockResolvedValue(undefined);
      vi.mocked(writeFile).mockResolvedValue(undefined);

      await plugin.writeBundle.call({}, { dir: '/out' }, {});

      expect(writeFile).toHaveBeenCalledExactlyOnceWith(
        '/out/shared.css',
        '.foo { color: red; }\n.bar { color: blue; }',
        'utf8',
      );
    });

    it('is a no-op when nothing was captured', async () => {
      const plugin = vueCSS() as unknown as PluginLike;
      await plugin.writeBundle.call({}, { dir: '/out' }, {});
      expect(mkdir).not.toHaveBeenCalled();
      expect(writeFile).not.toHaveBeenCalled();
    });

    it('warns and clears state when options.dir is missing', async () => {
      const plugin = vueCSS() as unknown as PluginLike;
      plugin.transform.call({}, '.foo {}', STYLE_ID_0);
      plugin.renderChunk.call(
        {},
        'code',
        { fileName: 'components/foo.mjs', moduleIds: [STYLE_ID_0] },
      );

      const warn = vi.spyOn(consola, 'warn').mockImplementation(() => {});
      await plugin.writeBundle.call({}, {}, {});

      expect(warn).toHaveBeenCalledOnce();
      expect(writeFile).not.toHaveBeenCalled();

      // Subsequent writeBundle with a valid dir should NOT re-write the
      // already-cleared state.
      await plugin.writeBundle.call({}, { dir: '/out' }, {});
      expect(writeFile).not.toHaveBeenCalled();
    });
  });

  describe('buildStart', () => {
    it('clears captured CSS so a fresh build does not re-emit old styles', async () => {
      const plugin = vueCSS() as unknown as PluginLike;
      plugin.transform.call({}, '.foo { color: red; }', STYLE_ID_0);
      plugin.renderChunk.call(
        {},
        'code',
        { fileName: 'foo.mjs', moduleIds: [STYLE_ID_0] },
      );

      vi.mocked(mkdir).mockResolvedValue(undefined);
      vi.mocked(writeFile).mockResolvedValue(undefined);
      await plugin.writeBundle.call({}, { dir: '/out' }, {});
      expect(writeFile).toHaveBeenCalledOnce();
      vi.mocked(writeFile).mockClear();

      // New build begins.
      plugin.buildStart.call({});

      // Without the buildStart clear, STYLE_ID_0 would still hold its
      // previous CSS and a renderChunk on the same id would re-queue
      // a write.
      const result = plugin.renderChunk.call(
        {},
        'code',
        { fileName: 'foo.mjs', moduleIds: [STYLE_ID_0] },
      );
      expect(result).toBeUndefined();

      await plugin.writeBundle.call({}, { dir: '/out' }, {});
      expect(writeFile).not.toHaveBeenCalled();
    });

    it('clears pending writes from a previous build that never reached writeBundle', async () => {
      const plugin = vueCSS() as unknown as PluginLike;
      plugin.transform.call({}, '.foo { color: red; }', STYLE_ID_0);
      plugin.renderChunk.call(
        {},
        'code',
        { fileName: 'foo.mjs', moduleIds: [STYLE_ID_0] },
      );
      // Aborted build: writeBundle never called. pendingWrites still
      // holds queued output.

      plugin.buildStart.call({});

      vi.mocked(mkdir).mockResolvedValue(undefined);
      vi.mocked(writeFile).mockResolvedValue(undefined);
      await plugin.writeBundle.call({}, { dir: '/out' }, {});
      expect(writeFile).not.toHaveBeenCalled();
    });
  });
});
