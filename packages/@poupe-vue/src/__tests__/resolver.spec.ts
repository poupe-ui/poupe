import { expect, it } from 'vitest';
import { components, createResolver } from '../resolver';
import * as Poupe from '../index';

it('should export components and composables', () => {
  const exports = Object.keys(Poupe);
  // Check that all components are exported
  for (const component of components) {
    expect(exports).toContain(component);
  }
  // Check that composables are also exported
  expect(exports).toContain('usePoupe');
  expect(exports).toContain('createPoupe');
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
