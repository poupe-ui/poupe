// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat';
import { forNuxtModules } from '@poupe/eslint-config/nuxt';

// Run `pnpx @eslint/config-inspector` to inspect the resolved config interactively
export default createConfigForNuxt({
  features: {
    // Rules for module authors
    tooling: true,
    // Rules for formatting
    stylistic: true,
  },
  dirs: {
    src: [
      './playground',
    ],
  },
}, forNuxtModules());
