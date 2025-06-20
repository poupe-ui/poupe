/* eslint-disable vue/one-component-per-file */
import { describe, it, expect, vi } from 'vitest';
import { ref, nextTick, defineComponent } from 'vue';
import { mountWithPoupe } from '../../components/__tests__/test-utils';
import { useRipple } from '../use-ripple';

describe('useRipple', () => {
  it('should initialize with empty ripples', () => {
    const elementReference = ref<HTMLElement>();
    const { ripples } = useRipple(elementReference);

    expect(ripples.value).toEqual([]);
  });

  it('should add ripple on mouse click', async () => {
    const TestComponent = defineComponent({
      setup() {
        const elementReference = ref<HTMLElement>();
        const { ripples } = useRipple(elementReference);

        return { elementRef: elementReference, ripples };
      },
      template: '<div ref="elementRef" style="width: 100px; height: 100px;"></div>',
    });

    const wrapper = mountWithPoupe(TestComponent);
    const element = wrapper.find('div');
    const vm = wrapper.vm as InstanceType<typeof TestComponent>;

    // Simulate click
    await element.trigger('mousedown', {
      clientX: 50,
      clientY: 50,
    });

    await nextTick();

    expect(vm.ripples).toHaveLength(1);
    expect(vm.ripples[0]).toHaveProperty('x');
    expect(vm.ripples[0]).toHaveProperty('y');
    expect(vm.ripples[0]).toHaveProperty('size');
    expect(vm.ripples[0]).toHaveProperty('id');
  });

  it('should remove ripple after duration', async () => {
    vi.useFakeTimers();

    const TestComponent = defineComponent({
      setup() {
        const elementReference = ref<HTMLElement>();
        const { ripples } = useRipple(elementReference, { duration: 300 });

        return { elementRef: elementReference, ripples };
      },
      template: '<div ref="elementRef" style="width: 100px; height: 100px;"></div>',
    });

    const wrapper = mountWithPoupe(TestComponent);
    const element = wrapper.find('div');
    const vm = wrapper.vm as InstanceType<typeof TestComponent>;

    // Simulate click
    await element.trigger('mousedown', {
      clientX: 50,
      clientY: 50,
    });

    expect(vm.ripples).toHaveLength(1);

    // Fast forward time
    vi.advanceTimersByTime(300);
    await nextTick();

    expect(vm.ripples).toHaveLength(0);

    vi.useRealTimers();
  });

  it('should not add ripple when disabled', async () => {
    const TestComponent = defineComponent({
      setup() {
        const elementReference = ref<HTMLElement>();
        const { ripples } = useRipple(elementReference, { disabled: true });

        return { elementRef: elementReference, ripples };
      },
      template: '<div ref="elementRef" style="width: 100px; height: 100px;"></div>',
    });

    const wrapper = mountWithPoupe(TestComponent);
    const element = wrapper.find('div');
    const vm = wrapper.vm as InstanceType<typeof TestComponent>;

    // Simulate click
    await element.trigger('mousedown', {
      clientX: 50,
      clientY: 50,
    });

    await nextTick();

    expect(vm.ripples).toHaveLength(0);
  });

  it('should generate correct ripple style', () => {
    const elementReference = ref<HTMLElement>();
    const { getRippleStyle } = useRipple(elementReference);

    const ripple = { x: 50, y: 50, size: 100, id: 0 };
    const style = getRippleStyle(ripple);

    expect(style).toEqual({
      position: 'absolute',
      left: '50px',
      top: '50px',
      width: '100px',
      height: '100px',
      transform: 'translate(-50%, -50%)',
      borderRadius: '50%',
      backgroundColor: 'currentColor',
      opacity: 0.12,
      pointerEvents: 'none',
      animation: 'ripple 600ms ease-out',
    });
  });

  it('should respond to reactive disabled state', async () => {
    const TestComponent = defineComponent({
      setup() {
        const elementReference = ref<HTMLElement>();
        const isDisabled = ref(false);
        const { ripples } = useRipple(elementReference, { disabled: isDisabled });

        return { elementRef: elementReference, ripples, isDisabled };
      },
      template: '<div ref="elementRef" style="width: 100px; height: 100px;"></div>',
    });

    const wrapper = mountWithPoupe(TestComponent);
    const element = wrapper.find('div');
    const vm = wrapper.vm as InstanceType<typeof TestComponent>;

    // Initially enabled - should add ripple
    await element.trigger('mousedown', {
      clientX: 50,
      clientY: 50,
    });
    await nextTick();
    expect(vm.ripples).toHaveLength(1);

    // Clear ripples
    vm.ripples.splice(0);

    // Set to disabled
    vm.isDisabled = true;
    await nextTick();

    // Should not add ripple when disabled
    await element.trigger('mousedown', {
      clientX: 50,
      clientY: 50,
    });
    await nextTick();
    expect(vm.ripples).toHaveLength(0);

    // Re-enable
    vm.isDisabled = false;
    await nextTick();

    // Should add ripple again when re-enabled
    await element.trigger('mousedown', {
      clientX: 50,
      clientY: 50,
    });
    await nextTick();
    expect(vm.ripples).toHaveLength(1);
  });
});
