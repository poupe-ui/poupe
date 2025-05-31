# @poupe/vue

[![API Reference][jsdocs-shield]][jsdocs-link]
[![NPM Version][npm-shield]][npm-link]
[![License][license-shield]][license-link]

Vue component library for Poupe UI framework with theme customization
and accessibility support.

## Features

- 🧩 Feature-rich Vue 3 component library
- 🎨 Built-in theme customization
- ♿ Strong focus on accessibility
- 🌓 Dark/light mode theming
- 🔧 Fully typed with TypeScript
- 📱 Responsive design out of the box

## Installation

```bash
npm install @poupe/vue @poupe/theme-builder
# or
yarn add @poupe/vue @poupe/theme-builder
# or
pnpm add @poupe/vue @poupe/theme-builder
```

For TailwindCSS integration:

```bash
npm install @poupe/tailwindcss
```

## Basic Setup

```typescript
import { createApp } from 'vue'
import { createPoupe } from '@poupe/vue'
import App from './App.vue'

// Create Vue app
const app = createApp(App)

// Setup Poupe with theme
app.use(createPoupe({
    theme: {
      colors: {
        primary: '#1976d2',
        secondary: '#9c27b0',
        // Add more colors as needed
      }
    },
    // Optional: component-specific options
    components: {
      // Button specific options
      button: {
        defaultVariant: 'filled'
      }
    }
}))

app.mount('#app')
```

## Using Components

```vue
<template>
    <div>
      <PButton variant="filled" color="primary">Click Me</PButton>

      <PCard>
        <template #header>Card Header</template>
        Card content goes here
        <template #footer>Card Footer</template>
      </PCard>

      <PInput v-model="inputValue" label="Username" />
    </div>
</template>

<script setup>
import { ref } from 'vue'

const inputValue = ref('')
</script>
```

## Components

### Available Components

The Vue component library provides Material Design 3 components with full
accessibility support and semantic HTML foundations.

#### Navigation & Layout

- **PScaffold** - Main app structure with header, content, and navigation
- **PAppBar** - Top/bottom navigation bars (`role="banner"` or `"toolbar"`)
- **PNavigationBar** - Bottom navigation for mobile (`role="navigation"`)
- **PNavigationDrawer** - Side navigation panel (`role="navigation"`)
- **PNavigationRail** - Desktop side navigation (`role="navigation"`)
- **PSurface** - Base container with elevation and color theming

#### Content Containers

- **PCard** - Flexible content container (`role="group"` or `"article"`)
- **PBottomSheet** - Slide-up content panel (`role="dialog"`)
- **PSideSheet** - Slide-in content panel (`role="dialog"`)
- **PDialog** - Modal dialog (`role="dialog"` or `"alertdialog"`)
- **PTabs** - Tabbed content organization (`role="tablist"`)
- **PCarousel** - Scrollable item collection (`role="region"`)

#### Interactive Controls

- **PButton** - Action buttons with multiple variants (`role="button"`)
- **PCheckbox** - Selection control (`role="checkbox"`)
- **PRadioButton** - Single choice from group (`role="radio"`)
- **PSwitch** - Toggle control (`role="switch"`)
- **PSlider** - Range input (`role="slider"`)
- **PTextField** - Text input (`role="textbox"`)
- **PChip** - Compact interactive elements (various roles)

#### Display & Feedback

- **PProgressIndicator** - Progress display (`role="progressbar"`)
- **PSnackbar** - Brief message display (`role="status"` or `"alert"`)
- **PTooltip** - Contextual help (`role="tooltip"`)
- **PBadge** - Status indicators
- **PMenu** - Action lists (`role="menu"`)
- **PDivider** - Content separator

#### Material Design 3 Principles

All components follow M3 design tokens with:

- **Tonal Elevation** - Dynamic color based on elevation
- **Dynamic Color** - Adapts to user's wallpaper
- **Accessibility First** - Semantic HTML with ARIA support
- **Theme Integration** - Consistent color and typography system

### Accessibility Guidelines

Components prioritize semantic HTML and use ARIA attributes only when
necessary. Key principles:

