import { describe, it, expect, vi } from 'vitest';
import { mountWithPoupe } from './test-utils';
import Card from '../card.vue';
import Surface from '../surface.vue';
import * as utils from '../../utils/utils';

describe('Card', () => {
  it('renders default slot content', () => {
    const wrapper = mountWithPoupe(Card, {
      slots: {
        default: 'Card content',
      },
    });
    expect(wrapper.text()).toContain('Card content');
  });

  it('renders title when provided', () => {
    const wrapper = mountWithPoupe(Card, {
      props: {
        title: 'Test Card',
      },
    });
    expect(wrapper.text()).toContain('Test Card');
  });

  it('renders header slot when provided', () => {
    const wrapper = mountWithPoupe(Card, {
      slots: {
        header: 'Custom header',
      },
    });
    expect(wrapper.text()).toContain('Custom header');
  });

  it('renders footer slot when provided', () => {
    const wrapper = mountWithPoupe(Card, {
      slots: {
        footer: 'Custom footer',
      },
    });
    expect(wrapper.text()).toContain('Custom footer');
  });

  it('applies default props correctly', () => {
    const wrapper = mountWithPoupe(Card);
    const surface = wrapper.findComponent(Surface);
    // Check if v-bind is passing all props correctly
    expect(surface.exists()).toBe(true);
    const props = surface.props();
    expect(props.role).toBe('container');
    expect(props.level).toBe('base');
    expect(props.shape).toBe('md');
    expect(props.shadow).toBe('z1');
    expect(props.padding).toBe('none');
  });

  it('allows prop overrides', () => {
    const wrapper = mountWithPoupe(Card, {
      props: {
        surface: 'high',
        shape: 'lg',
        shadow: 'z3',
      },
    });
    const surface = wrapper.findComponent(Surface);
    expect(surface.exists()).toBe(true);
    const props = surface.props();
    expect(props.role).toBe('container');
    expect(props.level).toBe('high');
    expect(props.shape).toBe('lg');
    expect(props.shadow).toBe('z3');
  });

  it('renders all sections when provided', () => {
    const wrapper = mountWithPoupe(Card, {
      props: {
        title: 'Card Title',
      },
      slots: {
        default: 'Main content',
        footer: 'Footer content',
      },
    });
    expect(wrapper.text()).toContain('Card Title');
    expect(wrapper.text()).toContain('Main content');
    expect(wrapper.text()).toContain('Footer content');
  });

  it('supports interactive prop', () => {
    const wrapper = mountWithPoupe(Card, {
      props: {
        interactive: true,
      },
    });
    const surface = wrapper.findComponent(Surface);
    expect(surface.exists()).toBe(true);
    expect(surface.props().interactive).toBe(true);
  });

  it('warns when both surface and container props are specified', () => {
    const warnSpy = vi.spyOn(utils, 'tryWarn').mockImplementation(() => {});

    mountWithPoupe(Card, {
      props: {
        surface: 'high',
        container: 'primary',
      },
    });

    expect(warnSpy).toHaveBeenCalledWith(
      '[PCard] Both "surface" and "container" props are specified. '
      + 'The "container" prop will take precedence. '
      + 'Please use only one of these props.',
    );

    warnSpy.mockRestore();
  });

  it('container prop takes precedence over surface prop', () => {
    const warnSpy = vi.spyOn(utils, 'tryWarn').mockImplementation(() => {});

    const wrapper = mountWithPoupe(Card, {
      props: {
        surface: 'high',
        container: 'primary',
      },
    });

    const surface = wrapper.findComponent(Surface);
    expect(surface.props().variant).toBe('primary');
    expect(surface.props().role).toBeUndefined();
    expect(surface.props().level).toBeUndefined();

    warnSpy.mockRestore();
  });
});
