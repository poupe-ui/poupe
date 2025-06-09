/**
 * Simplified TailwindCSS compilation wrapper for testing
 */

import { compile as tailwindCompile } from '@tailwindcss/node';

export interface CompileOptions {
  /** Base directory for resolving imports */
  base?: string
  /** HTML or other content containing candidate classes */
  content?: string | string[]
}

export interface CompileResult {
  /** The generated CSS output */
  css: string
  /** Dependencies tracked during compilation */
  dependencies: Set<string>
}

/**
 * Compile TailwindCSS with content scanning
 * @param inputCSS - The input CSS containing import and plugin directives
 * @param options - Compilation options
 * @returns Promise resolving to the compiled CSS and metadata
 */
export async function compile(
  inputCSS: string,
  options: CompileOptions = {},
): Promise<CompileResult> {
  const { base = process.cwd(), content = '' } = options;
  const dependencies = new Set<string>();

  // Compile the CSS
  const compiler = await tailwindCompile(inputCSS, {
    base,
    onDependency: dep => dependencies.add(dep),
  });

  // Extract candidate classes from content
  const candidates = extractCandidates(content);

  // Build CSS for the found candidates
  const css = compiler.build(candidates);

  return { css, dependencies };
}

/**
 * Pattern configuration for extracting class candidates
 */
export interface ClassPattern {
  /** Regular expression to match the pattern */
  regex: RegExp
  /** Index of the capture group containing class names */
  captureGroup: number
  /** Whether to split the captured text by whitespace */
  splitByWhitespace: boolean
  /** Description of what this pattern matches */
  description: string
}

/**
 * Patterns for extracting class candidates from different frameworks/syntaxes
 */
export const CLASS_PATTERNS: ClassPattern[] = [
  {
    regex: /class=["']([^"']+)["']/g,
    captureGroup: 1,
    splitByWhitespace: true,
    description: 'HTML class attributes',
  },
  {
    regex: /className=["']([^"']+)["']/g,
    captureGroup: 1,
    splitByWhitespace: true,
    description: 'React/JSX className attributes',
  },
  {
    regex: /class:([^=\s>]+)/g,
    captureGroup: 1,
    splitByWhitespace: false,
    description: 'Svelte class directive',
  },
  {
    regex: /:class=["'][^"']*["']([^"']+)["'][^"']*["']/g,
    captureGroup: 1,
    splitByWhitespace: true,
    description: 'Vue :class bindings (simplified)',
  },
];

/**
 * Extract candidate classes from HTML or text content
 * @param content - HTML or text content to scan for classes
 * @returns Array of candidate class names
 */
export function extractCandidates(content: string | string[]): string[] {
  const contents = Array.isArray(content) ? content : [content];
  const candidates = new Set<string>();

  for (const text of contents) {
    for (const pattern of CLASS_PATTERNS) {
      const matches = text.matchAll(pattern.regex);

      for (const match of matches) {
        const captured = match[pattern.captureGroup];
        if (!captured) continue;

        if (pattern.splitByWhitespace) {
          // Split by whitespace and add each class
          const classes = captured.split(/\s+/).filter(Boolean);
          for (const cls of classes) {
            candidates.add(cls);
          }
        } else {
          // Add the captured text as-is
          candidates.add(captured);
        }
      }
    }
  }

  return [...candidates];
}

/**
 * Compile CSS and return just the CSS string
 * Convenience wrapper for simple use cases
 */
export async function compileCSS(
  inputCSS: string,
  content: string | string[],
  base?: string,
): Promise<string> {
  const result = await compile(inputCSS, { base, content });
  return result.css;
}
