import { Hct, Variant } from '@poupe/material-color-utilities';
import {
  makeDynamicScheme,
  makeStandardColorsFromScheme,
  makeStandardStateVariants,
  makeCustomColors,
  makeCustomStateVariants,
  hexFromHct,
} from '../src';

// Example: Generate state variants for a Material Design 3 theme
const sourceColor = Hct.fromInt(0xFF_67_50_A4); // Material You purple

// Create a dynamic scheme
const scheme = makeDynamicScheme(sourceColor, Variant.VIBRANT, 0, false);

// Generate standard theme colors
const standardColors = makeStandardColorsFromScheme(scheme);

// Generate state variants for standard colors
const standardStateVariants = makeStandardStateVariants(standardColors);

console.log('Standard Theme State Variants:');
console.log('Primary hover:', hexFromHct(standardStateVariants['primary-hover']));
console.log('Primary focus:', hexFromHct(standardStateVariants['primary-focus']));
console.log('Primary pressed:', hexFromHct(standardStateVariants['primary-pressed']));
console.log('Primary disabled:', hexFromHct(standardStateVariants['primary-disabled']));
console.log('On-Primary disabled:', hexFromHct(standardStateVariants['on-primary-disabled']));

// Example with custom colors
const customColors = makeCustomColors(sourceColor, {
  brand: { value: '#00FF00' },
  accent: { value: '#FF0000', harmonize: false },
});

// Generate state variants for custom colors
const customStateVariants = makeCustomStateVariants(customColors.light);

console.log('\nCustom Theme State Variants (Light):');
console.log('Brand hover:', hexFromHct(customStateVariants['brand-hover']));
console.log('Brand focus:', hexFromHct(customStateVariants['brand-focus']));
console.log('Brand pressed:', hexFromHct(customStateVariants['brand-pressed']));
console.log('Brand disabled:', hexFromHct(customStateVariants['brand-disabled']));
console.log('On-Brand disabled:', hexFromHct(customStateVariants['on-brand-disabled']));

// Container variants
console.log('\nContainer State Variants:');
console.log('Brand container hover:', hexFromHct(customStateVariants['brand-container-hover']));
console.log('Brand container disabled:', hexFromHct(customStateVariants['brand-container-disabled']));
console.log('On-Brand container disabled:', hexFromHct(customStateVariants['on-brand-container-disabled']));

/**
 * Material Design 3 State Layer Usage:
 *
 * The state layer colors should be applied as overlays on top of the base colors:
 * - Hover: 8% opacity overlay
 * - Focus: 12% opacity overlay
 * - Pressed: 12% opacity overlay
 * - Dragged: 16% opacity overlay
 * - Disabled container: 12% opacity overlay
 * - Disabled content (on-color): 38% opacity
 *
 * These pre-mixed colors provide the exact values for each state.
 */
