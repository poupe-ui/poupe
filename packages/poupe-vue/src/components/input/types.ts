import {
  type InputHTMLAttributes,
  type InputTypeHTMLAttribute,
} from 'vue';

import {
  type VariantProps,
  tv,

  onSlot,

  borderVariants,
  borderInFocusVariants,
  containerVariants,
  roundedVariants,

  ps, pe, px, py,
} from '../variants';

export type InputValue = InputHTMLAttributes['value'];
export type InputType = InputTypeHTMLAttribute;

export const padding = (n: number) => `${px[n]} ${py[n]}`;

const paddingSlot = (n: number) => {
  return {
    [n]: {
      start: padding(n),
      field: padding(n),
      unit: `${ps[n + 1]} ${pe[n]} ${py[n]}`,
      end: padding(n),
    },
  };
};

export const inputWrapperVariants = tv({
  slots: {
    wrapper: 'flex flex-1 flex-nowrap rtl:flex-row-reverse overflow-hidden',
    field: 'flex-1',
    start: 'flex items-center',
    input: 'w-full focus:outline-none',
    unit: 'text-xs font-medium justify-end',
    end: 'flex items-center',
  },
  variants: {
    surface: onSlot(['wrapper', 'input'], containerVariants),
    border: onSlot('wrapper', borderVariants),
    outline: onSlot('wrapper', borderInFocusVariants),
    rounded: onSlot('wrapper', {
      ...roundedVariants,
      full: `${roundedVariants.full} px-4`,
    }),
    padding: {
      ...paddingSlot(0),
      ...paddingSlot(1),
      ...paddingSlot(2),
      ...paddingSlot(3),
      ...paddingSlot(4),
    },
    expand: {
      true: {
        wrapper: 'w-full',
      },
    },
  },
  defaultVariants: {
    surface: 'base',
    border: 'outline',
    outline: 'current',
    rounded: 'full',
    padding: 2,
    expand: false,
  },
});

type InputWrapperVariantProps = VariantProps<typeof inputWrapperVariants>;

export interface InputWrapperProps {
  class?: string
  id?: string
  type?: InputType

  modelValue?: InputValue
  value?: never

  iconStart?: string
  iconEnd?: string
  unit?: string

  surface?: InputWrapperVariantProps['surface']
  border?: InputWrapperVariantProps['border']
  outline?: InputWrapperVariantProps['outline']
  rounded?: InputWrapperVariantProps['rounded']
  padding?: InputWrapperVariantProps['padding']
  expand?: InputWrapperVariantProps['expand']
}

export const defaultInputWrapperProps: InputWrapperProps = {
  ...inputWrapperVariants.defaultVariants,
  type: 'text',
} as const;
