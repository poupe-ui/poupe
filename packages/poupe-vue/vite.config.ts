import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

import autoprefixer from 'autoprefixer';
import tailwind from 'tailwindcss';

import Vue from '@vitejs/plugin-vue';
import VueDevTools from 'vite-plugin-vue-devtools';
import Dts from 'vite-plugin-dts';

const resolve = (path: string) => fileURLToPath(new URL(path, import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Vue(),
    VueDevTools(),
    Dts({
      tsconfigPath: resolve('tsconfig.app.json'),
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      formats: ['es'],
      name: '@poupe/vue',
      fileName: (_, name) => `${name}.mjs`,
      entry: {
        index: resolve('src/index.ts'),
        config: resolve('src/config.ts'),
        resolver: resolve('src/resolver.ts'),
      },
    },
    rollupOptions: {
      external: [
        'vue',
        'tailwind-variants',
      ],
      output: {
        globals: {
          vue: 'Vue',
          ['tailwind-variants']: 'tailwindVariants',
        },
      },
    },
  },
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
