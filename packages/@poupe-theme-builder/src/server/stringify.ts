import {
  type CSSRules,
  type CSSRuleObject,
  type CSSRulesFormatOptions,
  generateCSSRulesArray,
} from '@poupe/css';

/**
 * Options for formatting CSS rules with newLine support.
 */
export interface CSSRulesStringifyOptions extends CSSRulesFormatOptions {
  /**
   * Character(s) to use for line breaks.
   * @defaultValue `'\n'`
   */
  newLine?: string
}

/**
 * Converts CSS rules array to a string with newLine between
 * each line. Uses the efficient generator implementation internally.
 * No trailing newLine for composition purposes.
 *
 * @param rules - The array of CSS rules to format
 * @param options - Configuration options for formatting
 * @returns A string with newLine-separated lines
 */
export function stringifyCSSRulesArray(
  rules: (string | CSSRules | CSSRuleObject)[] = [],
  options: CSSRulesStringifyOptions = {},
): string {
  const {
    newLine = '\n',
    ...formatOptions
  } = options;

  const lines = [...generateCSSRulesArray(rules, formatOptions)];

  // Join with newLine (no trailing newLine for composition)
  return lines.join(newLine);
}

/**
 * Converts CSS rules array to an async generator for streaming responses.
 * Uses the efficient generator implementation that yields lines as they're generated.
 *
 * @param rules - The array of CSS rules to format
 * @param options - Configuration options for formatting
 * @returns Formatted CSS lines with newLine endings
 */
export async function* stringifyCSSRulesArrayStream(
  rules: (string | CSSRules | CSSRuleObject)[] = [],
  options: CSSRulesStringifyOptions = {},
): AsyncGenerator<string, void, unknown> {
  const {
    newLine = '\n',
    ...formatOptions
  } = options;

  // Use the generator for true streaming
  for (const line of generateCSSRulesArray(rules, formatOptions)) {
    yield line + newLine;
  }
}

/**
 * Creates a ReadableStream with formatted CSS rules array.
 * Uses the generator directly for true streaming without building arrays.
 * Perfect for Cloudflare Workers and other edge environments.
 *
 * @param rules - The array of CSS rules to format
 * @param options - Configuration options for formatting
 * @returns A ReadableStream ready to be used in Response or other contexts
 */
export function stringifyCSSRulesArrayAsStream(
  rules: (string | CSSRules | CSSRuleObject)[] = [],
  options: CSSRulesStringifyOptions = {},
): ReadableStream<Uint8Array> {
  const {
    newLine = '\n',
    ...formatOptions
  } = options;

  return new ReadableStream({
    start(controller) {
      const generator = generateCSSRulesArray(rules, formatOptions);
      const encoder = new TextEncoder();

      function pump() {
        const { done, value } = generator.next();

        if (done) {
          controller.close();
          return;
        }

        controller.enqueue(encoder.encode(value + newLine));
        pump();
      }

      pump();
    },
  });
}

/**
 * Creates a Response object with formatted CSS rules array.
 * Sets appropriate Content-Type header and allows for additional headers.
 *
 * @param rules - The array of CSS rules to format
 * @param options - Configuration options for formatting and response
 * @returns A Response object ready to be sent
 */
export function stringifyCSSRulesArrayAsResponse(
  rules: (string | CSSRules | CSSRuleObject)[] = [],
  options: CSSRulesStringifyOptions & {
    /**
     * Additional headers to include in the response.
     */
    headers?: HeadersInit
  } = {},
): Response {
  const {
    headers: extraHeaders,
    newLine = '\n',
    ...formatOptions
  } = options;

  const content = stringifyCSSRulesArray(rules, { newLine, ...formatOptions });
  const finalContent = content ? content + newLine : content;

  const headers = new Headers(extraHeaders);
  // Set Content-Type if not already set
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'text/css; charset=utf-8');
  }

  return new Response(finalContent, {
    status: 200,
    headers,
  });
}

/**
 * Creates a streaming Response object with formatted CSS rules array.
 * Uses the ReadableStream function for true streaming without building arrays.
 * Sets appropriate Content-Type header and allows for additional headers.
 *
 * @param rules - The array of CSS rules to format
 * @param options - Configuration options for formatting and response
 * @returns A streaming Response object ready to be sent
 */
export function stringifyCSSRulesArrayAsStreamingResponse(
  rules: (string | CSSRules | CSSRuleObject)[] = [],
  options: CSSRulesStringifyOptions & {
    /**
     * Additional headers to include in the response.
     */
    headers?: HeadersInit
  } = {},
): Response {
  const {
    headers: extraHeaders,
    ...streamOptions
  } = options;

  const headers = new Headers(extraHeaders);
  // Set Content-Type if not already set
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'text/css; charset=utf-8');
  }

  const stream = stringifyCSSRulesArrayAsStream(rules, streamOptions);

  return new Response(stream, {
    status: 200,
    headers,
  });
}
