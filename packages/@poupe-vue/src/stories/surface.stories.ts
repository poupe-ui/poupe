import type { StoryGroup } from '../components/story/types';
import { createStory, createStoryGroup } from '../components/story/utils';
import Surface from '../components/surface/surface.vue';

const Default = createStory({
  title: 'Default Surface',
  component: Surface,
  props: { class: 'p-6' },
  slots: {
    default: `<h3 class="text-lg font-semibold mb-2">Default Surface</h3>
      <p class="text-sm text-secondary">
        This is a surface component with default elevation (z1) and shape (medium).
      </p>`,
  },
});

const Elevations = createStoryGroup(
  'Elevation Levels',
  'Different elevation levels for depth hierarchy',
  [
    createStory({
      title: 'z0 - No elevation',
      component: Surface,
      props: { elevation: 'z0', class: 'p-6' },
      slots: {
        default: `<div class="text-center">
            <div class="text-2xl font-bold mb-1">z0</div>
            <div class="text-sm text-secondary">No elevation</div>
          </div>`,
      },
    }),
    createStory({
      title: 'z1 - Low elevation',
      component: Surface,
      props: { elevation: 'z1', class: 'p-6' },
      slots: {
        default: `<div class="text-center">
            <div class="text-2xl font-bold mb-1">z1</div>
            <div class="text-sm text-secondary">Low elevation (default)</div>
          </div>`,
      },
    }),
    createStory({
      title: 'z2 - Medium-low elevation',
      component: Surface,
      props: { elevation: 'z2', class: 'p-6' },
      slots: {
        default: `<div class="text-center">
            <div class="text-2xl font-bold mb-1">z2</div>
            <div class="text-sm text-secondary">Medium-low elevation</div>
          </div>`,
      },
    }),
    createStory({
      title: 'z3 - Medium elevation',
      component: Surface,
      props: { elevation: 'z3', class: 'p-6' },
      slots: {
        default: `<div class="text-center">
            <div class="text-2xl font-bold mb-1">z3</div>
            <div class="text-sm text-secondary">Medium elevation</div>
          </div>`,
      },
    }),
    createStory({
      title: 'z4 - Medium-high elevation',
      component: Surface,
      props: { elevation: 'z4', class: 'p-6' },
      slots: {
        default: `<div class="text-center">
            <div class="text-2xl font-bold mb-1">z4</div>
            <div class="text-sm text-secondary">Medium-high elevation</div>
          </div>`,
      },
    }),
    createStory({
      title: 'z5 - High elevation',
      component: Surface,
      props: { elevation: 'z5', class: 'p-6' },
      slots: {
        default: `<div class="text-center">
            <div class="text-2xl font-bold mb-1">z5</div>
            <div class="text-sm text-secondary">High elevation</div>
          </div>`,
      },
    }),
  ],
);

const Shapes = createStoryGroup(
  'Shape Variants',
  'Material Design 3 shape system tokens',
  [
    createStory({
      title: 'shape-none',
      component: Surface,
      props: { shape: 'shape-none', class: 'p-6' },
      slots: {
        default: '<div class="text-center">No rounding</div>',
      },
    }),
    createStory({
      title: 'shape-extra-small',
      component: Surface,
      props: { shape: 'shape-extra-small', class: 'p-6' },
      slots: {
        default: '<div class="text-center">Extra small (4dp)</div>',
      },
    }),
    createStory({
      title: 'shape-small',
      component: Surface,
      props: { shape: 'shape-small', class: 'p-6' },
      slots: {
        default: '<div class="text-center">Small (8dp)</div>',
      },
    }),
    createStory({
      title: 'shape-medium',
      component: Surface,
      props: { shape: 'shape-medium', class: 'p-6' },
      slots: {
        default: '<div class="text-center">Medium (12dp)</div>',
      },
    }),
    createStory({
      title: 'shape-large',
      component: Surface,
      props: { shape: 'shape-large', class: 'p-6' },
      slots: {
        default: '<div class="text-center">Large (16dp)</div>',
      },
    }),
    createStory({
      title: 'shape-extra-large',
      component: Surface,
      props: { shape: 'shape-extra-large', class: 'p-6' },
      slots: {
        default: '<div class="text-center">Extra large (28dp)</div>',
      },
    }),
    createStory({
      title: 'shape-full',
      component: Surface,
      props: { shape: 'shape-full', class: 'p-6 aspect-square flex items-center justify-center' },
      slots: {
        default: '<div class="text-center">Full</div>',
      },
    }),
  ],
);

