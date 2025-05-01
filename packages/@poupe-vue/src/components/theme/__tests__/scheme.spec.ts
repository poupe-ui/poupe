import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';

import ThemeScheme from '../scheme.vue';

describe('ThemeScheme', () => {
  it('renders properly', () => {
    const wrapper = mount(ThemeScheme, {});

    expect(wrapper.text()).toContain('on surface');
  });
});
