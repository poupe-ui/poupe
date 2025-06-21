// @ts-check
import { defineConfig } from '@poupe/eslint-config';

export default defineConfig({
  ignores: ['examples/**'],
}, {
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
