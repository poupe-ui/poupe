import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: [
    { builder: 'mkdist', input: './src', pattern: ['**/*.vue'], loaders: ['vue'] },
    { builder: 'mkdist', input: './src', pattern: ['**/*.ts'], format: 'cjs', loaders: ['js'], ext: 'cjs' },
    { builder: 'mkdist', input: './src', pattern: ['**/*.ts'], format: 'esm', loaders: ['js'], ext: 'mjs' },
    './src/index',
    './src/resolver',
  ],
  clean: true,
  declaration: true,
  externals: [
    'vue',
  ],
  stub: true,
});
