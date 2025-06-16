import type { StoryGroup } from '../components/story/types';
import { createStory, createStoryGroup } from '../components/story/utils';
import Card from '../components/card.vue';

// Basic card variants
export const basicVariants = createStoryGroup(
  'Basic Cards',
  'Different card configurations',
  [
    createStory({
      title: 'Simple Card',
      component: Card,
      props: {
        title: 'Card Title',
      },
      slots: {
        default: 'This is the card content. It can contain any text or components.',
      },
    }),
    createStory({
      title: 'Card with Header and Footer',
      component: Card,
      props: {},
      slots: {
        header: 'Custom Header',
        default: 'Main content area',
        footer: 'Footer content',
      },
    }),
  ],
);

// Surface variants
export const surfaceVariants = createStoryGroup(
  'Surface Variants',
  'Cards with different surface colors',
  ['base', 'low', 'high', 'highest'].map(surface =>
    createStory({
      title: `Surface ${surface}`,
      component: Card,
      props: {
        surface,
        title: `${surface} Surface Card`,
      },
      slots: {
        default: `This card uses the ${surface} surface color.`,
      },
    }),
  ),
);

// Shadow variants
export const shadowVariants = createStoryGroup(
  'Shadow Variants',
  'Cards with different elevation shadows',
  ['none', 'z1', 'z2', 'z3', 'z4', 'z5'].map(shadow =>
    createStory({
      title: `Shadow ${shadow}`,
      component: Card,
      props: {
        shadow,
        title: `Shadow ${shadow}`,
      },
      slots: {
        default: `This card has ${shadow} elevation.`,
      },
    }),
  ),
);

export const cardStoryGroups: StoryGroup[] = [
  basicVariants,
  surfaceVariants,
  shadowVariants,
];
