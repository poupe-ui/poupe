import { h, Fragment } from 'vue';
import type { StoryGroup } from '../components/story/types';
import { createStory, createStoryGroup } from '../components/story/utils';
import { Button, Icon } from '../components';

// Surface variants
export const surfaceVariants = createStoryGroup(
  'Surface Variants',
  'Different surface colors for various button purposes',
  [
    // Standard surfaces
    ...['base', 'primary', 'secondary', 'tertiary', 'error'].map(surface =>
      createStory({
        title: `${surface} surface`,
        component: Button,
        props: {
          surface,
          label: `${surface} Button`,
        },
      }),
    ),
    // Container surfaces
    ...['lowest', 'low', 'high', 'highest'].map(surface =>
      createStory({
        title: `${surface} surface`,
        component: Button,
        props: {
          surface,
          label: `${surface} Container`,
        },
      }),
    ),
    // Color container surfaces
    ...['primary-container', 'secondary-container', 'tertiary-container', 'error-container'].map(surface =>
      createStory({
        title: `${surface}`,
        component: Button,
        props: {
          surface,
          label: surface.replace('-', ' '),
        },
      }),
    ),
    // Fixed surfaces
    ...['primary-fixed', 'secondary-fixed', 'tertiary-fixed'].map(surface =>
      createStory({
        title: `${surface}`,
        component: Button,
        props: {
          surface,
          label: surface.replace('-', ' '),
        },
      }),
    ),
    // Inverse surface
    createStory({
      title: 'inverse surface',
      component: Button,
      props: {
        surface: 'inverse',
        label: 'Inverse Button',
      },
    }),
  ],
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

// Border variants
export const borderVariants = createStoryGroup(
  'Border Variants',
  'Different border styles for buttons',
  ['none', 'current', 'primary', 'secondary', 'tertiary', 'error', 'outline'].map(border =>
    createStory({
      title: `Border ${border}`,
      component: Button,
      props: {
        border,
        surface: border === 'none' ? 'primary' : 'base',
        label: `Border ${border}`,
      },
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
      component: Button,
      props: {
        rounded,
        surface: 'primary',
        label: `Rounded ${rounded}`,
      },
    }),
  ),
);

// Shadow variants
export const shadowVariants = createStoryGroup(
  'Shadow Variants',
  'Different shadow elevations following Material Design',
  ['none', 'z1', 'z2', 'z3', 'z4', 'z5'].map(shadow =>
    createStory({
      title: `Shadow ${shadow}`,
      component: Button,
      props: {
        shadow,
        surface: 'base',
        label: `Shadow ${shadow}`,
      },
    }),
  ),
);

// Expand variant
export const expandVariants = createStoryGroup(
  'Expand Variants',
  'Full width button examples',
  [
    createStory({
      title: 'Normal width',
      component: Button,
      props: {
        surface: 'primary',
        label: 'Normal Button',
        expand: false,
      },
    }),
    createStory({
      title: 'Full width',
      component: Button,
      props: {
        surface: 'primary',
        label: 'Full Width Button',
        expand: true,
      },
    }),
  ],
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
    createStory({
      title: 'Icon only',
      component: Button,
      props: {
        surface: 'tertiary',
        rounded: 'full',
        size: 'base',
      },
      slots: {
        default: () => h(Icon, { icon: 'material-symbols:favorite' }),
      },
    }),
    createStory({
      title: 'With ellipsis',
      component: Button,
      props: {
        surface: 'primary',
        label: 'Loading',
        ellipsis: true,
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
      title: 'Primary action button',
      component: Button,
      props: {
        surface: 'primary',
        size: 'lg',
        rounded: 'md',
        shadow: 'z2',
        label: 'Get Started',
      },
    }),
    createStory({
      title: 'Secondary outlined',
      component: Button,
      props: {
        surface: 'base',
        border: 'secondary',
        size: 'base',
        rounded: 'sm',
        label: 'Learn More',
      },
    }),
    createStory({
      title: 'Error action',
      component: Button,
      props: {
        surface: 'error',
        size: 'sm',
        rounded: 'lg',
        label: 'Delete',
      },
    }),
    createStory({
      title: 'Floating action button',
      component: Button,
      props: {
        surface: 'primary',
        rounded: 'full',
        shadow: 'z3',
        size: 'lg',
      },
      slots: {
        default: () => h(Icon, { icon: 'material-symbols:add', class: 'text-xl' }),
      },
    }),
    createStory({
      title: 'Text button',
      component: Button,
      props: {
        surface: 'base',
        shadow: 'none',
        border: 'none',
        size: 'base',
        label: 'Cancel',
      },
    }),
    createStory({
      title: 'Chip-like button',
      component: Button,
      props: {
        surface: 'primary-container',
        rounded: 'full',
        size: 'sm',
        border: 'primary',
      },
      slots: {
        default: () => h(Fragment, [
          h(Icon, { icon: 'material-symbols:check-circle', class: 'mr-1' }),
          'Selected',
        ]),
      },
    }),
  ],
);

// Export all button story groups
export const buttonStoryGroups: StoryGroup[] = [
  surfaceVariants,
  sizeVariants,
  borderVariants,
  roundedVariants,
  shadowVariants,
  expandVariants,
  stateVariants,
  customContentVariants,
  combinationVariants,
];
