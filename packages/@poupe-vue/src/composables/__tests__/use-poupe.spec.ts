import { describe, it, expect } from 'vitest';
import { defineComponent, h, type Component } from 'vue';
import { mount } from '@vue/test-utils';
import { createPoupe, usePoupe, usePoupeDefaults, providePoupeOptions, usePoupeMergedProps } from '../use-poupe';

// Test component types
interface TestComponentProps {
  color: 'primary' | 'secondary' | 'base' | 'none'
  shape: 'none' | 'sm' | 'md' | 'lg'
  size: 'sm' | 'md' | 'lg'
  shadow: 'none' | 'z1' | 'z2'
  padding: 'none' | 'sm' | 'md' | 'lg'
}

// Test component type augmentation
declare module '../use-poupe' {
  interface PoupeComponentDefaults {
    testComponent?: Partial<TestComponentProps>
  }
}

// Type for test component instances
interface TestComponentInstance {
  merged: Record<string, unknown>
  poupe?: ReturnType<typeof usePoupe>
}

// Helper to mount with Poupe plugin
function mountWithPoupe<T>(component: T, options?: {
  poupeOptions?: Parameters<typeof createPoupe>[0]
  mountOptions?: Parameters<typeof mount>[1]
}) {
  const mountOptions = options?.mountOptions || {};
  const poupeOptions = options?.poupeOptions || {};

  return mount(component as Component, {
    ...mountOptions,
    global: {
      ...mountOptions.global,
      plugins: [
        ...(mountOptions.global?.plugins || []),
        createPoupe(poupeOptions),
      ],
    },
  });
}

describe('usePoupe', () => {
  it('should return undefined when no provider exists', () => {
    const TestComponent = defineComponent({
      setup() {
        const poupe = usePoupe();
        return { poupe };
      },
      template: '<div></div>',
    });

    const wrapper = mount(TestComponent);
    expect((wrapper.vm as unknown as TestComponentInstance).poupe).toBeUndefined();
  });

  it('should provide and inject options', () => {
    const options = {
      theme: {
        dark: true,
        colors: {
          primary: '#123456',
        },
      },
    };

    const TestComponent = defineComponent({
      setup() {
        const poupe = usePoupe();
        return { poupe };
      },
      template: '<div></div>',
    });

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [createPoupe(options)],
      },
    });

    const vm = wrapper.vm as unknown as TestComponentInstance;
    expect(vm.poupe).toEqual(options);
    expect(vm.poupe?.theme?.dark).toBe(true);
    expect(vm.poupe?.theme?.colors?.primary).toBe('#123456');
  });

  it('should provide ripple options', () => {
    const options = {
      ripple: {
        disabled: false,
        color: 'primary',
        opacity: 0.2,
        duration: 800,
      },
    };

    const TestComponent = defineComponent({
      setup() {
        const poupe = usePoupe();
        return { poupe };
      },
      template: '<div></div>',
    });

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [createPoupe(options)],
      },
    });

    expect(wrapper.vm.poupe?.ripple).toEqual({
      disabled: false,
      color: 'primary',
      opacity: 0.2,
      duration: 800,
    });
  });

  it('should return component defaults', () => {
    const options = {
      defaults: {
        // Empty for now, components will add their own
      },
    };

    const TestComponent = defineComponent({
      setup() {
        const defaults = usePoupeDefaults('button');
        return { defaults };
      },
      template: '<div></div>',
    });

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [createPoupe(options)],
      },
    });

    expect(wrapper.vm.defaults).toBeUndefined();
  });

  it('should work with providePoupeOptions', () => {
    const options = {
      accessibility: {
        reducedMotion: true,
        highContrast: false,
      },
    };

    const ParentComponent = defineComponent({
      setup() {
        providePoupeOptions(options);
      },
      render() {
        return h(ChildComponent);
      },
    });

    const ChildComponent = defineComponent({
      setup() {
        const poupe = usePoupe();
        return { poupe };
      },
      template: '<div></div>',
    });

    const wrapper = mount(ParentComponent);
    const child = wrapper.findComponent(ChildComponent);

    expect(child.vm.poupe).toEqual(options);
    expect(child.vm.poupe?.accessibility?.reducedMotion).toBe(true);
  });

  it('should be reactive', async () => {
    const options = {
      theme: {
        dark: false,
      },
    };

    const TestComponent = defineComponent({
      setup() {
        const poupe = usePoupe();
        return { poupe };
      },
      template: '<div></div>',
    });

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [createPoupe(options)],
      },
    });

    expect(wrapper.vm.poupe?.theme?.dark).toBe(false);

    // Modify the reactive object
    if (wrapper.vm.poupe?.theme) {
      wrapper.vm.poupe.theme.dark = true;
    }

    await wrapper.vm.$nextTick();
    expect(wrapper.vm.poupe?.theme?.dark).toBe(true);
  });
});

describe('usePoupeMergedProps', () => {
  it('should merge props with component defaults only when no global defaults', () => {
    const TestComponent = defineComponent({
      setup() {
        const props: Partial<TestComponentProps> = { color: 'primary' };
        const componentDefaults: Partial<TestComponentProps> = {
          color: 'base',
          shape: 'none',
          shadow: 'none',
        };

        const merged = usePoupeMergedProps(props, 'testComponent', componentDefaults);
        return { merged };
      },
      template: '<div></div>',
    });

    const wrapper = mount(TestComponent);
    const vm = wrapper.vm as unknown as TestComponentInstance;

    expect(vm.merged).toEqual({
      color: 'primary', // Props override
      shape: 'none', // From component defaults
      shadow: 'none', // From component defaults
    });
  });

  it('should merge all three levels correctly', () => {
    const TestComponent = defineComponent({
      setup() {
        const props: Partial<TestComponentProps> = { color: 'primary' };
        const componentDefaults: Partial<TestComponentProps> = {
          color: 'base',
          shape: 'md',
          shadow: 'none',
          padding: 'md',
        };

        const merged = usePoupeMergedProps(props, 'testComponent', componentDefaults);
        return { merged };
      },
      template: '<div></div>',
    });

    const wrapper = mountWithPoupe(TestComponent, {
      poupeOptions: {
        defaults: {
          testComponent: {
            color: 'secondary',
            shape: 'lg',
            shadow: 'z1',
          },
        },
      },
    });

    const vm = wrapper.vm as unknown as TestComponentInstance;
    expect(vm.merged).toEqual({
      color: 'primary', // Props override everything
      shape: 'md', // Component default overrides global
      shadow: 'none', // Component default overrides global
      padding: 'md', // From component defaults only
    });
  });

  it('should handle undefined props correctly', () => {
    const TestComponent = defineComponent({
      setup() {
        const props: Partial<TestComponentProps> = {
          color: undefined,
          shape: undefined,
        };
        const componentDefaults: Partial<TestComponentProps> = {
          color: 'base',
          shape: 'none',
        };

        const merged = usePoupeMergedProps(props, 'testComponent', componentDefaults);
        return { merged };
      },
      template: '<div></div>',
    });

    const wrapper = mountWithPoupe(TestComponent, {
      poupeOptions: {
        defaults: {
          testComponent: {
            color: 'primary',
            shape: 'lg',
          },
        },
      },
    });

    const vm = wrapper.vm as unknown as TestComponentInstance;
    expect(vm.merged).toEqual({
      color: 'base', // Component default (defu treats undefined as a value)
      shape: 'none', // Component default (defu treats undefined as a value)
    });
  });
});
