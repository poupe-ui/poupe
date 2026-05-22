import { vueCSS } from '@poupe/rolldown-vue-css';
import { defineBuildConfig } from 'obuild/config';
import VueRolldown from 'unplugin-vue/rolldown';

// Audience names map 1:1 to dist subpaths via obuild's distName
// algorithm. Composables are emitted file-by-file via a `transform`
// entry (below) so every bundle imports the same on-disk
// `use-poupe.mjs` — single `Symbol("poupe")`, single
// `PoupeComponentDefaults` declaration target for augmentations.
const audiences = [
  '.',
  'components',
  'config',
  'resolver',
  'story-viewer',
  'theme-scheme',
];

// Externalise composables before rolldown resolves them to source
// `.ts` paths. Rewriting to the bare `@poupe/vue/composables[/*]`
// specifier means the emitted string is identical from any output
// location (main bundle, components bundle, etc.); consumers resolve
// it via the package's own `exports` map.
const externalComposables = {
  name: 'external-composables',
  resolveId(source: string) {
    const match = /^\.\.?\/composables($|\/.*)/.exec(source);
    if (!match) return;
    return { id: `@poupe/vue/composables${match[1]}`, external: true };
  },
};

const rolldown = {
  plugins: [
    externalComposables,
    VueRolldown(),
    vueCSS({
      specifier: (css) => `@poupe/vue/${css}`,
    }),
  ],
};

const dts = {
  vue: true,
  // Point at tsconfig.app.json directly — the root tsconfig.json
  // declares references with `files: []`, which rolldown-plugin-dts
  // reads as "no source files" and refuses to load .vue inputs.
  tsconfig: './tsconfig.app.json',
};

export default defineBuildConfig({
  entries: [
    // Transform composables first so distSize for the bundles below
    // can resolve their externalised `./composables/*.mjs` imports.
    {
      type: 'transform' as const,
      input: './src/composables',
      outDir: './dist/composables',
      filter: (p) => !p.includes('__tests__'),
      dts: true,
    },
    ...audiences.map((a) => ({
      type: 'bundle' as const,
      input: a === '.' ? './src/index.ts' : `./src/${a}/index.ts`,
      rolldown,
      dts,
    })),
  ],
  hooks: {
    rolldownOutput(outConfig) {
      outConfig.sourcemap = true;
    },
  },
});
