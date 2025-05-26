import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: [
    { input: 'src/index', name: 'index' },
    { input: 'src/core/index', name: 'core' },
    { input: 'src/server/index', name: 'server' },
    { input: 'src/utils/index', name: 'utils' },
  ],
  declaration: true,
  sourcemap: true,
});
