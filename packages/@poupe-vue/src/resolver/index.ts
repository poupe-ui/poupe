import type { ComponentResolverObject } from 'unplugin-vue-components';

export const components = [
  'Button',
  'Card',
  'Icon',
  'Input',
  'Placeholder',
  'Surface',
] as const;

export const themeComponents = [
  'ThemeScheme',
] as const;

export type ComponentName = typeof components[number];
export type ThemeComponentName = typeof themeComponents[number];

export const DEFAULT_PREFIX = 'P';

export interface ResolverOptions {
  /** @defaultValue 'P' */
  prefix?: string
}

/** @returns kebab-case and snake_case to CamelCase to be used
 * as component prefix
 */
export const normalizedComponentPrefix = (s: string): string => {
  return s.replaceAll(/^[-_]+|[-_]+$/g, '')
    .replaceAll(/(^|[-_]+)([a-z])/g, (_, prefix, char) => char.toUpperCase());
};

export const createResolver = (options: ResolverOptions = {}): ComponentResolverObject => {
  const { prefix: $prefix = DEFAULT_PREFIX } = options;
  const prefix = normalizedComponentPrefix($prefix);

  return {
    type: 'component',
    resolve: (name: string) => {
      const componentName = prefix ? deprefix(name, prefix) : name;
      if (componentName) {
        if (components.includes(componentName as ComponentName)) {
          return {
            name: componentName,
            from: '@poupe/vue',
          };
        }
        if (themeComponents.includes(componentName as ThemeComponentName)) {
          return {
            name: componentName,
            from: '@poupe/vue/theme-scheme',
          };
        }
      }
    },
  };
};

export default createResolver;

const deprefix = (name: string, prefix: string) => name.startsWith(prefix) ? name.slice(prefix.length) : undefined;
