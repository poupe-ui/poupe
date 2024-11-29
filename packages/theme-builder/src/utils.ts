export type { KebabCase } from 'type-fest';

export type Prettify<T> = {
  [K in keyof T]: T[K];
};

export type PropType<T, K extends keyof T> = T[K];

export function kebabCase(s: string): string {
  return s.replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}
