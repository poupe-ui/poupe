import { withMaterialColors } from '@poupe/theme-builder/tailwind';

export default withMaterialColors({
  content: [
    'index.html',
    'src/**/*.{ts,vue,css}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}, {
  primary: {
    // brown for wood
    value: '#5d3c1c',
  },
  blue: {
    // light blue for tailwindcss
    value: '#63b0ee',
    harmonize: false,
  },
  darkBlue: {
    // dark blue for the sea
    value: '#30338f',
  },
});
