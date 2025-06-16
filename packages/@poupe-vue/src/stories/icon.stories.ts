import type { StoryGroup } from '../components/story/types';
import { createStory, createStoryGroup } from '../components/story/utils';
import Icon from '../components/icon.vue';

// Size variants
export const sizeVariants = createStoryGroup(
  'Icon Sizes',
  'Different icon sizes',
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
        size,
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
        size: 'text-2xl',
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
        size: 'text-2xl',
        class: className,
      },
    }),
  ),
);

export const iconStoryGroups: StoryGroup[] = [
  sizeVariants,
  commonIcons,
  colorVariants,
];
