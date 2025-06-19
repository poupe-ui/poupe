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

// MD3 Variants
export const variants = createStoryGroup(
  'Material Design 3 Variants',
  'Different button styles according to MD3 specifications',
  [
    createStory({
      title: 'Text Button',
      component: Button,
      props: {
        variant: 'text',
        label: 'Text Button',
      },
    }),
    createStory({
      title: 'Outlined Button',
      component: Button,
      props: {
        variant: 'outlined',
        label: 'Outlined Button',
      },
    }),
    createStory({
      title: 'Filled Button',
      component: Button,
      props: {
        variant: 'filled',
        label: 'Filled Button',
      },
    }),
    createStory({
      title: 'Elevated Button',
      component: Button,
      props: {
        variant: 'elevated',
        label: 'Elevated Button',
      },
    }),
    createStory({
      title: 'Tonal Button',
      component: Button,
      props: {
        variant: 'tonal',
        label: 'Tonal Button',
      },
    }),
  ],
);

// FAB Variants
export const fabVariants = createStoryGroup(
  'Floating Action Buttons',
  'FAB variants for primary actions',
  [
    createStory({
      title: 'FAB',
      component: Button,
      props: {
        fab: true,
        icon: 'mdi:plus',
        label: 'Add',
        surface: 'primary',
      },
    }),
    createStory({
      title: 'Small FAB',
      component: Button,
      props: {
        fab: true,
        size: 'sm',
        icon: 'mdi:plus',
        label: 'Add',
        surface: 'primary',
      },
    }),
    createStory({
      title: 'Large FAB',
      component: Button,
      props: {
        fab: true,
        size: 'lg',
        icon: 'mdi:plus',
        label: 'Add',
        surface: 'primary',
      },
    }),
    createStory({
      title: 'Extended FAB',
      component: Button,
      props: {
        fab: true,
        extended: true,
        icon: 'mdi:plus',
        label: 'Add Item',
        surface: 'primary',
      },
    }),
    createStory({
      title: 'Secondary FAB',
      component: Button,
      props: {
        fab: true,
        icon: 'mdi:pencil',
        label: 'Edit',
        surface: 'secondary',
      },
    }),
    createStory({
      title: 'Tertiary FAB',
      component: Button,
      props: {
        fab: true,
        icon: 'mdi:share',
        label: 'Share',
        surface: 'tertiary',
      },
    }),
  ],
);

// Icon Buttons
export const iconButtons = createStoryGroup(
  'Icon Buttons',
  'Icon-only buttons for compact actions',
  [
    createStory({
      title: 'Icon Button',
      component: Button,
      props: {
        iconButton: true,
        icon: 'mdi:heart',
        label: 'Favorite',
      },
    }),
    createStory({
      title: 'Small Icon Button',
      component: Button,
      props: {
        iconButton: true,
        icon: 'mdi:heart',
        label: 'Favorite',
        size: 'sm',
      },
    }),
    createStory({
      title: 'Large Icon Button',
      component: Button,
      props: {
        iconButton: true,
        icon: 'mdi:heart',
        label: 'Favorite',
        size: 'lg',
      },
    }),
    createStory({
      title: 'Filled Icon Button',
      component: Button,
      props: {
        iconButton: true,
        variant: 'filled',
        icon: 'mdi:heart',
        label: 'Favorite',
        surface: 'primary',
      },
    }),
    createStory({
      title: 'Tonal Icon Button',
      component: Button,
      props: {
        iconButton: true,
        variant: 'tonal',
        icon: 'mdi:heart',
        label: 'Favorite',
        surface: 'primary',
      },
    }),
    createStory({
      title: 'Outlined Icon Button',
      component: Button,
      props: {
        iconButton: true,
        variant: 'outlined',
        icon: 'mdi:heart',
        label: 'Favorite',
      },
    }),
  ],
);

