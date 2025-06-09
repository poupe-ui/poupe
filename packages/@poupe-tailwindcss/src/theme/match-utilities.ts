import {
  type CSSRuleObject,
  type PluginAPI,
} from './utils';

/** Default opacity for scrim utilities when no modifier is provided */
const DEFAULT_SCRIM_OPACITY = '32%';

/** The value type for utilities in {@link PluginAPI.matchUtilities} function */
export type MatchUtilitiesValue = Parameters<PluginAPI['matchUtilities']>[0][string];

/** The options type for {@link PluginAPI.matchUtilities} function */
export type MatchUtilitiesOptions = Parameters<PluginAPI['matchUtilities']>[1];

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
export function asMatchUtility(name: string, value: CSSRuleObject): ({
  name: string
  value?: MatchUtilitiesValue
  options?: MatchUtilitiesOptions
} | undefined) {
  // Only process dynamic utilities (those ending with -*)
  if (!name.endsWith('-*')) {
    return undefined;
  }

  // Convert utility name to base name (remove -* suffix)
  const utilityBaseName = name.slice(0, -2);

  // Separate --value() and --modifier() patterns from static CSS rules
  const dynamicProperties: Array<{
    cssProperty: string
    valuePattern: string
    type: string
  }> = [];
  const modifierProperties: Array<ModifierProperties> = [];
  const staticCSSRules: CSSRuleObject = {};

  for (const [cssProperty, cssValue] of Object.entries(value)) {
    if (typeof cssValue === 'string') {
      if (cssValue.includes('--value(')) {
        // Parse --value() pattern
        // Note: In Tailwind v4 CSS syntax, --value(integer, [integer]) means
        // the utility accepts both bare values (tab-4) and arbitrary values (tab-[4])
        // Since matchUtilities automatically handles arbitrary values, we only
        // need to extract the base type
        const valueMatch = cssValue.match(/--value\(([^)]+)\)/);
        if (valueMatch) {
          const valuePattern = valueMatch[1];
          // Extract the first type, ignoring additional syntax like [type]
          const type = valuePattern.split(',')[0].trim().replaceAll(/[[\]]/g, '') || 'any';

          dynamicProperties.push({
            cssProperty,
            valuePattern: cssValue,
            type,
          });
        }
      } else if (cssValue.includes('--modifier(')) {
        // Parse --modifier() pattern for opacity and other modifiers
        // Handle both --modifier([percentage]) and --modifier(type, default) patterns
        const modifierMatch = cssValue.match(/--modifier\(([^)]+)\)/);
        if (modifierMatch) {
          const modifierContent = modifierMatch[1].trim();
          let modifierType = 'any';
          let defaultValue = '';

          if (modifierContent.includes(',')) {
            // Pattern: --modifier(type, default)
            const parts = modifierContent.split(',').map(s => s.trim());
            if (parts.length >= 2) {
              modifierType = parts[0].replaceAll(/[[\\]]/g, '');
              defaultValue = parts[1];
            } else {
              // Fallback if comma is present but split doesn't work as expected
              modifierType = modifierContent.replaceAll(/[[\\]]/g, '');
            }
          } else {
            // Pattern: --modifier([percentage]) or --modifier(percentage)
            modifierType = modifierContent.replaceAll(/[[\\]]/g, '');
            // Set default based on the CSS property name for known properties
            if (cssProperty.includes('scrim-opacity')) {
              defaultValue = DEFAULT_SCRIM_OPACITY;
            }
          }

          modifierProperties.push({
            cssProperty,
            modifierPattern: cssValue,
            modifierType,
            defaultValue,
          });
        }
      } else {
        // Static CSS rules (like @apply directives)
        staticCSSRules[cssProperty] = cssValue;
      }
    } else {
      // Non-string values
      staticCSSRules[cssProperty] = cssValue;
    }
  }

  // If no dynamic properties found, this isn't a dynamic utility
  if (dynamicProperties.length === 0) {
    return undefined;
  }

  // Determine options from the primary dynamic property
  const primaryDynamicProp = dynamicProperties[0];
  const options = convertTypeToMatchUtilitiesOptions(primaryDynamicProp.type);

  return {
    name: utilityBaseName,
    value: (userValue: string, { modifier }: { modifier: string | null }) => {
      // Start with static CSS rules
      const cssResult: CSSRuleObject = { ...staticCSSRules };

      // Replace each --value() pattern with the user's input
      for (const { cssProperty } of dynamicProperties) {
        cssResult[cssProperty] = userValue;
      }

      // Replace each --modifier() pattern with modifier value or default
      for (const { cssProperty, defaultValue, modifierPattern } of modifierProperties) {
        if (modifierPattern.includes('[percentage]')) {
          // For percentage types, append % to the modifier value
          const value = modifier ? `${modifier}%` : defaultValue;
          cssResult[cssProperty] = value;
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

type ModifierProperties = {
  cssProperty: string
  modifierPattern: string
  modifierType: string
  defaultValue: string
};

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

  const mappedType = typeMapping[type] || 'any';

  return {
    type: mappedType,
  };
}
