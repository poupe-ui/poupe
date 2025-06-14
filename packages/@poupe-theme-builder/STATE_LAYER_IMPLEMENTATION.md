# Material Design 3 State Layer Implementation Summary

## Overview
Implemented Material Design 3 interactive state color variants for the theme builder package, allowing automatic generation of hover, focus, pressed, dragged, and disabled states for theme colors.

## What Was Implemented

### 1. Core State Layer Utilities (`src/core/states.ts`)
- Created state layer opacity constants following M3 specifications:
  ```typescript
  export const stateLayerOpacities = {
    hover: 0.08,      // 8% opacity
    focus: 0.12,      // 12% opacity
    pressed: 0.12,    // 12% opacity
    dragged: 0.16,    // 16% opacity
    disabled: 0.12,   // 12% opacity for containers
    onDisabled: 0.38, // 38% opacity for content (text/icons)
  } as const;
  ```

- `makeStateLayerColors()` - Mixes base and on-colors at specified opacities
- `makeStateVariants()` - Generic function for creating state variants for any color pairs

### 2. Theme State Variants (`src/theme/states.ts`)
- `makeStandardStateVariants()` - Generates state variants for all standard M3 colors
- `makeCustomStateVariants()` - Generates state variants for custom theme colors
- Supports both base colors and container colors
- Follows M3 naming convention with "on-" prefix for disabled content

### 3. Type System Improvements
- Replaced grotesque union types with template literal types
- Created `StandardInteractiveColorKey` for maintainable type definitions
- Used `Record<string, Hct>` internally to reduce type casting

### 4. Material Design 3 Compliance
Validated implementation against:
- Official M3 documentation (state layers)
- tailwind-material-surfaces implementation
- Confirmed opacity values match M3 specifications

## Key Features

1. **Automatic State Generation**
   - For each color/on-color pair, generates 6 state variants:
     - `{color}-hover` (8% opacity)
     - `{color}-focus` (12% opacity)
     - `{color}-pressed` (12% opacity)
     - `{color}-dragged` (16% opacity)
     - `{color}-disabled` (12% opacity)
     - `on-{color}-disabled` (38% opacity)

2. **Container Support**
   - Handles both base colors and container colors
   - Example: `primary-container-hover`, `on-primary-container-disabled`

3. **Type Safety**
   - Full TypeScript support with proper types
   - Template literal types for automatic variant generation

4. **M3 Naming Convention**
   - Uses "on-" prefix for disabled content colors
   - Follows Material Design 3 color system principles

## File Structure

```
@poupe-theme-builder/
├── src/
│   ├── core/
│   │   ├── states.ts           # Core state layer utilities
│   │   └── __tests__/
│   │       └── states.test.ts  # Core state tests
│   └── theme/
│       ├── states.ts           # Theme-specific state variants
│       └── __tests__/
│           └── states.test.ts  # Theme state tests
```

## Usage Example

```typescript
import { Hct, Variant } from '@poupe/material-color-utilities';
import { 
  makeDynamicScheme,
  makeStandardColorsFromScheme,
  makeStandardStateVariants,
} from '@poupe/theme-builder';

// Create theme colors
const sourceColor = Hct.fromInt(0xFF6750A4);
const scheme = makeDynamicScheme(sourceColor, Variant.VIBRANT, 0, false);
const colors = makeStandardColorsFromScheme(scheme);

// Generate state variants
const stateVariants = makeStandardStateVariants(colors);

// Use the variants
console.log(stateVariants['primary-hover']);     // Primary at 8% opacity
console.log(stateVariants['on-primary-disabled']); // On-primary at 38% opacity
```

## Testing
- Comprehensive test coverage for all functionality
- Tests for opacity values, color mixing, and variant generation
- All tests passing

## Exports
The following are now exported from the package:
- `stateLayerOpacities` - M3 opacity constants
- `makeStateLayerColors` - Core color mixing function
- `makeStateVariants` - Generic state variant generator
- `makeStandardStateVariants` - Standard M3 color variants
- `makeCustomStateVariants` - Custom color variants

## Future Considerations
1. The `dragged` state (16% opacity) might be specific to drag-and-drop interactions
2. Consider adding ripple effect support (separate from state layers)
3. Could add utilities for CSS variable generation

## References
- Material Design 3 State Layers: https://m3.material.io/foundations/interaction/states/state-layers
- tailwind-material-surfaces: https://github.com/JavierM42/tailwind-material-surfaces
- Material Design 3 Color System: https://m3.material.io/styles/color/overview