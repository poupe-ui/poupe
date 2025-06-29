import {
  type CSSRuleObject,
  warnLog,
} from './utils';

/**
 * Shape families supported by Material Design 3 Expressive
 *
 * @see https://m3.material.io/styles/shape/overview
 */
export const SHAPE_FAMILIES = [
  'rounded', // Standard rounded corners (border-radius)
  'squircle', // iOS-style super-elliptical corners
  'cut', // Cut/angled corners
  'concave', // Inward curved corners
  'convex', // Outward curved corners (beyond rounded)
] as const;

export type ShapeFamily = typeof SHAPE_FAMILIES[number];

/**
 * Shape scale tokens for Material Design 3
 * Based on MD3 shape system with expressive extensions
 *
 * MD3 defines: none, xs (extra-small), sm (small), md (medium), lg (large), xl (extra-large), full
 * where 'full' means completely rounded (pill/circle shape)
 */
export const SHAPE_SCALE = {
  none: {
    rounded: '0px',
    squircle: '0',
    cut: '0px',
    concave: '0px',
    convex: '0px',
  },
  xs: {
    rounded: '4px',
    squircle: '0.6',
    cut: '4px',
    concave: '4px',
    convex: '6px',
  },
  sm: {
    rounded: '8px',
    squircle: '0.8',
    cut: '8px',
    concave: '8px',
    convex: '12px',
  },
  md: {
    rounded: '12px',
    squircle: '1',
    cut: '12px',
    concave: '12px',
    convex: '18px',
  },
  lg: {
    rounded: '16px',
    squircle: '1.2',
    cut: '16px',
    concave: '16px',
    convex: '24px',
  },
  xl: {
    rounded: '28px',
    squircle: '1.4',
    cut: '28px',
    concave: '28px',
    convex: '36px',
  },
  full: {
    rounded: '9999px', // Fully rounded corners (pill/circle shape)
    squircle: '2',
    cut: '50%',
    concave: '50%',
    convex: '9999px',
  },
} as const;

export type ShapeScaleKey = keyof typeof SHAPE_SCALE;

/**
 * Corner positions for asymmetric shapes
 */
export type CornerPosition = 'tl' | 'tr' | 'br' | 'bl';
export type CornerSide = 't' | 'r' | 'b' | 'l';
export type CornerGroup = 'all' | CornerPosition | CornerSide;

/**
 * Maps corner groups to their constituent corners
 */
export const CORNER_GROUPS: Record<CornerGroup, CornerPosition[]> = {
  all: ['tl', 'tr', 'br', 'bl'],
  tl: ['tl'],
  tr: ['tr'],
  br: ['br'],
  bl: ['bl'],
  t: ['tl', 'tr'],
  r: ['tr', 'br'],
  b: ['br', 'bl'],
  l: ['tl', 'bl'],
};

/**
 * Generates CSS properties for rounded corners with asymmetric support
 */
export function getRoundedStyles(
  radius: string,
  corners: CornerPosition[] = ['tl', 'tr', 'br', 'bl'],
  scale?: ShapeScaleKey,
  themePrefix: string = 'md-',
): CSSRuleObject {
  if (corners.length === 4) {
    // All corners - use standard border-radius with CSS variable
    if (scale) {
      return { 'border-radius': `var(--${themePrefix}shape-${scale})` };
    }
    return { 'border-radius': radius };
  }

  // Asymmetric corners - set individual corner radii
  const styles: CSSRuleObject = {};
  const cornerMap: Record<CornerPosition, string> = {
    tl: 'border-top-left-radius',
    tr: 'border-top-right-radius',
    br: 'border-bottom-right-radius',
    bl: 'border-bottom-left-radius',
  };

  // Only set specific corners without resetting others
  // This preserves Tailwind's composability
  for (const corner of corners) {
    const value = scale
      ? `var(--${themePrefix}shape-${scale})`
      : radius;
    styles[cornerMap[corner]] = value;
  }

  return styles;
}

