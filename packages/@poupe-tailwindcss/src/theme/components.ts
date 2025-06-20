import {
  stateLayerOpacities,
} from '@poupe/theme-builder';

import {
  type Theme,
  defaultSurfacePrefix,
  defaultShapePrefix,
} from './types';

import {
  type CSSRuleObject,
  debugLog,
  warnLog,
} from './utils';

/** Default opacity for scrim utilities when no modifier is provided */
export const DEFAULT_SCRIM_OPACITY = '32%';

export function makeThemeComponents(theme: Readonly<Theme>, tailwindPrefix: string = ''): Record<string, CSSRuleObject>[] {
  return [
    makeSurfaceComponents(theme, tailwindPrefix),
    makeInteractiveSurfaceComponents(theme, tailwindPrefix),
    makeZIndexComponents(theme),
    makeRippleComponents(theme),
    makeShapeComponents(theme),
  ];
}

export function makeZIndexComponents(theme: Readonly<Theme>): Record<string, CSSRuleObject> {
  const { themePrefix } = theme.options;

  const out: Record<string, CSSRuleObject> = {
    ['scrim-*']: {
      // Dynamic scrim utility that accepts arbitrary z-index values with optional opacity modifier
      // The --value() pattern indicates this will be converted to matchUtilities
      // allowing usage like: scrim-[100], scrim-[1250]/50, scrim-[var(--custom-z)]/75
      '@apply fixed inset-0': {},
      'z-index': '--value(integer, [integer])',
      'background-color': `rgb(var(--${themePrefix}scrim-rgb) / var(--${themePrefix}scrim-opacity, ${DEFAULT_SCRIM_OPACITY}))`,
      [`--${themePrefix}scrim-opacity`]: '--modifier([percentage])',
    },
  };

  // semantic z-index scrim with opacity modifier support
  for (const name of ['base', 'content', 'drawer', 'modal', 'elevated', 'system']) {
    out[`scrim-${name}`] = {
      '@apply fixed inset-0': {},
      'z-index': `var(--${themePrefix}z-scrim-${name})`,
      'background-color': `rgb(var(--${themePrefix}scrim-rgb) / var(--${themePrefix}scrim-opacity, ${DEFAULT_SCRIM_OPACITY}))`,
      [`--${themePrefix}scrim-opacity`]: '--modifier([percentage])',
    };
  }

  // semantic z-index
  for (const name of ['navigation-persistent', 'navigation-floating', 'navigation-top', 'drawer', 'modal', 'snackbar', 'tooltip']) {
    out[`z-${name}`] = {
      'z-index': `var(--${themePrefix}z-${name})`,
    };
  }

  return out;
}

/**
 * Configuration for special surface color pairings using patterns
 * `{}` will be replaced with the color name (primary, secondary, tertiary, etc.)
 * Each entry maps a background pattern to an array of text color patterns
 *
 * Pattern types determine which colors to expand:
 * - 'standard': primary, secondary, tertiary only (Material Design core colors)
 * - 'fixed': primary, secondary, tertiary only (fixed color variants)
 * - 'static': no pattern expansion (like inverse-surface)
 *
 * Note: Custom colors (blue, green, orange, etc.) get standard pairings
 * automatically through the first loop in findSurfacePairs()
 */
const SURFACE_PAIRING_PATTERNS: Record<string, { patterns: string[]; type: 'standard' | 'fixed' | 'static' }> = {
  // Dim variants (Material Design 2025) - use standard on-color
  '{}-dim': {
    patterns: ['on-{}'],
    type: 'standard',
  },

  // Fixed color pairings - {} replaced with primary/secondary/tertiary
  '{}-fixed': {
    patterns: ['on-{}-fixed', 'on-{}-fixed-variant'],
    type: 'fixed',
  },
  '{}-fixed-dim': {
    patterns: ['on-{}-fixed', 'on-{}-fixed-variant'],
    type: 'fixed',
  },

  // Inverse surface (no pattern needed)
  'inverse-surface': {
    patterns: ['on-inverse-surface', 'inverse-primary'],
    type: 'static',
  },
};

/**
 * Represents a surface pair configuration
 */
interface SurfacePair {
  bgColor: string
  textColor: string
  surfaceName: string
}

/**
 * Generates the surface name for a color pair
 */
