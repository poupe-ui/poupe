import { fileURLToPath } from 'node:url';
import Vue from 'unplugin-vue/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [Vue()],
  test: {
    environment: 'jsdom',
    root: fileURLToPath(new URL('./', import.meta.url)),
  },
});
