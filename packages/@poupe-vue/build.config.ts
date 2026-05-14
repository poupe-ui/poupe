import { vueCSS } from '@poupe/rolldown-vue-css';
import { defineBuildConfig } from 'obuild/config';
import VueRolldown from 'unplugin-vue/rolldown';

// Audience names map 1:1 to dist subpaths via obuild's distName
// algorithm (`relative('src/', input)` minus extension). `.` is the
// root barrel (`./src/index.ts` → `dist/index.mjs`); the rest follow
// `./src/<name>/index.ts` → `dist/<name>/index.mjs`. `theme-scheme`
// and `story-viewer` get one-line re-export bridges under `src/` so
// their dist layout mirrors the pre-migration `build.lib.entry`
// shape from `vite.config.ts` — the only on-wire change is the
// `foo.mjs → foo/index.mjs` form swap.
const audiences = [
  '.',
  'components',
  'composables',
  'config',
  'resolver',
  'story-viewer',
  'theme-scheme',
];

const rolldown = {
  plugins: [
    VueRolldown(),
    // Bare specifier resolves via package self-reference, so obuild's
    // distSize re-bundle (rolldown with no plugins) externalises the
    // import via its `id[0] !== '.'` filter instead of routing it
    // through the removed CSS pipeline (rolldown/rolldown#4271).
    // Matches the `./*/index.css` wildcard in package.json exports.
    vueCSS({
      specifier: (css) => `@poupe/vue/${css}`,
    }),
  ],
  // unplugin-vue-components is a devDep (referenced from the resolver
  // source for types) so obuild's auto-external from dependencies
  // misses it. Everything in dependencies is externalised already.
  external: ['unplugin-vue-components'],
};

const dts = {
  vue: true,
  // Point at tsconfig.app.json directly — the root tsconfig.json
  // declares references with `files: []`, which rolldown-plugin-dts
  // reads as "no source files" and refuses to load .vue inputs.
  tsconfig: './tsconfig.app.json',
};

export default defineBuildConfig({
  entries: audiences.map((a) => ({
    type: 'bundle' as const,
    input: a === '.' ? './src/index.ts' : `./src/${a}/index.ts`,
    rolldown,
    dts,
  })),
  hooks: {
    rolldownOutput(outConfig) {
      outConfig.sourcemap = true;
    },
  },
});
