import {
  type DarkModeStrategy,
} from './types';

export interface PluginOptions {
  darkMode: DarkModeStrategy
};

export function withDefaultOptions(options: Partial<PluginOptions> = {}): PluginOptions {
  return {
    darkMode: options.darkMode ?? 'class',
  };
}
