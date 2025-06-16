import type { StoryGroup } from '../components/story/types';
import { createStory, createStoryGroup } from '../components/story/utils';
import { Icon } from '../components';

// Size variants
export const sizeVariants = createStoryGroup(
  'Icon Sizes',
  'Different icon sizes using Tailwind classes',
  [
    { size: 'text-xs', label: 'Extra Small' },
    { size: 'text-sm', label: 'Small' },
    { size: 'text-base', label: 'Base' },
    { size: 'text-lg', label: 'Large' },
    { size: 'text-xl', label: 'Extra Large' },
    { size: 'text-2xl', label: '2X Large' },
    { size: 'text-3xl', label: '3X Large' },
  ].map(({ size, label }) =>
    createStory({
      title: label,
      component: Icon,
      props: {
        icon: 'material-symbols:favorite',
        class: size,
      },
    }),
  ),
);

// Common icons
export const commonIcons = createStoryGroup(
  'Common Icons',
  'Frequently used Material Symbols icons',
  [
    'home', 'search', 'settings', 'favorite', 'star',
    'add', 'remove', 'edit', 'delete', 'close',
    'check', 'arrow-back', 'arrow-forward', 'menu',
    'more-vert', 'refresh', 'share', 'download', 'upload',
  ].map(name =>
    createStory({
      title: name,
      component: Icon,
      props: {
        icon: `material-symbols:${name}`,
        class: 'text-2xl',
      },
    }),
  ),
);

// Color variants
export const colorVariants = createStoryGroup(
  'Icon Colors',
  'Icons with different colors using text utilities',
  [
    { class: 'text-primary', label: 'Primary' },
    { class: 'text-secondary', label: 'Secondary' },
    { class: 'text-tertiary', label: 'Tertiary' },
    { class: 'text-error', label: 'Error' },
    { class: 'text-on-surface', label: 'On Surface' },
    { class: 'text-on-surface-variant', label: 'On Surface Variant' },
  ].map(({ class: className, label }) =>
    createStory({
      title: label,
      component: Icon,
      props: {
        icon: 'material-symbols:palette',
        class: `text-2xl ${className}`,
      },
    }),
  ),
);

// Rotation variants
export const rotationVariants = createStoryGroup(
  'Icon Rotation',
  'Icons with different rotation angles',
  [
    { rotate: 0, label: 'No rotation' },
    { rotate: 1, label: '90° clockwise' },
    { rotate: 2, label: '180°' },
    { rotate: 3, label: '270° clockwise' },
  ].map(({ rotate, label }) =>
    createStory({
      title: label,
      component: Icon,
      props: {
        icon: 'material-symbols:arrow-forward',
        class: 'text-3xl',
        rotate,
      },
    }),
  ),
);

// Flip variants
export const flipVariants = createStoryGroup(
  'Icon Flip',
  'Icons with horizontal and vertical flipping',
  [
    { flip: undefined, label: 'No flip' },
    { flip: 'horizontal', label: 'Horizontal flip' },
    { flip: 'vertical', label: 'Vertical flip' },
    { flip: 'horizontal,vertical', label: 'Both flips' },
  ].map(({ flip, label }) =>
    createStory({
      title: label,
      component: Icon,
      props: {
        icon: 'material-symbols:thumb-up',
        class: 'text-3xl',
        flip,
      },
    }),
  ),
);

// Custom size examples
export const customSizeVariants = createStoryGroup(
  'Custom Sizes',
  'Icons with custom width and height values',
  [
    createStory({
      title: 'Width 16px',
      component: Icon,
      props: {
        icon: 'material-symbols:square',
        width: '16',
      },
    }),
    createStory({
      title: 'Width 32px',
      component: Icon,
      props: {
        icon: 'material-symbols:square',
        width: '32',
      },
    }),
    createStory({
      title: 'Width 64px',
      component: Icon,
      props: {
        icon: 'material-symbols:square',
        width: '64',
      },
    }),
    createStory({
      title: 'Width 48px, Height 24px',
      component: Icon,
      props: {
        icon: 'material-symbols:rectangle',
        width: '48',
        height: '24',
      },
    }),
    createStory({
      title: 'Width 2em',
      component: Icon,
      props: {
        icon: 'material-symbols:circle',
        width: '2em',
      },
    }),
    createStory({
      title: 'Width 3rem',
      component: Icon,
      props: {
        icon: 'material-symbols:hexagon',
        width: '3rem',
      },
    }),
  ],
);

// Inline examples
export const inlineVariants = createStoryGroup(
  'Inline Icons',
  'Icons inline with text',
  [
    createStory({
      title: 'Inline false (default)',
      component: Icon,
      props: {
        icon: 'material-symbols:info',
        class: 'text-primary',
      },
      wrapperClass: 'flex items-center',
      // Note: The text content functionality has been removed for simplification
    }),
    createStory({
      title: 'Inline true',
      component: Icon,
      props: {
        icon: 'material-symbols:info',
        inline: true,
        class: 'text-primary',
      },
      wrapperClass: 'flex items-center',
      // Note: The text content functionality has been removed for simplification
    }),
  ],
);

// Icon set examples
export const iconSetVariants = createStoryGroup(
  'Different Icon Sets',
  'Icons from various icon collections',
  [
    createStory({
      title: 'Material Symbols',
      component: Icon,
      props: {
        icon: 'material-symbols:home',
        class: 'text-2xl',
      },
    }),
    createStory({
      title: 'MDI',
      component: Icon,
      props: {
        icon: 'mdi:home',
        class: 'text-2xl',
      },
    }),
    createStory({
      title: 'Tabler Icons',
      component: Icon,
      props: {
        icon: 'tabler:home',
        class: 'text-2xl',
      },
    }),
    createStory({
      title: 'Heroicons',
      component: Icon,
      props: {
        icon: 'heroicons:home',
        class: 'text-2xl',
      },
    }),
    createStory({
      title: 'Simple Icons',
      component: Icon,
      props: {
        icon: 'simple-icons:github',
        class: 'text-2xl',
      },
    }),
  ],
);

// Animation examples
export const animationVariants = createStoryGroup(
  'Animated Icons',
  'Icons with CSS animations',
  [
    createStory({
      title: 'Spinning',
      component: Icon,
      props: {
        icon: 'material-symbols:progress-activity',
        class: 'text-3xl animate-spin text-primary',
      },
    }),
    createStory({
      title: 'Pulsing',
      component: Icon,
      props: {
        icon: 'material-symbols:favorite',
        class: 'text-3xl animate-pulse text-error',
      },
    }),
    createStory({
      title: 'Bouncing',
      component: Icon,
      props: {
        icon: 'material-symbols:arrow-downward',
        class: 'text-3xl animate-bounce',
      },
    }),
  ],
);

export const iconStoryGroups: StoryGroup[] = [
  sizeVariants,
  commonIcons,
  colorVariants,
  rotationVariants,
  flipVariants,
  customSizeVariants,
  inlineVariants,
  iconSetVariants,
  animationVariants,
];
