import { beforeAll } from 'vitest';

// Suppress Vue warnings in tests
beforeAll(() => {
  // Store original console methods
  const originalWarn = console.warn;
  const originalError = console.error;

  // Suppress Vue warnings that are expected in tests
  console.warn = (...args) => {
    const message = args.join(' ');
    // Suppress injection warnings and lifecycle warnings that are expected in tests
    if (
      message.includes('injection "Symbol(poupe)" not found') ||
      message.includes('onMounted is called when there is no active component instance') ||
      message.includes('onUnmounted is called when there is no active component instance') ||
      message.includes('[PCard] Both "surface" and "container" props are specified')
    ) {
      return;
    }
    originalWarn(...args);
  };

  console.error = (...args) => {
    const message = args.join(' ');
    // Suppress the same warnings in error level
    if (
      message.includes('injection "Symbol(poupe)" not found') ||
      message.includes('onMounted is called when there is no active component instance') ||
      message.includes('onUnmounted is called when there is no active component instance')
    ) {
      return;
    }
    originalError(...args);
  };
});