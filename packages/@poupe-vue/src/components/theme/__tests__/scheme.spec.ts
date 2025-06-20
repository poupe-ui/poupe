import { describe, it, expect } from 'vitest';
import { mountWithPoupe } from '../../__tests__/test-utils';

import ThemeScheme from '../scheme.vue';

describe('ThemeScheme', () => {
  it('renders properly', () => {
    const wrapper = mountWithPoupe(ThemeScheme, {});

    expect(wrapper.text()).toContain('on surface');
  });
});
