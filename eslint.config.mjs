// @ts-check
import { defineConfig } from '@poupe/eslint-config';
import tsdocPlugin from 'eslint-plugin-tsdoc';

export default defineConfig({
  plugins: {
    tsdoc: tsdocPlugin,
  },
  rules: {
    'unicorn/prevent-abbreviations': [
      'error',
      {
        replacements: {
          env: {
            environment: false,
          },
          fn: {
            function: false,
          },
          prop: {
            property: false,
          },
          vars: {
            variables: false,
          },
        },
      },
    ],
    'tsdoc/syntax': 'warn',
  },
});
