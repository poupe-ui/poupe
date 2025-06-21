// @ts-check
import { defineConfig } from '@poupe/eslint-config';

export default defineConfig({
  files: ['**/*.spec.ts', '**/*.test.ts'],
  rules: {
    'vue/one-component-per-file': 'off',
  },
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