1. **Semantic HTML First** - Use native elements when possible
2. **Meaningful Labels** - Provide accessible names via text or
     `aria-label`
3. **Keyboard Navigation** - Full keyboard support for all interactions
4. **Screen Reader Support** - Proper ARIA roles and live regions

### Raw

### Container vs Surface

In Material Design 3 (M3), the distinction between "surfaces" and
"containers" isn't always a strict, mutually exclusive categorization
for every component. Instead, many components act as **containers** by
holding other content and components, and they all exist on **surfaces**
which define their visual background, elevation, and tonal
characteristics.

Here's a breakdown of common Material Design 3 components, indicating if
they primarily function as a surface (often serving as a background or
base layer) or a container (designed to hold other elements):

**Components that are primarily Surfaces (often serving as backgrounds or
base layers, and can *contain* other elements):**

* **Surface:** This is the foundational element in Material Design. It
    defines the background color, elevation, and tonal characteristics for
    a region of the UI. All other components essentially rest on or within
    a Surface. While it can "contain" elements, its primary role is to
    establish the visual ground.
* **Scaffold:** While not a "surface" in the same visual sense as a
    `Surface` composable, the Scaffold provides the basic visual structure
    for a screen, including areas for top app bar, bottom navigation bar,
    FAB, and content. It acts as the primary container for the entire
    screen's layout, where other components are placed.

**Components that are primarily Containers (designed to hold and group other
elements):**

* **App Bar (Top and Bottom):** These are containers for navigation,
    actions, and titles at the top or bottom of a screen.
* **Bottom Sheet:** A transient container that slides up from the bottom
    of the screen to reveal supplementary content.
* **Card:** A flexible container for related pieces of content, often
    with a distinct background and elevation, grouping information and
    actions.
* **Carousel:** A container that displays a collection of items, allowing
    users to scroll through them.
* **Dialog:** A modal container that prompts the user for information or
    a decision, typically displayed on top of other content.
* **Navigation Bar:** A persistent container at the bottom of the screen
    for primary navigation destinations on mobile.
* **Navigation Drawer:** A container that slides in from the leading edge
    of the screen for navigation on larger devices.
* **Navigation Rail:** A persistent container on the leading edge of
    tablet and desktop screens for navigation.
* **Side Sheet:** Similar to a bottom sheet, but slides in from the side
    (leading or trailing edge).
* **Tabs:** Layered containers that organize content across different
    screens or views.
* **Tooltip:** A brief, temporary container that displays a label or
    message when a user interacts with an element.

**Components that can be both, or interact closely with surfaces/containers:**

Many interactive components implicitly involve a "surface" for their
visual representation, and some can act as containers for text or icons.

* **Buttons (FAB, Extended FAB, Icon Button, Segmented Button, Text
    Button, Elevated Button, Filled Button, Outlined Button, Tonal
    Button):** While individual buttons are interactive elements, their
    visual appearance (color, elevation, shape) is defined by how they sit
    on or within a surface. Some (like Extended FAB) can contain both text
    and an icon.
* **Chips (Assist, Filter, Input, Suggestion):** Small, interactive
    elements. They visually sit on a surface and contain text and/or icons.
* **Date Pickers / Time Pickers:** These typically open within a dialog
    or a temporary surface to allow selection.
* **Divider:** A thin line used to visually group content within lists or
    other containers.
* **Lists / List Items:** Lists are continuous containers of text and
    images. Individual list items visually define their own background and
    can contain other elements.
* **Menus:** A temporary surface that displays a list of choices.
* **Progress Indicators (Linear, Circular):** Visually displayed on a
    surface, indicating a process.
* **Selection Controls (Checkbox, Radio Button, Switch, Slider):** These
    interactive elements are displayed on a surface and represent a
    selection state.
* **Snackbar:** A brief message container displayed at the bottom of the
    screen.
* **Text Fields:** An input field that typically has a container (like an
    outline or fill) to hold the text input.

**Key principles to remember in Material Design 3:**

