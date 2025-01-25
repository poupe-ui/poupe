import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';

import {
  default as Button,
  type ButtonProps,
} from '../button.vue';

describe('Button', () => {
  it('should render correctly', () => {
    const props: ButtonProps = {
      label: 'Button label',
    };

    const wrapper = mount(Button, {
      props,
    });
    expect(wrapper.text()).toBe('Button label');
  });
});
