export interface PSurfaceProps {
  /**
   * HTML tag to render
   * @defaultValue `'div'`
   */
  tag?: string

  /**
   * Elevation level (z0-z5)
   * @defaultValue `'z1'`
   */
  elevation?: 'z0' | 'z1' | 'z2' | 'z3' | 'z4' | 'z5'

  /**
   * Shape variant using MD3 tokens
   * @defaultValue `'shape-medium'`
   */
  shape?: 'shape-none' | 'shape-extra-small' | 'shape-small' | 'shape-medium' | 'shape-large' | 'shape-extra-large' | 'shape-full'

  /**
   * Surface color variant
   */
  color?: 'surface' | 'surface-dim' | 'surface-bright' | 'surface-variant' | 'surface-container-lowest' | 'surface-container-low' | 'surface-container' | 'surface-container-high' | 'surface-container-highest' | 'primary' | 'secondary' | 'tertiary' | 'error' | 'primary-container' | 'secondary-container' | 'tertiary-container' | 'error-container' | 'inverse'

  /**
   * Whether the surface is interactive (clickable)
   * @defaultValue `false`
   */
  interactive?: boolean
}
