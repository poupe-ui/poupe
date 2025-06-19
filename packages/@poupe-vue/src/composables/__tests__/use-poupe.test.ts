import { describe, it, expect } from 'vitest';
import { createApp } from 'vue';
import {
  createPoupe,
  usePoupeDefaults,
  providePoupeOptions,
} from '../use-poupe';
import type { PoupeOptions } from '../use-poupe';

describe('usePoupe', () => {
  it('creates a poupe instance', () => {
    const poupe = createPoupe({
      defaults: {
        button: { variant: 'filled' as const },
      },
    });

    expect(poupe).toBeDefined();
    expect(poupe.install).toBeInstanceOf(Function);
  });

  it('provides options to app', () => {
    const app = createApp({});
    const options: PoupeOptions = {
      defaults: {
        button: { variant: 'filled' as const, surface: 'primary' as const },
        card: { elevation: 'z2' },
      },
    };

    app.use(createPoupe(options));

    // The options should be provided to the app
    const provided = app._context.provides;
    expect(provided).toBeDefined();
  });

  it('allows empty options', () => {
    const poupe = createPoupe();
    expect(poupe).toBeDefined();
  });

  it('supports theme options', () => {
    const poupe = createPoupe({
      theme: {
        dark: true,
        colors: { primary: '#1976d2' },
      },
    });

    expect(poupe).toBeDefined();
  });

  it('supports accessibility options', () => {
    const poupe = createPoupe({
      accessibility: {
        reducedMotion: true,
        highContrast: false,
      },
    });

    expect(poupe).toBeDefined();
  });

  describe('usePoupeDefaults', () => {
    it('returns undefined when no poupe is provided', () => {
      const defaults = usePoupeDefaults('button');
      expect(defaults).toBeUndefined();
    });
  });

  describe('providePoupeOptions', () => {
    it('provides options for isolated instances', () => {
      const options: PoupeOptions = {
        defaults: {
          button: { variant: 'outlined' as const },
        },
      };

      // This would be used in a component setup
      expect(() => providePoupeOptions(options as PoupeOptions)).not.toThrow();
    });
  });
});
