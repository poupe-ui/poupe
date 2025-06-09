/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Unit tests for compile utility
 */

import { describe, test, expect, vi, beforeEach } from 'vitest';
import { compile, extractCandidates, compileCSS, CLASS_PATTERNS, type ClassPattern } from '../compile';
import { compile as tailwindCompile } from '@tailwindcss/node';

// Mock @tailwindcss/node
vi.mock('@tailwindcss/node', () => ({
  compile: vi.fn(),
}));

describe('extractCandidates', () => {
  test('extracts classes from HTML class attributes', () => {
    const html = '<div class="bg-blue-500 text-white p-4">Content</div>';
    const candidates = extractCandidates(html);

    expect(candidates).toEqual(['bg-blue-500', 'text-white', 'p-4']);
  });

  test('extracts classes from React className attributes', () => {
    const jsx = '<div className="flex items-center justify-between">Content</div>';
    const candidates = extractCandidates(jsx);

    expect(candidates).toEqual(['flex', 'items-center', 'justify-between']);
  });

  test('extracts classes from Svelte class directive', () => {
    const svelte = '<div class:active class:disabled>Content</div>';
    const candidates = extractCandidates(svelte);

    expect(candidates).toContain('active');
    expect(candidates).toContain('disabled');
  });

  test('focuses on standard HTML class and React className patterns', () => {
    // Focus on the main patterns we actually use
    const mixed = `
      <div class="bg-primary text-white">HTML</div>
      <div className="flex items-center">React</div>
    `;
    const candidates = extractCandidates(mixed);

    expect(candidates).toContain('bg-primary');
    expect(candidates).toContain('text-white');
    expect(candidates).toContain('flex');
    expect(candidates).toContain('items-center');
  });

  test('handles multiple content strings', () => {
    const contents = [
      '<div class="bg-red-500">Red</div>',
      '<div className="bg-blue-500">Blue</div>',
    ];
    const candidates = extractCandidates(contents);

    expect(candidates).toEqual(['bg-red-500', 'bg-blue-500']);
  });

  test('removes duplicate classes', () => {
    const html = '<div class="bg-blue-500"><span class="bg-blue-500">Duplicate</span></div>';
    const candidates = extractCandidates(html);

    expect(candidates).toEqual(['bg-blue-500']);
  });

  test('handles empty content', () => {
    expect(extractCandidates('')).toEqual([]);
    expect(extractCandidates([])).toEqual([]);
  });

  test('handles content without classes', () => {
    const html = '<div>No classes here</div>';
    const candidates = extractCandidates(html);

    expect(candidates).toEqual([]);
  });

  test('extracts complex utility classes with modifiers', () => {
    const html = `
      <div class="bg-blue-500/50 hover:bg-red-600 md:text-lg lg:p-4">
        <span className="scrim-modal/75 dark:text-white">
          Complex utilities
        </span>
      </div>
    `;
    const candidates = extractCandidates(html);

    expect(candidates).toContain('bg-blue-500/50');
    expect(candidates).toContain('hover:bg-red-600');
    expect(candidates).toContain('md:text-lg');
    expect(candidates).toContain('lg:p-4');
    expect(candidates).toContain('scrim-modal/75');
    expect(candidates).toContain('dark:text-white');
  });

  test('pattern-based extraction covers all framework syntaxes', () => {
    // Test all the different patterns in one comprehensive test
    const content = `
      <!-- HTML class attribute -->
      <div class="html-class bg-primary text-white">HTML</div>

      <!-- React className attribute -->
      <div className="react-class flex items-center">React</div>

      <!-- Svelte class directive -->
      <div class:svelte-class class:active>Svelte</div>

      <!-- Mixed content with complex classes -->
      <div class="scrim-modal/75 hover:bg-red-500 lg:text-xl">Mixed</div>
    `;

    const candidates = extractCandidates(content);

    // HTML pattern
    expect(candidates).toContain('html-class');
    expect(candidates).toContain('bg-primary');
    expect(candidates).toContain('text-white');

    // React pattern
    expect(candidates).toContain('react-class');
    expect(candidates).toContain('flex');
    expect(candidates).toContain('items-center');

    // Svelte pattern
    expect(candidates).toContain('svelte-class');
    expect(candidates).toContain('active');

    // Complex utilities
    expect(candidates).toContain('scrim-modal/75');
    expect(candidates).toContain('hover:bg-red-500');
    expect(candidates).toContain('lg:text-xl');
  });

  test('exported CLASS_PATTERNS can be inspected and extended', () => {
    // Verify the patterns are accessible
    expect(CLASS_PATTERNS).toBeInstanceOf(Array);
    expect(CLASS_PATTERNS.length).toBeGreaterThan(0);

    // Check that each pattern has the expected structure
    for (const pattern of CLASS_PATTERNS) {
      expect(pattern).toHaveProperty('regex');
      expect(pattern).toHaveProperty('captureGroup');
      expect(pattern).toHaveProperty('splitByWhitespace');
      expect(pattern).toHaveProperty('description');
      expect(pattern.regex).toBeInstanceOf(RegExp);
      expect(typeof pattern.captureGroup).toBe('number');
      expect(typeof pattern.splitByWhitespace).toBe('boolean');
      expect(typeof pattern.description).toBe('string');
    }

    // Verify we can create custom patterns using the interface
    const customPattern: ClassPattern = {
      regex: /tw-([a-zA-Z0-9-]+)/g,
      captureGroup: 1,
      splitByWhitespace: false,
      description: 'Custom tw- prefixed classes',
    };

    expect(customPattern.description).toBe('Custom tw- prefixed classes');
  });
});

