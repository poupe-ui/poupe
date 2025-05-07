import { describe, it, expect } from 'vitest';
import { themePlugin } from './plugin';

describe('themePlugin', () => {
  it('should implement PluginWithOptions interface', () => {
    expect(themePlugin).toBeDefined();
    expect(typeof themePlugin).toBe('function');

    // Check for expected method signatures typical of Tailwind CSS v4 plugin
    expect(themePlugin).toHaveProperty('__isOptionsFunction', true);

    // Verify the plugin can be called with options
    const mockOptions = {};
    const pluginResult = themePlugin(mockOptions);

    expect(pluginResult).toBeTruthy();
    expect(typeof pluginResult).toBe('object');

    // check for the plugin handler
    expect(pluginResult).toHaveProperty('handler');
    expect(typeof pluginResult.handler).toBe('function');

    // check for the theme config
    expect(pluginResult).toHaveProperty('config');
    expect(typeof pluginResult.config).toBe('object');
    expect(pluginResult.config).toHaveProperty('theme');
    expect(typeof pluginResult.config?.theme).toBe('object');
  });
});
