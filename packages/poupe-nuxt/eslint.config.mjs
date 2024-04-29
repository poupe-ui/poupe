// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat';
import { configs as poupe } from '@poupe/eslint-config';

// Run `pnpx @eslint/config-inspector` to inspect the resolved config interactively
export default createConfigForNuxt({
  features: {
    // Rules for module authors
    tooling: true,
    // Rules for formatting
    stylistic: true,
  },
  dirs: {
    src: [
      './playground',
    ],
  },
})
  .append(
    ...poupe,
    {
      ignores: [
        '**/.nuxt',
      ],
      rules: {
        '@stylistic/semi': ['error', 'always'],
      },
    },
  );
