import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node', // or 'jsdom' if your tests ever require a DOM
    globals: true, // Optional: enables global APIs like describe, it, expect
    coverage: {
      provider: 'v8', // or 'istanbul'
      reporter: ['text', 'json-summary', 'json', 'html'],
      include: ['src/**/*.ts'], // Adjust based on your source code location
      exclude: [
        // Add patterns for files/directories to exclude from coverage
        'src/index.ts', // Often entry points don't need coverage
        '**/*.spec.ts',
        '**/*.test.ts',
        '**/__tests__/**',
        '**/dist/**',
      ],
    },
  },
  // If you use path aliases in your project (e.g., in tsconfig.json),
  // you might need to configure them here as well.
  // resolve: {
  //   alias: {
  //     // Example: '@': path.resolve(__dirname, './src'),
  //   },
  // },
});
