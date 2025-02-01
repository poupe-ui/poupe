import { createResolver } from '@nuxt/kit';
import stringifyObject from 'stringify-object';

export const createDefaultResolver = () => {
  const { resolve } = createResolver(import.meta.url);
  return resolve;
};

export const stringify = (input: unknown): string => stringifyObject(input, {
  indent: '  ',
  singleQuotes: true,
});