function getSurfaceName(bgColor: string, textColor: string): string {
  // Special naming for inverse-surface + on-inverse-surface (standard inverse)
  if (bgColor === 'inverse-surface' && textColor === 'on-inverse-surface') {
    return 'inverse';
  }

  // Special naming for inverse-surface + inverse-primary
  if (bgColor === 'inverse-surface' && textColor === 'inverse-primary') {
    return 'inverse-primary';
  }

  // Special naming for fixed color variants
  if ((bgColor.endsWith('-fixed') || bgColor.endsWith('-fixed-dim')) && textColor.endsWith('-fixed-variant')) {
    // Extract the unique part from text color
    const prefix = textColor.replace(/-fixed-variant$/, '').replace(/^on-/, '');
    const bgSuffix = bgColor.endsWith('-dim') ? '-dim' : '';
    return `${prefix}-fixed${bgSuffix}-variant`;
  }

  // Default: just use the background color name
  return bgColor;
}

/**
 * Adds a surface pair to the map with the appropriate key
 */
function addSurfacePair(
  pairs: Map<string, SurfacePair>,
  bgColor: string,
  textColor: string,
): void {
  const surfaceName = getSurfaceName(bgColor, textColor);
  const key = textColor === `on-${bgColor}` ? bgColor : `${bgColor}:${textColor}`;
  pairs.set(key, {
    bgColor,
    textColor,
    surfaceName,
  });
}

/**
 * Finds standard color pairs (color + on-color, including containers)
 */
function findStandardPairs(theme: Readonly<Theme>, pairs: Map<string, SurfacePair>): void {
  for (const name of theme.keys) {
    const onName = `on-${name}`;
    if (theme.colors[name] && theme.colors[onName]) {
      addSurfacePair(pairs, name, onName);
    }
  }
}

/**
 * Processes static surface patterns (non-expandable like inverse-surface)
 */
function processStaticPattern(
  theme: Readonly<Theme>,
  pairs: Map<string, SurfacePair>,
  bgPattern: string,
  textPatterns: string[],
): void {
  if (!theme.colors[bgPattern]) return;

  for (const textPattern of textPatterns) {
    if (theme.colors[textPattern]) {
      addSurfacePair(pairs, bgPattern, textPattern);
    }
  }
}

/**
 * Checks if a color key is a base color (not on-*, *-container, etc.)
 */
function isBaseColor(colorKey: string): boolean {
  return !colorKey.includes('-') && !colorKey.startsWith('on-');
}

/**
 * Checks if a color should be processed for the given pattern type
 */
function shouldProcessColor(colorKey: string, type: 'standard' | 'fixed'): boolean {
  if (type === 'fixed' || type === 'standard') {
    return ['primary', 'secondary', 'tertiary'].includes(colorKey);
  }
  return true;
}

/**
 * Expands pattern-based surface pairings
 */
function expandPatternPairings(
  theme: Readonly<Theme>,
  pairs: Map<string, SurfacePair>,
  bgPattern: string,
  textPatterns: string[],
  type: 'standard' | 'fixed',
): void {
  for (const colorKey of theme.keys) {
    // Skip if it's not a base color
    if (!isBaseColor(colorKey)) continue;

    const bg = bgPattern.replace('{}', colorKey);

    // Check if this specific pattern exists in the theme
    if (!theme.colors[bg]) continue;

    // Check if this color should be processed for this pattern type
    if (!shouldProcessColor(colorKey, type)) continue;

    // Try each text pattern
    for (const textPattern of textPatterns) {
      const text = textPattern.replace('{}', colorKey);
      if (theme.colors[text]) {
        addSurfacePair(pairs, bg, text);
      }
    }
  }
}

/**
 * Finds all valid surface color pairs in the theme
 */
function findSurfacePairs(theme: Readonly<Theme>): Map<string, SurfacePair> {
  const pairs = new Map<string, SurfacePair>();

  // First, find all standard pairs (color + on-color)
  findStandardPairs(theme, pairs);

  // Then, expand pattern-based pairings
  for (const [bgPattern, config] of Object.entries(SURFACE_PAIRING_PATTERNS)) {
    const { patterns: textPatterns, type } = config;

    if (type === 'static') {
      processStaticPattern(theme, pairs, bgPattern, textPatterns);
    } else {
      expandPatternPairings(theme, pairs, bgPattern, textPatterns, type);
    }
  }

  return pairs;
}

