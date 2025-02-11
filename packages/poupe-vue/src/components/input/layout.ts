import {
  type VariantProps,
  tv,

  ps,
  pe,
  py,
} from '../variants';

import {
  type InputWrapperProps,
  defaultInputWrapperProps,
} from './wrapper';

const padding = (n: number) => {
  return {
    [n]: {
      unit: `${ps[n + 2]} ${pe[n]} ${py[n]}`,
      start: `${ps[n]} ${py[n]}`,
      end: `${pe[n]} ${py[n]}`,
      field: `${ps[n]} ${pe[n]} ${py[n]}`,
    },
  };
};

const paddingVariants = {
  ...padding(0),
  ...padding(1),
  ...padding(2),
  ...padding(3),
  ...padding(4),
  ...padding(5),
  ...padding(6),
};

export const inputLayoutVariants = tv({
  slots: {
    root: 'grid grid-rows-auto gap-1',
    label: 'text-xs font-medium',
    help: 'text-xs font-medium',

    start: '',
    field: '',
    unit: 'text-xs font-medium justify-end',
    end: '',
  },
  variants: {
    padding: paddingVariants,
  },
  defaultVariants: {
    padding: 2,
  },
});

type InputLayoutVariantProps = VariantProps<typeof inputLayoutVariants>;

export type InputLayoutProps = InputWrapperProps & {
  id?: string
  label?: string
  help?: string

  unit?: string
  iconStart?: string
  iconEnd?: string

  padding?: InputLayoutVariantProps['padding']
};

export const defaultInputLayoutProps: Readonly<InputLayoutProps> = {
  ...defaultInputWrapperProps,
  ...inputLayoutVariants.defaultVariants,
};
