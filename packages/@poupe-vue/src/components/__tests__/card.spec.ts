import { describe, it, expect } from 'vitest';
import { mountWithPoupe } from './test-utils';

import Card from '../card.vue';

describe('Card', () => {
  it('renders properly', () => {
    const wrapper = mountWithPoupe(Card, {
      slots: {
        default: 'card body',
      },
    });
    expect(wrapper.text()).toContain('card body');
  });
});
