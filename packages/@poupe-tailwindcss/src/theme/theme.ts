/* imports */
import {
  type CSSRuleObject,
  getDeepRule,
  setDeepRule,
  unsafeKeys,
} from '@poupe/css';

import {
  type ColorMap,
  type ThemeColors as ThemeBuilderColors,
  assembleCSSColors,
  getStateColorMixParams,
  Hct,
  makeTheme as makeThemeColors,
  makeThemeKeys,
  rgba,
} from '@poupe/theme-builder';

import {
  flattenColorOptions,
} from './options';

import {
  type Shades,
  getShades,
  makeShades,
} from './shades';

import {
  type Theme,
  type ThemeColorConfig,
  type ThemeOptions,
  defaultThemePrefix,
} from './types';

import {
  debugLog,
  hexString,
  hslString,
} from './utils';

import {
  type DarkModeStrategy,
  getDarkMode,
} from './variants';

/* re-exports */
export {
  makeThemeComponents,
} from './components';

import { makeShapeConstants as makeSemanticShapeConstants } from './shape-semantic';

export {
  type Theme,
} from './types';

/**
 * Creates a theme configuration based on the provided theme options.
 *
 * @param options - Theme configuration options
 * @returns A fully configured theme object with color palettes for dark and light modes
 *
 * @remarks
 * This function supports two theme generation modes:
 * - When `omitTheme` is true, it generates a theme with minimal configuration
 * - When `omitTheme` is false (default), it generates a full theme with dark and light color palettes
 */
export function makeTheme<K extends string>(options: ThemeOptions<K>) {
  debugLog(options.debug, 'makeTheme', options);

  const $colors = options.colors as ThemeBuilderColors<K>;
  const { omitTheme = false } = options;

  if (omitTheme) {
    const { keys, paletteKeys } = makeThemeKeys($colors);

    return newTheme<K, typeof paletteKeys[number], typeof keys[number]>(options, paletteKeys, keys);
  }

  const {
    dark,
    light,
    darkKeyColors,
  } = makeThemeColors($colors, options.scheme, options.contrastLevel);

  const keys = unsafeKeys(dark);
  const keyColors = unsafeKeys(darkKeyColors);

  return newTheme<K, typeof keyColors[number], typeof keys[number]>(options, keyColors, keys, dark, light);
}

function newTheme<
  K0 extends string,
  K1 extends string,
  K2 extends string,
>(
  options: ThemeOptions<K0>,
  paletteKeys: K1[],
  keys: K2[],
  dark?: Record<K2, Hct>,
  light?: Record<K2, Hct>,
): Theme {
  const darkColors: ColorMap<string> | undefined = dark ? {} as ColorMap<string> : undefined;
  const lightColors: ColorMap<string> | undefined = light ? {} as ColorMap<string> : undefined;
  const colors: Record<K2, ThemeColorConfig> = {} as Record<K2, ThemeColorConfig>;

  const { themePrefix = defaultThemePrefix } = options;
  const defaultShades = options.shades;

  // iterate over palette colors that might have custom shades
  for (const k0 of unsafeKeys(options.colors)) {
    const color = flattenColorOptions(options.colors[k0]);
    const { shades } = getShades(color?.shades, defaultShades);

    setColor(k0 as K2, themePrefix, shades, colors, darkColors, lightColors, dark, light);
  }

  // rest of the palette keys take the default shades
  for (const key of paletteKeys as unknown[] as K2[]) {
    if (key in colors) continue;

    setColor(key, themePrefix, defaultShades, colors, darkColors, lightColors, dark, light);
  }

  // and the rest have no shades
  for (const key of keys) {
    if (key in colors) continue;

    setColor(key, themePrefix, false, colors, darkColors, lightColors, dark, light);
  }

  // Add state colors to theme (they reference --md-* variables)
  const theme = {
    options,
    keys,
    paletteKeys,
    dark: darkColors,
    light: lightColors,
    colors,
  };
  addStateColors(colors, theme);

  return theme;
}

function setColor<K extends string>(
  key: K,
  prefix: string,
  shades: Shades,
  colors: Record<K, ThemeColorConfig>,
  darkColors: ColorMap<string> | undefined,
  lightColors: ColorMap<string> | undefined,
  dark: Record<K, Hct> | undefined,
  light: Record<K, Hct> | undefined,
) {
  if (dark && darkColors) {
    for (const [k, v] of newThemeColorHct(key, dark[key], shades)) {
      darkColors[k] = v;
    }
  }

  if (light && lightColors) {
    for (const [k, v] of newThemeColorHct(key, light[key], shades)) {
      lightColors[k] = v;
    }
  }

  colors[key] = newThemeColorConfig(key, shades, prefix);
}

