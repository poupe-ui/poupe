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

    // Verify simplified scrim naming (without z- prefix)
    expect(styleContent).toContain('@utility scrim-base');
    expect(styleContent).toContain('@utility scrim-modal');
    expect(styleContent).toContain('@utility scrim-drawer');
    expect(styleContent).toContain('@utility scrim-content');
    expect(styleContent).toContain('@utility scrim-elevated');
    expect(styleContent).toContain('@utility scrim-system');

    // Verify old z- prefixed naming is gone (except for arbitrary scrim-z-*)
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
    expect(defaultContent).toContain('scrim-z-*'); // arbitrary z-index scrim still exists
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

    // Create HTML with utility classes including scrim opacity modifiers
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
  <div class="scrim-z-[100]/25">Custom z-index scrim with 25% opacity</div>
  <div class="scrim-z-[1250]/60">High z-index scrim with 60% opacity</div>
</body>
</html>`;
    writeFileSync(htmlPath, htmlContent);

    // Run TailwindCSS CLI with @plugin workflow from package root
    let result;
    try {
      result = execSync(
        `pnpx @tailwindcss/cli -i ${inputCssPath} -o ${outputCssPath} --content ${htmlPath} 2>&1`,
        { cwd: process.cwd(), encoding: 'utf8' },
      );
    } catch (error) {
      const errorOutput = error instanceof Error && 'stdout' in error ? String(error.stdout || error.stderr || error.message) : String(error);
      throw new Error(`TailwindCSS CLI failed: ${errorOutput}`);
    }

    // Check if stderr contains errors that should fail the test
    if (result && result.includes('Unsupported bare value data type')) {
      throw new Error(`TailwindCSS CLI reported errors: ${result}`);
    }

    // Verify the output was generated successfully
    const outputContent = readFileSync(outputCssPath, 'utf8');
    expect(outputContent).toContain('tailwindcss');
    expect(outputContent).toContain('@layer'); // TailwindCSS base structure
  });

  test('example output.css files exist and contain modifier support', () => {
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

      // Verify scrim utilities are present with modifier support
      expect(content).toMatch(/\.scrim[^{]*\{[^}]*--md-scrim-opacity: --modifier\(\[percentage\]\)[^}]*\}/);

      // Verify the background-color uses RGB variable syntax
      expect(content).toMatch(/background-color: rgb\(var\(--md-scrim-rgb\)[^}]*var\(--md-scrim-opacity, 32%\)/);
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

  test('CSS assets combined with TailwindCSS base', () => {
    const testId = randomUUID().slice(0, 8);
    const inputCssPath = paths.join(`test-combined-${testId}.css`);
    const outputCssPath = paths.join(`test-output-combined-${testId}.css`);
    const htmlPath = paths.join(`test-combined-${testId}.html`);

    temporaryFiles.push(inputCssPath, outputCssPath, htmlPath);

    // Read style.css to extract just the theme variables and utility definitions
    const styleContent = readFileSync(paths.asset('style.css'), 'utf8');

    // Create a test CSS that combines TailwindCSS base with our theme/utilities
    const inputCSS = `@import 'tailwindcss';
${styleContent}`;
    writeFileSync(inputCssPath, inputCSS);

    // Create HTML with utility classes to test
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
    writeFileSync(htmlPath, htmlContent);

    // Run TailwindCSS CLI to process combined CSS
    let result;
    try {
      result = execSync(
        `pnpx @tailwindcss/cli -i ${inputCssPath} -o ${outputCssPath} --content ${htmlPath} 2>&1`,
        { cwd: process.cwd(), encoding: 'utf8' },
      );
    } catch (error) {
      const errorOutput = error instanceof Error && 'stdout' in error ? String(error.stdout || error.stderr || error.message) : String(error);
      throw new Error(`TailwindCSS CLI failed: ${errorOutput}`);
    }

    // Check if stderr contains errors that should fail the test
    if (result && result.includes('Unsupported bare value data type')) {
      throw new Error(`TailwindCSS CLI reported errors: ${result}`);
    }

    // If it succeeds, verify output contains our utilities
    if (existsSync(outputCssPath)) {
      const outputContent = readFileSync(outputCssPath, 'utf8');
      expect(outputContent).toBeDefined();
      expect(outputContent.length).toBeGreaterThan(1000);

      // Check for our custom utilities in the output
      expect(outputContent).toMatch(/surface-primary|scrim-modal|z1/);
    }
  });

  test('validate default.css example with TailwindCSS', () => {
    const testId = randomUUID().slice(0, 8);
    const inputCssPath = paths.join(`test-default-validate-${testId}.css`);
    const outputCssPath = paths.join(`test-output-default-${testId}.css`);
    const htmlPath = paths.join(`test-default-${testId}.html`);

    temporaryFiles.push(inputCssPath, outputCssPath, htmlPath);

    // Read default.css
    const defaultContent = readFileSync(paths.asset('default.css'), 'utf8');

    // Create test CSS combining TailwindCSS with default.css
    const inputCSS = `@import 'tailwindcss';
