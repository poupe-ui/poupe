# TailwindCSS Plugin Examples

This directory contains examples that demonstrate different usage patterns of
`@poupe/tailwindcss`. The structure is flattened with a unified `index.html`
and different CSS input variations for testing workflows.

## Structure

### `input.css` (Default)
- **Purpose**: Default setup using imported assets
- **Config**: Uses `@import '../src/assets/default.css'` for quick start
- **Usage**: Standard Material Design utilities with default theme

### `input-default-plugin.css`
- **Purpose**: Demonstrates the `@plugin` workflow (direct plugin import in CSS)
- **Config**: Uses `@plugin "../dist/index.mjs"` directly in CSS
- **Usage**: TailwindCSS v4 plugin workflow for component libraries

### `input-flat-plugin.css`
- **Purpose**: Demonstrates the flat plugin (default export via config)
- **Config**: Uses flat plugin via `tailwind-flat-plugin.config.js`
- **Usage**: Material Design utilities with simplified API

### `input-theme-plugin.css`
- **Purpose**: Demonstrates the theme plugin (named export via config)
- **Config**: Uses theme plugin via `tailwind-theme-plugin.config.js`
- **Usage**: Advanced theming capabilities with full Material Design system

## Manual Testing

You can test different workflows manually:

```bash
# Test default workflow (imports assets)
cd examples/
pnpx @tailwindcss/cli -i input.css -o output.css --content index.html

# Test @plugin workflow
pnpx @tailwindcss/cli -i input-default-plugin.css -o output.css --content index.html

# Test flat plugin via config
pnpx @tailwindcss/cli -i input-flat-plugin.css -o output.css --content index.html

# Test theme plugin via config
pnpx @tailwindcss/cli -i input-theme-plugin.css -o output.css --content index.html
```

## Workflow Testing

The flattened structure allows testing different plugin integration methods:

- **Asset Import**: Direct import of CSS assets (fastest startup)
- **Plugin Import**: TailwindCSS v4 @plugin syntax (component library pattern)
- **Config Plugin**: Traditional TailwindCSS v3 plugin via config (full control)

## Testing Integration

These examples are integrated with the test suite in `src/__tests__/cli.test.ts`:

### What Tests Validate
- **Plugin Loading**: Ensures plugins can be imported and configured correctly
- **TailwindCSS Integration**: Validates `@plugin` and `@config` workflows work
- **CSS Generation**: Confirms CSS is generated without syntax errors
- **Scrim Utilities**: Validates scrim-* utilities with opacity modifiers work correctly

### Running Tests

```bash
# From package root - runs all tests including CLI validation
pnpm test

# Tests use temporary files and don't interfere with examples/
```

## File Structure

The flattened examples directory contains:

```
examples/
├── README.md                        # This documentation
├── index.html                       # Unified demo HTML with utility classes
├── input.css                        # Default: imports src/assets/default.css
├── input-default-plugin.css        # @plugin workflow with dist/index.mjs
├── input-flat-plugin.css            # Flat plugin via config
├── input-theme-plugin.css           # Theme plugin via config
├── tailwind-flat-plugin.config.js   # Config for flat plugin
└── tailwind-theme-plugin.config.js  # Config for theme plugin
```

## Dependencies

Examples rely on the parent package's built files:
- **Plugin**: Uses `../dist/index.mjs` for @plugin workflow
- **Config**: Uses `../dist/flat` and `../dist/theme` for config workflows
- **Assets**: Uses `../src/assets/default.css` for direct imports

No local `package.json` or `node_modules` needed - everything uses the parent package.
