import {
  type Theme,
  defaultSurfacePrefix,
} from './types';

import {
  type CSSRuleObject,
  debugLog,
} from './utils';

/** Default opacity for scrim utilities when no modifier is provided */
export const DEFAULT_SCRIM_OPACITY = '32%';

export function makeThemeComponents(theme: Readonly<Theme>, tailwindPrefix: string = ''): Record<string, CSSRuleObject>[] {
  return [
    makeSurfaceComponents(theme, tailwindPrefix),
    makeZIndexComponents(theme),
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
 * Generates a composite surface name by finding the unique parts between
 * background and text color names for special fixed color combinations.
 */
function generateCompositeSurfaceName(baseKey: string, bgName: string, textName: string): string {
  // Find the common prefix between the background and text colors
  // Remove 'on-' prefix from text color for comparison
  const textWithoutOn = textName.startsWith('on-') ? textName.slice(3) : textName;

  // Split both names into parts
  const bgParts = bgName.split('-');
  const textParts = textWithoutOn.split('-');

  // Find common prefix parts
  let commonParts = 0;
  for (let i = 0; i < Math.min(bgParts.length, textParts.length); i++) {
    if (bgParts[i] === textParts[i]) {
      commonParts++;
    } else {
      break;
    }
  }

  // Get the unique parts from both colors
  const bgSuffix = bgParts.slice(commonParts).join('-');
  const textSuffix = textParts.slice(commonParts).join('-');

  // Build the surface name with both unique parts
  if (bgSuffix && textSuffix) {
    return `${baseKey}-${textSuffix}`;
  } else if (textSuffix) {
    return `${baseKey}-${textSuffix}`;
  }
  // If only bgSuffix exists, baseKey already contains it
  return baseKey;
}

export function makeSurfaceComponents(theme: Readonly<Theme>, tailwindPrefix: string = ''): Record<string, CSSRuleObject> {
  const { surfacePrefix = defaultSurfacePrefix } = theme.options;
  if (!surfacePrefix) {
    return {};
  }

  // find surface pairs
  const pairs = new Map<string, string>();
  for (const name of theme.keys) {
    if (theme.colors[name] && theme.colors[`on-${name}`]) {
      pairs.set(name, `on-${name}`);
    }
  }

  // Handle special fixed color combinations
  // Each fixed background (primary-fixed, primary-fixed-dim) can pair with
  // each fixed text variant (on-primary-fixed, on-primary-fixed-variant)
  const fixedPrefixes = ['primary', 'secondary', 'tertiary'];

  for (const prefix of fixedPrefixes) {
    const backgrounds = [`${prefix}-fixed`, `${prefix}-fixed-dim`];
    const texts = [`on-${prefix}-fixed`, `on-${prefix}-fixed-variant`];

    // Create all combinations for fixed colors
    for (const bg of backgrounds) {
      for (const text of texts) {
        if (theme.colors[bg] && theme.colors[text]) {
          // Use a composite key to avoid overwriting the standard pair
          const key = bg + ':' + text;
          pairs.set(key, text);
        }
      }
    }
  }

  const surfaces: Record<string, CSSRuleObject> = {};

  const [bgPrefix, textPrefix] = ['bg-', 'text-'].map(prefix => `${tailwindPrefix}${prefix}`);
  for (const [nameKey, onName] of pairs) {
    // Handle composite keys for special combinations
    const name = nameKey.includes(':') ? nameKey.split(':')[0] : nameKey;
    const { key, value } = assembleSurfaceComponent(name, onName, bgPrefix, textPrefix, surfacePrefix);

    // For composite keys, create unique surface names by finding what's different
    let surfaceKey = key;
    if (nameKey.includes(':')) {
      surfaceKey = generateCompositeSurfaceName(key, name, onName);
    }

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
  if (colorName.startsWith(prefix) || `${colorName}-` === prefix) {
    // prevent duplication
    return colorName;
  }
  return `${prefix}${colorName}`;
}