export function makeSurfaceComponents(theme: Readonly<Theme>, tailwindPrefix: string = ''): Record<string, CSSRuleObject> {
  const { surfacePrefix = defaultSurfacePrefix } = theme.options;
  if (!surfacePrefix) {
    return {};
  }

  const pairs = findSurfacePairs(theme);

  const surfaces: Record<string, CSSRuleObject> = {};

  const [bgPrefix, textPrefix] = ['bg-', 'text-'].map(prefix => `${tailwindPrefix}${prefix}`);

  for (const pair of pairs.values()) {
    const { bgColor, textColor, surfaceName } = pair;
    const { value } = assembleSurfaceComponent(bgColor, textColor, bgPrefix, textPrefix, surfacePrefix);

    // Use the preferred surface name from the pair
    const surfaceKey = makeSurfaceName(surfaceName, surfacePrefix);
    surfaces[surfaceKey] = value;
  }

  debugLog(theme.options.debug, 'surfaces', surfaces);
  return surfaces;
}

/**
 * Assembles a surface component by combining background and text color classes.
 *
 * @param colorName - The base color name for the background
 * @param onColorName - The color name for text on the surface
 * @param bgPrefix - Prefix for background color classes
 * @param textPrefix - Prefix for text color classes
 * @param surfacePrefix - Prefix for surface classes
 * @returns An object with a key for the surface class and its corresponding CSS rule object
 */
export function assembleSurfaceComponent(
  colorName: string,
  onColorName: string,
  bgPrefix: string,
  textPrefix: string,
  surfacePrefix: string,
): { key: string; value: CSSRuleObject } {
  if (surfacePrefix === bgPrefix) {
    // extend bg- with text-on-
    return {
      key: `${bgPrefix}${colorName}`,
      value: {
        [`@apply ${textPrefix}${onColorName}`]: {},
      },
    };
  }
  // combine bg- and text-on-
  const surfaceName = makeSurfaceName(colorName, surfacePrefix);
  return {
    key: `${surfaceName}`,
    value: {
      [`@apply ${bgPrefix}${colorName} ${textPrefix}${onColorName}`]: {},
    },
  };
}

/**
 * Generates a surface name by prefixing a color name with a given prefix.
 *
 * @param colorName - The original color name to be transformed
 * @param prefix - The prefix to be added to the color name
 * @returns A surface name that avoids prefix duplication
 */
export function makeSurfaceName(colorName: string, prefix: string): string {
  // Special case for inverse in interactive context - maintain consistency
  if (colorName === 'inverse' && prefix === 'interactive-surface-') {
    return 'interactive-surface-inverse';
  }

  if (colorName.startsWith(prefix) || `${colorName}-` === prefix) {
    // prevent duplication
    return colorName;
  }

  // Use the component name generator logic to avoid duplicates
  if (prefix.endsWith('-')) {
    const prefixParts = prefix.slice(0, -1).split('-');
    const colorParts = colorName.split('-');

    // Find common parts to avoid duplication
    let commonParts = 0;
    for (let i = 0; i < Math.min(prefixParts.length, colorParts.length); i++) {
      if (prefixParts[prefixParts.length - 1 - i] === colorParts[i]) {
        commonParts++;
      } else {
        break;
      }
    }

    if (commonParts > 0) {
      // Remove common parts from the beginning of colorName
      const uniqueParts = colorParts.slice(commonParts).join('-');
      if (uniqueParts) {
        return `${prefix}${uniqueParts}`;
      }
      // If all parts are common, just use the prefix without dash
      return prefix.slice(0, -1);
    }
  }

  return `${prefix}${colorName}`;
}

/**
 * Checks if a color should have interactive states
 */
