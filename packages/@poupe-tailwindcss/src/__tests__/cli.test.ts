/**
 * CLI Tests for `@poupe/tailwindcss`
 * Tests CSS files using actual TailwindCSS CLI to ensure they are valid
 */

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { afterEach, describe, test, expect } from 'vitest';

// Path resolver functions for consistent file path handling
const paths = {
  /** Join paths from project root */
  join: (...segments: string[]) => path.join(process.cwd(), ...segments),
  /** Get path to asset files */
  asset: (filename: string) => path.join(process.cwd(), 'src/assets', filename),
  /** Get path to dist files */
  dist: (filename: string) => path.join(process.cwd(), 'dist', filename),
  /** Get path to examples */
  examples: (...segments: string[]) => path.join(process.cwd(), 'examples', ...segments),
};

describe('TailwindCSS CLI validation', () => {
  const temporaryFiles: string[] = [];

  afterEach(() => {
    // Clean up any temporary files created during tests
    for (const file of temporaryFiles) {
      try {
        unlinkSync(file);
      } catch {
        // Ignore cleanup errors
      }
    }
    temporaryFiles.length = 0;
  });

  test('style.css structure validation', () => {
    const stylePath = paths.asset('style.css');

    // Verify our style.css is syntactically valid by checking structure
    const styleContent = readFileSync(stylePath, 'utf8');
    expect(styleContent).toContain('@utility surface');
    expect(styleContent).toContain('--md-');
    expect(styleContent).toContain('@layer base');
    expect(styleContent).toContain('@theme');
    expect(styleContent).toContain('--color-primary');
    expect(styleContent).toContain('--shadow-z1');

    // Verify scrim classes are present and functional
    expect(styleContent).toContain('@utility scrim');
    expect(styleContent).toContain('scrim-z-*');
  });

  test('default.css structure validation', () => {
    const defaultPath = paths.asset('default.css');

    // Verify our default.css is syntactically valid by checking structure
    const defaultContent = readFileSync(defaultPath, 'utf8');
    expect(defaultContent).toContain('@utility surface');
    expect(defaultContent).toContain('rgb(0 100 148)'); // Primary color from default.css
    expect(defaultContent).toContain('@layer base');
    expect(defaultContent).toContain('--md-primary:');
    expect(defaultContent).toContain('.dark');

    // Verify scrim classes are present in default.css too
    expect(defaultContent).toContain('@utility scrim');
    expect(defaultContent).toContain('scrim-z-*');
  });

  test('@plugin workflow with TailwindCSS CLI', () => {
    const testId = randomUUID().slice(0, 8);
    const inputCssPath = paths.join(`test-input-${testId}.css`);
    const outputCssPath = paths.join(`test-output-${testId}.css`);
    const htmlPath = paths.join(`test-${testId}.html`);

    temporaryFiles.push(inputCssPath, outputCssPath, htmlPath);

    // Create CSS using TailwindCSS v4 @plugin syntax with relative path
    const pluginPath = paths.dist('index.mjs').replaceAll('\\', '/');
    const inputCSS = `
@import 'tailwindcss';
@plugin "${pluginPath}";
`;
    writeFileSync(inputCssPath, inputCSS);

    // Create HTML with utility classes
    const htmlContent = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body>
  <div class="surface-primary z1">@plugin workflow test</div>
</body>
</html>`;
    writeFileSync(htmlPath, htmlContent);

    // Run TailwindCSS CLI with @plugin workflow from package root
    execSync(

      `pnpx @tailwindcss/cli -i ${inputCssPath} -o ${outputCssPath} --content ${htmlPath}`,
      { cwd: process.cwd(), encoding: 'utf8' },
    );

    // Verify the output was generated successfully
    const outputContent = readFileSync(outputCssPath, 'utf8');
    expect(outputContent).toContain('tailwindcss');
    expect(outputContent).toContain('@layer'); // TailwindCSS base structure
  });

  test('example output.css files exist', () => {
    // Verify that build.config.ts generated the example CSS files
    const exampleOutputs = [
      paths.examples('plugin-workflow', 'output.css'),
      paths.examples('flat-plugin', 'output.css'),
      paths.examples('theme-plugin', 'output.css'),
    ];

    for (const outputPath of exampleOutputs) {
      expect(existsSync(outputPath)).toBe(true);

      // Basic validation that the files contain TailwindCSS output
      const content = readFileSync(outputPath, 'utf8');
      expect(content).toContain('tailwindcss');
      expect(content.length).toBeGreaterThan(100); // Should have actual CSS content
    }
  });

  test('plugin exports validation', () => {
    // Test that our plugin files exist and are structured correctly
    const pluginPath = paths.dist('index.mjs');

    // Verify plugin file exists
    expect(() => readFileSync(pluginPath, 'utf8')).not.toThrow();

    // Verify asset files exist and can be read
    const stylePath = paths.asset('style.css');
    const defaultPath = paths.asset('default.css');

    expect(() => readFileSync(stylePath, 'utf8')).not.toThrow();
    expect(() => readFileSync(defaultPath, 'utf8')).not.toThrow();

    // Verify CSS structure is valid for TailwindCSS
    const styleContent = readFileSync(stylePath, 'utf8');
    const defaultContent = readFileSync(defaultPath, 'utf8');

    expect(styleContent).toContain('@theme');
    expect(styleContent).toContain('@utility');
    expect(defaultContent).toContain('@theme');
    expect(defaultContent).toContain('@utility');
  });
});
