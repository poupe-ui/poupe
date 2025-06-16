import type { StoryGroup } from '../components/story/types';
import { createStory, createStoryGroup } from '../components/story/utils';
import { Input } from '../components/input';

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

export const inputStoryGroups: StoryGroup[] = [
  basicVariants,
  stateVariants,
  typeVariants,
  helperTextVariants,
];
