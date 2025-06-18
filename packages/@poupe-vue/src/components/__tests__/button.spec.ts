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
describe('Button', () => {
  // Basic rendering tests
  it('should render with default props', () => {
    const wrapper = mount(Button);
    expect(wrapper.text()).toBe('Button');
    expect(wrapper.classes()).toContain('text-base'); // default size
  });

  it('should render custom label', () => {
    const wrapper = mount(Button, {
      props: { label: 'Click me' },
    });
    expect(wrapper.text()).toBe('Click me');
  });

  it('should render label with ellipsis', () => {
    const wrapper = mount(Button, {
      props: {
        label: 'Click me',
        ellipsis: true,
      },
    });
    expect(wrapper.text()).toBe('Click me…');
  });

  // Slot tests
  it('should render slot content when no label provided', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Slot content',
      },
    });
    expect(wrapper.text()).toBe('Slot content');
  });

  // Variant tests
  it('should apply border variants correctly', () => {
    const wrapper = mount(Button, {
      props: { border: 'primary' },
    });
    expect(wrapper.classes()).toContain('border-primary');
  });

  it('should apply rounded variants correctly', () => {
    const wrapper = mount(Button, {
      props: { rounded: 'lg' },
    });
    expect(wrapper.classes()).toContain('rounded-lg');
  });

  it('should apply shadow variants correctly', () => {
    const wrapper = mount(Button, {
      props: { shadow: 'z3' },
    });
    expect(wrapper.classes()).toContain('shadow-z3');
  });

  it('should apply surface variants correctly', () => {
    const wrapper = mount(Button, {
      props: { surface: 'primary' },
    });
    expect(wrapper.classes()).toContain('interactive-surface-primary');
  });

  it('should expand when expand prop is true', () => {
    const wrapper = mount(Button, {
      props: { expand: true },
    });
    expect(wrapper.classes()).toContain('w-full');
  });

  // Event handling
  it('should emit click event when clicked', async () => {
    const wrapper = mount(Button);
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
  });

  // Multiple variants combination
  it('should apply multiple variants correctly', () => {
    const props: ButtonProps = {
      size: 'lg',
      border: 'primary',
      rounded: 'lg',
      shadow: 'z1',
      surface: 'primary',
      expand: true,
    };
    const wrapper = mount(Button, { props });

    expect(wrapper.classes()).toContain('text-base'); // lg size class
    expect(wrapper.classes()).toContain('border-primary');
    expect(wrapper.classes()).toContain('rounded-lg');
    expect(wrapper.classes()).toContain('shadow-z1');
    expect(wrapper.classes()).toContain('interactive-surface-primary');
    expect(wrapper.classes()).toContain('w-full');
  });
});
