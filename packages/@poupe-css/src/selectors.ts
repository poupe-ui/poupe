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

/**
 * Processes an array of CSS selectors and at-rules, merging consecutive
 * selectors with OR and adding * variants, while keeping at-rules stacked
 * separately.
 *
 * @param selectors - Array of CSS selectors and at-rules
 * @param addStarVariants - Whether to add "selector *" variants
 * @returns Single string, array of strings, or undefined
 */
export function processCSSRuleChain(
  selectors: string[],
  addStarVariants: boolean = true,
): string | string[] | undefined {
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

  for (const s of selectors) {
    const expanded = expandSelectorAlias(s);
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

  if (result.length === 0) {
    return undefined;
  }
  return result.length === 1 ? result[0] : result;
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
 * Generic function to process CSS selector arrays for any theme mode
 * @param selectors - Array of CSS selectors and at-rules
 * @param options - Processing options
 * @returns Processed selector string(s) or undefined
 */
export function processCSSSelectors(
  selectors: string | string[],
  options: ProcessCSSSelectorOptions = {},
): string | string[] | undefined {
  const {
    addStarVariants = true,
    allowCommaPassthrough = true,
    aliases,
  } = options;

  if (!Array.isArray(selectors)) {
    const expanded = expandSelectorAlias(selectors, aliases);

    if (allowCommaPassthrough && expanded.includes(',')) {
      return expanded;
    }
    return addStarVariants
      ? `${expanded}, ${expanded} *`
      : expanded;
  }

  return processCSSRuleChain(selectors, addStarVariants);
}
