import { h } from 'vue';
import type { StoryGroup } from '../components/story/types';
import { createStory, createStoryGroup } from '../components/story/utils';
import { Button, Card, Icon, Placeholder } from '../components';

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
  ],
);

// Surface variants
export const surfaceVariants = createStoryGroup(
  'Surface Variants',
  'Cards with different surface colors',
  ['base', 'low', 'high', 'highest'].map(surface =>
    createStory({
      title: `Surface ${surface}`,
      component: Card,
      props: {
        surface,
        title: `${surface} Surface Card`,
      },
      slots: {
        default: `This card uses the ${surface} surface color.`,
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
      title: `Shadow ${shadow}`,
      component: Card,
      props: {
        shadow,
        title: `Shadow ${shadow}`,
      },
      slots: {
        default: `This card has ${shadow} elevation.`,
      },
    }),
  ),
);

// Rounded variants
export const roundedVariants = createStoryGroup(
  'Rounded Variants',
  'Cards with different corner radius options',
  ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'].map(rounded =>
    createStory({
      title: `Rounded ${rounded}`,
      component: Card,
      props: {
        rounded,
        title: `Rounded ${rounded}`,
        shadow: 'z2',
      },
      slots: {
        default: `This card has ${rounded} corner radius.`,
      },
    }),
  ),
);

// Complex content examples
export const complexContentVariants = createStoryGroup(
  'Complex Content',
  'Cards with rich content and interactive elements',
  [
    createStory({
      title: 'Card with Image',
      component: Card,
      props: {
        shadow: 'z2',
        rounded: 'lg',
      },
      slots: {
        header: () => h('div', { class: 'h-48 bg-gradient-to-r from-primary to-secondary' }),
        default: () => h('div', { class: 'space-y-2' }, [
          h('h3', { class: 'text-xl font-semibold' }, 'Beautiful Landscape'),
          h('p', { class: 'text-sm text-on-surface-variant' }, 'Experience the breathtaking views of nature with our curated collection of landscape photography.'),
        ]),
        footer: () => h('div', { class: 'flex justify-end gap-2 p-2' }, [
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
        rounded: 'xl',
      },
      slots: {
        default: () => h('div', { class: 'flex items-center gap-4' }, [
          h('div', { class: 'w-16 h-16' }, [
            h(Placeholder, { shape: 'circle', color: 'primary' }),
          ]),
          h('div', { class: 'flex-1' }, [
            h('h4', { class: 'font-medium' }, 'John Doe'),
            h('p', { class: 'text-sm text-on-surface-variant' }, 'Software Engineer'),
            h('div', { class: 'flex gap-2 mt-2' }, [
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
        shadow: 'z1',
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
        surface: 'high',
      },
      slots: {
        header: () => h('div', { class: 'flex items-center justify-between p-4' }, [
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
        shadow: 'z1',
      },
      slots: {
        default: () => h('div', { class: 'space-y-4' }, [
          h('p', 'This card contains other cards:'),
          h(Card, {
            surface: 'low',
            shadow: 'none',
            rounded: 'md',
          }, {
            default: () => 'Nested card 1 with low surface',
          }),
          h(Card, {
            surface: 'high',
            shadow: 'none',
            rounded: 'md',
          }, {
            default: () => 'Nested card 2 with high surface',
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
        rounded: 'md',
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
        rounded: 'lg',
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
        rounded: '2xl',
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
  ],
);

export const cardStoryGroups: StoryGroup[] = [
  basicVariants,
  surfaceVariants,
  shadowVariants,
  roundedVariants,
  complexContentVariants,
  combinationVariants,
];
