import type { StoryGroup } from '../components/story/types';
import { createStory, createStoryGroup } from '../components/story/utils';
import { Input } from '../components';

// Basic input variants
export const basicVariants = createStoryGroup(
  'Basic Inputs',
  'Different input configurations',
  [
    createStory({
      title: 'Basic Input',
      component: Input,
      props: {
        label: 'Username',
        modelValue: '',
      },
    }),
    createStory({
      title: 'Input with Placeholder',
      component: Input,
      props: {
        label: 'Email',
        placeholder: 'email@example.com',
        modelValue: '',
      },
    }),
    createStory({
      title: 'Required Input',
      component: Input,
      props: {
        label: 'Password',
        required: true,
        type: 'password',
        modelValue: '',
      },
    }),
  ],
);

// Input states
export const stateVariants = createStoryGroup(
  'Input States',
  'Different input states',
  [
    createStory({
      title: 'Normal State',
      component: Input,
      props: {
        label: 'Normal Input',
        modelValue: 'Some text',
      },
    }),
    createStory({
      title: 'Disabled State',
      component: Input,
      props: {
        label: 'Disabled Input',
        disabled: true,
        modelValue: 'Cannot edit this',
      },
    }),
    createStory({
      title: 'Read-only State',
      component: Input,
      props: {
        label: 'Read-only Input',
        readonly: true,
        modelValue: 'Read-only value',
      },
    }),
    createStory({
      title: 'Error State',
      component: Input,
      props: {
        label: 'Error Input',
        error: true,
        modelValue: 'Invalid value',
        helperText: 'Please enter a valid value',
      },
    }),
  ],
);

// Input types
export const typeVariants = createStoryGroup(
  'Input Types',
  'Different HTML input types',
  [
    createStory({
      title: 'Text Input',
      component: Input,
      props: {
        label: 'Text',
        type: 'text',
        modelValue: '',
      },
    }),
    createStory({
      title: 'Email Input',
      component: Input,
      props: {
        label: 'Email',
        type: 'email',
        placeholder: 'user@example.com',
        modelValue: '',
      },
    }),
    createStory({
      title: 'Number Input',
      component: Input,
      props: {
        label: 'Age',
        type: 'number',
        min: 0,
        max: 120,
        modelValue: '',
      },
    }),
    createStory({
      title: 'Date Input',
      component: Input,
      props: {
        label: 'Date of Birth',
        type: 'date',
        modelValue: '',
      },
    }),
    createStory({
      title: 'Search Input',
      component: Input,
      props: {
        label: 'Search',
        type: 'search',
        placeholder: 'Search...',
        modelValue: '',
      },
    }),
  ],
);

// Input with helper text
export const helperTextVariants = createStoryGroup(
  'Helper Text',
  'Inputs with helper or error text',
  [
    createStory({
      title: 'With Helper Text',
      component: Input,
      props: {
        label: 'Username',
        helperText: 'Choose a unique username',
        modelValue: '',
      },
    }),
    createStory({
      title: 'With Character Counter',
      component: Input,
      props: {
        label: 'Bio',
        helperText: '0/200 characters',
        maxlength: 200,
        modelValue: '',
      },
    }),
  ],
);

// Surface variants
export const surfaceVariants = createStoryGroup(
  'Surface Variants',
  'Different surface colors for input fields',
  ['base', 'lowest', 'low', 'high', 'highest'].map(surface =>
    createStory({
      title: `Surface ${surface}`,
      component: Input,
      props: {
        label: `${surface} Surface`,
        surface,
        modelValue: 'Sample text',
      },
    }),
  ),
);

// Border variants
export const borderVariants = createStoryGroup(
  'Border Variants',
  'Different border styles for input fields',
  ['none', 'current', 'primary', 'secondary', 'tertiary', 'error', 'outline'].map(border =>
    createStory({
      title: `Border ${border}`,
      component: Input,
      props: {
        label: `${border} Border`,
        border,
        surface: border === 'none' ? 'low' : 'base',
        modelValue: '',
      },
    }),
  ),
);