const Colors = createStoryGroup(
  'Color Variants',
  'Surface color options for different contexts',
  [
    createStory({
      title: 'surface',
      component: Surface,
      props: { color: 'surface', class: 'p-6' },
      slots: { default: 'Default surface' },
    }),
    createStory({
      title: 'surface-dim',
      component: Surface,
      props: { color: 'surface-dim', class: 'p-6' },
      slots: { default: 'Dim surface' },
    }),
    createStory({
      title: 'surface-bright',
      component: Surface,
      props: { color: 'surface-bright', class: 'p-6' },
      slots: { default: 'Bright surface' },
    }),
    createStory({
      title: 'surface-container-lowest',
      component: Surface,
      props: { color: 'surface-container-lowest', class: 'p-6' },
      slots: { default: 'Container lowest' },
    }),
    createStory({
      title: 'surface-container',
      component: Surface,
      props: { color: 'surface-container', class: 'p-6' },
      slots: { default: 'Container' },
    }),
    createStory({
      title: 'surface-container-highest',
      component: Surface,
      props: { color: 'surface-container-highest', class: 'p-6' },
      slots: { default: 'Container highest' },
    }),
    createStory({
      title: 'primary',
      component: Surface,
      props: { color: 'primary', class: 'p-6' },
      slots: { default: 'Primary surface' },
    }),
    createStory({
      title: 'secondary',
      component: Surface,
      props: { color: 'secondary', class: 'p-6' },
      slots: { default: 'Secondary surface' },
    }),
    createStory({
      title: 'tertiary',
      component: Surface,
      props: { color: 'tertiary', class: 'p-6' },
      slots: { default: 'Tertiary surface' },
    }),
    createStory({
      title: 'error',
      component: Surface,
      props: { color: 'error', class: 'p-6' },
      slots: { default: 'Error surface' },
    }),
  ],
);

const Interactive = createStoryGroup(
  'Interactive Surfaces',
  'Surfaces with hover, focus, and active states',
  [
    createStory({
      title: 'Interactive Surface Container',
      component: Surface,
      props: { interactive: true, color: 'surface-container', class: 'p-6 cursor-pointer' },
      slots: {
        default: `<h3 class="text-lg font-semibold mb-2">Interactive Surface</h3>
        <p class="text-sm text-secondary">
          Click or hover to see the interactive states.
        </p>`,
      },
    }),
    createStory({
      title: 'Interactive Primary',
      component: Surface,
      props: { interactive: true, color: 'primary', class: 'p-6 cursor-pointer' },
      slots: {
        default: `<h3 class="text-lg font-semibold mb-2">Interactive Primary</h3>
        <p class="text-sm">
          Primary colored interactive surface.
        </p>`,
      },
    }),
  ],
);

const CustomTags = createStoryGroup(
  'Custom HTML Tags',
  'Using semantic HTML elements',
  [
    createStory({
      title: 'Article Tag',
      component: Surface,
      props: { tag: 'article', elevation: 'z2', class: 'p-6' },
      slots: {
        default: `<h3 class="text-lg font-semibold mb-2">Article Surface</h3>
        <p class="text-sm text-secondary">
          Using article tag for semantic HTML.
        </p>`,
      },
    }),
    createStory({
      title: 'Section Tag',
      component: Surface,
      props: { tag: 'section', elevation: 'z1', color: 'surface-container', class: 'p-6' },
      slots: {
        default: `<h3 class="text-lg font-semibold mb-2">Section Surface</h3>
        <p class="text-sm text-secondary">
          Using section tag for page sections.
        </p>`,
      },
    }),
  ],
);

const Composition = createStoryGroup(
  'Composition Examples',
  'Complex layouts using multiple surfaces',
  [
    createStory({
      title: 'Nested Surfaces',
      component: Surface,
      wrapperClass: 'max-w-md mx-auto',
      props: { elevation: 'z2', shape: 'shape-large', class: 'p-8' },
      slots: {
        default: `<p-surface elevation="z0" shape="shape-medium" color="surface-container" class="p-4 mb-4">
        <h3 class="text-lg font-semibold">Nested Surfaces</h3>
        <p class="text-sm text-secondary mt-2">
          Surfaces can be nested to create depth hierarchy.
        </p>
      </p-surface>
      
      <div class="grid grid-cols-2 gap-4">
        <p-surface elevation="z1" shape="shape-small" color="primary" class="p-4 text-center">
          <div class="text-2xl mb-1">42</div>
          <div class="text-sm">Active</div>
        </p-surface>
        
        <p-surface elevation="z1" shape="shape-small" color="tertiary" class="p-4 text-center">
          <div class="text-2xl mb-1">128</div>
          <div class="text-sm">Total</div>
        </p-surface>
      </div>`,
      },
    }),
  ],
);

// Also create a single default story group
const defaultStoryGroup = createStoryGroup(
  'Default',
  'Basic surface component usage',
  [Default],
);

// Export all surface story groups
export const surfaceStoryGroups: StoryGroup[] = [
  defaultStoryGroup,
  Elevations,
  Shapes,
  Colors,
  Interactive,
  CustomTags,
  Composition,
];