// Toggle Buttons
export const toggleButtons = createStoryGroup(
  'Toggle Buttons',
  'Buttons with toggle state behavior',
  [
    createStory({
      title: 'Toggle Button',
      component: Button,
      props: {
        toggle: true,
        icon: 'mdi:format-bold',
        label: 'Bold',
      },
    }),
    createStory({
      title: 'Toggle Button Pressed',
      component: Button,
      props: {
        toggle: true,
        pressed: true,
        icon: 'mdi:format-bold',
        label: 'Bold',
      },
    }),
    createStory({
      title: 'Icon Toggle',
      component: Button,
      props: {
        iconButton: true,
        toggle: true,
        icon: 'mdi:star',
        label: 'Star',
      },
    }),
    createStory({
      title: 'Filled Toggle',
      component: Button,
      props: {
        variant: 'filled',
        toggle: true,
        icon: 'mdi:bookmark',
        label: 'Bookmark',
      },
    }),
  ],
);

// Buttons with Icons
export const withIcons = createStoryGroup(
  'Buttons with Icons',
  'Buttons featuring leading and trailing icons',
  [
    createStory({
      title: 'Leading Icon',
      component: Button,
      props: {
        icon: 'mdi:send',
        label: 'Send',
        variant: 'filled',
      },
    }),
    createStory({
      title: 'Trailing Icon',
      component: Button,
      props: {
        trailingIcon: 'mdi:arrow-right',
        label: 'Next',
        variant: 'filled',
      },
    }),
    createStory({
      title: 'Both Icons',
      component: Button,
      props: {
        icon: 'mdi:cloud',
        trailingIcon: 'mdi:check',
        label: 'Upload',
        variant: 'filled',
      },
    }),
  ],
);

// Surface/Color variants
export const surfaceVariants = createStoryGroup(
  'Surface Colors',
  'Different surface colors for various button purposes',
  [
    // Standard surfaces
    ...['primary', 'secondary', 'tertiary', 'error'].map(surface =>
      createStory({
        title: `${surface} surface`,
        component: Button,
        props: {
          surface,
          variant: 'filled',
          label: `${surface} Button`,
        },
      }),
    ),
    // Container surfaces
    ...['primary-container', 'secondary-container', 'tertiary-container', 'error-container'].map(surface =>
      createStory({
        title: `${surface}`,
        component: Button,
        props: {
          surface,
          variant: 'filled',
          label: surface.replace('-', ' '),
        },
      }),
    ),
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
        variant: 'filled',
        surface: 'primary',
        label: `Size ${size}`,
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
      title: 'Loading',
      component: Button,
      props: {
        loading: true,
        variant: 'filled',
        label: 'Loading...',
      },
    }),
    createStory({
      title: 'Disabled',
      component: Button,
      props: {
        disabled: true,
        variant: 'filled',
        label: 'Disabled',
      },
    }),
    createStory({
      title: 'Expanded',
      component: Button,
      props: {
        expand: true,
        variant: 'filled',
        label: 'Full Width',
      },
    }),
    createStory({
      title: 'With Ellipsis',
      component: Button,
      props: {
        ellipsis: true,
        variant: 'filled',
        label: 'Long text that might overflow',
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
        variant: 'filled',
        surface: 'primary',
        size: 'lg',
        icon: 'mdi:rocket-launch',
        label: 'Get Started',
      },
    }),
    createStory({
      title: 'Danger Action',
      component: Button,
      props: {
        variant: 'filled',
        surface: 'error',
        icon: 'mdi:delete',
        label: 'Delete Account',
      },
    }),
    createStory({
      title: 'Social Login',
      component: Button,
      props: {
        variant: 'outlined',
        icon: 'mdi:google',
        label: 'Continue with Google',
        expand: true,
      },
    }),
    createStory({
      title: 'Loading Submit',
      component: Button,
      props: {
        variant: 'filled',
        surface: 'primary',
        loading: true,
        label: 'Submitting',
        expand: true,
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
  variants,
  fabVariants,
  iconButtons,
  toggleButtons,
  withIcons,
  surfaceVariants,
  sizeVariants,
  states,
  examples,
];