// Outline variants (focus)
export const outlineVariants = createStoryGroup(
  'Outline Variants',
  'Different outline colors when focused',
  ['none', 'current', 'primary', 'secondary', 'tertiary', 'error', 'outline'].map(outline =>
    createStory({
      title: `Outline ${outline}`,
      component: Input,
      props: {
        label: `${outline} Outline (focus me)`,
        outline,
        modelValue: '',
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
      component: Input,
      props: {
        label: `Rounded ${rounded}`,
        rounded,
        modelValue: '',
      },
    }),
  ),
);

// Padding variants
export const paddingVariants = createStoryGroup(
  'Padding Variants',
  'Different padding sizes',
  [0, 1, 2, 3, 4].map(padding =>
    createStory({
      title: `Padding ${padding}`,
      component: Input,
      props: {
        label: `Padding ${padding}`,
        padding,
        modelValue: 'Sample text',
      },
    }),
  ),
);

// Expand variant
export const expandVariants = createStoryGroup(
  'Expand Variants',
  'Full width input examples',
  [
    createStory({
      title: 'Normal width',
      component: Input,
      props: {
        label: 'Normal Input',
        expand: false,
        modelValue: '',
      },
    }),
    createStory({
      title: 'Full width',
      component: Input,
      props: {
        label: 'Full Width Input',
        expand: true,
        modelValue: '',
      },
    }),
  ],
);

// Icon variants
export const iconVariants = createStoryGroup(
  'Icon Variants',
  'Inputs with icons',
  [
    createStory({
      title: 'Icon Start',
      component: Input,
      props: {
        label: 'Search',
        iconStart: 'material-symbols:search',
        placeholder: 'Search...',
        modelValue: '',
      },
    }),
    createStory({
      title: 'Icon End',
      component: Input,
      props: {
        label: 'Email',
        iconEnd: 'material-symbols:mail',
        type: 'email',
        placeholder: 'user@example.com',
        modelValue: '',
      },
    }),
    createStory({
      title: 'Icons on Both Sides',
      component: Input,
      props: {
        label: 'Phone',
        iconStart: 'material-symbols:phone',
        iconEnd: 'material-symbols:check-circle',
        placeholder: '+1 (555) 123-4567',
        modelValue: '',
      },
    }),
  ],
);

// Unit variants
export const unitVariants = createStoryGroup(
  'Unit Variants',
  'Inputs with unit labels',
  [
    createStory({
      title: 'Currency Unit',
      component: Input,
      props: {
        label: 'Price',
        unit: 'USD',
        type: 'number',
        modelValue: '99.99',
      },
    }),
    createStory({
      title: 'Weight Unit',
      component: Input,
      props: {
        label: 'Weight',
        unit: 'kg',
        type: 'number',
        modelValue: '75',
      },
    }),
    createStory({
      title: 'Percentage Unit',
      component: Input,
      props: {
        label: 'Discount',
        unit: '%',
        type: 'number',
        min: 0,
        max: 100,
        modelValue: '15',
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
      title: 'Search Box',
      component: Input,
      props: {
        label: 'Search',
        type: 'search',
        iconStart: 'material-symbols:search',
        rounded: 'full',
        surface: 'low',
        border: 'none',
        placeholder: 'Search products...',
        expand: true,
        modelValue: '',
      },
    }),
    createStory({
      title: 'Password with Toggle',
      component: Input,
      props: {
        label: 'Password',
        type: 'password',
        iconStart: 'material-symbols:lock',
        iconEnd: 'material-symbols:visibility',
        required: true,
        helperText: 'Must be at least 8 characters',
        modelValue: '',
      },
    }),
    createStory({
      title: 'Credit Card',
      component: Input,
      props: {
        label: 'Card Number',
        iconStart: 'material-symbols:credit-card',
        placeholder: '1234 5678 9012 3456',
        maxlength: 19,
        modelValue: '',
      },
    }),
    createStory({
      title: 'Amount with Currency',
      component: Input,
      props: {
        label: 'Amount',
        type: 'number',
        iconStart: 'material-symbols:attach-money',
        unit: 'USD',
        border: 'primary',
        surface: 'primary-container',
        modelValue: '0.00',
      },
    }),
    createStory({
      title: 'Error Field',
      component: Input,
      props: {
        label: 'Username',
        error: true,
        border: 'error',
        outline: 'error',
        iconEnd: 'material-symbols:error',
        helperText: 'This username is already taken',
        modelValue: 'johndoe',
      },
    }),
    createStory({
      title: 'Compact Form Field',
      component: Input,
      props: {
        label: 'Zip Code',
        padding: 1,
        rounded: 'sm',
        maxlength: 5,
        placeholder: '12345',
        modelValue: '',
      },
    }),
  ],
);

export const inputStoryGroups: StoryGroup[] = [
  basicVariants,
  stateVariants,
  typeVariants,
  helperTextVariants,
  surfaceVariants,
  borderVariants,
  outlineVariants,
  roundedVariants,
  paddingVariants,
  expandVariants,
  iconVariants,
  unitVariants,
  combinationVariants,
];
