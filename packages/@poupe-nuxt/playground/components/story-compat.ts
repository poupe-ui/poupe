import { defineComponent, h, Fragment, reactive } from 'vue';

// Mock Story component for running stories outside Histoire
export const Story = defineComponent({
  name: 'Story',
  props: {
    title: String,
    layout: Object,
  },
  setup(_, { slots }) {
    return () => h('div', { class: 'story-container' }, [
      slots.default?.()
    ]);
  },
});

// Mock Variant component for running stories outside Histoire
export const Variant = defineComponent({
  name: 'Variant',
  props: {
    title: String,
    initState: Function,
    autoPropsDisabled: Boolean,
  },
  setup(props, { slots }) {
    const state = props.initState ? reactive(props.initState()) : reactive({});
    
    return () => h('div', { class: 'story-variant mb-8' }, [
      h('h3', { class: 'text-lg font-semibold mb-4' }, props.title),
      h('div', { class: 'p-4 border rounded-lg bg-surface-container' }, 
        slots.default?.({ state }) || slots.default?.()
      ),
    ]);
  },
});

// Mock Histoire control components
export const HstText = defineComponent({
  name: 'HstText',
  props: ['title', 'modelValue'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => null; // Controls not rendered in story viewer
  },
});

export const HstNumber = defineComponent({
  name: 'HstNumber',
  props: ['title', 'modelValue', 'min', 'max'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => null;
  },
});

export const HstCheckbox = defineComponent({
  name: 'HstCheckbox',
  props: ['title', 'modelValue'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => null;
  },
});

export const HstSelect = defineComponent({
  name: 'HstSelect',
  props: ['title', 'modelValue'],
  emits: ['update:modelValue'],
  setup(props, { slots }) {
    return () => null;
  },
});