describe('compile', () => {
  const mockCompiler = {
    build: vi.fn().mockReturnValue('/* compiled css */'),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (tailwindCompile as any).mockResolvedValue(mockCompiler);
  });

  test('compiles CSS with default options', async () => {
    const inputCSS = '@import "tailwindcss";';
    const result = await compile(inputCSS);

    expect(tailwindCompile).toHaveBeenCalledWith(inputCSS, {
      base: process.cwd(),
      onDependency: expect.any(Function),
    });

    expect(mockCompiler.build).toHaveBeenCalledWith([]);
    expect(result.css).toBe('/* compiled css */');
    expect(result.dependencies).toBeInstanceOf(Set);
  });

  test('compiles CSS with custom base directory', async () => {
    const inputCSS = '@import "tailwindcss";';
    const customBase = '/custom/path';

    await compile(inputCSS, { base: customBase });

    expect(tailwindCompile).toHaveBeenCalledWith(inputCSS, {
      base: customBase,
      onDependency: expect.any(Function),
    });
  });

  test('extracts candidates from content', async () => {
    const inputCSS = '@import "tailwindcss";';
    const content = '<div class="bg-blue-500 text-white">Test</div>';

    await compile(inputCSS, { content });

    expect(mockCompiler.build).toHaveBeenCalledWith(['bg-blue-500', 'text-white']);
  });

  test('handles multiple content sources', async () => {
    const inputCSS = '@import "tailwindcss";';
    const content = [
      '<div class="bg-red-500">Red</div>',
      '<div className="bg-blue-500">Blue</div>',
    ];

    await compile(inputCSS, { content });

    expect(mockCompiler.build).toHaveBeenCalledWith(['bg-red-500', 'bg-blue-500']);
  });

  test('tracks dependencies', async () => {
    const inputCSS = '@import "tailwindcss";';
    let onDependencyCallback: (dep: string) => void;

    (tailwindCompile as any).mockImplementation((css: string, options: any) => {
      onDependencyCallback = options.onDependency;
      return Promise.resolve(mockCompiler);
    });

    const resultPromise = compile(inputCSS);

    // Simulate dependency tracking
    onDependencyCallback!('/path/to/dependency1.css');
    onDependencyCallback!('/path/to/dependency2.css');

    const result = await resultPromise;

    expect(result.dependencies.has('/path/to/dependency1.css')).toBe(true);
    expect(result.dependencies.has('/path/to/dependency2.css')).toBe(true);
    expect(result.dependencies.size).toBe(2);
  });

  test('handles compilation errors', async () => {
    const inputCSS = '@import "invalid";';
    const error = new Error('Compilation failed');

    (tailwindCompile as any).mockRejectedValue(error);

    await expect(compile(inputCSS)).rejects.toThrow('Compilation failed');
  });
});

describe('compileCSS', () => {
  const mockCompiler = {
    build: vi.fn().mockReturnValue('/* compiled css */'),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (tailwindCompile as any).mockResolvedValue(mockCompiler);
  });

  test('returns only CSS string', async () => {
    const inputCSS = '@import "tailwindcss";';
    const content = '<div class="bg-blue-500">Test</div>';

    const css = await compileCSS(inputCSS, content);

    expect(css).toBe('/* compiled css */');
  });

  test('passes base directory option', async () => {
    const inputCSS = '@import "tailwindcss";';
    const content = '<div class="bg-blue-500">Test</div>';
    const base = '/custom/base';

    await compileCSS(inputCSS, content, base);

    expect(tailwindCompile).toHaveBeenCalledWith(inputCSS, {
      base,
      onDependency: expect.any(Function),
    });
  });
});
