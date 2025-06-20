import { mount } from '@vue/test-utils';
import type { ComponentMountingOptions } from '@vue/test-utils';
import { createPoupe } from '../../composables';

/**
 * Helper to mount components with Poupe context
 * Provides empty Poupe configuration by default
 */
export function mountWithPoupe<T>(
  component: T,
  options?: ComponentMountingOptions<T>,
) {
  return mount(component, {
    ...options,
    global: {
      ...options?.global,
      plugins: [
        ...(options?.global?.plugins || []),
        createPoupe({}),
      ],
    },
  } as ComponentMountingOptions<T>);
}
