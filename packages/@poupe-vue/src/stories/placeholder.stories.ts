import { h } from 'vue';
import type { StoryGroup } from '../components/story/types';
import { createStory, createStoryGroup } from '../components/story/utils';
import { Placeholder, Icon } from '../components';

// Basic placeholder variants
export const basicVariants = createStoryGroup(
  'Basic Placeholders',
  'Different placeholder configurations',
  [
    createStory({
      title: 'Default Placeholder',
      component: Placeholder,
      props: {},
      wrapperClass: 'w-64 h-32',
    }),
    createStory({
      title: 'With Content',
      component: Placeholder,
      props: {},
      wrapperClass: 'w-64 h-32',
      slots: {
        default: () => h('div', { class: 'flex items-center justify-center h-full' }, [
          h(Icon, { icon: 'material-symbols:image', class: 'text-4xl' }),
        ]),
      },
    }),
    createStory({
      title: 'Text Content',
      component: Placeholder,
      props: {
        border: 'solid',
        color: 'primary',
      },
      wrapperClass: 'w-64 h-32',
      slots: {
        default: () => h('div', { class: 'flex items-center justify-center h-full text-primary' }, 'Loading...'),
      },
    }),
  ],
);

// Border variants
export const borderVariants = createStoryGroup(
  'Border Variants',
  'Different border styles',
  ['none', 'solid', 'dashed'].map(border =>
    createStory({
      title: `Border ${border}`,
      component: Placeholder,
      props: {
        border,
      },
      wrapperClass: 'w-48 h-24',
    }),
  ),
);

// Color variants
export const colorVariants = createStoryGroup(
  'Color Variants',
  'Different pattern and border colors',
  ['current', 'outline-variant', 'outline', 'primary', 'secondary', 'tertiary', 'error'].map(color =>
    createStory({
      title: `Color ${color}`,
      component: Placeholder,
      props: {
        color,
        border: 'solid',
      },
      wrapperClass: 'w-48 h-24',
    }),
  ),
);

// Rounded variants
export const roundedVariants = createStoryGroup(
  'Rounded Variants',
  'Different corner radius options',
  ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full'].map(rounded =>
    createStory({
      title: `Rounded ${rounded}`,
      component: Placeholder,
      props: {
        rounded,
        border: 'solid',
        color: 'primary',
      },
      wrapperClass: 'w-48 h-24',
    }),
  ),
);

// Shadow variants
export const shadowVariants = createStoryGroup(
  'Shadow Variants',
  'Different shadow elevations',
  ['none', 'z1', 'z2', 'z3', 'z4', 'z5'].map(shadow =>
    createStory({
      title: `Shadow ${shadow}`,
      component: Placeholder,
      props: {
        shadow,
        border: 'solid',
      },
      wrapperClass: 'w-48 h-24',
    }),
  ),
);

// Rhombus pattern variants
export const rhombusVariants = createStoryGroup(
  'Rhombus Pattern Variants',
  'Different rhombus dimensions for the pattern',
  [
    createStory({
      title: 'Default (10x20)',
      component: Placeholder,
      props: {
        rw: 10,
        rh: 20,
      },
      wrapperClass: 'w-48 h-24',
    }),
    createStory({
      title: 'Small Pattern (5x10)',
      component: Placeholder,
      props: {
        rw: 5,
        rh: 10,
      },
      wrapperClass: 'w-48 h-24',
    }),
    createStory({
      title: 'Large Pattern (20x40)',
      component: Placeholder,
      props: {
        rw: 20,
        rh: 40,
      },
      wrapperClass: 'w-48 h-24',
    }),
    createStory({
      title: 'Square Pattern (15x15)',
      component: Placeholder,
      props: {
        rw: 15,
        rh: 15,
      },
      wrapperClass: 'w-48 h-24',
    }),
    createStory({
      title: 'Wide Pattern (30x15)',
      component: Placeholder,
      props: {
        rw: 30,
        rh: 15,
      },
      wrapperClass: 'w-48 h-24',
    }),
  ],
);

// Shape examples (using rounded variants)
export const shapeExamples = createStoryGroup(
  'Shape Examples',
  'Common shapes using rounded variants',
  [
    createStory({
      title: 'Rectangle',
      component: Placeholder,
      props: {
        rounded: 'md',
        border: 'solid',
      },
      wrapperClass: 'w-64 h-32',
    }),
    createStory({
      title: 'Square',
      component: Placeholder,
      props: {
        rounded: 'lg',
        border: 'solid',
      },
      wrapperClass: 'w-32 h-32',
    }),
    createStory({
      title: 'Circle',
      component: Placeholder,
      props: {
        rounded: 'full',
        border: 'solid',
      },
      wrapperClass: 'w-32 h-32',
      slots: {
        default: () => h('div', { class: 'flex items-center justify-center h-full' }, [
          h(Icon, { icon: 'material-symbols:person', class: 'text-4xl' }),
        ]),
      },
    }),
  ],
);

