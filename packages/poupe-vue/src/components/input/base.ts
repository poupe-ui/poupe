import type { InputHTMLAttributes } from 'vue';

import {
  type InputLayoutProps,
  defaultInputLayoutProps,
} from './layout';

export type InputProps = InputLayoutProps & {
  /** @defaultValue 'text' */
  type?: InputHTMLAttributes['type']
};

export const defaultInputProps: Readonly<InputProps> = {
  ...defaultInputLayoutProps,
  type: 'text',
};
