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
        modelValue: '',
      },
      attrs: {
        placeholder: 'Enter text...',
      },
    }),
    createStory({
      title: 'Input with Placeholder',
      component: Input,
      props: {
        modelValue: '',
      },
      attrs: {
        placeholder: 'email@example.com',
      },
    }),
    createStory({
      title: 'Required Input',
      component: Input,
      props: {
        type: 'password',
        modelValue: '',
      },
      attrs: {
        required: true,
        placeholder: 'Enter password',
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
        modelValue: 'Some text',
      },
    }),
    createStory({
      title: 'Disabled State',
      component: Input,
      props: {
        modelValue: 'Cannot edit this',
      },
      attrs: {
        disabled: true,
      },
    }),
    createStory({
      title: 'Read-only State',
      component: Input,
      props: {
        modelValue: 'Read-only value',
      },
      attrs: {
        readonly: true,
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
        type: 'text',
        modelValue: '',
      },
      attrs: {
        placeholder: 'Enter text',
      },
    }),
    createStory({
      title: 'Email Input',
      component: Input,
      props: {
        type: 'email',
        modelValue: '',
      },
      attrs: {
        placeholder: 'user@example.com',
      },
    }),
    createStory({
      title: 'Number Input',
      component: Input,
      props: {
        type: 'number',
        modelValue: '',
      },
      attrs: {
        min: 0,
        max: 120,
        placeholder: 'Age',
      },
    }),
    createStory({
      title: 'Date Input',
      component: Input,
      props: {
        type: 'date',
        modelValue: '',
      },
    }),
    createStory({
      title: 'Search Input',
      component: Input,
      props: {
        type: 'search',
        modelValue: '',
      },
      attrs: {
        placeholder: 'Search...',
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
        border,
        surface: border === 'none' ? 'low' : 'base',
        modelValue: '',
      },
      attrs: {
        placeholder: `${border} border`,
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
        outline,
        modelValue: '',
      },
      attrs: {
        placeholder: `Focus me - ${outline} outline`,
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
        rounded,
        modelValue: '',
      },
      attrs: {
        placeholder: `Rounded ${rounded}`,
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
        expand: false,
        modelValue: '',
      },
      attrs: {
        placeholder: 'Normal width',
      },
    }),
    createStory({
      title: 'Full width',
      component: Input,
      props: {
        expand: true,
        modelValue: '',
      },
      attrs: {
        placeholder: 'Full width input',
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
        iconStart: 'material-symbols:search',
        modelValue: '',
      },
      attrs: {
        placeholder: 'Search...',
      },
    }),
    createStory({
      title: 'Icon End',
      component: Input,
      props: {
        iconEnd: 'material-symbols:mail',
        type: 'email',
        modelValue: '',
      },
      attrs: {
        placeholder: 'user@example.com',
      },
    }),
    createStory({
      title: 'Icons on Both Sides',
      component: Input,
      props: {
        iconStart: 'material-symbols:phone',
        iconEnd: 'material-symbols:check-circle',
        modelValue: '',
      },
      attrs: {
        placeholder: '+1 (555) 123-4567',
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
        unit: 'USD',
        type: 'number',
        modelValue: '99.99',
      },
    }),
    createStory({
      title: 'Weight Unit',
      component: Input,
      props: {
        unit: 'kg',
        type: 'number',
        modelValue: '75',
      },
    }),
    createStory({
      title: 'Percentage Unit',
      component: Input,
      props: {
        unit: '%',
        type: 'number',
        modelValue: '15',
      },
      attrs: {
        min: 0,
        max: 100,
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
        type: 'search',
        iconStart: 'material-symbols:search',
        rounded: 'full',
        surface: 'low',
        border: 'none',
        expand: true,
        modelValue: '',
      },
      attrs: {
        placeholder: 'Search products...',
      },
    }),
    createStory({
      title: 'Password with Toggle',
      component: Input,
      props: {
        type: 'password',
        iconStart: 'material-symbols:lock',
        modelValue: '',
      },
      attrs: {
        required: true,
        placeholder: 'Enter password',
      },
    }),
    createStory({
      title: 'Credit Card',
      component: Input,
      props: {
        iconStart: 'material-symbols:credit-card',
        modelValue: '',
      },
      attrs: {
        placeholder: '1234 5678 9012 3456',
        maxlength: 19,
      },
    }),
    createStory({
      title: 'Amount with Currency',
      component: Input,
      props: {
        type: 'number',
        iconStart: 'material-symbols:attach-money',
        unit: 'USD',
        border: 'primary',
        modelValue: '0.00',
      },
    }),
    createStory({
      title: 'Error State',
      component: Input,
      props: {
        border: 'error',
        outline: 'error',
        iconEnd: 'material-symbols:error',
        modelValue: 'johndoe',
      },
      attrs: {
        placeholder: 'Username',
      },
    }),
    createStory({
      title: 'Compact Form Field',
      component: Input,
      props: {
        padding: 1,
        rounded: 'sm',
        modelValue: '',
      },
      attrs: {
        maxlength: 5,
        placeholder: '12345',
      },
    }),
  ],
);

export const inputStoryGroups: StoryGroup[] = [
  basicVariants,
  stateVariants,
  typeVariants,
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
