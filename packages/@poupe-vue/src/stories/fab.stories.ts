import type { StoryGroup } from '../components/story/types';
import { createStory, createStoryGroup } from '../components/story/utils';
import { Fab } from '../components';
import type { FabMenuItem } from '../components';

// Sample menu items
const sampleItems: FabMenuItem[] = [
  {
    key: 'add',
    icon: 'mdi:plus-circle',
    label: 'Add Item',
  },
  {
    key: 'edit',
    icon: 'mdi:pencil',
    label: 'Edit',
  },
  {
    key: 'share',
    icon: 'mdi:share',
    label: 'Share',
  },
];

// Basic FAB examples
export const basicExamples = createStoryGroup(
  'Basic Examples',
  'Floating Action Button with menu',
  [
    createStory({
      title: 'Default FAB',
      component: Fab,
      props: {
        items: sampleItems,
      },
      wrapperClass: 'relative h-64 w-full bg-surface-container rounded-lg [&_.fixed]:!absolute',
    }),
    createStory({
      title: 'Custom Icons',
      component: Fab,
      props: {
        icon: 'mdi:menu',
        closeIcon: 'mdi:close',
        items: sampleItems,
      },
      wrapperClass: 'relative h-64 w-full bg-surface-container rounded-lg [&_.fixed]:!absolute',
    }),
    createStory({
      title: 'Secondary Variant',
      component: Fab,
      props: {
        variant: 'secondary',
        items: sampleItems,
      },
      wrapperClass: 'relative h-64 w-full bg-surface-container rounded-lg [&_.fixed]:!absolute',
    }),
  ],
);

// Position examples
export const positionExamples = createStoryGroup(
  'Position Examples',
  'FAB positioning options',
  [
    createStory({
      title: 'Bottom Right (Default)',
      component: Fab,
      props: {
        position: 'bottom-right',
        items: sampleItems.slice(0, 2),
      },
      wrapperClass: 'relative h-48 w-full bg-surface-container-low rounded-lg [&_.fixed]:!absolute',
    }),
    createStory({
      title: 'Bottom Left',
      component: Fab,
      props: {
        position: 'bottom-left',
        items: sampleItems.slice(0, 2),
      },
      wrapperClass: 'relative h-48 w-full bg-surface-container-low rounded-lg [&_.fixed]:!absolute',
    }),
    createStory({
      title: 'Top Right',
      component: Fab,
      props: {
        position: 'top-right',
        items: sampleItems.slice(0, 2),
      },
      wrapperClass: 'relative h-48 w-full bg-surface-container-low rounded-lg [&_.fixed]:!absolute',
    }),
    createStory({
      title: 'Top Left',
      component: Fab,
      props: {
        position: 'top-left',
        items: sampleItems.slice(0, 2),
      },
      wrapperClass: 'relative h-48 w-full bg-surface-container-low rounded-lg [&_.fixed]:!absolute',
    }),
  ],
);

// Different menu configurations
export const menuConfigurations = createStoryGroup(
  'Menu Configurations',
  'Various menu item configurations',
  [
    createStory({
      title: 'Single Action',
      component: Fab,
      props: {
        items: [
          {
            key: 'camera',
            icon: 'mdi:camera',
            label: 'Take Photo',
          },
        ],
      },
      wrapperClass: 'relative h-64 w-full bg-surface-container rounded-lg [&_.fixed]:!absolute',
    }),
    createStory({
      title: 'Mixed Variants',
      component: Fab,
      props: {
        items: [
          {
            key: 'primary',
            icon: 'mdi:star',
            label: 'Primary Action',
            variant: 'primary',
          },
          {
            key: 'secondary',
            icon: 'mdi:heart',
            label: 'Secondary Action',
            variant: 'secondary',
          },
          {
            key: 'error',
            icon: 'mdi:delete',
            label: 'Delete',
            variant: 'error',
          },
        ],
      },
      wrapperClass: 'relative h-64 w-full bg-surface-container rounded-lg [&_.fixed]:!absolute',
    }),
    createStory({
      title: 'No Menu Items',
      component: Fab,
      props: {
        items: [],
      },
      wrapperClass: 'relative h-64 w-full bg-surface-container rounded-lg [&_.fixed]:!absolute',
    }),
  ],
);

// Custom offset example
export const customOffset = createStoryGroup(
  'Custom Offset',
  'Adjust distance from edge',
  [
    createStory({
      title: 'Small Offset',
      component: Fab,
      props: {
        offset: 0.5,
        items: sampleItems.slice(0, 2),
      },
      wrapperClass: 'relative h-48 w-full bg-surface-container rounded-lg [&_.fixed]:!absolute',
    }),
    createStory({
      title: 'Large Offset',
      component: Fab,
      props: {
        offset: 3,
        items: sampleItems.slice(0, 2),
      },
      wrapperClass: 'relative h-48 w-full bg-surface-container rounded-lg [&_.fixed]:!absolute',
    }),
  ],
);

// Initially open example
export const initiallyOpen = createStoryGroup(
  'Initial State',
  'FAB menu initially open',
  [
    createStory({
      title: 'Menu Open',
      component: Fab,
      props: {
        modelValue: true,
        items: sampleItems,
      },
      wrapperClass: 'relative h-64 w-full bg-surface-container rounded-lg [&_.fixed]:!absolute',
    }),
  ],
);

// Export all story groups
export const fabStoryGroups: StoryGroup[] = [
  basicExamples,
  positionExamples,
  menuConfigurations,
  customOffset,
  initiallyOpen,
];
