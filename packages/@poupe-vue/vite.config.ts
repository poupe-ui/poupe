import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

import tailwind from '@tailwindcss/vite';

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
    tailwind(),
  ],
  build: {
    lib: {
      formats: ['es'],
      name: '@poupe/vue',
      fileName: (_, name) => `${name}.mjs`,
      entry: {
        'index': resolve('src/index.ts'),
        'config': resolve('src/config/index.ts'),
        'resolver': resolve('src/resolver/index.ts'),
        'theme-scheme': resolve('src/components/theme/index.ts'),
      },
    },
    rollupOptions: {
      external: [
        '@poupe/theme-builder',
        'tailwind-variants',
        'tailwind-scrollbar',
        'tailwindcss',
        'vue',
      ],
      output: {
        globals: {
          ['@poupe/theme-builder']: 'PoupeThemeBuilder',
          ['tailwind-variants']: 'TailwindVariants',
          ['tailwind-scrollbar']: 'TailwindScrollbar',
          tailwindcss: 'Tailwindcss',
          vue: 'Vue',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve('src'),
    },
  },
});
