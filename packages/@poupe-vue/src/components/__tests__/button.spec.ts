import { describe, it, expect } from 'vitest';
import { mountWithPoupe } from './test-utils';

import {
  default as Button,
  type ButtonProps,
} from '../button.vue';

describe('Button', () => {
  it('should render correctly', () => {
    const props: ButtonProps = {
      label: 'Button label',
    };

    const wrapper = mountWithPoupe(Button, {
      props,
    });
    expect(wrapper.text()).toBe('Button label');
    expect(wrapper.html()).toMatchSnapshot();
  });
  // Basic rendering tests
  it('should render with default props', () => {
    const wrapper = mountWithPoupe(Button, {
      props: { label: 'Button' },
    });
    expect(wrapper.text()).toBe('Button');
    expect(wrapper.classes()).toContain('text-sm'); // default size 'base' uses text-sm
  });

  it('should render custom label', () => {
    const wrapper = mountWithPoupe(Button, {
      props: { label: 'Click me' },
    });
    expect(wrapper.text()).toBe('Click me');
  });

  it('should render label with ellipsis', () => {
    const wrapper = mountWithPoupe(Button, {
      props: {
        label: 'Click me',
        ellipsis: true,
      },
    });
    expect(wrapper.text()).toBe('Click me…');
  });

  // Slot tests
  it('should render slot content when no label provided', () => {
    const wrapper = mountWithPoupe(Button, {
      slots: {
        default: 'Slot content',
      },
    });
    expect(wrapper.text()).toBe('Slot content');
  });

  // Variant tests
  it('should apply border variants correctly', () => {
    const wrapper = mountWithPoupe(Button, {
      props: { border: 'primary' },
    });
    expect(wrapper.classes()).toContain('border-primary');
  });

  it('should apply shape variants correctly', () => {
    const wrapper = mountWithPoupe(Button, {
      props: { shape: 'lg' },
    });
    expect(wrapper.classes()).toContain('shape-squircle-large');
  });

  it('should apply shadow variants correctly', () => {
    const wrapper = mountWithPoupe(Button, {
      props: { shadow: 'z3' },
    });
    expect(wrapper.classes()).toContain('shadow-z3');
  });

  it('should apply type and variant correctly', () => {
    const wrapper = mountWithPoupe(Button, {
      props: { type: 'filled', variant: 'primary' },
    });
    expect(wrapper.classes()).toContain('interactive-surface-primary');
  });

  it('should expand when expand prop is true', () => {
    const wrapper = mountWithPoupe(Button, {
      props: { expand: true },
    });
    expect(wrapper.classes()).toContain('w-full');
  });

  // Event handling
  it('should emit click event when clicked', async () => {
    const wrapper = mountWithPoupe(Button);
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
  });

  // Multiple variants combination
  it('should apply multiple variants correctly', () => {
    const props: ButtonProps = {
      size: 'lg',
      type: 'outlined',
      variant: 'primary',
      shape: 'lg',
      shadow: 'z1',
      expand: true,
    };
    const wrapper = mountWithPoupe(Button, { props });

    expect(wrapper.classes()).toContain('text-base'); // lg size class
    expect(wrapper.classes()).toContain('border-primary');
    expect(wrapper.classes()).toContain('shape-squircle-large');
    expect(wrapper.classes()).toContain('shadow-z1');
    expect(wrapper.classes()).toContain('w-full');
  });

  // Disabled state tests
  it('should handle disabled state correctly', async () => {
    const wrapper = mountWithPoupe(Button, {
      props: { disabled: false },
    });

    // Initially not disabled
    expect(wrapper.attributes('disabled')).toBeUndefined();

    // Update to disabled
    await wrapper.setProps({ disabled: true });
    expect(wrapper.attributes('disabled')).toBeDefined();

    // Verify click events are not emitted when disabled
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeUndefined();
  });

  // Ripple effect test with disabled state changes
  it('should handle ripple effect with dynamic disabled state', async () => {
    const wrapper = mountWithPoupe(Button, {
      props: { disabled: false },
    });

    const button = wrapper.find('button');

    // Trigger mousedown when enabled
    await button.trigger('mousedown');
    // The ripple composable should handle the event

    // Update to disabled
    await wrapper.setProps({ disabled: true });

    // Trigger mousedown when disabled
    await button.trigger('mousedown');
    // The ripple composable should ignore the event when disabled
  });
});
