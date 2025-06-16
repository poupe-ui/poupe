import type { StoryGroup } from '../components/story/types';
import { createStory, createStoryGroup } from '../components/story/utils';
import Placeholder from '../components/placeholder.vue';

// Basic placeholder variants
export const basicVariants = createStoryGroup(
  'Basic Placeholders',
  'Different placeholder configurations',
  [
    createStory({
      title: 'Default Placeholder',
      component: Placeholder,
      props: {},
    }),
    createStory({
      title: 'Custom Text',
      component: Placeholder,
      props: {
        text: 'Custom placeholder text',
      },
    }),
    createStory({
      title: 'With Icon',
      component: Placeholder,
      props: {
        icon: 'material-symbols:image',
        text: 'Image placeholder',
      },
    }),
  ],
);

// Size variants
export const sizeVariants = createStoryGroup(
  'Size Variants',
  'Different placeholder sizes',
  [
    createStory({
      title: 'Small',
      component: Placeholder,
      props: {
        size: 'sm',
        text: 'Small placeholder',
      },
    }),
    createStory({
      title: 'Base',
      component: Placeholder,
      props: {
        size: 'base',
        text: 'Base placeholder',
      },
    }),
    createStory({
      title: 'Large',
      component: Placeholder,
      props: {
        size: 'lg',
        text: 'Large placeholder',
      },
    }),
  ],
);

// Shape variants
export const shapeVariants = createStoryGroup(
  'Shape Variants',
  'Different placeholder shapes',
  [
    createStory({
      title: 'Rectangle',
      component: Placeholder,
      props: {
        shape: 'rectangle',
        text: 'Rectangle shape',
      },
    }),
    createStory({
      title: 'Square',
      component: Placeholder,
      props: {
        shape: 'square',
        text: 'Square shape',
      },
    }),
    createStory({
      title: 'Circle',
      component: Placeholder,
      props: {
        shape: 'circle',
        icon: 'material-symbols:person',
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
        icon: 'material-symbols:image',
        text: 'Image',
        shape: 'rectangle',
        class: 'w-full h-48',
      },
    }),
    createStory({
      title: 'Avatar Placeholder',
      component: Placeholder,
      props: {
        icon: 'material-symbols:person',
        shape: 'circle',
        size: 'lg',
      },
    }),
    createStory({
      title: 'Content Block',
      component: Placeholder,
      props: {
        text: 'Content loading...',
        shape: 'rectangle',
        class: 'w-full h-32',
      },
    }),
    createStory({
      title: 'Icon Placeholder',
      component: Placeholder,
      props: {
        icon: 'material-symbols:widgets',
        shape: 'square',
        size: 'sm',
      },
    }),
  ],
);

export const placeholderStoryGroups: StoryGroup[] = [
  basicVariants,
  sizeVariants,
  shapeVariants,
  useCaseVariants,
];