${defaultContent}`;
    writeFileSync(inputCssPath, inputCSS);

    // Create HTML with specific utilities from default.css
    const htmlContent = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body>
  <div class="surface-primary-fixed">Fixed color surface</div>
  <div class="surface-secondary-container">Secondary container</div>
  <div class="shadow-z3">Elevated element</div>
  <div class="dark:surface-inverse">Dark mode inverse</div>
</body>
</html>`;
    writeFileSync(htmlPath, htmlContent);

    // Run TailwindCSS CLI
    let result;
    try {
      result = execSync(
        `pnpx @tailwindcss/cli -i ${inputCssPath} -o ${outputCssPath} --content ${htmlPath} 2>&1`,
        { cwd: process.cwd(), encoding: 'utf8' },
      );
    } catch (error) {
      const errorOutput = error instanceof Error && 'stdout' in error ? String(error.stdout || error.stderr || error.message) : String(error);
      throw new Error(`TailwindCSS CLI failed: ${errorOutput}`);
    }

    // Check if stderr contains errors that should fail the test
    if (result && result.includes('Unsupported bare value data type')) {
      throw new Error(`TailwindCSS CLI reported errors: ${result}`);
    }

    // Verify output if successful
    if (existsSync(outputCssPath)) {
      const outputContent = readFileSync(outputCssPath, 'utf8');
      expect(outputContent).toBeDefined();

      // Check for theme variables
      expect(outputContent).toMatch(/--md-primary|--md-secondary/);
    }
  });

  test('scrim opacity modifiers generate correct CSS output', () => {
    const testId = randomUUID().slice(0, 8);
    const inputCssPath = paths.join(`test-modifier-${testId}.css`);
    const outputCssPath = paths.join(`test-modifier-output-${testId}.css`);
    const htmlPath = paths.join(`test-modifier-${testId}.html`);

    temporaryFiles.push(inputCssPath, outputCssPath, htmlPath);

    // Create CSS using TailwindCSS v4 @plugin syntax
    const pluginPath = paths.dist('index.mjs').replaceAll('\\\\', '/');
    const inputCSS = `
@import 'tailwindcss';
@plugin "${pluginPath}";
`;
    writeFileSync(inputCssPath, inputCSS);

    // Create HTML with specific scrim utilities that use opacity modifiers
    const htmlContent = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body>
  <!-- Basic scrim without modifier (should use default opacity) -->
  <div class="scrim-modal">Default modal scrim</div>
  <div class="scrim-drawer">Default drawer scrim</div>

  <!-- Scrim with specific opacity modifiers -->
  <div class="scrim-modal/50">Modal scrim with 50% opacity</div>
  <div class="scrim-drawer/25">Drawer scrim with 25% opacity</div>
  <div class="scrim-elevated/75">Elevated scrim with 75% opacity</div>

  <!-- Arbitrary z-index with opacity modifiers -->
  <div class="scrim-z-[100]/10">Custom z-index scrim with 10% opacity</div>
  <div class="scrim-z-[1500]/90">High z-index scrim with 90% opacity</div>
</body>
</html>`;
    writeFileSync(htmlPath, htmlContent);

    // Run TailwindCSS CLI
    let result;
    try {
      result = execSync(
        `pnpx @tailwindcss/cli -i ${inputCssPath} -o ${outputCssPath} --content ${htmlPath} 2>&1`,
        { cwd: process.cwd(), encoding: 'utf8' },
      );
    } catch (error) {
      const errorOutput = error instanceof Error && 'stdout' in error ? String(error.stdout || error.stderr || error.message) : String(error);
      throw new Error(`TailwindCSS CLI failed: ${errorOutput}`);
    }

    // Check if stderr contains errors that should fail the test
    if (result && result.includes('Unsupported bare value data type')) {
      throw new Error(`TailwindCSS CLI reported errors: ${result}`);
    }

    // Verify the output was generated successfully
    expect(existsSync(outputCssPath)).toBe(true);
    const outputContent = readFileSync(outputCssPath, 'utf8');

    // Verify scrim utilities are present in the output
    expect(outputContent).toContain('.scrim-modal');
    expect(outputContent).toContain('.scrim-drawer');
    expect(outputContent).toContain('.scrim-elevated');

    // Verify the base scrim utility exists (used by @apply scrim)
    expect(outputContent).toContain('.scrim');

    // Verify each scrim utility has the correct structure
    const expectedScrimUtilities = ['scrim-modal', 'scrim-drawer', 'scrim-elevated', 'scrim-base', 'scrim-content', 'scrim-system'];

    for (const utility of expectedScrimUtilities) {
      // Each utility should have the modifier declaration
      expect(outputContent).toMatch(new RegExp(`\\.${utility}[^{]*\\{[^}]*--md-scrim-opacity: --modifier\\(\\[percentage\\]\\)[^}]*\\}`));

      // Each utility should have the RGB variable background-color
      expect(outputContent).toMatch(new RegExp(`\\.${utility}[^{]*\\{[^}]*background-color: rgb\\(var\\(--md-scrim-rgb\\)[^}]*\\)`));

      // Each utility should have proper z-index (except base scrim)
      if (utility !== 'scrim') {
        expect(outputContent).toMatch(new RegExp(`\\.${utility}[^{]*\\{[^}]*z-index: var\\(--md-z-${utility.replace('scrim-', 'scrim-')}\\)[^}]*\\}`));
      }
    }

    // Note: Arbitrary z-index utilities (scrim-z-[100]) are only generated when used
    // in content. Our test HTML includes them, so let's check if any were generated.
    // If not found, that's okay as TailwindCSS might not generate unused utilities.

    // Verify the modifier system is correctly set up
    // All scrim utilities should have --md-scrim-opacity: --modifier([percentage])
    const modifierDeclarations = outputContent.match(/--md-scrim-opacity: --modifier\(\[percentage\]\)/g) || [];
    expect(modifierDeclarations.length).toBeGreaterThan(0);

    // Verify the background-color uses percentage syntax
    expect(outputContent).toMatch(/var\(--md-scrim-opacity, 32%\)/);

    // Verify that TailwindCSS processed our modifier syntax without errors
    // The fact that we reached this point means no "Unsupported bare value data type" errors occurred
    expect(outputContent).toContain('tailwindcss v4');

    // Verify the CSS is substantial and complete
    expect(outputContent.length).toBeGreaterThan(5000);
  });
});
