import type { PluginAPI, CSSRuleObject } from './utils';
import { SHAPE_SCALE, SHAPE_FAMILIES, COMPONENT_SHAPES } from './shapes';

/**
 * Registers shape utilities using Tailwind's matchUtilities for optimal tree-shaking
 * This approach generates utilities on-demand instead of pre-generating all combinations
 */
export function registerShapeMatchUtilities(api: PluginAPI, themePrefix: string = 'md-'): void {
  // Register base shape scale utilities (shape-xs, shape-sm, etc.)
  api.matchUtilities({
    shape: (value: string) => ({
      borderRadius: `var(--${themePrefix}shape-${value})`,
    }),
  }, {
    values: Object.fromEntries(
      Object.keys(SHAPE_SCALE).map(scale => [scale, scale]),
    ),
  });

  // Register shape family + scale combinations (shape-rounded-sm, shape-squircle-lg, etc.)
  for (const family of SHAPE_FAMILIES) {
    api.matchUtilities({
      [`shape-${family}`]: (value: string) => {
        const scaleValues = SHAPE_SCALE[value as keyof typeof SHAPE_SCALE];
        if (!scaleValues) return {};

        const baseStyles: Record<string, string> = {
          [`--${themePrefix}shape-family`]: family,
          [`--${themePrefix}shape-scale`]: value,
        };

        // Apply family-specific styles
        switch (family) {
          case 'rounded':
            return {
              ...baseStyles,
              borderRadius: `var(--${themePrefix}shape-${value})`,
            };

          case 'squircle':
            // For squircle, we need the SVG path - this is more complex
            // For now, return a simple version
            return {
              ...baseStyles,
              borderRadius: `var(--${themePrefix}shape-${value})`,
              // Note: Full squircle implementation would need the SVG mask
            };

          case 'cut':
            // Simplified version - full implementation needs polygon calculation
            return {
              ...baseStyles,
              borderRadius: `var(--${themePrefix}shape-${value})`,
            };

          case 'concave':
          case 'convex':
            return {
              ...baseStyles,
              borderRadius: `var(--${themePrefix}shape-${value})`,
            };

          default:
            return baseStyles;
        }
      },
    }, {
      values: Object.fromEntries(
        Object.keys(SHAPE_SCALE).map(scale => [scale, scale]),
      ),
    });
  }

  // Register corner-specific utilities using a different approach
  // Instead of shape-rounded-sm-tl, we could use rounded-tl with shape-sm
  api.matchUtilities({
    'rounded-tl': (value: string) => ({
      borderTopLeftRadius: `var(--${themePrefix}shape-${value})`,
    }),
    'rounded-tr': (value: string) => ({
      borderTopRightRadius: `var(--${themePrefix}shape-${value})`,
    }),
    'rounded-br': (value: string) => ({
      borderBottomRightRadius: `var(--${themePrefix}shape-${value})`,
    }),
    'rounded-bl': (value: string) => ({
      borderBottomLeftRadius: `var(--${themePrefix}shape-${value})`,
    }),
    'rounded-t': (value: string) => ({
      borderTopLeftRadius: `var(--${themePrefix}shape-${value})`,
      borderTopRightRadius: `var(--${themePrefix}shape-${value})`,
    }),
    'rounded-r': (value: string) => ({
      borderTopRightRadius: `var(--${themePrefix}shape-${value})`,
      borderBottomRightRadius: `var(--${themePrefix}shape-${value})`,
    }),
    'rounded-b': (value: string) => ({
      borderBottomLeftRadius: `var(--${themePrefix}shape-${value})`,
      borderBottomRightRadius: `var(--${themePrefix}shape-${value})`,
    }),
    'rounded-l': (value: string) => ({
      borderTopLeftRadius: `var(--${themePrefix}shape-${value})`,
      borderBottomLeftRadius: `var(--${themePrefix}shape-${value})`,
    }),
  }, {
    values: Object.fromEntries(
      Object.keys(SHAPE_SCALE).map(scale => [scale, scale]),
    ),
  });

  // Register component shape utilities
  api.matchUtilities({
    shape: (value: string) => {
      const componentConfig = COMPONENT_SHAPES[value];
      if (!componentConfig) {
        return {
          borderRadius: `var(--${themePrefix}shape-${value})`,
        };
      }

      return {
        borderRadius: `var(--${themePrefix}shape-${value})`,
      };
    },
  }, {
    values: Object.fromEntries(
      Object.keys(COMPONENT_SHAPES).map(component => [component, component]),
    ),
  });
}

/**
 * Alternative approach: Minimal CSS with CSS variable composition
 * This generates a much smaller set of utilities that can be composed
 */
export function generateMinimalShapeCSS(themePrefix: string = 'md-'): Record<string, CSSRuleObject> {
  const utilities: Record<string, CSSRuleObject> = {};

  // Base size utilities that set a CSS variable
  for (const scale of Object.keys(SHAPE_SCALE)) {
    utilities[`.shape-${scale}`] = {
      '--shape-size': `var(--${themePrefix}shape-${scale})`,
    };
  }

  // Corner utilities that use the CSS variable
  const corners = {
    tl: { borderTopLeftRadius: 'var(--shape-size, var(--md-shape-md))' },
    tr: { borderTopRightRadius: 'var(--shape-size, var(--md-shape-md))' },
    br: { borderBottomRightRadius: 'var(--shape-size, var(--md-shape-md))' },
    bl: { borderBottomLeftRadius: 'var(--shape-size, var(--md-shape-md))' },
    t: {
      borderTopLeftRadius: 'var(--shape-size, var(--md-shape-md))',
      borderTopRightRadius: 'var(--shape-size, var(--md-shape-md))',
    },
    r: {
      borderTopRightRadius: 'var(--shape-size, var(--md-shape-md))',
      borderBottomRightRadius: 'var(--shape-size, var(--md-shape-md))',
    },
    b: {
      borderBottomLeftRadius: 'var(--shape-size, var(--md-shape-md))',
      borderBottomRightRadius: 'var(--shape-size, var(--md-shape-md))',
    },
    l: {
      borderTopLeftRadius: 'var(--shape-size, var(--md-shape-md))',
      borderBottomLeftRadius: 'var(--shape-size, var(--md-shape-md))',
    },
    all: {
      borderRadius: 'var(--shape-size, var(--md-shape-md))',
    },
  };

  for (const [corner, styles] of Object.entries(corners)) {
    utilities[`.rounded-${corner}`] = styles;
  }

  return utilities;
}
