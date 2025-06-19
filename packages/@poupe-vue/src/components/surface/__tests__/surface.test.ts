import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Surface from '../surface.vue';
import { poupeInjectionKey } from '../../../composables/use-poupe';
import type { PSurfaceProps } from '../surface.props';

const mountWithPoupe = (options = {}) => {
  return mount(Surface, {
    global: {
      provide: {
        [poupeInjectionKey as symbol]: {
          defaults: {
            surface: {
              elevation: 'z1',
              shape: 'shape-medium',
            },
          },
        },
      },
    },
    ...options,
  });
};

describe('Surface', () => {
  it('renders with default props', () => {
    const wrapper = mountWithPoupe();
    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.classes()).toContain('z1');
    expect(wrapper.classes()).toContain('rounded-xl'); // shape-medium
  });

  it('applies elevation variants', () => {
    const elevations = ['z0', 'z1', 'z2', 'z3', 'z4', 'z5'] as const;

    for (const elevation of elevations) {
      const wrapper = mountWithPoupe({
        props: { elevation },
      });
      expect(wrapper.classes()).toContain(elevation);
    }
  });

  it('applies shape variants', () => {
    const shapes = {
      'shape-none': 'rounded-none',
      'shape-extra-small': 'rounded',
      'shape-small': 'rounded-lg',
      'shape-medium': 'rounded-xl',
      'shape-large': 'rounded-2xl',
      'shape-extra-large': 'rounded-3xl',
      'shape-full': 'rounded-full',
    };

    for (const [shape, expectedClass] of Object.entries(shapes)) {
      const wrapper = mountWithPoupe({
        props: { shape: shape as PSurfaceProps['shape'] },
      });
      expect(wrapper.classes()).toContain(expectedClass);
    }
  });

  it('applies color variants', () => {
    const wrapper = mountWithPoupe({
      props: { color: 'primary' },
    });
    expect(wrapper.classes()).toContain('surface-primary');
  });

  it('renders with custom tag', () => {
    const wrapper = mountWithPoupe({
      props: { tag: 'section' },
    });
    expect(wrapper.element.tagName).toBe('SECTION');
  });

  it('applies interactive states when interactive', () => {
    const wrapper = mountWithPoupe({
      props: { interactive: true, color: 'primary' },
    });

    const classes = wrapper.classes().join(' ');
    // interactive-surface-* utilities include hover/focus/active states
    expect(classes).toContain('interactive-surface-primary');
  });

  it('renders slot content', () => {
    const wrapper = mountWithPoupe({
      slots: {
        default: '<p>Surface content</p>',
      },
    });
    expect(wrapper.html()).toContain('<p>Surface content</p>');
  });

  it('passes through attrs', () => {
    const wrapper = mountWithPoupe({
      attrs: {
        'id': 'test-surface',
        'data-test': 'surface',
      },
    });
    expect(wrapper.attributes('id')).toBe('test-surface');
    expect(wrapper.attributes('data-test')).toBe('surface');
  });
});