// Common use cases
export const useCaseVariants = createStoryGroup(
  'Common Use Cases',
  'Placeholder examples for different content types',
  [
    createStory({
      title: 'Image Placeholder',
      component: Placeholder,
      props: {
        rounded: 'lg',
        shadow: 'z1',
      },
      wrapperClass: 'w-full h-48',
      slots: {
        default: () => h('div', { class: 'flex flex-col items-center justify-center h-full text-on-surface-variant' }, [
          h(Icon, { icon: 'material-symbols:image', class: 'text-4xl mb-2' }),
          h('span', { class: 'text-sm' }, 'Image'),
        ]),
      },
    }),
    createStory({
      title: 'Avatar Placeholder',
      component: Placeholder,
      props: {
        rounded: 'full',
        color: 'primary',
        border: 'solid',
      },
      wrapperClass: 'w-24 h-24',
      slots: {
        default: () => h('div', { class: 'flex items-center justify-center h-full' }, [
          h(Icon, { icon: 'material-symbols:person', class: 'text-3xl text-primary' }),
        ]),
      },
    }),
    createStory({
      title: 'Content Block',
      component: Placeholder,
      props: {
        color: 'outline',
        rw: 15,
        rh: 15,
      },
      wrapperClass: 'w-full h-32',
      slots: {
        default: () => h('div', { class: 'flex items-center justify-center h-full text-on-surface-variant' }, 'Content loading...'),
      },
    }),
    createStory({
      title: 'Icon Placeholder',
      component: Placeholder,
      props: {
        rounded: 'md',
        shadow: 'z2',
        color: 'secondary',
      },
      wrapperClass: 'w-16 h-16',
      slots: {
        default: () => h('div', { class: 'flex items-center justify-center h-full' }, [
          h(Icon, { icon: 'material-symbols:widgets', class: 'text-2xl text-secondary' }),
        ]),
      },
    }),
  ],
);

// Combination examples
export const combinationVariants = createStoryGroup(
  'Combinations',
  'Real-world examples combining multiple variants',
  [
    createStory({
      title: 'Loading Card',
      component: Placeholder,
      props: {
        border: 'none',
        shadow: 'z2',
        rounded: 'xl',
        color: 'outline-variant',
      },
      wrapperClass: 'w-64 h-40',
      slots: {
        default: () => h('div', { class: 'flex flex-col items-center justify-center h-full gap-2' }, [
          h('div', { class: 'animate-spin' }, [
            h(Icon, { icon: 'material-symbols:progress-activity', class: 'text-3xl' }),
          ]),
          h('span', { class: 'text-sm text-on-surface-variant' }, 'Loading content...'),
        ]),
      },
    }),
    createStory({
      title: 'Upload Area',
      component: Placeholder,
      props: {
        border: 'dashed',
        color: 'primary',
        rounded: 'lg',
        rw: 20,
        rh: 20,
      },
      wrapperClass: 'w-full h-48',
      slots: {
        default: () => h('div', { class: 'flex flex-col items-center justify-center h-full gap-3 text-primary' }, [
          h(Icon, { icon: 'material-symbols:cloud-upload', class: 'text-5xl' }),
          h('div', { class: 'text-center' }, [
            h('div', { class: 'font-medium' }, 'Drop files here'),
            h('div', { class: 'text-sm opacity-75' }, 'or click to browse'),
          ]),
        ]),
      },
    }),
    createStory({
      title: 'No Data',
      component: Placeholder,
      props: {
        border: 'none',
        color: 'outline',
        rounded: '2xl',
        rw: 5,
        rh: 5,
      },
      wrapperClass: 'w-64 h-64',
      slots: {
        default: () => h('div', { class: 'flex flex-col items-center justify-center h-full gap-4' }, [
          h(Icon, { icon: 'material-symbols:inbox', class: 'text-6xl text-on-surface-variant' }),
          h('div', { class: 'text-center' }, [
            h('div', { class: 'font-medium text-lg' }, 'No data yet'),
            h('div', { class: 'text-sm text-on-surface-variant' }, 'Start by adding some items'),
          ]),
        ]),
      },
    }),
  ],
);

export const placeholderStoryGroups: StoryGroup[] = [
  basicVariants,
  borderVariants,
  colorVariants,
  roundedVariants,
  shadowVariants,
  rhombusVariants,
  shapeExamples,
  useCaseVariants,
  combinationVariants,
];
