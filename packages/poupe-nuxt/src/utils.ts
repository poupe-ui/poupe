import { createResolver } from '@nuxt/kit';

export const createDefaultResolver = () => {
  const { resolve } = createResolver(import.meta.url);
  return resolve;
};
