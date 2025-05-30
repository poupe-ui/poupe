/**
 * Default selector aliases that expand simple names into complex at-rules
 */
const DEFAULT_SELECTOR_ALIASES: Record<string, string> = {
  media: '@media (prefers-color-scheme: dark)',
  dark: '@media (prefers-color-scheme: dark)',
  light: '@media (prefers-color-scheme: light)',
  mobile: '@media (max-width: 768px)',
  tablet: '@media (min-width: 769px) and (max-width: 1024px)',
  desktop: '@media (min-width: 1025px)',
};

/**
 * Expands selector aliases into their full forms
 * @param selector - The selector to potentially expand
 * @param aliases - Custom aliases to use (defaults to built-in ones)
 * @returns Expanded selector or original if no alias found
 */
export function expandSelectorAlias(
  selector: string,
  aliases: Record<string, string> = DEFAULT_SELECTOR_ALIASES,
): string {
  const trimmed = selector.trim();
  return aliases[trimmed] || trimmed;
}

export interface ProcessCSSSelectorOptions {
  /** Whether to add "selector *" variants to each selector */
  addStarVariants?: boolean
  /** Whether to allow comma-separated selectors to pass through */
  allowCommaPassthrough?: boolean
  /** Custom selector aliases to use for expansion */
  aliases?: Record<string, string>
}

/**
 * Processes CSS selectors and at-rules, handling both strings and arrays.
 * Merges consecutive selectors with OR and adds * variants,
 * while keeping at-rules stacked separately.
 *
 * @param selectors - CSS selector(s) and at-rules
 * @param options - Processing options
 * @returns Array of processed selector strings or undefined
 */
export function processCSSSelectors(
  selectors: string | string[],
  options: ProcessCSSSelectorOptions = {},
): string[] | undefined {
  const {
    addStarVariants = true,
    allowCommaPassthrough = true,
    aliases = DEFAULT_SELECTOR_ALIASES,
  } = options;

  // Convert string to array for unified processing
  const selectorArray = Array.isArray(selectors) ? selectors : [selectors];

  // Handle comma passthrough for single strings
  if (!Array.isArray(selectors) && allowCommaPassthrough && selectors.includes(',')) {
    const expanded = expandSelectorAlias(selectors, aliases);
    return [expanded];
  }

  const result: string[] = [];
  const currentSelectors: string[] = [];

  const flushSelectors = () => {
    if (currentSelectors.length > 0) {
      // Merge consecutive selectors with OR, optionally adding * variants
      const expandedSelectors: string[] = [];
      for (const selector of currentSelectors) {
        expandedSelectors.push(selector);
        if (addStarVariants) {
          expandedSelectors.push(`${selector} *`);
        }
      }
      result.push(expandedSelectors.join(', '));
      currentSelectors.length = 0;
    }
  };

  for (const s of selectorArray) {
    const expanded = expandSelectorAlias(s, aliases);
    const trimmed = expanded.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('@')) {
      // At-rule: flush current selectors and add at-rule separately
      flushSelectors();
      result.push(trimmed);
    } else {
      // Regular selector: add to current batch
      currentSelectors.push(trimmed);
    }
  }

  // Flush any remaining selectors
  flushSelectors();

  return result.length === 0 ? undefined : result;
}
