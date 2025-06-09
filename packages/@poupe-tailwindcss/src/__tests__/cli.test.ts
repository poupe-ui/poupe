/**
 * CLI Tests for `@poupe/tailwindcss`
 * Tests CSS compilation using TailwindCSS programmatic API for better error handling
 */

import { compile, compileCSS } from '../utils/compile';
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
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
    expect(styleContent).toContain('scrim-*');

    // Verify simplified scrim naming (without z- prefix)
    expect(styleContent).toContain('@utility scrim-base');
    expect(styleContent).toContain('@utility scrim-modal');
    expect(styleContent).toContain('@utility scrim-drawer');
    expect(styleContent).toContain('@utility scrim-content');
    expect(styleContent).toContain('@utility scrim-elevated');
    expect(styleContent).toContain('@utility scrim-system');

    // Verify old z- prefixed naming is gone
    expect(styleContent).not.toContain('@utility scrim-z-*');
    expect(styleContent).not.toContain('@utility scrim-z-base');
    expect(styleContent).not.toContain('@utility scrim-z-modal');
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
    expect(defaultContent).toContain('scrim-*');
    expect(defaultContent).not.toContain('scrim-z-*');
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

  test('@plugin workflow with programmatic API', async () => {
    const testId = randomUUID().slice(0, 8);
    const outputCssPath = paths.join(`test-output-${testId}.css`);
    temporaryFiles.push(outputCssPath);

    // Create CSS using TailwindCSS v4 @plugin syntax
    const pluginPath = paths.dist('index.mjs').replaceAll('\\', '/');
    const inputCSS = `
@import 'tailwindcss';
@plugin "${pluginPath}";
`;

    // HTML content to scan for utility classes
    const htmlContent = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body>
  <div class="surface-primary z1">@plugin workflow test</div>

  <!-- Test scrim utilities without modifiers (default opacity) -->
  <div class="scrim-modal">Default modal scrim</div>
  <div class="scrim-drawer">Default drawer scrim</div>

  <!-- Test scrim utilities with opacity modifiers -->
  <div class="scrim-modal/50">Modal scrim with 50% opacity</div>
  <div class="scrim-drawer/75">Drawer scrim with 75% opacity</div>
  <div class="scrim-elevated/25">Elevated scrim with 25% opacity</div>

  <!-- Test arbitrary z-index with opacity modifiers -->
  <div class="scrim-[100]/25">Custom z-index scrim with 25% opacity</div>
  <div class="scrim-[1250]/60">High z-index scrim with 60% opacity</div>
</body>
</html>`;

    try {
      // Compile CSS with simplified convenience function
      const outputCSS = await compileCSS(inputCSS, htmlContent, process.cwd());

      // Write output for inspection if needed
      writeFileSync(outputCssPath, outputCSS);

      // Verify the output contains expected content
      expect(outputCSS).toContain('tailwindcss');
      expect(outputCSS).toContain('@layer');
      expect(outputCSS).toContain('.surface-primary');
      expect(outputCSS).toContain('.scrim-modal');

      // Verify scrim utilities with modifiers are correctly generated
      expect(outputCSS).toMatch(/--md-scrim-opacity: --modifier\(\[percentage\]\)/);
      expect(outputCSS).toContain('background-color: rgb(var(--md-scrim-rgb)');
    } catch (error) {
      // Better error handling with detailed messages
      if (error instanceof Error) {
        throw new TypeError(`TailwindCSS compilation failed: ${error.message}\n${error.stack}`);
      }
      throw error;
    }
  });

  test('CSS assets combined with TailwindCSS base using programmatic API', async () => {
    const testId = randomUUID().slice(0, 8);
    const outputCssPath = paths.join(`test-output-combined-${testId}.css`);
    temporaryFiles.push(outputCssPath);

    // Read style.css to extract just the theme variables and utility definitions
    const styleContent = readFileSync(paths.asset('style.css'), 'utf8');

    // Create a test CSS that combines TailwindCSS base with our theme/utilities
    const inputCSS = `@import 'tailwindcss';
${styleContent}`;

    // HTML content with utility classes to test
    const htmlContent = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body>
  <div class="surface-primary z1">Surface with elevation</div>
  <div class="scrim-modal">Modal scrim</div>
  <div class="bg-primary text-on-primary">Primary colors</div>
  <div class="surface-container-high">Container surface</div>
</body>
</html>`;

    try {
      // Compile CSS with simplified convenience function
      const outputCSS = await compileCSS(inputCSS, htmlContent);

      // Write output for inspection if needed
      writeFileSync(outputCssPath, outputCSS);

      // Verify output contains our utilities
      expect(outputCSS).toBeDefined();
      expect(outputCSS.length).toBeGreaterThan(1000);

      // Check for our custom utilities in the output
      expect(outputCSS).toMatch(/surface-primary|scrim-modal|z1/);
    } catch (error) {
      // Better error handling with detailed messages
      if (error instanceof Error) {
        throw new TypeError(`TailwindCSS compilation failed: ${error.message}\n${error.stack}`);
      }
      throw error;
    }
  });

  test('all 4 example inputs produce similar output with programmatic API', async () => {
    const htmlPath = paths.examples('index.html');
    const htmlContent = readFileSync(htmlPath, 'utf8');

    // All 4 input CSS files to test
    const inputFiles = [
      paths.examples('input.css'),
      paths.examples('default-plugin.css'),
      paths.examples('flat-plugin.css'),
      paths.examples('theme-plugin.css'),
    ];

    const outputs: string[] = [];

    // Process each input file and collect outputs
    for (const inputPath of inputFiles) {
      const inputCSS = readFileSync(inputPath, 'utf8');

      try {
        // Compile CSS with simplified convenience function
        const outputCSS = await compileCSS(inputCSS, htmlContent, path.dirname(inputPath));

        // Basic validation
        expect(outputCSS).toContain('tailwindcss');
        expect(outputCSS.length).toBeGreaterThan(1000);

        // Store the output for comparison
        outputs.push(outputCSS);
      } catch (error) {
        const filename = path.basename(inputPath);
        if (error instanceof Error) {
          throw new TypeError(`TailwindCSS compilation failed for ${filename}: ${error.message}`);
        }
        throw error;
      }
    }

    // Compare all outputs - they should contain similar utilities
    const [baseOutput, ...otherOutputs] = outputs;

    for (const output of otherOutputs) {
      // Verify key utilities are present in all outputs
      expect(output).toContain('.surface-primary');
      expect(output).toContain('.scrim-modal');
      expect(output).toContain('--md-scrim-opacity: --modifier([percentage])');
      expect(output).toContain('background-color: rgb(var(--md-scrim-rgb)');

      // Check that both have similar content length (within 10%)
      const sizeDiff = Math.abs(output.length - baseOutput.length) / baseOutput.length;
      expect(sizeDiff).toBeLessThan(0.1); // Less than 10% difference

      // Verify key utilities that are actually used in HTML are present in both
      const keyUtilities = ['scrim-modal', 'scrim-base', 'surface-primary', 'surface-secondary', 'surface-tertiary'];
      for (const utility of keyUtilities) {
        expect(baseOutput).toContain(`.${utility}`);
        expect(output).toContain(`.${utility}`);
      }
    }
  });

  test('scrim opacity modifiers generate correct CSS with programmatic API', async () => {
    const pluginPath = paths.dist('index.mjs').replaceAll('\\', '/');
    const inputCSS = `
@import 'tailwindcss';
@plugin "${pluginPath}";
`;

    // HTML content with specific scrim utilities that use opacity modifiers
    const htmlContent = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body>
  <!-- Basic scrim without modifier (should use default opacity) -->
  <div class="scrim-modal">Default modal scrim</div>
  <div class="scrim-drawer">Default drawer scrim</div>
  <div class="scrim-elevated">Default elevated scrim</div>

  <!-- Scrim with specific opacity modifiers -->
  <div class="scrim-modal/50">Modal scrim with 50% opacity</div>
  <div class="scrim-drawer/25">Drawer scrim with 25% opacity</div>
  <div class="scrim-elevated/75">Elevated scrim with 75% opacity</div>

  <!-- Arbitrary z-index with opacity modifiers -->
  <div class="scrim-[100]/10">Custom z-index scrim with 10% opacity</div>
  <div class="scrim-[1500]/90">High z-index scrim with 90% opacity</div>
</body>
</html>`;

    try {
      // Compile CSS and get additional metadata for debugging
      const { css: outputCSS } = await compile(inputCSS, {
        content: htmlContent,
        base: process.cwd(),
      });

      // Write output for debugging
      const debugPath = paths.join(`test-debug-scrim-${randomUUID().slice(0, 8)}.css`);
      writeFileSync(debugPath, outputCSS);
      temporaryFiles.push(debugPath);

      // Verify scrim utilities are present in the output
      expect(outputCSS).toContain('.scrim-modal');
      expect(outputCSS).toContain('.scrim-drawer');
      expect(outputCSS).toContain('.scrim-elevated');

      // Verify the base scrim utility exists
      expect(outputCSS).toContain('.scrim');

      // Verify each scrim utility has the correct structure
      const expectedScrimUtilities = ['scrim-modal', 'scrim-drawer', 'scrim-elevated'];

      for (const utility of expectedScrimUtilities) {
        // Each utility should have the modifier declaration
        expect(outputCSS).toMatch(new RegExp(`\\.${utility}[^{]*\\{[^}]*--md-scrim-opacity: --modifier\\(\\[percentage\\]\\)[^}]*\\}`));

        // Each utility should have the RGB variable background-color
        expect(outputCSS).toMatch(new RegExp(`\\.${utility}[^{]*\\{[^}]*background-color: rgb\\(var\\(--md-scrim-rgb\\)[^}]*\\)`));

        // Each utility should have proper z-index
        expect(outputCSS).toMatch(new RegExp(`\\.${utility}[^{]*\\{[^}]*z-index: var\\(--md-z-${utility.replace('scrim-', 'scrim-')}\\)[^}]*\\}`));
      }

      // Verify the modifier system is correctly set up
      const modifierDeclarations = outputCSS.match(/--md-scrim-opacity: --modifier\(\[percentage\]\)/g) || [];
      expect(modifierDeclarations.length).toBeGreaterThan(0);

      // Verify the background-color uses percentage syntax
      expect(outputCSS).toMatch(/var\(--md-scrim-opacity, 32%\)/);

      // Verify the CSS is substantial and complete
      expect(outputCSS.length).toBeGreaterThan(5000);
    } catch (error) {
      // Better error handling with detailed messages
      if (error instanceof Error) {
        throw new TypeError(`TailwindCSS compilation failed: ${error.message}\n${error.stack}`);
      }
      throw error;
    }
  });
});
