import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: [
    { input: 'src/index', name: 'index' },
    { input: 'src/theme/index', name: 'theme' },
    { input: 'src/utils/index', name: 'utils' },
  ],
  declaration: true,
  sourcemap: true,
});