* **Emphasis on Tonal Elevation:** M3 uses tonal elevation in addition
    to shadows to differentiate surfaces and containers. Higher elevation
    can result in a darker color in light themes and a lighter color in
    dark themes, providing a more harmonious visual hierarchy.
* **Dynamic Color:** Components adapt to the user's chosen wallpaper,
    allowing for personalized experiences.
* **Expressive Design:** M3 encourages more fluid animations, larger
    buttons, and bold use of shape and color to create delightful user
    experiences.

The core idea is that every visual element in Material Design resides on a
"material surface," which has properties like color, elevation, and
shape. Components are then built upon or within these surfaces, with many
serving as dedicated containers for other content and interactions.

### ARIA roles

You're asking a crucial question for accessibility! While Material
Design 3 provides visual guidelines and components, the actual ARIA
(Accessible Rich Internet Applications) roles are implemented at the code
level (HTML, Compose, Flutter, etc.). The goal is to use semantic HTML
elements whenever possible, as they have built-in accessibility. When a
custom component is created or a native HTML element doesn't convey the
correct semantics, ARIA roles are used to provide that information to
assistive technologies like screen readers.

**General Principles for ARIA Roles in Material Design:**

* **Use semantic HTML first:** This is the golden rule. If an HTML
    element (like `<button>`, `<input type="checkbox">`, `<nav>`,
    `<main>`) already has the correct semantic meaning and behavior, use
    it. It often comes with built-in accessibility.
* **ARIA for custom or complex components:** When a component is built
    from non-semantic elements (e.g., a `<div>` acting as a button), or
    when a component's behavior is more complex than a native HTML
    element, ARIA roles, states, and properties are essential.
* **Don't over-ARIA:** Avoid adding ARIA roles to elements that already
    have the same implicit semantic role. For example, a `<button>`
    element already has `role="button"` implicitly. Adding it explicitly
    is redundant.
* **Provide accessible names:** Most interactive elements need an
    accessible name (what a screen reader announces). This can come from
    visible text, `aria-label`, or `aria-labelledby`.

---

**Material Design 3 Components and their common ARIA Roles:**

**Interactive Components (often "Widgets" in ARIA terms):**