function newThemeColorHct(key: string, value: Hct, shades: Shades): [string, Hct][] {
  const out: [string, Hct][] = [
    [key, value],
  ];

  if (shades) {
    const shadesMap = makeShades(value, shades);
    for (const shade of shades) {
      out.push([`${key}-${shade}`, shadesMap[shade]]);
    }
  }

  return out;
}

function newThemeColorConfig(key: string, shades: Shades, prefix: string): ThemeColorConfig {
  const base = `--${prefix}${key}`;

  if (!shades) {
    return {
      value: base,
    };
  }

  return {
    value: base,
    shades: Object.fromEntries(shades.map(shade => [shade, `${base}-${shade}`])),
  };
}

/**
 * Finds the last style object in the array that contains a specific selector.
 * @param styles - Array of CSS rule objects to search
 * @param selector - Selector to find (string or array)
 * @returns The last matching style object, or undefined if none found
 */
function findLastStyleWithSelector(
  styles: CSSRuleObject[],
  selector: string | string[],
): CSSRuleObject | undefined {
  let lastMatch: CSSRuleObject | undefined;

  for (const style of styles) {
    if (getDeepRule(style, selector) !== undefined) {
      lastMatch = style;
    }
  }

  return lastMatch;
}

/**
 * Injects shadow RGB variables into existing CSS styles from assembleCSSColors().
 * Finds the appropriate style objects and extends them with shadow RGB definitions.
 * @param theme - Theme configuration with dark/light color maps
 * @param styles - Array of CSS rule objects to extend
 * @param darkSelector - Dark mode selector array
 */
function injectShadowRGBIntoStyles(
  theme: Readonly<Theme>,
  styles: CSSRuleObject[],
  darkSelector: string[],
): void {
  const { themePrefix } = theme.options;
  const shadowRGBVariable = `--${themePrefix}shadow-rgb`;
  const shadowColorKey = 'shadow';

  // Check if shadow colors exist in both dark and light themes
  const darkShadow = theme.dark?.[shadowColorKey];
  const lightShadow = theme.light?.[shadowColorKey];

  if (!darkShadow || !lightShadow) {
    return;
  }

  // Generate direct RGB values from Hct colors (rgba returns 0-255 integers)
  const lightRGBA = rgba(lightShadow);
  const darkRGBA = rgba(darkShadow);

  const lightRGB = `${lightRGBA.r} ${lightRGBA.g} ${lightRGBA.b}`;
  const darkRGB = `${darkRGBA.r} ${darkRGBA.g} ${darkRGBA.b}`;

  // Find and inject light mode shadow RGB into :root
  const rootStyle = findLastStyleWithSelector(styles, ':root');
  if (rootStyle) {
    setDeepRule(rootStyle, ':root', { [shadowRGBVariable]: lightRGB });
  }

  // Only inject dark mode shadow RGB if it differs from light mode
  if (lightRGB !== darkRGB) {
    const darkStyle = findLastStyleWithSelector(styles, darkSelector);
    if (darkStyle) {
      setDeepRule(darkStyle, darkSelector, { [shadowRGBVariable]: darkRGB });
    }
  }
}

/**
 * Injects scrim RGB variables into existing CSS styles from assembleCSSColors().
 * Finds the appropriate style objects and extends them with scrim RGB definitions.
 * @param theme - Theme configuration with dark/light color maps
 * @param styles - Array of CSS rule objects to extend
 * @param darkSelector - Dark mode selector array
 */
function injectScrimRGBIntoStyles(
  theme: Readonly<Theme>,
  styles: CSSRuleObject[],
  darkSelector: string[],
): void {
  const { themePrefix } = theme.options;
  const scrimRGBVariable = `--${themePrefix}scrim-rgb`;
  const scrimColorKey = 'scrim';

  // Check if scrim colors exist in both dark and light themes
  const darkScrim = theme.dark?.[scrimColorKey];
  const lightScrim = theme.light?.[scrimColorKey];

  if (!darkScrim || !lightScrim) {
    return;
  }

  // Generate direct RGB values from Hct colors (rgba returns 0-255 integers)
  const lightRGBA = rgba(lightScrim);
  const darkRGBA = rgba(darkScrim);

  const lightRGB = `${lightRGBA.r} ${lightRGBA.g} ${lightRGBA.b}`;
  const darkRGB = `${darkRGBA.r} ${darkRGBA.g} ${darkRGBA.b}`;

  // Find and inject light mode scrim RGB into :root
  const rootStyle = findLastStyleWithSelector(styles, ':root');
  if (rootStyle) {
    setDeepRule(rootStyle, ':root', { [scrimRGBVariable]: lightRGB });
  }

  // Only inject dark mode scrim RGB if it differs from light mode
  if (lightRGB !== darkRGB) {
    const darkStyle = findLastStyleWithSelector(styles, darkSelector);
    if (darkStyle) {
      setDeepRule(darkStyle, darkSelector, { [scrimRGBVariable]: darkRGB });
    }
  }
}

