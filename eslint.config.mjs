// @ts-check
import { defineConfig } from '@poupe/eslint-config';

export default defineConfig(
  {
    ignores: [
      '.claude/**/memory/**',
      '.tmp/**',
    ],
  },
  {
    // cspell config files are JSONC: allow `//` and `/* */` comments
    // for grouping the words[] dictionary.
    files: ['**/cspell.json'],
    language: 'jsonc/jsonc',
    rules: {
      'jsonc/no-comments': 'off',
    },
  },
);