* **Buttons (FAB, Extended FAB, Icon Button, Segmented Button, Text
    Button, Elevated Button, Filled Button, Outlined Button, Tonal
    Button):**
      * **ARIA Role:** `role="button"` (if not using a native `<button>`
        element)
      * **ARIA States/Properties:**
          * `aria-pressed` (for toggle buttons)
          * `aria-expanded` (if it controls an expandable section, like
            a menu)
          * `aria-label` or `aria-labelledby` (if the button's purpose
            isn't clear from its visible text/icon)
* **Checkbox:**
      * **ARIA Role:** `role="checkbox"` (if not using a native
        `<input type="checkbox">`)
      * **ARIA States/Properties:** `aria-checked` (`true`, `false`, `mixed`)
* **Radio Button:**
      * **ARIA Role:** `role="radio"` (if not using a native
        `<input type="radio">`)
      * **Container Role:** `role="radiogroup"` for the group of radio
        buttons.
      * **ARIA States/Properties:** `aria-checked` (`true`, `false`)
* **Switch:**
      * **ARIA Role:** `role="switch"` (or `role="checkbox"` with
        `aria-checked` for a simpler implementation if `switch` isn't
        fully supported)
      * **ARIA States/Properties:** `aria-checked` (`true`, `false`)
* **Slider:**
      * **ARIA Role:** `role="slider"` (if not using a native
        `<input type="range">`)
      * **ARIA States/Properties:** `aria-valuenow`, `aria-valuemin`,
        `aria-valuemax`, `aria-valuetext`
* **Text Field:**
      * **ARIA Role:** `role="textbox"` (if not using a native
        `<input type="text">`, `<textarea>`)
      * **ARIA States/Properties:** `aria-label` or `aria-labelledby`
        (linking to its visible label), `aria-required`, `aria-invalid`,
        `aria-errormessage`, `aria-describedby` (for hints or
        instructions)
* **Chips (Assist, Filter, Input, Suggestion):**
      * **Assist/Suggestion Chip:** Often `role="button"` or `role="link"`
        if they navigate.
      * **Filter Chip:** `role="checkbox"` or `role="radio"` if they
        represent a selection.
      * **Input Chip:** Often `role="button"` with `aria-describedby` to
        indicate its content.
      * **ARIA States/Properties:** `aria-selected` (for filter/selection
        chips), `aria-disabled`
* **Date Pickers / Time Pickers:** These are complex widgets.
      * **Dialog/Modal Role:** The picker itself often appears in a
        `role="dialog"` or `role="alertdialog"`.
      * **Grid/Table Role:** The date grid might use `role="grid"` with
        nested `role="row"` and `role="gridcell"` for days.
      * **Button Roles:** Individual day/time selections will be
        `role="button"`.
      * **Labeling:** `aria-label` for month/year navigation buttons,
        `aria-labelledby` for the picker dialog.
* **Menus (and Menu Items):**
      * **Container Role:** `role="menu"` for the menu itself.
      * **Item Role:** `role="menuitem"` for individual menu options.
      * **Sub-menu items:** `role="menuitemcheckbox"` or
        `role="menuitemradio"` if they are selection-based.
      * **ARIA States/Properties:** `aria-haspopup="menu"` on the element
        that opens the menu, `aria-expanded` when the menu is open,
        `aria-checked` (for checkbox/radio menu items).

**Containment/Structure Components (often "Document Structure" or "Landmark"
roles):**

* **Surface:** Generally does not need a specific ARIA role unless it
    represents a significant, distinct region. If it's just a background
    for other content, its role is implicit.
* **Scaffold:** As the overall page structure, it primarily contains
    landmarks. The content area within the scaffold might be marked with
    `role="main"`.
* **App Bar (Top and Bottom):**
      * **Top App Bar:** Often `role="banner"` (if it's the primary header
        for the whole page) or `role="toolbar"` (if it primarily contains
        actions).
      * **Bottom App Bar:** Often `role="toolbar"` or `role="navigation"`.
      * **ARIA States/Properties:** `aria-label` to provide a meaningful
        name if its purpose isn't obvious.
* **Bottom Sheet:**
      * **ARIA Role:** `role="dialog"` or `role="alertdialog"` (if it
        requires user action before proceeding).
      * **ARIA States/Properties:** `aria-modal="true"`, `aria-label` or
        `aria-labelledby`.
* **Card:**
      * **ARIA Role:** Often `role="group"` if it simply groups related
        content, or `role="article"` if it represents a self-contained
        piece of content. Sometimes no explicit role is needed if it's
        purely for visual grouping.
      * **ARIA States/Properties:** `aria-label` or `aria-labelledby` if
        the card itself needs a programmatic label.
* **Carousel:**
      * **ARIA Role:** `role="region"` or no explicit role if the items
        within are sufficiently marked up. Can be complex, often requiring
        `aria-live` regions if content changes automatically, or
        `role="group"` for each slide.
      * **ARIA States/Properties:** `aria-roledescription` (e.g.,
        "carousel"), `aria-current` (for the active slide).
* **Dialog:**
      * **ARIA Role:** `role="dialog"` or `role="alertdialog"`.
      * **ARIA States/Properties:** `aria-modal="true"` (for modal
        dialogs), `aria-label` or `aria-labelledby` (essential for
        providing context).
* **Navigation Bar:**
      * **ARIA Role:** `role="navigation"`.
      * **ARIA States/Properties:** `aria-label` (e.g., "Primary
        navigation").
* **Navigation Drawer/Rail:**
      * **ARIA Role:** `role="navigation"`.
      * **ARIA States/Properties:** `aria-label` (e.g., "Main
        navigation"), `aria-expanded` (if it can be opened/closed),
        `aria-hidden` (when closed).
* **Side Sheet:** Similar to Bottom Sheet.
      * **ARIA Role:** `role="dialog"`.
      * **ARIA States/Properties:** `aria-modal="true"`, `aria-label` or
        `aria-labelledby`.
* **Tabs:**
      * **Container Role:** `role="tablist"` for the container of tabs.
      * **Tab Item Role:** `role="tab"` for each individual tab button.
      * **Panel Role:** `role="tabpanel"` for the content associated with
        each tab.
      * **ARIA States/Properties:** `aria-selected` on the active tab,
        `aria-controls` (linking a tab to its panel), `aria-labelledby`
        (linking a panel to its tab).
* **Tooltip:**
      * **ARIA Role:** `role="tooltip"`.
      * **ARIA States/Properties:** `id` on the tooltip element, and
        `aria-describedby` on the element it describes, pointing to that
        `id`.

**Informational/Status Components (often "Live Regions"):**

* **Badge:** Often presented as visual cues and may not need a specific
    ARIA role if the information is also conveyed in an accessible way
    (e.g., as part of the accessible name of the element it's attached
    to). If it represents a dynamic count, it might be part of an
    `aria-live` region.
* **Progress Indicators:**
      * **ARIA Role:** `role="progressbar"`.
      * **ARIA States/Properties:** `aria-valuenow`, `aria-valuemin`,
        `aria-valuemax` (for determinate progress), `aria-valuetext` (for
        more descriptive text).
* **Snackbar:**
      * **ARIA Role:** `role="status"` (for polite, non-interrupting
        messages) or `role="alert"` (for urgent, interrupting messages).
      * **ARIA States/Properties:** `aria-live="polite"` or
        `aria-live="assertive"`.

**Important Note for Developers:**

When implementing Material Design components, whether using
platform-specific libraries (Android Compose, Flutter, Material
Components for Web) or building custom components, it's crucial to refer
to the official documentation for accessibility. These libraries usually
handle many of the ARIA mappings automatically. However, understanding
the underlying ARIA roles helps in:

* **Customization:** Ensuring accessibility is maintained when modifying
    standard components.
* **Debugging:** Identifying why a component might not be accessible to
    screen reader users.
* **Semantic HTML:** Prioritizing the use of native HTML elements where
    appropriate to leverage their built-in accessibility.

The WAI-ARIA Authoring Practices Guide (APG) from the W3C is the
definitive resource for understanding and implementing ARIA roles, states,
and properties correctly for various UI patterns.

## Available Exports

- **Main export**: Core components and configuration
- **config**: Theme configuration utilities
- **resolver**: Component resolving for build tools
- **theme-scheme**: Theme visualization component

### Theme Scheme Component

The `ThemeScheme` component is exported separately as it's a
specialized utility component for visualizing and debugging theme colors:

```typescript
// Import from the separate export
import { ThemeScheme } from '@poupe/vue/theme-scheme'
```

This component displays all theme color schemes and is useful for:
- Visualizing your theme's color palette
- Debugging theme configurations
- Showcasing theme variations to stakeholders

## TailwindCSS Integration

For optimal experience, integrate with TailwindCSS:

```js
// tailwind.config.js
import { poupePlugin } from '@poupe/tailwindcss'

export default {
    // ...
    plugins: [
      poupePlugin()
    ]
}
```

## Related Packages

- [@poupe/css](../@poupe-css) - CSS-in-JS utilities
- [@poupe/theme-builder](../@poupe-theme-builder) - Theme token generation
- [@poupe/tailwindcss](../@poupe-tailwindcss) - TailwindCSS integration
- [@poupe/nuxt](../@poupe-nuxt) - Nuxt integration

## Requirements

- Vue ^3.5.13
- Node.js >=20.19.1
- @poupe/theme-builder ^0.7.0
- @poupe/tailwindcss ^0.2.6

## License

MIT licensed.

[jsdocs-shield]: https://img.shields.io/badge/jsDocs.io-reference-blue
[jsdocs-link]: https://www.jsdocs.io/package/@poupe/vue
[npm-shield]: https://img.shields.io/npm/v/@poupe/vue.svg
[npm-link]: https://www.npmjs.com/package/@poupe/vue
[license-shield]: https://img.shields.io/badge/License-MIT-blue.svg
[license-link]: ../../LICENCE.txt
