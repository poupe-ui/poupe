import { h } from 'vue';
import type { StoryGroup } from '../components/story/types';
import { createStory, createStoryGroup } from '../components/story/utils';
import { Surface as PSurface, Icon, Button } from '../components';

// Surface variants
export const surfaceVariants = createStoryGroup(
  'Surface Variants',
  'Different Material Design 3 surface colors',
  [
    { role: 'surface', tone: 'dim', title: 'Surface Dim' },
    { role: 'surface', tone: 'base', title: 'Surface' },
    { role: 'surface', tone: 'bright', title: 'Surface Bright' },
    { role: 'container', level: 'lowest', title: 'Surface Container Lowest' },
    { role: 'container', level: 'low', title: 'Surface Container Low' },
    { role: 'container', level: 'base', title: 'Surface Container' },
    { role: 'container', level: 'high', title: 'Surface Container High' },
    { role: 'container', level: 'highest', title: 'Surface Container Highest' },
  ].map(({ role, tone, level, title }) =>
    createStory({
      title,
      component: PSurface,
      props: {
        role,
        ...(tone && { tone }),
        ...(level && { level }),
        padding: 'md',
      },
      slots: {
        default: () => h('div', [
          h('h3', { class: 'font-medium mb-2' }, title.toLowerCase().replace('surface ', '')),
          h('p', { class: 'text-sm' }, 'This demonstrates the ' + title.toLowerCase() + ' variant.'),
        ]),
      },
    }),
  ),
);

// Container variants
export const containerVariants = createStoryGroup(
  'Container Variants',
  'Color container variants for brand emphasis',
  ['primary', 'secondary', 'tertiary', 'error'].map(variant =>
    createStory({
      title: variant.charAt(0).toUpperCase() + variant.slice(1) + ' Container',
      component: PSurface,
      props: {
        variant: variant + '-container',
        padding: 'md',
      },
      slots: {
        default: () => h('div', [
          h('h3', { class: 'font-medium mb-2' }, variant + ' Container'),
          h('p', { class: 'text-sm' }, 'Uses the ' + variant + ' color scheme.'),
        ]),
      },
    }),
  ),
);

// Shape variants
export const shapeVariants = createStoryGroup(
  'Shape Variants',
  'Different corner radius options using the shape system',
  [
    // Size-based squircle variants
    'xs', 'sm', 'md', 'lg', 'xl',
    // Explicit squircle variants
    'squircle-xs', 'squircle-sm', 'squircle-md', 'squircle-lg', 'squircle-xl',
    // Special variants
    'rounded', 'full',
  ].map(shape =>
    createStory({
      title: 'Shape ' + shape,
      component: PSurface,
      props: {
        role: 'container',
        level: 'high',
        shape,
        padding: 'lg',
      },
      slots: {
        default: () => h('div', { class: 'text-center' }, [
          h('div', { class: 'font-medium' }, 'shape-' + shape),
          h('div', { class: 'text-sm text-on-surface-variant mt-1' }, (() => {
            if (shape.includes('squircle')) {
              return 'Explicit squircle';
            }
            if (['xs', 'sm', 'md', 'lg', 'xl'].includes(shape)) {
              return 'Size alias (squircle)';
            }
            if (shape === 'rounded' || shape === 'full') {
              return 'Fully rounded';
            }
            return 'Custom shape';
          })()),
        ]),
      },
    }),
  ),
);

// Shadow variants
export const shadowVariants = createStoryGroup(
  'Shadow Variants',
  'Elevation levels for depth perception',
  ['none', 'z1', 'z2', 'z3', 'z4', 'z5'].map(shadow =>
    createStory({
      title: 'Shadow Level ' + shadow,
      component: PSurface,
      props: {
        role: 'container',
        level: 'base',
        shadow,
        shape: 'lg',
        padding: 'lg',
      },
      slots: {
        default: () => h('div', { class: 'text-center' }, [
          h('div', { class: 'text-2xl font-bold mb-2' }, shadow === 'none' ? '0' : shadow.slice(1)),
          h('div', { class: 'text-sm' }, 'Elevation Level'),
        ]),
      },
    }),
  ),
);

// Border variants
export const borderVariants = createStoryGroup(
  'Border Variants',
  'Border styles for additional emphasis',
  ['none', 'primary', 'outline', 'outline-variant'].map(border =>
    createStory({
      title: border === 'none' ? 'No Border' : border.replaceAll('-', ' ').replaceAll(/\b\w/g, l => l.toUpperCase()),
      component: PSurface,
      props: {
        role: 'surface',
        tone: 'base',
        border,
        shape: 'md',
        padding: 'md',
      },
      slots: {
        default: () => h('div', [
          h('div', { class: 'font-medium' }, 'Border: ' + border),
          h('div', { class: 'text-sm text-on-surface-variant mt-1' }, (() => {
            if (border === 'none') {
              return 'No border applied';
            }
            if (border === 'primary') {
              return 'Primary color border';
            }
            if (border === 'outline') {
              return 'Standard outline';
            }
            return 'Muted outline variant';
          })()),
        ]),
      },
    }),
  ),
);