/**
 * Gets all interactive colors that need state variants.
 *
 * @param theme - The theme configuration
 * @returns Array of color names that should have state variants
 */
export function getInteractiveColors(theme: Readonly<Theme>): string[] {
  const interactiveColors: string[] = [
    'primary', 'secondary', 'tertiary', 'error',
    'surface', 'surface-dim', 'surface-bright', 'surface-variant',
    'surface-container', 'surface-container-lowest',
    'surface-container-low', 'surface-container-high',
    'surface-container-highest',
    'primary-container', 'secondary-container',
    'tertiary-container', 'error-container',
    'primary-fixed', 'secondary-fixed', 'tertiary-fixed',
    'primary-fixed-dim', 'secondary-fixed-dim', 'tertiary-fixed-dim',
    'inverse-surface',
  ];

  // Add custom palette colors from theme
  for (const key of theme.paletteKeys) {
    if (!interactiveColors.includes(key)) {
      interactiveColors.push(key, `${key}-container`);
    }
  }

  return interactiveColors;
}

/**
 * State suffixes used for interactive colors.
 */
export const stateSuffixes = ['hover', 'focus', 'pressed', 'dragged', 'disabled'] as const;

/**
 * Adds state color entries to the theme colors that reference --md-* variables.
 * This ensures TailwindCSS recognizes utilities like bg-surface-hover.
 *
 * @param colors - The theme colors object to add state colors to
 * @param theme - The theme configuration
 */
function addStateColors<K extends string>(
  colors: Record<K, ThemeColorConfig>,
  theme: Readonly<Theme>,
): void {
  const { themePrefix } = theme.options;
  const interactiveColors = getInteractiveColors(theme);

  // Add state colors for each interactive color that exists in the theme
  for (const baseColor of interactiveColors) {
    if (theme.keys.includes(baseColor as K)) {
      for (const state of stateSuffixes) {
        const stateKey = `${baseColor}-${state}` as K;
        if (!colors[stateKey]) {
          colors[stateKey] = {
            value: `--${themePrefix}${stateKey}`,
          };
        }
      }
    }
  }
}

/**
 * Generates CSS variables for state colors using CSS color-mix() function.
 * Creates variables for hover, focus, pressed, dragged, and disabled states.
 *
 * @param theme - The theme configuration
 * @returns A CSS rule object containing state color variables
 */
function generateStateColorVariables(
  theme: Readonly<Theme>,
): CSSRuleObject {
  const { themePrefix } = theme.options;
  const rules: CSSRuleObject = {};
  const interactiveColors = getInteractiveColors(theme);

  const createStateVariable = (
    colorName: string,
    state: typeof stateSuffixes[number],
  ) => {
    const params = getStateColorMixParams(colorName, state, `--${themePrefix}`);
    const variableName = `--${themePrefix}${colorName}-${state}`;
    const colorMixValue = `color-mix(in srgb, var(${params.baseColor}) ${params.opacityPercent}%, var(${params.onColor}))`;
    rules[variableName] = `var(${variableName}, ${colorMixValue})`;
  };

  // Generate color-mix variables for each interactive color and state
  for (const colorName of interactiveColors) {
    // Standard states
    for (const state of stateSuffixes) createStateVariable(colorName, state);
  }

  return rules;
}

/**
 * Generates CSS base styles for a theme with dark and light modes.
 * Includes CSS custom properties for all theme colors and the shadow RGB variable.
 *
 * @param theme - The theme configuration containing dark and light color modes
 * @param darkMode - Strategy for applying dark mode (defaults to 'class')
 * @param stringify - Optional function to convert HCT colors to string representation (defaults to HSL string)
 * @returns An array of CSS rule objects for theme base styles
 * @remarks
 * Automatically generates `--{prefix}shadow-rgb` and `--{prefix}scrim-rgb` variables:
 * - When dark/light themes exist: direct RGB values extracted from Hct colors
 * - When dark/light themes don't exist: CSS Level 4 fallback syntax for both variables
 */