function isInteractiveColor(theme: Readonly<Theme>, colorName: string): boolean {
  // Interactive colors that always have state variants in MD3
  const knownInteractiveColors = new Set([
    'primary', 'secondary', 'tertiary', 'error',
    'surface', 'surface-dim', 'surface-bright', 'surface-variant',
    'surface-container', 'surface-container-lowest',
    'surface-container-low', 'surface-container-high',
    'surface-container-highest', 'inverse-surface',
    'primary-container', 'secondary-container',
    'tertiary-container', 'error-container',
    'primary-fixed', 'secondary-fixed', 'tertiary-fixed',
  ]);

  // Include custom palette colors from theme
  for (const key of theme.paletteKeys) {
    knownInteractiveColors.add(key);
    knownInteractiveColors.add(`${key}-container`);
    knownInteractiveColors.add(`${key}-fixed`);
  }

  // Check if it's a known interactive color or has state variants defined
  return knownInteractiveColors.has(colorName)
    || theme.keys.includes(`${colorName}-hover`)
    || theme.keys.includes(`${colorName}-focus`)
    || theme.keys.includes(`${colorName}-pressed`)
    || theme.keys.includes(`${colorName}-disabled`);
}

/**
 * Generates interactive surface components that combine base surface colors
 * with their Material Design 3 state layers (hover, focus, pressed, disabled).
 */
export function makeInteractiveSurfaceComponents(
  theme: Readonly<Theme>,
  tailwindPrefix: string = '',
): Record<string, CSSRuleObject> {
  const { themePrefix } = theme.options;

  const interactiveSurfaces: Record<string, CSSRuleObject> = {};

  // Find all surface pairs that have interactive states
  const pairs = findSurfacePairs(theme);
  const interactivePairs: SurfacePair[] = [];

  // Filter pairs to only include those with interactive states
  for (const pair of pairs.values()) {
    if (isInteractiveColor(theme, pair.bgColor)) {
      interactivePairs.push(pair);
    }
  }

  const [bgPrefix, textPrefix, borderPrefix] = ['bg-', 'text-', 'border-']
    .map(prefix => `${tailwindPrefix}${prefix}`);

  // Calculate disabled text opacity once
  const onDisabledOpacity = Math.round(stateLayerOpacities.onDisabled * 100);

  for (const pair of interactivePairs) {
    const { bgColor, textColor, surfaceName } = pair;

    // Generate the interactive surface name
    const interactiveSurfaceName = makeSurfaceName(surfaceName, 'interactive-surface-');

    // Build the interactive surface utility
    const stateClasses: string[] = [
      `${bgPrefix}${bgColor}`,
      `${textPrefix}${textColor}`,
      `${borderPrefix}${textColor}`,
    ];

    // Add hover state (only background changes)
    if (isInteractiveColor(theme, bgColor) || theme.keys.includes(`${bgColor}-hover`)) {
      stateClasses.push(`hover:${bgPrefix}${bgColor}-hover`);
    }

    // Add focus states (only background changes)
    if (isInteractiveColor(theme, bgColor) || theme.keys.includes(`${bgColor}-focus`)) {
      stateClasses.push(
        `focus:${bgPrefix}${bgColor}-focus`,
        `focus-visible:${bgPrefix}${bgColor}-focus`,
        `focus-within:${bgPrefix}${bgColor}-focus`,
      );
    }

    // Add pressed/active state (only background changes)
    if (isInteractiveColor(theme, bgColor) || theme.keys.includes(`${bgColor}-pressed`)) {
      stateClasses.push(`active:${bgPrefix}${bgColor}-pressed`);
    }

    // Add disabled state
    const hasDisabledBg = isInteractiveColor(theme, bgColor)
      || theme.keys.includes(`${bgColor}-disabled`);

    if (hasDisabledBg) {
      stateClasses.push(
        `disabled:${bgPrefix}${bgColor}-disabled`,
        `disabled:${textPrefix}${textColor}/${onDisabledOpacity}`,
      );
    }

    // Add transition for smooth state changes
    stateClasses.push('transition-colors',
      `duration-[var(--${themePrefix}state-transition-duration,150ms)]`,
    );

    interactiveSurfaces[interactiveSurfaceName] = {
      [`@apply ${stateClasses.join(' ')}`]: {},
    };
  }

  debugLog(theme.options.debug, 'interactive-surfaces', interactiveSurfaces);
  return interactiveSurfaces;
}

/**
 * Generates ripple effect component for Material Design
 */
export function makeRippleComponents(theme: Readonly<Theme>): Record<string, CSSRuleObject> {
  const { themePrefix } = theme.options;

  return {
    '.ripple-effect': {
      'position': 'absolute',
      'border-radius': '50%',
      'pointer-events': 'none',
      'background-color': 'currentColor',
      'animation': `ripple var(--${themePrefix}ripple-duration, 600ms) ease-out`,
      'will-change': 'transform, opacity',
    },
  };
}

