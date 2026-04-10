// @ts-check
import { defineConfig } from '@poupe/eslint-config';

export default defineConfig({
  ignores: [
    '.claude/**/memory/**',
    '.tmp/**',
  ],
});