export function makeThemeBases(
  theme: Readonly<Theme>,
  darkMode: DarkModeStrategy = 'class',
  stringify?: (hct: Hct) => string,
): CSSRuleObject[] {
  if (theme.options.debug) {
    debugLog(true, 'makeThemeBases', `darkMode:${darkMode}`, {
      ...theme,
      dark: theme.dark ? Object.fromEntries(Object.entries(theme.dark).map(([k, v]) => [k, hexString(v)])) : undefined,
      light: theme.light ? Object.fromEntries(Object.entries(theme.light).map(([k, v]) => [k, hexString(v)])) : undefined,
    });
  }

  const bases: CSSRuleObject[] = [];
  const { themePrefix } = theme.options;

  const constants = makeThemeConstants(theme);

  if (theme.dark && theme.light) {
    const darkSelector = getDarkMode(darkMode);
    if (theme.options.disablePrintMode !== true) {
      darkSelector.unshift('@media not print');
    }

    const { styles } = assembleCSSColors<string>(
      theme.dark,
      theme.light as typeof theme.dark,
      {
        darkMode: darkSelector,
        lightMode: false,
        prefix: theme.options.themePrefix,
        darkSuffix: theme.options.darkSuffix,
        lightSuffix: theme.options.lightSuffix,
        stringify: stringify || hslString,
        addStarVariantsToDark: false,
      },
    );

    // Inject shadow RGB variables into existing styles
    injectShadowRGBIntoStyles(theme, styles, darkSelector);

    // Inject scrim RGB variables into existing styles
    injectScrimRGBIntoStyles(theme, styles, darkSelector);

    // Add state color variables if useColorMix is enabled
    if (theme.options.useColorMix) {
      const stateColors = generateStateColorVariables(theme);
      // Find the :root rule in styles and add state colors
      const rootRule = styles.find(style => ':root' in style);
      if (rootRule) {
        Object.assign(rootRule[':root'], stateColors);
      } else {
        // Create a new :root rule if none exists
        styles.unshift({ ':root': stateColors });
      }
    }

    bases.push(...styles);
  } else {
    // Add fallback for omitted themes
    const shadowVariable = `--${themePrefix}shadow`;
    const shadowRGBVariable = `--${themePrefix}shadow-rgb`;
    constants[shadowRGBVariable] = `var(${shadowRGBVariable}, from var(${shadowVariable}) r g b)`;

    const scrimVariable = `--${themePrefix}scrim`;
    const scrimRGBVariable = `--${themePrefix}scrim-rgb`;
    constants[scrimRGBVariable] = `var(${scrimRGBVariable}, from var(${scrimVariable}) r g b)`;

    // Always add state colors when themes are omitted (as a fallback)
    const stateColors = generateStateColorVariables(theme);
    Object.assign(constants, stateColors);
  }

  bases.push({
    ':root': constants,
  }, {
    // empty line
  }, {
    '@keyframes ripple': {
      '0%': {
        transform: 'translate(-50%, -50%) scale(0)',
        opacity: `var(--${themePrefix}ripple-opacity, 0.12)`,
      },
      '100%': {
        transform: 'translate(-50%, -50%) scale(1)',
        opacity: '0',
      },
    },
  });

  return bases;
}

export function makeThemeConstants(theme: Readonly<Theme>): CSSRuleObject {
  const out: CSSRuleObject = {};
  const { themePrefix } = theme.options;

  const constants: Record<string, number> = {
    ['z-navigation-persistent']: 1000, /* Mobile stepper, bottom navigation */
    ['z-navigation-floating']: 1050, /* FAB, speed dial */
    ['z-navigation-top']: 1100, /* App bar, top navigation */
    ['z-drawer']: 1200, /* Navigation drawer, side sheets */
    ['z-modal']: 1300, /* Modal dialogs */
    ['z-snackbar']: 1400, /* Snackbars, toasts */
    ['z-tooltip']: 1500, /* Tooltips */

    /* Below navigation layer */
    ['z-scrim-base']: 950, /* Basic overlay, below all navigation */
    ['z-scrim-content']: 975, /* Content overlay, above base but below stepper */

    /* Between drawer and modal */
    ['z-scrim-drawer']: 1175, /* Scrim for drawer overlays */
    ['z-scrim-modal']: 1275, /* Scrim for modal preparation */

    /* Above modal layer */
    ['z-scrim-elevated']: 1350, /* High-priority overlays */
    ['z-scrim-system']: 1450, /* System-level scrims, below snackbar */
  };

  for (const [key, value] of Object.entries(constants)) {
    out[`--${themePrefix}${key}`] = `var(--${themePrefix}${key}, ${value})`;
  }

  // Always use semantic shape constants
  const semanticShapeConstants = makeSemanticShapeConstants(themePrefix);
  Object.assign(out, semanticShapeConstants);

  return out;
}
