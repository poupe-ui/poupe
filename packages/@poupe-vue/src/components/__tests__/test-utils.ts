import { mount } from '@vue/test-utils';
import { createPoupe } from '../../composables';

/**
 * Helper to mount components with Poupe context
 * Provides empty Poupe configuration by default
 */
export const mountWithPoupe = (
  component: Parameters<typeof mount>[0],
  options: Parameters<typeof mount>[1] = {},
) => {
  return mount(component, {
    ...options,
    global: {
      ...options.global,
      plugins: [
        ...(options.global?.plugins || []),
        createPoupe({}),
      ],
    },
  });
};
