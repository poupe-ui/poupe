declare module 'stringify-object' {
  interface StringifyOptions {
    indent?: string
    singleQuotes?: boolean
    inlineCharacterLimit?: number
    filter?: (object: unknown, prop: string) => boolean
  }

  function stringifyObject(
    input: unknown,
    options?: StringifyOptions,
    pad?: string
  ): string;

  export = stringifyObject;
}
