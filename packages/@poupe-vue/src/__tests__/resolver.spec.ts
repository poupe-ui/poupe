import { expect, it } from 'vitest';
import { components, createResolver } from '../resolver';
import * as PoupeIndex from '../index';
import * as PoupeComponents from '../components';

it('should export only the components from index', () => {
  expect(new Set(Object.keys(PoupeIndex))).toEqual(new Set(components));
});

it('should export only the components from components entry point', () => {
  expect(new Set(Object.keys(PoupeComponents))).toEqual(new Set(components));
});

it('should resolve component with default prefix', () => {
  const resolved = createResolver().resolve('PPlaceholder');
  expect(resolved).toEqual({
    name: 'Placeholder',
    from: '@poupe/vue',
  });
});

it('should resolve component with custom prefix', () => {
  const resolved = createResolver({ prefix: 'Poupe' }).resolve('PoupePlaceholder');
  expect(resolved).toEqual({
    name: 'Placeholder',
    from: '@poupe/vue',
  });
});

it('should not resolve invalid component', () => {
  const resolved = createResolver().resolve('PInvalid');
  expect(resolved).toBeUndefined();
});
