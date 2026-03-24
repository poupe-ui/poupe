// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat';
import { withPoupe } from '@poupe/eslint-config';

// Run `pnpx @eslint/config-inspector` to inspect the resolved config interactively
export default withPoupe(createConfigForNuxt({
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
}), {
  files: ['**/.vscode/*.json'],
  rules: {
    'jsonc/no-comments': 'off',
  },
}, {
  files: ['**/*.md'],
  rules: {
    'markdownlint/md007': ['error', { indent: 2 }],
  },
});
