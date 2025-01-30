import type { ComponentResolverObject } from 'unplugin-vue-components';

export const components = [
  'Placeholder',
];

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
      if (componentName && components.includes(componentName)) {
        return {
          name: componentName,
          from: '@poupe/vue',
        };
      }
    },
  };
};

export default createResolver;

const deprefix = (name: string, prefix: string) => name.startsWith(prefix) ? name.slice(prefix.length) : undefined;
