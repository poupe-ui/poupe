// @ts-check
import { defineConfig } from '@poupe/eslint-config';

export default defineConfig({
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
  },
});
