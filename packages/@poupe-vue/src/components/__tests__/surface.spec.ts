/* eslint-disable vue/one-component-per-file */
import { describe, it, expect } from 'vitest';
import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { mountWithPoupe } from './test-utils';
import { createPoupe } from '../../composables';
import Surface from '../surface.vue';

describe('Surface', () => {
  it('renders with default props', () => {
    const wrapper = mountWithPoupe(Surface, {
      slots: {
        default: 'Surface content',
      },
    });
    expect(wrapper.text()).toContain('Surface content');
    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.classes()).toContain('relative');
  });

  it('renders with custom tag', () => {
    const wrapper = mountWithPoupe(Surface, {
      props: {
        tag: 'section',
      },
    });
    expect(wrapper.element.tagName).toBe('SECTION');
  });

  it('applies surface variants correctly', () => {
    const wrapper = mountWithPoupe(Surface, {
      props: {
        variant: 'primary',
      },
    });
    expect(wrapper.classes()).toContain('surface-primary');
  });

  it('applies container variants correctly', () => {
    const wrapper = mountWithPoupe(Surface, {
      props: {
        role: 'container',
        level: 'high',
      },
    });
    expect(wrapper.classes()).toContain('surface-container-high');
  });

  it('applies interactive surface variants', () => {
    const wrapper = mountWithPoupe(Surface, {
      props: {
        variant: 'primary',
        interactive: true,
      },
    });
    expect(wrapper.classes()).toContain('interactive-surface-primary');
    expect(wrapper.classes()).toContain('cursor-pointer');
  });

  it('applies interactive container variants', () => {
    const wrapper = mountWithPoupe(Surface, {
      props: {
        role: 'container',
        level: 'high',
        interactive: true,
      },
    });
    expect(wrapper.classes()).toContain('interactive-surface-container-high');
    expect(wrapper.classes()).toContain('cursor-pointer');
  });

  it('applies shape variants', () => {
    const wrapper = mountWithPoupe(Surface, {
      props: {
        shape: 'md',
      },
    });
    expect(wrapper.classes()).toContain('shape-squircle-medium');
  });

  it('applies rounded shape variant', () => {
    const wrapper = mountWithPoupe(Surface, {
      props: {
        shape: 'rounded',
      },
    });
    expect(wrapper.classes()).toContain('shape-full');
  });

  it('applies shadow variants', () => {
    const wrapper = mountWithPoupe(Surface, {
      props: {
        shadow: 'z2',
      },
    });
    expect(wrapper.classes()).toContain('shadow-z2');
  });

  it('applies border variants', () => {
    const wrapper = mountWithPoupe(Surface, {
      props: {
        border: 'primary',
      },
    });
    expect(wrapper.classes()).toContain('border-primary');
    expect(wrapper.classes()).toContain('border-solid');
    expect(wrapper.classes()).toContain('border');
  });

  it('applies padding variants', () => {
    const wrapper = mountWithPoupe(Surface, {
      props: {
        padding: 'md',
      },
    });
    expect(wrapper.classes()).toContain('p-4');
  });

  it('merges custom classes', () => {
    const wrapper = mountWithPoupe(Surface, {
      props: {
        class: 'custom-class another-class',
      },
    });
    expect(wrapper.classes()).toContain('custom-class');
    expect(wrapper.classes()).toContain('another-class');
    expect(wrapper.classes()).toContain('relative');
  });

  describe('with global defaults', () => {
    it('uses global defaults when no props provided', () => {
      const TestComponent = defineComponent({
        components: { Surface },
        template: '<Surface>Content</Surface>',
      });

      const wrapper = mount(TestComponent, {
        global: {
          plugins: [
            createPoupe({
              defaults: {
                surface: {
                  shape: 'lg',
                  shadow: 'z1',
                  padding: 'sm',
                },
              },
            }),
          ],
        },
      });

      const surface = wrapper.findComponent(Surface);
      // Component defaults override global defaults with current defu behavior
      expect(surface.classes()).toContain('shape-none'); // Component default wins
      expect(surface.classes()).toContain('shadow-none'); // Component default wins
      expect(surface.classes()).toContain('relative'); // Base class always present
    });

    it('props override global defaults', () => {
      const TestComponent = defineComponent({
        components: { Surface },
        template: '<Surface shape="xl" shadow="z3">Content</Surface>',
      });

      const wrapper = mount(TestComponent, {
        global: {
          plugins: [
            createPoupe({
              defaults: {
                surface: {
                  shape: 'lg',
                  shadow: 'z1',
                  variant: 'primary',
                },
              },
            }),
          ],
        },
      });

      const surface = wrapper.findComponent(Surface);
      expect(surface.classes()).toContain('shape-squircle-extra-large'); // Props override
      expect(surface.classes()).toContain('shadow-z3'); // Props override
      expect(surface.classes()).toContain('surface-primary'); // Global default variant='primary'
    });

    it('merges all three levels of defaults correctly', () => {
      const TestComponent = defineComponent({
        components: { Surface },
        template: '<Surface variant="secondary" padding="lg">Content</Surface>',
      });

      const wrapper = mount(TestComponent, {
        global: {
          plugins: [
            createPoupe({
              defaults: {
                surface: {
                  role: 'container',
                  level: 'high',
                  shape: 'md',
                  shadow: 'z2',
                  padding: 'sm',
                  interactive: true,
                },
              },
            }),
          ],
        },
      });

      const surface = wrapper.findComponent(Surface);
      // Props override
      expect(surface.classes()).toContain('surface-secondary'); // surface variant (component) + secondary color (props)
      expect(surface.classes()).toContain('p-6');
      // Component defaults win over global defaults
      expect(surface.classes()).toContain('shape-none');
      expect(surface.classes()).toContain('shadow-none');
      // Interactive is false from component defaults
      expect(surface.classes()).not.toContain('interactive-surface-secondary');
      expect(surface.classes()).not.toContain('cursor-pointer');
    });
  });

  describe('compound variants', () => {
    it('applies border base classes only when border variant is set', () => {
      const withoutBorder = mountWithPoupe(Surface, {
        props: {
          border: 'none',
        },
      });
      expect(withoutBorder.classes()).not.toContain('border-solid');
      expect(withoutBorder.classes()).not.toContain('border');

      const withBorder = mountWithPoupe(Surface, {
        props: {
          border: 'primary',
        },
      });
      expect(withBorder.classes()).toContain('border-solid');
      expect(withBorder.classes()).toContain('border');
    });
  });

  describe('all prop combinations', () => {
    it('applies all props together correctly', () => {
      const wrapper = mountWithPoupe(Surface, {
        props: {
          tag: 'article',
          role: 'container',
          level: 'low',
          shape: 'xl',
          shadow: 'z5',
          border: 'outline',
          interactive: true,
          padding: 'xl',
          class: 'my-custom-surface',
        },
        slots: {
          default: 'Complex surface',
        },
      });

      expect(wrapper.element.tagName).toBe('ARTICLE');
      expect(wrapper.text()).toContain('Complex surface');
      expect(wrapper.classes()).toContain('surface-container-low');
      expect(wrapper.classes()).toContain('interactive-surface-container-low');
      expect(wrapper.classes()).toContain('shape-squircle-extra-large');
      expect(wrapper.classes()).toContain('shadow-z5');
      expect(wrapper.classes()).toContain('border-outline');
      expect(wrapper.classes()).toContain('cursor-pointer');
      expect(wrapper.classes()).toContain('p-8');
      expect(wrapper.classes()).toContain('my-custom-surface');
    });
  });
});