/**
 * Generates CSS properties for a squircle shape
 * Uses CSS mask with SVG path for smooth iOS-style squircles
 */
export function getSquircleStyles(
  smoothing: string,
  corners: CornerPosition[] = ['tl', 'tr', 'br', 'bl'],
): CSSRuleObject {
  const s = smoothing;

  // For asymmetric squircles, we need a more complex approach
  if (corners.length < 4) {
    // TODO: Implement asymmetric squircle masks
    // For now, fall back to rounded corners with equivalent radius
    const radiusMap: Record<string, string> = {
      0: '0',
      0.6: '4px',
      0.8: '8px',
      1: '12px',
      1.2: '16px',
      1.4: '28px',
      2: '9999px',
    };
    // Don't reset border-radius for asymmetric corners
    const styles: CSSRuleObject = {};
    const cornerMap: Record<CornerPosition, string> = {
      tl: 'border-top-left-radius',
      tr: 'border-top-right-radius',
      br: 'border-bottom-right-radius',
      bl: 'border-bottom-left-radius',
    };
    const radius = radiusMap[s] || '12px';
    for (const corner of corners) {
      styles[cornerMap[corner]] = radius;
    }
    return styles;
  }

  // Full squircle using mask
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
export function getSquirclePath(smoothing: string): string {
  const s = Number.parseFloat(smoothing);

  if (Number.isNaN(s) || s < 0 || s > 2) {
    const defaultSmoothing = 0.6;
    warnLog(`Invalid smoothing value: ${smoothing}. Expected 0-2. Using default: ${defaultSmoothing}`);
    return getSquirclePath(String(defaultSmoothing));
  }

  if (s === 0) {
    // Rectangle
    return 'M 0 0 L 200 0 L 200 200 L 0 200 Z';
  }

  if (s >= 2) {
    // Full circle
    return 'M 100 0 A 100 100 0 0 1 200 100 A 100 100 0 0 1 100 200 A 100 100 0 0 1 0 100 A 100 100 0 0 1 100 0 Z';
  }

  // Squircle path using cubic bezier curves
  const t = Math.min(s, 2) / 2;
  const r = 100 * t;
  const controlOffset = r * 0.552_284_749_831;

  const cornerX = Math.max(0, Math.min(100, r));
  const cornerY = Math.max(0, Math.min(100, r));

  return `M ${cornerX} 0 L ${200 - cornerX} 0 C ${200 - cornerX + controlOffset} 0 200 ${cornerY - controlOffset} 200 ${cornerY} L 200 ${200 - cornerY} C 200 ${200 - cornerY + controlOffset} ${200 - cornerX + controlOffset} 200 ${200 - cornerX} 200 L ${cornerX} 200 C ${cornerX - controlOffset} 200 0 ${200 - cornerY + controlOffset} 0 ${200 - cornerY} L 0 ${cornerY} C 0 ${cornerY - controlOffset} ${cornerX - controlOffset} 0 ${cornerX} 0 Z`;
}

/**
 * Generates CSS properties for cut corners
 * Uses clip-path for angled corner cuts
 */
export function getCutStyles(
  size: string,
  corners: CornerPosition[] = ['tl', 'tr', 'br', 'bl'],
): CSSRuleObject {
  // Convert size to percentage for clip-path
  const sizeNumber = Number.parseInt(size);
  const percent = Math.min(50, Math.round((sizeNumber / 100) * 50));

  if (corners.length === 4) {
    // All corners cut
    return {
      'clip-path': `polygon(${percent}% 0%, ${100 - percent}% 0%, 100% ${percent}%, 100% ${100 - percent}%, ${100 - percent}% 100%, ${percent}% 100%, 0% ${100 - percent}%, 0% ${percent}%)`,
    };
  }

  // Asymmetric cut corners
  // Build a custom polygon based on which corners are cut
  const points: string[] = [];

  // Top left
  if (corners.includes('tl')) {
    points.push(`${percent}% 0%`, `0% ${percent}%`);
  } else {
    points.push('0% 0%');
  }

  // Top right
  if (corners.includes('tr')) {
    points.push(`${100 - percent}% 0%`, `100% ${percent}%`);
  } else {
    points.push('100% 0%');
  }

  // Bottom right
  if (corners.includes('br')) {
    points.push(`100% ${100 - percent}%`, `${100 - percent}% 100%`);
  } else {
    points.push('100% 100%');
  }

  // Bottom left
  if (corners.includes('bl')) {
    points.push(`${percent}% 100%`, `0% ${100 - percent}%`);
  } else {
    points.push('0% 100%');
  }

  return {
    'clip-path': `polygon(${points.join(', ')})`,
  };
}

// Track whether we've shown the concave corners warning
let concaveWarningShown = false;

/**
 * Generates CSS properties for concave corners
 * Uses radial gradients and masks for inward curves
 */
export function getConcaveStyles(
  size: string,
): CSSRuleObject {
  // Concave corners are complex and require SVG masks
  // For now, provide a fallback using inverted border radius effect
  if (!concaveWarningShown) {
    warnLog('Concave corners are experimental and may not work in all browsers');
    concaveWarningShown = true;
  }

  return {
    'position': 'relative',
    'overflow': 'hidden',
    // TODO: Implement proper concave corner masks
    'border-radius': size,
  };
}

/**
 * Generates CSS properties for convex corners
 * More extreme rounding than standard rounded corners
 */
export function getConvexStyles(
  size: string,
  corners: CornerPosition[] = ['tl', 'tr', 'br', 'bl'],
  scale?: ShapeScaleKey,
  themePrefix?: string,
): CSSRuleObject {
  // Convex is like rounded but with more extreme values
  // Could also use SVG paths for more control
  const sizeNumber = Number.parseInt(size);

  // Cap the maximum radius to 9999px for better compatibility and readability
  const convexRadius = sizeNumber >= 6666 ? '9999px' : `${sizeNumber * 1.5}px`;

  return getRoundedStyles(convexRadius, corners, scale, themePrefix);
}

/**
 * Gets the appropriate shape styles based on family
 */
export function getShapeStyles(
  family: ShapeFamily,
  value: string,
  corners: CornerPosition[] = ['tl', 'tr', 'br', 'bl'],
  scale?: ShapeScaleKey,
  themePrefix?: string,
): CSSRuleObject {
  switch (family) {
    case 'rounded':
      return getRoundedStyles(value, corners, scale, themePrefix);
    case 'squircle':
      return getSquircleStyles(value, corners);
    case 'cut':
      return getCutStyles(value, corners);
    case 'concave':
      return getConcaveStyles(value);
    case 'convex':
      return getConvexStyles(value, corners, scale, themePrefix);
    default:
      return {};
  }
}

/**
 * Component shape tokens for MD3
 */
export const COMPONENT_SHAPES: Record<string, { scale: ShapeScaleKey; family?: ShapeFamily }> = {
  // Interactive components
  'button': { scale: 'full' },
  'fab': { scale: 'lg' },
  'chip': { scale: 'sm' },
  'icon-button': { scale: 'full' },

  // Container components
  'card': { scale: 'md' },
  'dialog': { scale: 'xl' },
  'menu': { scale: 'xs' },
  'snackbar': { scale: 'xs' },
  'tooltip': { scale: 'xs' },

  // Input components
  'text-field': { scale: 'xs' },
  'search': { scale: 'full' },

  // Navigation components
  'navigation-bar': { scale: 'none' },
  'navigation-rail': { scale: 'none' },
  'navigation-drawer': { scale: 'lg' },

  // Special shapes with specific families
  'badge': { scale: 'sm', family: 'squircle' },
  'avatar': { scale: 'full', family: 'squircle' },
};
