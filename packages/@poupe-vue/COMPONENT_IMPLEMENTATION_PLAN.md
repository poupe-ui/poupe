# Component Implementation Plan for @poupe/vue

## Overview

This document outlines the comprehensive implementation plan for Material Design 3 components in @poupe/vue, including improvements to existing components and creation of new components following MD3 specifications.

**Last Updated**: 2025-06-19

## Progress Summary

### ✅ Completed
- Shape system moved to @poupe/tailwindcss
- Ripple effect system implemented via useRipple composable
- Button component fully enhanced with MD3 variants
- PSurface base component created
- usePoupe composable for global defaults
- Interactive surface variants system

## Core Design Systems

### Shape System Evolution

**Material Design 3 Shape Scale**:
- `shape-none` - No rounding (0dp)
- `shape-extra-small` - Subtle rounding (4dp)
- `shape-small` - Small rounding (8dp)
- `shape-medium` - Medium rounding (12dp)
- `shape-large` - Large rounding (16dp)
- `shape-extra-large` - Extra large rounding (28dp)
- `shape-full` - Fully rounded/circular

**Component-Specific Shape Tokens**:
```css
shape-button            // Full rounding
shape-card              // 12px (medium)
shape-fab               // 16px (large)
shape-text-field        // 4px (extra-small)
shape-dialog            // 28px (extra-large)
shape-chip              // 8px (small)
shape-bottom-sheet      // Top corners only
shape-navigation-drawer // Custom shape
```

**CSS Variables**:
```css
--md-shape-none: 0px;
--md-shape-extra-small: 4px;
--md-shape-small: 8px;
--md-shape-medium: 12px;
--md-shape-large: 16px;
--md-shape-extra-large: 28px;
--md-shape-full: 9999px;
```

### Interactive Effects System

#### Ripple Effect ✅
Material Design's signature touch feedback:
- ✅ Created `useRipple` composable
- ✅ Support touch and mouse events
- ✅ Custom ripple colors
- ✅ Bounded and unbounded ripples
- ✅ Integrated with button component
- ✅ Uses ripple-effect utility from @poupe/tailwindcss
- Performance optimized

#### Loading/Skeleton States
Graceful loading states:
- `skeleton-text` - Text placeholders
- `skeleton-avatar` - Avatar placeholders
- `skeleton-button` - Button placeholders
- `skeleton-card` - Card placeholders
- `skeleton-list-item` - List placeholders

Features:
- Shimmer animation
- Theme-aware colors
- ARIA busy states
- Layout preservation

## Existing Components - Enhancements

### 1. PButton
**Enhancements**:
- [ ] Add FAB variant
- [ ] Add extended FAB variant
- [ ] Add icon button variant
- [ ] Add segmented button support
- [ ] Implement ripple effect
- [ ] Add loading state with spinner
- [ ] Add toggle behavior (`aria-pressed`)
- [ ] Use `shape-button` token

### 2. PCard
**Enhancements**:
- [ ] Add elevated, filled, outlined variants
- [ ] Add action area support
- [ ] Add media slots
- [ ] Add expandable behavior
- [ ] Implement ripple for interactive cards
- [ ] Add skeleton loading state
- [ ] Use `shape-card` token

### 3. PInput
**Enhancements**:
- [ ] Add filled and outlined variants
- [ ] Add leading/trailing icons
- [ ] Add prefix/suffix support
- [ ] Add helper and error text
- [ ] Add character counter
- [ ] Add clear button
- [ ] Implement label animation
- [ ] Add textarea variant
- [ ] Use `shape-text-field` token

### 4. PIcon
**Enhancements**:
- [ ] Add size variants (sm, md, lg)
- [ ] Add interactive states
- [ ] Add badge support
- [ ] Add rotation animations
- [ ] Improve Iconify integration

### 5. Story Components
**Enhancements**:
- [ ] Add props table generation
- [ ] Add code snippet display
- [ ] Add theme switcher
- [ ] Add viewport controls
- [ ] Add accessibility audit

## New Components - Implementation Phases

### Phase 1: Core Infrastructure (Critical)

#### 1. usePoupe Composable ✅ (Implemented)
- Used by @poupe/nuxt module to inject app settings
- Provides global component defaults from `app.config.ts`
- Configuration split:
  - `nuxt.config.ts`: Theme colors and generation parameters
  - `app.config.ts`: Component preferences (variants, sizes, etc.)
- Example: `app.config.ts` sets `button: { variant: 'filled' }`
- Components use `inject('poupe')` to access these defaults
- Falls back to component's own defaults if not provided

**Implementation details**:
- Created `src/composables/use-poupe.ts`
- Exports: `createPoupe`, `usePoupe`, `usePoupeDefaults`, `providePoupeOptions`
- Injection key: `poupeInjectionKey`
- Supports defaults for all planned components
- Includes theme and accessibility options
- Created tests in `__tests__/use-poupe.test.ts`

#### 2. PSurface
- Foundation component
- Elevation system (z0-z5)
- Tonal elevation
- Shape variants
- Optional interactive states

#### 3. useRipple Composable
- Reusable ripple effect
- Touch/mouse support
- Custom colors
- Performance optimized

### Phase 2: Selection Controls (High Priority)

#### 4. PCheckbox
- States: checked, unchecked, indeterminate
- Group support
- Ripple effect
- Error states
- `role="checkbox"`

#### 5. PRadioButton & PRadioGroup
- Single selection
- Arrow key navigation
- Ripple effect
- Error states
- `role="radio"` / `role="radiogroup"`

#### 6. PSwitch
- On/off toggle
- Loading state
- Icon support
- Smooth animations
- `role="switch"`

### Phase 3: Lists & Navigation (High Priority)