/**
 * Shape families supported by the shape system
 */
export const SHAPE_FAMILIES = ['rounded', 'squircle'] as const;
export type ShapeFamily = typeof SHAPE_FAMILIES[number];

/**
 * Shape scale tokens for Material Design 3
 * Based on MD3 Expressive shape system
 */
export const SHAPE_SCALE = {
  'none': { rounded: '0px', squircle: '0' },
  'extra-small': { rounded: '4px', squircle: '0.6' },
  'small': { rounded: '8px', squircle: '0.8' },
  'medium': { rounded: '12px', squircle: '1' },
  'large': { rounded: '16px', squircle: '1.2' },
  'extra-large': { rounded: '28px', squircle: '1.4' },
  'full': { rounded: '9999px', squircle: '2' },
} as const;

/**
 * Shape scale keys for validation
 */
export type ShapeScaleKey = keyof typeof SHAPE_SCALE;

/**
 * Generates CSS properties for a squircle shape
 * Uses CSS mask with SVG path for smooth iOS-style squircles
 */
function getSquircleStyles(smoothing: string): CSSRuleObject {
  // Smoothing value of 1 = standard squircle, higher = more rounded
  const s = smoothing;
  return {
    'mask-image': `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='${getSquirclePath(s)}' fill='black'/%3E%3C/svg%3E")`,
    'mask-size': '100% 100%',
    'mask-repeat': 'no-repeat',
    '-webkit-mask-image': `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='${getSquirclePath(s)}' fill='black'/%3E%3C/svg%3E")`,
    '-webkit-mask-size': '100% 100%',
    '-webkit-mask-repeat': 'no-repeat',
  };
}

/**
 * Generates SVG path for a squircle shape
 * Based on the iOS squircle formula
 */
function getSquirclePath(smoothing: string): string {
  const s = Number.parseFloat(smoothing);

  // Validate smoothing parameter
  // MD3 Expressive allows values up to 2 for maximum roundness
  if (Number.isNaN(s) || s < 0 || s > 2) {
    // Default to 0.6 for invalid values (MD3 standard smoothing)
    const defaultSmoothing = 0.6;
    warnLog(`Invalid smoothing value: ${smoothing}. Expected a number between 0 and 2. Using default: ${defaultSmoothing}`);
    return getSquirclePath(String(defaultSmoothing));
  }

  if (s === 0) {
    // Rectangle
    return 'M 0 0 L 200 0 L 200 200 L 0 200 Z';
  }

  // Squircle path using cubic bezier curves
  // This creates a superellipse-like shape

  if (s >= 2) {
    // Full circle
    return 'M 100 0 A 100 100 0 0 1 200 100 A 100 100 0 0 1 100 200 A 100 100 0 0 1 0 100 A 100 100 0 0 1 100 0 Z';
  }

  // For values 0-2, interpolate between rectangle and circle
  // At s=1, this gives a standard squircle
  // At s=2, this approaches a circle
  const t = Math.min(s, 2) / 2; // Normalize to 0-1 range

  // Corner radius: 0 at s=0, 100 (full circle) at s=2
  const r = 100 * t;

  // Control point offset for bezier curves
  // This creates the squircle effect
  const controlOffset = r * 0.552_284_749_831; // Magic number for circle approximation

  // Ensure control points stay within bounds
  const cornerX = Math.max(0, Math.min(100, r));
  const cornerY = Math.max(0, Math.min(100, r));

  // Generate path
  return `M ${cornerX} 0 L ${200 - cornerX} 0 C ${200 - cornerX + controlOffset} 0 200 ${cornerY - controlOffset} 200 ${cornerY} L 200 ${200 - cornerY} C 200 ${200 - cornerY + controlOffset} ${200 - cornerX + controlOffset} 200 ${200 - cornerX} 200 L ${cornerX} 200 C ${cornerX - controlOffset} 200 0 ${200 - cornerY + controlOffset} 0 ${200 - cornerY} L 0 ${cornerY} C 0 ${cornerY - controlOffset} ${cornerX - controlOffset} 0 ${cornerX} 0 Z`;
}

/**
 * Generates shape components for Material Design 3 shape system
 */
