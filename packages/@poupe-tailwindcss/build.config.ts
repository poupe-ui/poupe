import { defineBuildConfig } from 'unbuild';
import {
  mkdirSync,
  writeFileSync,
  readFileSync,
} from 'node:fs';

import {
  join,
} from 'pathe';

import {
  type ThemeOptions,
  type ColorFormat,

  colorFormatter,
  formatTheme,
  makeThemeFromPartialOptions,
} from './src/theme/index';

import { compileCSS } from './src/utils/compile';

type FileThemeOptions<K extends string> = {
  theme: Partial<ThemeOptions<K>>
  format?: ColorFormat
};

const debugThemes = false;

const themes: Record<string, FileThemeOptions<string>> = {
  default: {
    theme: {
      debug: debugThemes,
    },
  },
  style: {
    theme: {
      debug: debugThemes,
      omitTheme: true,
    },
  },
};

function writeTheme<K extends string>(dirname: string, filename: string, format: ColorFormat | undefined, themeOptions: Partial<ThemeOptions<K>>) {
  const theme = makeThemeFromPartialOptions(themeOptions);
  const [indent, newLine] = ['  ', '\n'];

  const lines = formatTheme(theme, 'class', indent, colorFormatter(format));
  const content = [
    '/* This file is auto-generated by @poupe/tailwindcss. DO NOT EDIT */',
    '',
    ...lines,
    '',
  ].join(newLine);

  const destdir = join(process.cwd(), dirname);
  mkdirSync(destdir, { recursive: true });
  writeFileSync(join(destdir, filename), content);
  console.log(`[assets] ✔ Wrote ${content.length} bytes to ${join(dirname, filename)}`);
}

async function generateCSSForExample(input: string, output: string, content: string) {
  const inputPath = `examples/${input}`;
  const outputPath = `examples/${output}`;
  const contentPath = content ? `examples/${content}` : undefined;

  try {
    const inputCSS = readFileSync(inputPath, 'utf8');
    const htmlContent = contentPath ? readFileSync(contentPath, 'utf8') : '';

    // Use the examples directory as base to properly resolve relative imports
    const css = await compileCSS(inputCSS, htmlContent, join(process.cwd(), 'examples'));
    writeFileSync(outputPath, css);
    console.log(`[examples] ✔ Successfully generated: ${outputPath}`);
  } catch (error: unknown) {
    console.error(`[examples] ✘ Failed to generate: ${outputPath}`);
    console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

export default defineBuildConfig({
  entries: [
    { input: 'src/index', name: 'index' },
    { input: 'src/theme/index', name: 'theme' },
    { input: 'src/utils/index', name: 'utils' },
    { input: 'src/assets', name: 'assets', builder: 'copy' },
  ],
  declaration: true,
  sourcemap: true,

  hooks: {
    async 'build:prepare'() {
      // assemble assets
      for (const [filename, { theme, format }] of Object.entries(themes)) {
        writeTheme('src/assets', `${filename}.css`, format, theme);
      }
      // output.css for examples/index.html
      await generateCSSForExample('input.css', 'output.css', 'index.html');
    },
  },
});
