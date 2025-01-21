import { dirname } from 'pathe';
import type { ComponentResolverObject } from 'unplugin-vue-components';

export const components = [
  'Button',
  'Card',
  'Placeholder',
  'ThemeScheme',
] as const;

export type ComponentName = typeof components[number];

export interface ResolverOptions {
  /** @defaultValue 'P' */
  prefix?: string
}

export const createResolver = (options: ResolverOptions = {}): ComponentResolverObject => {
  const { prefix = 'P' } = options;
  return {
    type: 'component',
    resolve: (name: string) => {
      const componentName = prefix ? deprefix(name, prefix) : name;
      if (componentName && components.includes(componentName as ComponentName)) {
        return {
          name: componentName,
          from: '@poupe/vue',
        };
      }
    },
  };
};

export default createResolver;

/** @returns the directory path to the `@poupe/vue` package */
export const contentPath = () => dirname(new URL(import.meta.url).pathname);

/** @returns the glob patterns needed by tailwindcss to scan classes */
export const contentGlobs = (): string[] => {
  const path = contentPath();
  return [
    `${path}/index.mjs`,
    `${path}/**/*.vue`,
  ];
};

const deprefix = (name: string, prefix: string) => name.startsWith(prefix) ? name.slice(prefix.length) : undefined;