export function makeShapeComponents(theme: Readonly<Theme>): Record<string, CSSRuleObject> {
  const { themePrefix, shapePrefix = defaultShapePrefix } = theme.options;

  if (!shapePrefix) {
    return {};
  }

  const components: Record<string, CSSRuleObject> = {};

  // Validate theme has shape tokens if needed
  const hasShapeTokens = Object.keys(theme.colors).some(key => key.startsWith('shape-'));
  if (theme.options.debug && !hasShapeTokens) {
    debugLog(true, 'shape-validation', 'No shape- tokens found in theme colors');
  }

  // Generate shape scale utilities for MD3 Expressive
  for (const [scale, values] of Object.entries(SHAPE_SCALE)) {
    // Shape token as CSS variable (MD3 Expressive design tokens)
    const shapeVariable = `--${themePrefix}shape-${scale}`;

    // Rounded corner shapes (default)
    components[`.${shapePrefix}${scale}`] = {
      'border-radius': `var(${shapeVariable}, ${values.rounded})`,
    };

    // Squircle shapes for MD3 Expressive
    if (scale !== 'none') {
      components[`.${shapePrefix}squircle-${scale}`] = {
        ...getSquircleStyles(values.squircle),
        // Store shape family for component reference
        [`--${themePrefix}shape-family-${scale}`]: 'squircle',
        // Fallback to rounded corners for browsers that don't support mask
        '@supports not (mask-image: url())': {
          'border-radius': `var(${shapeVariable}, ${values.rounded})`,
        },
      };
    }
  }

  // Add shape family utilities (cleaner names without "family-")
  components[`.${shapePrefix}rounded`] = {
    [`--${themePrefix}shape-family`]: 'rounded',
  };

  components[`.${shapePrefix}squircle`] = {
    [`--${themePrefix}shape-family`]: 'squircle',
  };

  // Component-specific shape tokens for MD3 Expressive
  // These follow Material Design 3 component shape recommendations
  const componentShapes: Record<string, keyof typeof SHAPE_SCALE> = {
    // Interactive components
    'button': 'full', // MD3: Buttons use full rounding
    'fab': 'large', // MD3: FABs use large rounding
    'chip': 'small', // MD3: Chips use small rounding
    'icon-button': 'full', // MD3: Icon buttons are circular

    // Container components
    'card': 'medium', // MD3: Cards use medium rounding
    'dialog': 'extra-large', // MD3: Dialogs use extra-large rounding
    'menu': 'extra-small', // MD3: Menus use extra-small rounding
    'snackbar': 'extra-small', // MD3: Snackbars use extra-small rounding
    'tooltip': 'extra-small', // MD3: Tooltips use extra-small rounding

    // Input components
    'text-field': 'extra-small', // MD3: Text fields use extra-small rounding
    'search': 'full', // MD3: Search bars often use full rounding

    // Navigation components
    'navigation-bar': 'none', // MD3: Nav bars typically have no rounding
    'navigation-rail': 'none', // MD3: Nav rails typically have no rounding
    'navigation-drawer': 'large', // MD3: Nav drawers use large rounding on one side
  };

  for (const [component, defaultScale] of Object.entries(componentShapes)) {
    const shapeVariable = `--${themePrefix}shape-${component}`;
    const defaultVariable = `--${themePrefix}shape-${defaultScale}`;

    // Regular rounded component shapes with MD3 token hierarchy
    components[`.${shapePrefix}${component}`] = {
      'border-radius': `var(${shapeVariable}, var(${defaultVariable}, ${SHAPE_SCALE[defaultScale].rounded}))`,
    };

    // Squircle component shapes for MD3 Expressive
    if (defaultScale !== 'none') {
      components[`.${shapePrefix}squircle-${component}`] = {
        ...getSquircleStyles(SHAPE_SCALE[defaultScale].squircle),
        // Store component shape family
        [`--${themePrefix}shape-family-${component}`]: 'squircle',
        // Fallback to rounded corners for browsers that don't support mask
        '@supports not (mask-image: url())': {
          'border-radius': `var(${shapeVariable}, var(${defaultVariable}, ${SHAPE_SCALE[defaultScale].rounded}))`,
        },
      };
    }
  }

  debugLog(theme.options.debug, 'shapes', components);
  return components;
}
