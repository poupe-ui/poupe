import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';

import Card from '../card.vue';

describe('Card', () => {
  it('renders properly', () => {
    const wrapper = mount(Card, {
      slots: {
        default: 'card body',
      },
    });
    expect(wrapper.text()).toContain('card body');
  });
});
