import { addPlugin } from '@nuxt/kit';

import type { SetupContext } from './types';

export const setupPlugins = <K extends string>(context: SetupContext<K>) => {
  const { resolve } = context;
  addPlugin(resolve('./runtime/plugin'));
};
