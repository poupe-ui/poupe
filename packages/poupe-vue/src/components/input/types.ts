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
} from '../variants';

export type InputValue = InputHTMLAttributes['value'];
export type InputType = InputTypeHTMLAttribute;

export const inputWrapperVariants = tv({
  slots: {
    wrapper: 'flex flex-1 flex-nowrap rtl:flex-row-reverse overflow-hidden',
    field: 'flex-1 py-2 px-2',
    input: 'w-full focus:outline-none',
  },
  variants: {
    surface: onSlot(['wrapper', 'input'], containerVariants),
    border: onSlot('wrapper', borderVariants),
    outline: onSlot('wrapper', borderInFocusVariants),
    rounded: onSlot('wrapper', {
      ...roundedVariants,
      full: `${roundedVariants.full} px-4`,
    }),
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

  surface?: InputWrapperVariantProps['surface']
  border?: InputWrapperVariantProps['border']
  outline?: InputWrapperVariantProps['outline']
  rounded?: InputWrapperVariantProps['rounded']
  expand?: InputWrapperVariantProps['expand']
}

export const defaultInputWrapperProps: InputWrapperProps = {
  ...inputWrapperVariants.defaultVariants,
  type: 'text',
} as const;
