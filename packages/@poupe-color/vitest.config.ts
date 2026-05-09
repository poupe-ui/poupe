import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/index.ts',
        '**/*.spec.ts',
        '**/*.test.ts',
        '**/__tests__/**',
        '**/dist/**',
      ],
    },
  },
});
