import { dirname } from 'pathe';

import ScrollbarPlugin from 'tailwind-scrollbar';

/** @returns array of required third-party tailwind plugins */
export const tailwindPlugins = [
  ScrollbarPlugin,
];

/** @returns the directory path to the `@poupe/vue` package */
export const contentPath = () => dirname(new URL(import.meta.url).pathname);

/** @returns the glob patterns needed by tailwindcss to scan classes */
export const contentGlobs = (): string[] => {
  const path = contentPath();
  return [
    `${path}/index.mjs`,
  ];
};
