import { createResolver } from '@nuxt/kit';
import stringifyObject from 'stringify-object';

export const createDefaultResolver = () => {
  const { resolve } = createResolver(import.meta.url);
  return resolve;
};

export const resolvePackage = (pkg: string): string => new URL(import.meta.resolve(pkg)).pathname;

export const stringify = (input: unknown): string => stringifyObject(input, {
  indent: '  ',
  singleQuotes: true,
});
