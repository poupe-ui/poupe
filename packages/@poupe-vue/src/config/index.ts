import { fileURLToPath } from 'node:url';

import ScrollbarPlugin from 'tailwind-scrollbar';

/** @returns array of required third-party tailwind plugins */
export const tailwindPlugins = [
  ScrollbarPlugin,
];

/**
 * @returns the `@poupe/vue` `dist/` directory that `contentGlobs()` scans.
 * `..` against the module URL skips two segments at once
 * (`index.mjs` + the per-subpath folder) — obuild emits this file at
 * `dist/config/index.mjs`, so `..` lands on `dist/`. `fileURLToPath`
 * keeps the path portable on Windows.
 */
export const contentPath = (): string =>
  fileURLToPath(new URL('..', import.meta.url));

/** audiences whose bundled outputs contain template CSS classes */
const contentEntries = [
  'components',
  'theme-scheme',
] as const;

/** @returns the glob patterns needed by tailwindcss to scan classes */
export const contentGlobs = (): string[] => {
  const path = contentPath();
  return contentEntries.map((entry) => `${path}/${entry}/index.{mjs,css}`);
};
