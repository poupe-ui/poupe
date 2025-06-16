import { h, Fragment } from 'vue';
import type { StoryGroup } from '../components/story/types';
import { createStory, createStoryGroup } from '../components/story/utils';
import Button from '../components/button.vue';
import Icon from '../components/icon.vue';

// Surface variants
export const surfaceVariants = createStoryGroup(
  'Surface Variants',
  'Different surface colors for various button purposes',
  ['base', 'primary', 'secondary', 'tertiary', 'error'].map(surface =>
    createStory({
      title: `${surface} surface`,
      component: Button,
      props: {
        surface,
        label: `${surface} Button`,
      },
    }),
  ),
);

// Size variants
export const sizeVariants = createStoryGroup(
  'Size Variants',
  'Different button sizes for various use cases',
  ['xs', 'sm', 'base', 'lg', 'xl'].map(size =>
    createStory({
      title: `Size ${size}`,
      component: Button,
      props: {
        size,
        surface: 'primary',
        label: `Size ${size}`,
      },
    }),
  ),
);

// Button states
export const stateVariants = createStoryGroup(
  'Button States',
  'Different button states for various interactions',
  [
    createStory({
      title: 'Normal state',
      component: Button,
      props: {
        surface: 'primary',
        label: 'Normal',
      },
    }),
    createStory({
      title: 'Disabled state',
      component: Button,
      props: {
        surface: 'primary',
        label: 'Disabled',
        disabled: true,
      },
    }),
    createStory({
      title: 'Loading state',
      component: Button,
      props: {
        surface: 'primary',
        label: 'Loading',
        loading: true,
      },
    }),
  ],
);

// Custom content with slots
export const customContentVariants = createStoryGroup(
  'Custom Content',
  'Using slots for custom button content with icons and text',
  [
    createStory({
      title: 'Icon before text',
      component: Button,
      props: {
        surface: 'primary',
      },
      slots: {
        default: () => h(Fragment, [
          h(Icon, { icon: 'material-symbols:add', class: 'mr-2' }),
          'Add Item',
        ]),
      },
    }),
    createStory({
      title: 'Icon after text',
      component: Button,
      props: {
        surface: 'secondary',
      },
      slots: {
        default: () => h(Fragment, [
          'Settings',
          h(Icon, { icon: 'material-symbols:settings', class: 'ml-2' }),
        ]),
      },
    }),
  ],
);

// Export all button story groups
export const buttonStoryGroups: StoryGroup[] = [
  surfaceVariants,
  sizeVariants,
  stateVariants,
  customContentVariants,
];
