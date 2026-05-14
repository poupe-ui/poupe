import { defineBuildConfig } from 'obuild/config';

export default defineBuildConfig({
  entries: [
    // One bundle entry per published subpath — keeps each
    // subpath's scope independent. A single multi-input bundle
    // would couple them through rolldown's shared module graph.
    { type: 'bundle', input: ['./src/index.ts'] },
    { type: 'bundle', input: ['./src/core/index.ts'] },
    { type: 'bundle', input: ['./src/server/index.ts'] },
  ],
  hooks: {
    rolldownOutput(outConfig) {
      outConfig.sourcemap = true;
    },
  },
});
