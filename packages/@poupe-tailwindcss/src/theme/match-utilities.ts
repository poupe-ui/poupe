import {
  type CSSRuleObject,
  type PluginAPI,
} from './utils';

import {
  DEFAULT_SCRIM_OPACITY,
} from './components';

/** The value type for utilities in {@link PluginAPI.matchUtilities} function */
export type MatchUtilitiesValue = Parameters<PluginAPI['matchUtilities']>[0][string];

/** The options type for {@link PluginAPI.matchUtilities} function */
export type MatchUtilitiesOptions = Parameters<PluginAPI['matchUtilities']>[1];

type DynamicProperty = {
  cssProperty: string
  type: string
};

type ModifierProperty = {
  cssProperty: string
  defaultValue: string
  modifierPattern: string
};

/**
 * Transforms a utility class name and its CSS rule object into a match utility configuration
 * for Tailwind CSS's matchUtilities API. This enables dynamic utilities that accept arbitrary values.
 *
 * @param name - The name of the utility class (with -* suffix for dynamic utilities)
 * @param value - The CSS rule object containing --value() patterns that indicate dynamic values
 * @returns A match utility configuration object compatible with Tailwind's matchUtilities API
 *
 * @remarks
 * This function detects utilities that use the --value() pattern (from Tailwind v4's CSS syntax)
 * and converts them to work with the matchUtilities JavaScript API, enabling arbitrary values
 * like scrim-z-[100] or scrim-z-[var(--custom-z)].
 */
export function asMatchUtility(name: string, value: CSSRuleObject): (undefined | {
  name: string
  options?: MatchUtilitiesOptions
  value?: MatchUtilitiesValue
}) {
  // Only process dynamic utilities (those ending with -*)
  if (!name.endsWith('-*')) {
    return undefined;
  }

  // Convert utility name to base name (remove -* suffix)
  const utilityBaseName = name.slice(0, -2);

  // Separate --value() and --modifier() patterns from static CSS rules
  const dynamicProperties: DynamicProperty[] = [];
  const modifierProperties: ModifierProperty[] = [];
  const staticCSSRules: CSSRuleObject = {};

  for (const [cssProperty, cssValue] of Object.entries(value)) {
    if (typeof cssValue !== 'string') {
      staticCSSRules[cssProperty] = cssValue;
      continue;
    }

    const dynamic = parseValuePattern(cssValue);
    if (dynamic) {
      dynamicProperties.push({ cssProperty, type: dynamic.type });
      continue;
    }

    const modifier = parseModifierPattern(cssValue, cssProperty);
    if (modifier) {
      modifierProperties.push({
        cssProperty,
        modifierPattern: cssValue,
        defaultValue: modifier.defaultValue,
      });
      continue;
    }

    // Static CSS rules (e.g. @apply directives)
    staticCSSRules[cssProperty] = cssValue;
  }

  // If no dynamic properties found, this isn't a dynamic utility
  if (dynamicProperties.length === 0) {
    return undefined;
  }

  // length ≥ 1 verified above; [0] cannot be undefined
  const options = convertTypeToMatchUtilitiesOptions(dynamicProperties[0]!.type);

  return {
    name: utilityBaseName,
    value: (userValue: string, { modifier }: { modifier: null | string }) => {
      const cssResult: CSSRuleObject = { ...staticCSSRules };

      for (const { cssProperty } of dynamicProperties) {
        cssResult[cssProperty] = userValue;
      }

      for (const { cssProperty, defaultValue, modifierPattern } of modifierProperties) {
        if (modifierPattern.includes('[percentage]')) {
          // Percentage modifiers receive the user value with `%` appended
          cssResult[cssProperty] = modifier ? `${modifier}%` : defaultValue;
        } else {
          cssResult[cssProperty] = modifier || defaultValue;
        }
      }

      return cssResult;
    },
    options: {
      ...options,
      ...(modifierProperties.length > 0 ? { modifiers: 'any' } : {}),
    },
  };
}

/**
 * Parses a `--value(type)` or `--value(type, [type])` pattern, returning the
 * resolved type. In Tailwind v4 syntax, the bracketed `[type]` alternative
 * marks arbitrary-value support — but matchUtilities accepts arbitrary values
 * automatically, so we only need the first (bare) type.
 *
 * `[^)]+` guarantees a non-empty capture group when the match succeeds, and
 * `String.split` always yields ≥1 element.
 */
function parseValuePattern(cssValue: string): undefined | { type: string } {
  const match = cssValue.match(/--value\(([^)]+)\)/);
  if (!match) return undefined;
  const firstType = match[1]!.split(',')[0]!.trim().replaceAll(/[[\]]/g, '');
  return { type: firstType || 'any' };
}

/**
 * Parses a `--modifier(type)` or `--modifier(type, default)` pattern, returning
 * the resolved default value. Falls back to `DEFAULT_SCRIM_OPACITY` for
 * scrim-opacity properties when no explicit default is given.
 */
function parseModifierPattern(
  cssValue: string,
  cssProperty: string,
): undefined | { defaultValue: string } {
  const match = cssValue.match(/--modifier\(([^)]+)\)/);
  if (!match) return undefined;
  const content = match[1]!.trim();

  if (content.includes(',')) {
    // includes(',') guarantees split yields ≥2 elements
    return { defaultValue: content.split(',')[1]!.trim() };
  }

  return {
    defaultValue: cssProperty.includes('scrim-opacity') ? DEFAULT_SCRIM_OPACITY : '',
  };
}

/**
 * Converts --value() type specifications to matchUtilities options.
 *
 * @param type - The type from --value() pattern
 * @returns MatchUtilitiesOptions for the matchUtilities API
 */
function convertTypeToMatchUtilitiesOptions(type: string): MatchUtilitiesOptions {
  // Map types to matchUtilities type options
  const typeMapping: Record<string, string> = {
    integer: 'number', // matchUtilities uses 'number' for integers
    number: 'number',
    length: 'length',
    color: 'color',
    percentage: 'percentage',
    url: 'url',
    any: 'any',
  };

  return {
    type: typeMapping[type] || 'any',
  };
}