#### 7. PList & PListItem
- One/two/three line variants
- Leading/trailing content
- Interactive items with ripple
- Divider support
- Selection states

#### 8. PNavigationBar
- Mobile bottom navigation
- 3-5 items
- Badge support
- Active animations
- `role="navigation"`

#### 9. PNavigationRail
- Desktop side navigation
- FAB integration
- Collapsed state
- Badge support
- `role="navigation"`

#### 10. PNavigationDrawer
- Modal/permanent variants
- Sections and items
- Scrim for modal
- Responsive behavior
- `role="navigation"`

#### 11. PAppBar
- Top/bottom variants
- Scroll behaviors
- Action slots
- Search integration
- `role="banner"` or `role="toolbar"`

#### 12. PScaffold
- App layout structure
- Responsive slots
- Navigation integration
- FAB positioning

### Phase 4: Feedback & Progress (Medium Priority)

#### 13. PProgressIndicator
- Linear/circular variants
- Determinate/indeterminate
- Buffer support
- Skeleton integration
- `role="progressbar"`

#### 14. PSnackbar
- Toast notifications
- Action support
- Queue management
- Position variants
- `role="status"` or `role="alert"`

#### 15. PTooltip
- Rich content
- Position variants
- Delay configuration
- Touch support
- `role="tooltip"`

#### 16. PBadge
- Numeric/dot variants
- Position options
- Animation support
- Color variants

### Phase 5: Dialogs & Sheets (Medium Priority)

#### 17. PDialog
- Modal/non-modal
- Alert variant
- Fullscreen option
- Shape: `shape-dialog`
- `role="dialog"`

#### 18. PBottomSheet
- Drag to dismiss
- Peek height
- Fullscreen expansion
- Shape: `shape-bottom-sheet`
- `role="dialog"`

#### 19. PSideSheet
- Leading/trailing
- Responsive width
- Backdrop support
- Push content
- `role="dialog"`

#### 20. PMenu & PMenuItem
- Positioning engine
- Nested menus
- Icon support
- Keyboard navigation
- `role="menu"` / `role="menuitem"`

### Phase 6: Form Components (Medium Priority)

#### 21. PTextField
- Complete MD3 implementation
- All variants
- Validation states
- Mask support
- Shape: `shape-text-field`

#### 22. PSelect
- Dropdown selection
- Multi-select
- Search/filter
- Custom templates
- `role="combobox"`

#### 23. PSlider
- Continuous/discrete
- Range selection
- Custom marks
- Value display
- `role="slider"`

#### 24. PDatePicker
- Calendar view
- Date range
- Internationalization
- Keyboard navigation
- `role="dialog"`

#### 25. PTimePicker
- Clock face/input
- 12/24 hour
- Keyboard input
- Accessibility
- `role="dialog"`

### Phase 7: Content Organization (Low Priority)

#### 26. PTabs
- Scrollable tabs
- Icon support
- Badge integration
- Swipe gestures
- `role="tablist"`

#### 27. PChip
- Input/filter/suggestion/assist
- Removable chips
- Selection states
- Avatar support
- Shape: `shape-chip`

#### 28. PCarousel
- Touch/swipe
- Indicators
- Auto-play
- Transitions
- `role="region"`

#### 29. PDivider
- Horizontal/vertical
- Inset variants
- With text
- Styling variants

### Phase 8: Advanced Components (Low Priority)

#### 30. PFab
- Regular/extended
- Size variants
- Position options
- Shape: `shape-fab`
- Ripple effect

#### 31. PSegmentedButton
- Single/multi-select
- Icon support
- Density variants
- Transitions

## Implementation Guidelines

### Component Development Checklist
- [ ] TypeScript props interface
- [ ] Integrate with usePoupe for defaults:
  ```typescript
  // In component
  const poupe = inject('poupe')
  const props = withDefaults(defineProps<Props>(), {
    variant: poupe?.defaults?.button?.variant || 'text'
  })
  
  // User's app.config.ts
  export default defineAppConfig({
    poupe: {
      button: { variant: 'filled', color: 'primary' },
      card: { elevation: 'z2' }
    }
  })
  ```
- [ ] Interactive states using variants
- [ ] Proper ARIA roles and attributes
- [ ] Keyboard navigation support
- [ ] Touch gestures (where applicable)
- [ ] RTL support
- [ ] Theme integration
- [ ] Shape tokens (not rounded-*)
- [ ] Ripple effect (interactive components)
- [ ] Loading/skeleton states
- [ ] Unit tests with Vitest
- [ ] Story documentation
- [ ] Accessibility testing
- [ ] Performance optimization

### Story Requirements
Each component must have stories showing:
1. Default state
2. All variants
3. Color options
4. Interactive states
5. Loading states
6. Different content types
7. Responsive behavior
8. Accessibility features
9. Edge cases

### Commit Strategy
```bash
# New components
git commit -s -m "feat(vue): add PComponentName with MD3 support

Implement component with:
- Key features list
- MD3 compliance
- Accessibility support
- Comprehensive stories"

# Enhancements
git commit -s -m "feat(vue): enhance PComponentName

Add support for:
- New features list
- Improved accessibility
- Better performance"
```

## Success Criteria
- ✓ All components pass accessibility audits
- ✓ Consistent interactive behavior
- ✓ Complete story coverage
- ✓ 60fps animations
- ✓ Theme integration works
- ✓ TypeScript types are comprehensive
- ✓ Components work standalone
- ✓ MD3 specification compliance

## Implementation Notes
- Start with high-priority, commonly used components
- Mobile-first approach
- Test with screen readers
- Validate keyboard navigation
- One commit per component/feature
- Run `pnpm lint` and `pnpm type-check` before commits