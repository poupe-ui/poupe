import { defineBuildConfig } from 'obuild/config';

export default defineBuildConfig({
  entries: [
    { type: 'bundle', input: ['./src/index.ts'] },
  ],
  hooks: {
    rolldownOutput(outConfig) {
      outConfig.sourcemap = true;
    },
  },
});
