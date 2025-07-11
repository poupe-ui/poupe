import { describe, it, expect } from 'vitest';
import { mountWithPoupe } from './test-utils';
import Button from '../button.vue';
import Card from '../card.vue';
import InputWrapper from '../input/wrapper.vue';

describe('Interactive State Classes', () => {
  describe('Button', () => {
    it('should have interactive state classes for filled button', () => {
      const wrapper = mountWithPoupe(Button, {
        props: {
          type: 'filled',
          variant: 'primary',
          label: 'Test Button',
        },
      });

      const button = wrapper.find('button');
      const classes = button.classes().join(' ');

      // Check that interactive surface utility is applied
      expect(classes).toContain('interactive-surface-primary');

      // The interactive-surface-primary utility includes all the states,
      // so we just need to verify it's applied correctly
      expect(classes).toContain('cursor-pointer');
    });

    it('should have interactive state classes for tonal button', () => {
      const wrapper = mountWithPoupe(Button, {
        props: {
          type: 'tonal',
          variant: 'primary',
          label: 'Test Button',
        },
      });

      const button = wrapper.find('button');
      const classes = button.classes().join(' ');

      expect(classes).toContain('interactive-surface-primary-container');
    });

    it('should apply disabled state classes when disabled', () => {
      const wrapper = mountWithPoupe(Button, {
        props: {
          type: 'filled',
          variant: 'secondary',
          label: 'Disabled Button',
          disabled: true,
        },
      });

      const button = wrapper.find('button');
      const classes = button.classes().join(' ');

      expect(button.attributes('disabled')).toBeDefined();
      expect(classes).toContain('cursor-not-allowed');
      expect(classes).toContain('interactive-surface-secondary');
    });
  });

  describe('Card', () => {
    it('should have interactive state classes when interactive prop is true',
      () => {
        const wrapper = mountWithPoupe(Card, {
          props: {
            container: 'primary',
            title: 'Interactive Card',
            interactive: true,
          },
        });

        const card = wrapper.find('div');
        const classes = card.classes().join(' ');

        expect(classes).toContain('cursor-pointer');
        expect(classes).toContain('interactive-surface-primary');
      });

    it('should not have interactive classes when interactive prop is false',
      () => {
        const wrapper = mountWithPoupe(Card, {
          props: {
            container: 'primary',
            title: 'Static Card',
            interactive: false,
          },
        });

        const card = wrapper.find('div');
        const classes = card.classes().join(' ');

        expect(classes).not.toContain('cursor-pointer');
        expect(classes).toContain('surface-primary');
        expect(classes).not.toContain('interactive-surface-primary');
      });
  });

  describe('InputWrapper', () => {
    it('should have interactive state classes', () => {
      const wrapper = mountWithPoupe(InputWrapper, {
        props: {
          surface: 'base',
          modelValue: '',
        },
      });

      const wrapperDiv = wrapper.find('div');
      const classes = wrapperDiv.classes().join(' ');

      expect(classes).toContain('interactive-surface-container');
    });

    it('should have transparent background on input element', () => {
      const wrapper = mountWithPoupe(InputWrapper, {
        props: {
          surface: 'primary',
          modelValue: '',
        },
      });

      const input = wrapper.find('input');
      const classes = input.classes().join(' ');

      expect(classes).toContain('bg-transparent');
    });
  });
});
