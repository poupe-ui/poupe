// @ts-check
import { defineConfig } from '@poupe/eslint-config';
import tailwindcss from '@poupe/eslint-plugin-tailwindcss';

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
}, tailwindcss.configs.recommended);
