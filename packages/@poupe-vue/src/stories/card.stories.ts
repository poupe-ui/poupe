import { h } from 'vue';
import type { StoryGroup } from '../components/story/types';
import { createStory, createStoryGroup } from '../components/story/utils';
import { Button, Card, Icon, Surface } from '../components';

// Basic card variants
export const basicVariants = createStoryGroup(
  'Basic Cards',
  'Different card configurations',
  [
    createStory({
      title: 'Simple Card',
      component: Card,
      props: {
        title: 'Card Title',
      },
      slots: {
        default: 'This is the card content. It can contain any text or components.',
      },
    }),
    createStory({
      title: 'Card with Header and Footer',
      component: Card,
      props: {},
      slots: {
        header: 'Custom Header',
        default: 'Main content area',
        footer: 'Footer content',
      },
    }),
    createStory({
      title: 'Card without Title',
      component: Card,
      props: {},
      slots: {
        default: 'A card with just content, no title or header.',
      },
    }),
  ],
);

// Surface variants
export const surfaceVariants = createStoryGroup(
  'Surface Variants',
  'Cards with different surface colors',
  ['base', 'low', 'container', 'high', 'highest'].map(surface =>
    createStory({
      title: surface.replaceAll('-', ' ').replaceAll(/\b\w/g, l => l.toUpperCase()),
      component: Card,
      props: {
        surface,
        title: 'Surface Variant',
      },
      slots: {
        default: `This card uses the ${surface} color.`,
      },
    }),
  ),
);

// Shadow variants
export const shadowVariants = createStoryGroup(
  'Shadow Variants',
  'Cards with different elevation shadows',
  ['none', 'z1', 'z2', 'z3', 'z4', 'z5'].map(shadow =>
    createStory({
      title: `Shadow Level ${shadow}`,
      component: Card,
      props: {
        shadow,
        title: `Elevation ${shadow}`,
      },
      slots: {
        default: `This card has shadow level ${shadow}.`,
      },
    }),
  ),
);

// Shape variants
export const shapeVariants = createStoryGroup(
  'Shape Variants',
  'Cards with different corner radius options',
  ['xs', 'sm', 'md', 'lg', 'xl'].map(shape =>
    createStory({
      title: `Shape ${shape}`,
      component: Card,
      props: {
        shape,
        title: `Shape ${shape}`,
      },
      slots: {
        default: `This card uses ${shape} corners.`,
      },
    }),
  ),
);

// Interactive cards
export const interactiveVariants = createStoryGroup(
  'Interactive Cards',
  'Cards with hover and click interactions',
  [
    createStory({
      title: 'Clickable Card',
      component: Card,
      props: {
        interactive: true,
        title: 'Interactive Card',
      },
      slots: {
        default: 'This card responds to hover and click. Try interacting with it!',
      },
    }),
    createStory({
      title: 'Interactive with Primary Container',
      component: Card,
      props: {
        interactive: true,
        container: 'primary',
        title: 'Primary Interactive',
      },
      slots: {
        default: 'An interactive card with primary container color.',
      },
    }),
  ],
);

