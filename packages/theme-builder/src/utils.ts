export type { KebabCase } from 'type-fest';

export type Prettify<T> = {
  [K in keyof T]: T[K];
};

export type PropType<T, K extends keyof T> = T[K];

export function kebabCase(s: string): string {
  return s.replaceAll(/([a-z])([A-Z])/g, '$1-$2')
    .replaceAll(/[\s_]+/g, '-')
    .toLowerCase();
}

/*
 * CSSRuleObject inspired by tailwindcss/types/config's
 */
export interface CSSRuleObject {
  [key: string]: null | string | string[] | CSSRuleObject
};
