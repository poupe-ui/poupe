import {
  type Theme,
  defaultSurfacePrefix,
} from './types';

import {
  type CSSRuleObject,
  debugLog,
} from './utils';

export function makeThemeComponents(theme: Readonly<Theme>, tailwindPrefix: string = ''): Record<string, CSSRuleObject>[] {
  return [
    makeSurfaceComponents(theme, tailwindPrefix),
    {
      scrim: {
        '@apply fixed inset-0 bg-scrim/32': {},
      },
    },
  ];
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

  // TODO: determine pair of special colors
  // - primary-fixed-dim
  // - on-primary-fixed-variant
  // - secondary-fixed-dim
  // - on-secondary-fixed-variant
  // - tertiary-fixed-dim
  // - on-tertiary-fixed-variant

  const surfaces: Record<string, CSSRuleObject> = {};

  const [bgPrefix, textPrefix] = ['bg-', 'text-'].map(prefix => `${tailwindPrefix}${prefix}`);
  for (const [name, onName] of pairs) {
    const { key, value } = assembleSurfaceComponent(name, onName, bgPrefix, textPrefix, surfacePrefix);
    surfaces[key] = value;
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
      key: `.${bgPrefix}${colorName}`,
      value: {
        [`@apply ${textPrefix}${onColorName}`]: {},
      },
    };
  }
  // combine bg- and text-on-
  const surfaceName = makeSurfaceName(colorName, surfacePrefix);
  return {
    key: `.${surfaceName}`,
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
