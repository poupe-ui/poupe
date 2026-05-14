import { fileURLToPath, URL } from 'node:url';

import tailwind from '@tailwindcss/vite';
import Vue from 'unplugin-vue/vite';
import { defineConfig } from 'vite';

const resolve = (path: string) => fileURLToPath(new URL(path, import.meta.url));

// Dev server only — serves the in-house story viewer
// (src/app.vue → src/stories/index.vue) for component
// development. The library build runs through obuild
// (build.config.ts).
export default defineConfig({
  plugins: [
    Vue(),
    tailwind(),
  ],
  resolve: {
    alias: {
      '@': resolve('src'),
    },
  },
  server: {
    host: '0.0.0.0',
  },
});
