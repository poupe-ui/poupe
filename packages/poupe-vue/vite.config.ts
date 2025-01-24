import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

import autoprefixer from 'autoprefixer';
import tailwind from 'tailwindcss';
import vue from '@vitejs/plugin-vue';
import VueDevTools from 'vite-plugin-vue-devtools';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
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
