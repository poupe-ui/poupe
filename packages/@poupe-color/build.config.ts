import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: [
    { input: 'src/index', name: 'index' },
    { input: 'src/d3/index', name: 'd3' },
    { input: 'src/utils/index', name: 'utils' },
  ],
  declaration: true,
  sourcemap: true,
});
