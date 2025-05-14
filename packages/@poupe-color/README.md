# @poupe/color

[![jsDocs.io](https://img.shields.io/badge/jsDocs.io-reference-blue)](https://www.jsdocs.io/package/@poupe/color)
[![npm version](https://img.shields.io/npm/v/@poupe/color.svg)](https://www.npmjs.com/package/@poupe/color)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../../LICENCE.txt)

HCT/HCL color-space utils

## D3 Color Utilities

The `@poupe/color` package includes a D3 subpackage that provides color conversion and manipulation
capabilities built on top of the powerful [d3-color](https://github.com/d3/d3-color) library.

### Features

- **Versatile color conversion**: Convert between different color formats including CSS strings, ARGB numbers,
  and various color space objects
- **Multiple color spaces**: Work with RGB, HSL, HCL, Lab, HSV, and HCT color spaces
- **Type checking**: Easily verify color object types with helper functions
- **Seamless d3-color integration**: Direct access to d3-color's core functionality with enhanced capabilities

### Color Functions

```typescript
// Convert from any color format
const myColor = color('#ff0000');            // From CSS string
const myColor = color(0xFFFF0000);           // From ARGB number
const myColor = color({ h: 0, c: 100, l: 50 }); // From HCL object
const myColor = color({ h: 0, s: 1, v: 1 });    // From HSV object
const myColor = color({ h: 0, c: 50, t: 60 });  // From HCT object

// Create colors in specific spaces
const myRgb = rgb(255, 0, 0);
const myHsl = hsl(0, 1, 0.5);
const myHcl = hcl(0, 100, 50);
const myLab = lab(50, 80, 67);

// Type checking
if (isRGB(myColor)) {
  // Work with RGB properties
}
```

### Supported Color Spaces

- **RGB**: Red, Green, Blue - standard digital color representation
- **HSL**: Hue, Saturation, Lightness - intuitive color selection
- **HCL**: Hue, Chroma, Luminance - perceptually uniform color space
- **Lab**: CIE L*a*b* - device-independent, perceptually uniform color space
- **HSV**: Hue, Saturation, Value - alternative to HSL (converted to HSL when using `color()`)
- **HCT**: Hue, Chroma, Tone - Material Design 3 color space (converted to HCL when using `color()`)

Use these utilities for building color palettes, theming systems, color conversions, and more complex
color manipulations in your Poupe UI projects.


## Integration with Poupe Ecosystem

- [@poupe/css](../@poupe-css) - CSS-in-JS utilities
- [@poupe/theme-builder](../@poupe-theme-builder) - Design tokens generation
- [@poupe/tailwindcss](../@poupe-tailwindcss) - TailwindCSS integration
- [@poupe/vue](../@poupe-vue) - Vue components library
- [@poupe/nuxt](../@poupe-nuxt) - Nuxt integration

## License

MIT licensed.
