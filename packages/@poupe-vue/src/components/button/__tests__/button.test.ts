import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Button from '../button.vue';
import { poupeInjectionKey } from '../../../composables/use-poupe';

const mountWithPoupe = (options = {}) => {
  return mount(Button, {
    global: {
      provide: {
        [poupeInjectionKey as symbol]: {
          defaults: {
            button: {
              variant: 'text',
              surface: 'primary',
              size: 'base',
            },
          },
        },
      },
    },
    ...options,
  });
};

describe('Button', () => {
  it('renders with default props', () => {
    const wrapper = mountWithPoupe({
      props: { label: 'Button' },
    });
    expect(wrapper.element.tagName).toBe('BUTTON');
    expect(wrapper.text()).toContain('Button');
  });

  it('renders custom label', () => {
    const wrapper = mountWithPoupe({
      props: { label: 'Click me' },
    });
    expect(wrapper.text()).toBe('Click me');
  });

  it('applies MD3 variants', () => {
    const variants = ['text', 'outlined', 'filled', 'elevated', 'tonal'] as const;

    for (const variant of variants) {
      const wrapper = mountWithPoupe({
        props: { variant, label: 'Test' },
      });
      const button = wrapper.find('button');
      const classes = button.classes().join(' ');
      // Check that the button has proper variant styling
      switch (variant) {
        case 'outlined': {
          expect(classes).toContain('border-current/12');

          break;
        }
        case 'filled': {
          expect(classes).toContain('interactive-surface-primary');

          break;
        }
        case 'elevated': {
          expect(classes).toContain('shadow-z1');

          break;
        }
        case 'tonal': {
          expect(classes).toContain('interactive-surface-primary-container');

          break;
        }
      // No default
      }
    }
  });

  it('renders as FAB', () => {
    const wrapper = mountWithPoupe({
      props: {
        fab: true,
        icon: 'mdi:plus',
        label: 'Add',
      },
    });
    expect(wrapper.classes()).toContain('rounded-2xl');
    expect(wrapper.find('svg').exists()).toBe(true);
  });

  it('renders as extended FAB', () => {
    const wrapper = mountWithPoupe({
      props: {
        fab: true,
        extended: true,
        icon: 'mdi:plus',
        label: 'Add Item',
      },
    });
    expect(wrapper.text()).toContain('Add Item');
  });

  it('renders as icon button', () => {
    const wrapper = mountWithPoupe({
      props: {
        iconButton: true,
        icon: 'mdi:heart',
        label: 'Favorite',
      },
    });
    expect(wrapper.classes()).toContain('rounded-full');
    expect(wrapper.attributes('aria-label')).toBe('Favorite');
    expect(wrapper.text()).toBe(''); // No visible text
  });

  it('handles toggle behavior', async () => {
    const wrapper = mountWithPoupe({
      props: {
        toggle: true,
        label: 'Toggle',
      },
    });

    expect(wrapper.attributes('aria-pressed')).toBe('false');

    await wrapper.trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.attributes('aria-pressed')).toBe('true');

    await wrapper.trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.attributes('aria-pressed')).toBe('false');
  });

  it('emits toggle event', async () => {
    const wrapper = mountWithPoupe({
      props: {
        toggle: true,
        label: 'Toggle',
      },
    });

    await wrapper.trigger('click');
    expect(wrapper.emitted('toggle')).toHaveLength(1);
    expect(wrapper.emitted('toggle')?.[0]).toEqual([true]);

    await wrapper.trigger('click');
    expect(wrapper.emitted('toggle')).toHaveLength(2);
    expect(wrapper.emitted('toggle')?.[1]).toEqual([false]);
  });

  it('applies size variants', () => {
    const sizes = ['xs', 'sm', 'base', 'lg', 'xl'] as const;

    for (const size of sizes) {
      const wrapper = mountWithPoupe({
        props: { size },
      });
      expect(wrapper.classes().join(' ')).toMatch(new RegExp(String.raw`min-h-\d+`));
    }
  });

  it('renders with icons', () => {
    const wrapper = mountWithPoupe({
      props: {
        icon: 'mdi:send',
        trailingIcon: 'mdi:check',
        label: 'Send',
      },
    });

    const icons = wrapper.findAll('svg');
    expect(icons).toHaveLength(2);
  });

  it('shows loading state', () => {
    const wrapper = mountWithPoupe({
      props: {
        loading: true,
        label: 'Loading',
      },
    });

    expect(wrapper.find('.animate-spin').exists()).toBe(true);
    expect(wrapper.attributes('disabled')).toBeDefined();
  });

  it('applies disabled state', () => {
    const wrapper = mountWithPoupe({
      props: {
        disabled: true,
        label: 'Disabled',
      },
    });

    expect(wrapper.attributes('disabled')).toBeDefined();
    expect(wrapper.classes()).toContain('cursor-not-allowed');
    expect(wrapper.classes()).toContain('opacity-38');
  });

  it('expands to full width', () => {
    const wrapper = mountWithPoupe({
      props: {
        expand: true,
        label: 'Full Width',
      },
    });

    expect(wrapper.classes()).toContain('w-full');
  });

  it('adds ellipsis to label', () => {
    const wrapper = mountWithPoupe({
      props: {
        ellipsis: true,
        label: 'Long text',
      },
    });

    expect(wrapper.text()).toBe('Long text…');
  });

  it('uses slot content when no label', () => {
    const wrapper = mountWithPoupe({
      slots: {
        default: '<span>Slot content</span>',
      },
    });

    expect(wrapper.text()).toBe('Slot content');
  });

  it('emits click event', async () => {
    const wrapper = mountWithPoupe({
      props: { label: 'Click me' },
    });

    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('applies custom class', () => {
    const wrapper = mountWithPoupe({
      props: {
        class: 'custom-class',
        label: 'Custom',
      },
    });

    expect(wrapper.classes()).toContain('custom-class');
  });

  it('uses poupe defaults', () => {
    const wrapper = mount(Button, {
      global: {
        provide: {
          [poupeInjectionKey as symbol]: {
            defaults: {
              button: {
                variant: 'filled',
                surface: 'secondary',
                size: 'lg',
              },
            },
          },
        },
      },
    });

    const button = wrapper.find('button');
    const classes = button.classes().join(' ');
    // Check that defaults were properly applied
    expect(classes).toContain('interactive-surface-secondary');
    expect(classes).toContain('min-h-12'); // lg size
  });
});
