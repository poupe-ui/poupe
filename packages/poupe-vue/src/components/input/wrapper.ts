import {
  type VariantProps,
  tv,

  onSlot,
  onVariant,

  borderVariants,
  containerVariants,
  roundedVariants,
} from '../variants';

export const inputWrapperVariants = tv({
  slots: {
    wrapper: 'overflow-hidden flex flex-1 flex-nowrap',
    field: 'flex-1 focus:outline-none py-2 px-2',
  },
  variants: {
    surface: onSlot(['wrapper', 'field'], containerVariants),
    border: onSlot('wrapper', borderVariants),
    outline: onSlot('wrapper', onVariant('focus-within', borderVariants)),
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
  class?: string | undefined

  surface?: Required<InputWrapperVariantProps['surface']>
  border?: InputWrapperVariantProps['border']
  outline?: InputWrapperVariantProps['outline']
  rounded?: InputWrapperVariantProps['rounded']
  expand?: InputWrapperVariantProps['expand']
}

export const defaultInputWrapperProps: Readonly<InputWrapperProps> = {
  ...inputWrapperVariants.defaultVariants,
};
