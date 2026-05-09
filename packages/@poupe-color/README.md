# @poupe/color

[![jsDocs.io][jsdocs-badge]][jsdocs-url]
[![npm version][npm-badge]][npm-url]
[![License: MIT][license-badge]][license-url]

Colour seeding and scheme preset utilities for the Poupe UI framework.

## Status

Scaffold stage. The package currently exposes only a `VERSION`
constant; the preset and scheme API will land in subsequent releases.

## Installation

```bash
npm install @poupe/color
```

```bash
yarn add @poupe/color
```

```bash
pnpm add @poupe/color
```

## API

### `VERSION`

The package version, sourced from `package.json` at build time.

```typescript
import { VERSION } from '@poupe/color';

console.log(VERSION); // e.g. '0.0.0'
```

## Integration with Poupe Ecosystem

- [@poupe/material-color-utilities][mcu] — upstream HCT, palettes,
  dynamic schemes
- [@poupe/theme-builder](../@poupe-theme-builder) — consumes
  `@poupe/color` to generate design tokens
- [@poupe/css](../@poupe-css) — peer dependency of theme-builder for
  CSS rendering (not used directly by `@poupe/color`)

## Requirements

- Node.js >= 20.19.2
- TypeScript-friendly environment

## License

MIT licensed.

<!-- Badge references -->
[jsdocs-badge]: https://img.shields.io/badge/jsDocs.io-reference-blue
[jsdocs-url]: https://www.jsdocs.io/package/@poupe/color
[npm-badge]: https://img.shields.io/npm/v/@poupe/color.svg
[npm-url]: https://www.npmjs.com/package/@poupe/color
[license-badge]: https://img.shields.io/badge/License-MIT-blue.svg
[license-url]: ../../LICENCE.txt
[mcu]: https://www.npmjs.com/package/@poupe/material-color-utilities