// Complex content examples
export const complexContentVariants = createStoryGroup(
  'Complex Content',
  'Cards with rich content and interactive elements',
  [
    createStory({
      title: 'Media Card',
      component: Card,
      props: {
        shadow: 'z2',
      },
      slots: {
        header: () => h('div', { class: 'h-48 -mx-4 -mt-4 bg-gradient-to-r from-primary to-secondary' }),
        default: () => h('div', { class: 'space-y-2' }, [
          h('h3', { class: 'text-xl font-semibold' }, 'Beautiful Landscape'),
          h('p', { class: 'text-sm text-on-surface-variant' }, 'Experience the breathtaking views of nature with our curated collection of landscape photography.'),
        ]),
        footer: () => h('div', { class: 'flex justify-end gap-2 -mx-4 -mb-4 px-4 pb-4' }, [
          h(Button, { surface: 'base', label: 'Share' }),
          h(Button, { surface: 'primary', label: 'View' }),
        ]),
      },
    }),
    createStory({
      title: 'Profile Card',
      component: Card,
      props: {
        surface: 'highest',
        shadow: 'z3',
      },
      slots: {
        default: () => h('div', { class: 'flex items-center gap-4' }, [
          h(Surface, {
            shape: 'full',
            variant: 'primary-container',
            padding: 'none',
          }, {
            default: () => h('div', { class: 'w-16 h-16 flex items-center justify-center' }, [
              h('span', { class: 'text-2xl font-bold' }, 'JD'),
            ]),
          }),
          h('div', { class: 'flex-1' }, [
            h('h4', { class: 'font-medium' }, 'John Doe'),
            h('p', { class: 'text-sm text-on-surface-variant' }, 'Software Engineer'),
            h('div', { class: 'flex gap-2 mt-2 items-center' }, [
              h(Icon, { icon: 'material-symbols:mail', class: 'text-sm' }),
              h('span', { class: 'text-xs' }, 'john.doe@example.com'),
            ]),
          ]),
        ]),
      },
    }),
    createStory({
      title: 'Stats Card',
      component: Card,
      props: {
        title: 'Monthly Statistics',
        surface: 'low',
      },
      slots: {
        default: () => h('div', { class: 'grid grid-cols-3 gap-4 text-center' }, [
          h('div', [
            h('div', { class: 'text-2xl font-bold text-primary' }, '1,234'),
            h('div', { class: 'text-xs text-on-surface-variant' }, 'Views'),
          ]),
          h('div', [
            h('div', { class: 'text-2xl font-bold text-secondary' }, '89%'),
            h('div', { class: 'text-xs text-on-surface-variant' }, 'Growth'),
          ]),
          h('div', [
            h('div', { class: 'text-2xl font-bold text-tertiary' }, '456'),
            h('div', { class: 'text-xs text-on-surface-variant' }, 'Users'),
          ]),
        ]),
      },
    }),
    createStory({
      title: 'Action Card',
      component: Card,
      props: {
        shadow: 'z2',
      },
      slots: {
        header: () => h('div', { class: 'flex items-center justify-between' }, [
          h('h3', { class: 'text-lg font-medium' }, 'Quick Actions'),
          h(Icon, { icon: 'material-symbols:more-vert' }),
        ]),
        default: () => h('div', { class: 'space-y-2' }, [
          h(Button, { expand: true, surface: 'primary', label: 'Create New', iconStart: 'material-symbols:add' }),
          h(Button, { expand: true, surface: 'secondary', label: 'Import Data', iconStart: 'material-symbols:upload' }),
          h(Button, { expand: true, surface: 'tertiary', label: 'Export Report', iconStart: 'material-symbols:download' }),
        ]),
      },
    }),
    createStory({
      title: 'Nested Cards',
      component: Card,
      props: {
        title: 'Parent Card',
        surface: 'base',
      },
      slots: {
        default: () => h('div', { class: 'space-y-4' }, [
          h('p', 'This card contains other cards:'),
          h(Card, {
            surface: 'low',
            shadow: 'none',
            shape: 'sm',
          }, {
            default: () => 'Nested card with low surface',
          }),
          h(Card, {
            surface: 'high',
            shadow: 'none',
            shape: 'sm',
          }, {
            default: () => 'Nested card with high surface',
          }),
        ]),
      },
    }),
    createStory({
      title: 'List Item Card',
      component: Card,
      props: {
        surface: 'base',
        shadow: 'none',
        shape: 'sm',
        interactive: true,
      },
      slots: {
        default: () => h('div', { class: 'flex items-center justify-between' }, [
          h('div', { class: 'flex items-center gap-3' }, [
            h(Icon, { icon: 'material-symbols:folder', class: 'text-2xl text-primary' }),
            h('div', [
              h('div', { class: 'font-medium' }, 'Documents'),
              h('div', { class: 'text-sm text-on-surface-variant' }, '125 files'),
            ]),
          ]),
          h(Icon, { icon: 'material-symbols:chevron-right', class: 'text-on-surface-variant' }),
        ]),
      },
    }),
  ],
);

// Combination examples
export const combinationVariants = createStoryGroup(
  'Combinations',
  'Cards combining multiple variants for specific use cases',
  [
    createStory({
      title: 'Material Design Card',
      component: Card,
      props: {
        surface: 'high',
        shadow: 'z2',
        shape: 'lg',
      },
      slots: {
        default: () => h('div', { class: 'space-y-4' }, [
          h('h3', { class: 'text-lg font-medium' }, 'Material Design 3'),
          h('p', { class: 'text-sm' }, 'A modern design system by Google that emphasizes bold colors, dynamic theming, and elevated surfaces.'),
          h('div', { class: 'flex gap-2' }, [
            h(Button, { surface: 'primary', size: 'sm', label: 'Learn More' }),
            h(Button, { surface: 'base', size: 'sm', label: 'Dismiss' }),
          ]),
        ]),
      },
    }),
    createStory({
      title: 'Elevated Action Card',
      component: Card,
      props: {
        surface: 'highest',
        shadow: 'z4',
        shape: 'xl',
      },
      slots: {
        default: () => h('div', { class: 'text-center py-8' }, [
          h(Icon, { icon: 'material-symbols:rocket-launch', class: 'text-6xl text-primary mb-4' }),
          h('h2', { class: 'text-2xl font-bold mb-2' }, 'Ready to Launch?'),
          h('p', { class: 'text-on-surface-variant mb-6' }, 'Start your journey with our premium features'),
          h(Button, { surface: 'primary', size: 'lg', rounded: 'full', shadow: 'z2', label: 'Get Started' }),
        ]),
      },
    }),
    createStory({
      title: 'Color Container Cards',
      component: Card,
      props: {},
      slots: {
        default: () => h('div', { class: 'space-y-4' }, [
          h(Card, { container: 'primary', title: 'Primary', shadow: 'z1' }, {
            default: () => 'Card with primary container color',
          }),
          h(Card, { container: 'secondary', title: 'Secondary', shadow: 'z1' }, {
            default: () => 'Card with secondary container color',
          }),
          h(Card, { container: 'tertiary', title: 'Tertiary', shadow: 'z1' }, {
            default: () => 'Card with tertiary container color',
          }),
        ]),
      },
    }),
  ],
);

export const cardStoryGroups: StoryGroup[] = [
  basicVariants,
  surfaceVariants,
  shadowVariants,
  shapeVariants,
  interactiveVariants,
  complexContentVariants,
  combinationVariants,
];
