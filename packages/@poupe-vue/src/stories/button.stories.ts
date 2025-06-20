import type { StoryGroup } from '../components/story/types';
import { createStory, createStoryGroup } from '../components/story/utils';
import { Button } from '../components';

// Default button
const defaultButton = createStory({
  title: 'Default Button',
  component: Button,
  props: {
    label: 'Click me',
  },
});

// MD3 Button Types
export const typeVariants = createStoryGroup(
  'Button Types',
  'Material Design 3 button types',
  ['text', 'outlined', 'filled', 'elevated', 'tonal'].map(type =>
    createStory({
      title: `${type} button`,
      component: Button,
      props: {
        type,
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} Button`,
      },
    }),
  ),
);

// Color variants
export const colorVariants = createStoryGroup(
  'Color Variants',
  'Semantic color variants for buttons',
  ['base', 'primary', 'secondary', 'tertiary', 'error'].map(variant =>
    createStory({
      title: `${variant} variant`,
      component: Button,
      props: {
        variant,
        label: `${variant.charAt(0).toUpperCase() + variant.slice(1)}`,
      },
    }),
  ),
);

// Type and variant combinations
export const typeColorCombinations = createStoryGroup(
  'Type & Color Combinations',
  'All button type and color variant combinations',
  ['text', 'outlined', 'filled', 'elevated', 'tonal'].flatMap(type =>
    ['base', 'primary', 'secondary', 'tertiary', 'error'].map(variant =>
      createStory({
        title: `${type} ${variant}`,
        component: Button,
        props: {
          type,
          variant,
          label: `${type} ${variant}`,
        },
      }),
    ),
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
        variant: 'primary',
        label: `Size ${size}`,
      },
    }),
  ),
);

// Shape variants (replacing border variants)
export const shapeVariants = createStoryGroup(
  'Shape Variants',
  'Different button shapes',
  ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full'].map(shape =>
    createStory({
      title: `Shape ${shape}`,
      component: Button,
      props: {
        shape,
        variant: 'primary',
        label: `Shape ${shape}`,
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
        type: 'elevated',
        label: `Shadow ${shadow}`,
      },
    }),
  ),
);

// States
export const states = createStoryGroup(
  'Button States',
  'Different button states and behaviors',
  [
    createStory({
      title: 'Normal',
      component: Button,
      props: {
        variant: 'primary',
        label: 'Normal',
      },
    }),
    createStory({
      title: 'Loading',
      component: Button,
      props: {
        loading: true,
        variant: 'primary',
        label: 'Loading...',
      },
    }),
    createStory({
      title: 'Disabled',
      component: Button,
      props: {
        disabled: true,
        variant: 'primary',
        label: 'Disabled',
      },
    }),
    createStory({
      title: 'Expanded',
      component: Button,
      props: {
        expand: true,
        variant: 'primary',
        label: 'Full Width',
      },
    }),
    createStory({
      title: 'With Ellipsis',
      component: Button,
      props: {
        ellipsis: true,
        variant: 'primary',
        label: 'Long text that might overflow',
      },
    }),
  ],
);

// Icon examples
export const iconExamples = createStoryGroup(
  'Icon Examples',
  'Buttons with leading and trailing icons',
  [
    createStory({
      title: 'Leading Icon',
      component: Button,
      props: {
        type: 'filled',
        variant: 'primary',
        icon: 'mdi:plus',
        label: 'Add Item',
      },
    }),
    createStory({
      title: 'Trailing Icon',
      component: Button,
      props: {
        type: 'outlined',
        variant: 'primary',
        trailingIcon: 'mdi:arrow-right',
        label: 'Next',
      },
    }),
    createStory({
      title: 'Both Icons',
      component: Button,
      props: {
        type: 'tonal',
        variant: 'secondary',
        icon: 'mdi:cloud',
        trailingIcon: 'mdi:download',
        label: 'Download',
      },
    }),
    createStory({
      title: 'Loading with Icon',
      component: Button,
      props: {
        type: 'filled',
        variant: 'primary',
        icon: 'mdi:upload',
        loading: true,
        label: 'Uploading',
      },
    }),
  ],
);

// FAB patterns
export const fabPatterns = createStoryGroup(
  'FAB Patterns',
  'Floating Action Button styles',
  [
    createStory({
      title: 'FAB',
      component: Button,
      props: {
        fab: true,
        variant: 'primary',
        icon: 'mdi:plus',
      },
    }),
    createStory({
      title: 'Small FAB',
      component: Button,
      props: {
        fab: true,
        size: 'sm',
        variant: 'secondary',
        icon: 'mdi:pencil',
      },
    }),
    createStory({
      title: 'Large FAB',
      component: Button,
      props: {
        fab: true,
        size: 'lg',
        variant: 'tertiary',
        icon: 'mdi:share',
      },
    }),
    createStory({
      title: 'Extended FAB',
      component: Button,
      props: {
        fab: true,
        extended: true,
        variant: 'primary',
        icon: 'mdi:plus',
        label: 'Add Item',
      },
    }),
    createStory({
      title: 'Surface FAB',
      component: Button,
      props: {
        fab: true,
        type: 'elevated',
        variant: 'base',
        icon: 'mdi:menu',
      },
    }),
  ],
);

// Icon button patterns
export const iconButtonPatterns = createStoryGroup(
  'Icon Button Patterns',
  'Icon-only button styles',
  [
    createStory({
      title: 'Standard Icon Button',
      component: Button,
      props: {
        iconButton: true,
        type: 'text',
        icon: 'mdi:heart',
      },
    }),
    createStory({
      title: 'Filled Icon Button',
      component: Button,
      props: {
        iconButton: true,
        type: 'filled',
        variant: 'primary',
        icon: 'mdi:star',
      },
    }),
    createStory({
      title: 'Tonal Icon Button',
      component: Button,
      props: {
        iconButton: true,
        type: 'tonal',
        variant: 'secondary',
        icon: 'mdi:bookmark',
      },
    }),
    createStory({
      title: 'Outlined Icon Button',
      component: Button,
      props: {
        iconButton: true,
        type: 'outlined',
        variant: 'tertiary',
        icon: 'mdi:share',
      },
    }),
    createStory({
      title: 'Toggle Icon Button',
      component: Button,
      props: {
        iconButton: true,
        toggle: true,
        pressed: false,
        type: 'text',
        icon: 'mdi:heart-outline',
      },
    }),
    createStory({
      title: 'Toggle Icon Button (Pressed)',
      component: Button,
      props: {
        iconButton: true,
        toggle: true,
        pressed: true,
        type: 'tonal',
        variant: 'error',
        icon: 'mdi:heart',
      },
    }),
  ],
);

// Complex examples
export const examples = createStoryGroup(
  'Complex Examples',
  'Real-world button usage examples',
  [
    createStory({
      title: 'Call to Action',
      component: Button,
      props: {
        type: 'filled',
        variant: 'primary',
        size: 'lg',
        shape: 'lg',
        shadow: 'z2',
        label: 'Get Started',
      },
    }),
    createStory({
      title: 'Danger Action',
      component: Button,
      props: {
        type: 'filled',
        variant: 'error',
        shadow: 'z1',
        label: 'Delete Account',
      },
    }),
    createStory({
      title: 'Social Login',
      component: Button,
      props: {
        type: 'outlined',
        variant: 'base',
        expand: true,
        icon: 'mdi:google',
        label: 'Continue with Google',
      },
    }),
    createStory({
      title: 'Loading Submit',
      component: Button,
      props: {
        type: 'filled',
        variant: 'primary',
        loading: true,
        label: 'Submitting',
        expand: true,
      },
    }),
    createStory({
      title: 'Navigation Button',
      component: Button,
      props: {
        type: 'text',
        variant: 'base',
        trailingIcon: 'mdi:arrow-right',
        label: 'Learn More',
      },
    }),
    createStory({
      title: 'Chip Selection',
      component: Button,
      props: {
        type: 'tonal',
        variant: 'primary',
        shape: 'full',
        size: 'sm',
        icon: 'mdi:check',
        label: 'Selected',
      },
    }),
    createStory({
      title: 'Download Action',
      component: Button,
      props: {
        type: 'elevated',
        variant: 'secondary',
        icon: 'mdi:download',
        label: 'Download PDF',
      },
    }),
  ],
);

// Create default story group
const defaultStoryGroup = createStoryGroup(
  'Default',
  'Basic button usage',
  [defaultButton],
);

// Export all button story groups
export const buttonStoryGroups: StoryGroup[] = [
  defaultStoryGroup,
  typeVariants,
  colorVariants,
  typeColorCombinations,
  sizeVariants,
  shapeVariants,
  shadowVariants,
  states,
  iconExamples,
  fabPatterns,
  iconButtonPatterns,
  examples,
];
