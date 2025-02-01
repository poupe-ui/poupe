import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

import autoprefixer from 'autoprefixer';
import tailwind from 'tailwindcss';

import Vue from '@vitejs/plugin-vue';
import VueDevTools from 'vite-plugin-vue-devtools';

const resolve = (path: string) => fileURLToPath(new URL(path, import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Vue(),
    VueDevTools(),
  ],
  resolve: {
    alias: {
      '@': resolve('src'),
    },
  },
  css: {
    postcss: {
      plugins: [
        tailwind(),
        autoprefixer(),
      ],
    },
  },
});
