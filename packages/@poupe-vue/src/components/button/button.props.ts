import type { VariantProps } from '../variants';
import type { button } from './button.variants';

type ButtonVariantProps = VariantProps<typeof button>;

export interface PButtonProps {
  /**
   * Button label text
   */
  label?: string

  /**
   * Add ellipsis to label
   * @defaultValue `false`
   */
  ellipsis?: boolean

  /**
   * Loading state
   * @defaultValue `false`
   */
  loading?: boolean

  /**
   * Disabled state
   * @defaultValue `false`
   */
  disabled?: boolean

  /**
   * Button variant style
   * @defaultValue `'text'`
   */
  variant?: 'text' | 'outlined' | 'filled' | 'elevated' | 'tonal'

  /**
   * FAB (Floating Action Button) variant
   * @defaultValue `false`
   */
  fab?: boolean

  /**
   * Extended FAB variant (requires fab=true)
   * @defaultValue `false`
   */
  extended?: boolean

  /**
   * Icon button variant
   * @defaultValue `false`
   */
  iconButton?: boolean

  /**
   * Toggle button behavior
   * @defaultValue `false`
   */
  toggle?: boolean

  /**
   * Toggle pressed state (requires toggle=true)
   * @defaultValue `false`
   */
  pressed?: boolean

  /**
   * Leading icon name
   */
  icon?: string

  /**
   * Trailing icon name
   */
  trailingIcon?: string

  /**
   * Custom class names
   */
  class?: string

  /**
   * Surface color variant
   * @defaultValue `'primary'`
   */
  surface?: ButtonVariantProps['surface']

  /**
   * @deprecated Use variant prop instead
   */
  border?: ButtonVariantProps['border']

  /**
   * @deprecated Use shape tokens instead
   */
  rounded?: ButtonVariantProps['rounded']

  /**
   * @deprecated Use variant prop instead
   */
  shadow?: ButtonVariantProps['shadow']

  /**
   * Button size
   * @defaultValue `'base'`
   */
  size?: ButtonVariantProps['size']

  /**
   * Expand to full width
   * @defaultValue `false`
   */
  expand?: ButtonVariantProps['expand']

  /**
   * Shape token for button corners
   * @defaultValue `'shape-button'`
   */
  shape?: ButtonVariantProps['shape']
}