// Padding variants
export const paddingVariants = createStoryGroup(
  'Padding Variants',
  'Different padding sizes for content spacing',
  ['none', 'xs', 'sm', 'md', 'lg', 'xl'].map(padded =>
    createStory({
      title: 'Padding ' + padded,
      component: PSurface,
      props: {
        role: 'container',
        level: 'low',
        padding: padded,
        shape: 'md',
        border: 'outline-variant',
      },
      slots: {
        default: () => h('div', { class: 'bg-primary/10 text-center' }, [
          h('div', { class: 'font-medium' }, 'Padding: ' + padded),
        ]),
      },
    }),
  ),
);

// Interactive surfaces
export const interactiveVariants = createStoryGroup(
  'Interactive Surfaces',
  'Surfaces with hover and focus states',
  ['surface', 'primary', 'secondary', 'tertiary'].map(variant =>
    createStory({
      title: variant.charAt(0).toUpperCase() + variant.slice(1) + ' Interactive',
      component: PSurface,
      props: {
        ...(variant === 'surface' ? { role: 'container', level: 'base' } : { variant: variant + '-container' }),
        interactive: true,
        shape: 'lg',
        padding: 'lg',
      },
      slots: {
        default: () => h('div', { class: 'text-center' }, [
          h(Icon, { icon: 'material-symbols:touch-app', class: 'text-3xl mb-2' }),
          h('div', { class: 'font-medium' }, 'Interactive ' + variant),
          h('div', { class: 'text-sm text-on-surface-variant mt-1' }, 'Hover or focus me'),
        ]),
      },
    }),
  ),
);

// Complex examples
export const complexExamples = createStoryGroup(
  'Complex Examples',
  'Real-world usage patterns',
  [
    createStory({
      title: 'Card-like Surface',
      component: PSurface,
      props: {
        role: 'container',
        level: 'base',
        shape: 'shape-card',
        shadow: 'z2',
        padding: 'lg',
      },
      slots: {
        default: () => h('div', { class: 'space-y-3' }, [
          h('h3', { class: 'text-xl font-semibold' }, 'Card Example'),
          h('p', { class: 'text-on-surface-variant' }, 'PSurface can be used as a foundation for card components.'),
          h('div', { class: 'flex gap-2 mt-4' }, [
            h(Button, { surface: 'primary', size: 'sm', label: 'Action' }),
            h(Button, { surface: 'base', size: 'sm', label: 'Cancel' }),
          ]),
        ]),
      },
    }),
    createStory({
      title: 'Nested Surfaces',
      component: PSurface,
      props: {
        role: 'surface',
        tone: 'base',
        shape: 'lg',
        padding: 'lg',
      },
      slots: {
        default: () => h('div', { class: 'space-y-4' }, [
          h('h3', { class: 'font-medium mb-3' }, 'Container with nested surfaces'),
          h(PSurface, {
            role: 'container',
            level: 'low',
            shape: 'md',
            padding: 'md',
          }, {
            default: () => 'Low container',
          }),
          h(PSurface, {
            role: 'container',
            level: 'high',
            shape: 'md',
            padding: 'md',
          }, {
            default: () => 'High container',
          }),
        ]),
      },
    }),
    createStory({
      title: 'Interactive List Item',
      component: PSurface,
      props: {
        role: 'surface',
        tone: 'base',
        interactive: true,
        shape: 'sm',
        padding: 'md',
      },
      slots: {
        default: () => h('div', { class: 'flex items-center justify-between' }, [
          h('div', { class: 'flex items-center gap-3' }, [
            h(Icon, { icon: 'material-symbols:folder', class: 'text-2xl text-primary' }),
            h('div', [
              h('div', { class: 'font-medium' }, 'Documents'),
              h('div', { class: 'text-sm text-on-surface-variant' }, '24 items'),
            ]),
          ]),
          h(Icon, { icon: 'material-symbols:chevron-right' }),
        ]),
      },
    }),
    createStory({
      title: 'FAB-like Surface',
      component: PSurface,
      props: {
        variant: 'primary-container',
        shape: 'shape-fab',
        shadow: 'z3',
        padding: 'lg',
        interactive: true,
      },
      slots: {
        default: () => h('div', { class: 'flex items-center justify-center w-12 h-12' }, [
          h(Icon, { icon: 'material-symbols:add', class: 'text-2xl' }),
        ]),
      },
    }),
  ],
);

// Combinations showcase
export const combinationShowcase = createStoryGroup(
  'Combination Showcase',
  'Various prop combinations',
  [
    createStory({
      title: 'Elevated Primary',
      component: PSurface,
      props: {
        variant: 'primary-container',
        shape: 'xl',
        shadow: 'z3',
        padding: 'lg',
      },
      slots: {
        default: 'Elevated primary container with xl shape',
      },
    }),
    createStory({
      title: 'Outlined Secondary',
      component: PSurface,
      props: {
        variant: 'secondary-container',
        shape: 'squircle-lg',
        border: 'outline',
        padding: 'md',
      },
      slots: {
        default: 'Secondary container with outline border',
      },
    }),
    createStory({
      title: 'Dim Surface Interactive',
      component: PSurface,
      props: {
        role: 'surface',
        tone: 'dim',
        shape: 'rounded',
        interactive: true,
        padding: 'lg',
      },
      slots: {
        default: 'Dim surface with full rounding and interactivity',
      },
    }),
  ],
);

export const surfaceStoryGroups: StoryGroup[] = [
  surfaceVariants,
  containerVariants,
  shapeVariants,
  shadowVariants,
  borderVariants,
  paddingVariants,
  interactiveVariants,
  complexExamples,
  combinationShowcase,
];
