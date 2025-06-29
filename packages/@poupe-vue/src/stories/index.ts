import type { StoryGroup } from '../components/story/types';
import { buttonStoryGroups } from './button.stories';
import { cardStoryGroups } from './card.stories';
import { fabStoryGroups } from './fab.stories';
import { iconStoryGroups } from './icon.stories';
import { inputStoryGroups } from './input.stories';
import { placeholderStoryGroups } from './placeholder.stories';
import { surfaceStoryGroups } from './surface.stories';

export interface ComponentStory {
  name: string
  storyGroups: StoryGroup[]
}

export const allComponentStories: ComponentStory[] = [
  {
    name: 'Button',
    storyGroups: buttonStoryGroups,
  },
  {
    name: 'Card',
    storyGroups: cardStoryGroups,
  },
  {
    name: 'FAB',
    storyGroups: fabStoryGroups,
  },
  {
    name: 'Icon',
    storyGroups: iconStoryGroups,
  },
  {
    name: 'Input',
    storyGroups: inputStoryGroups,
  },
  {
    name: 'Placeholder',
    storyGroups: placeholderStoryGroups,
  },
  {
    name: 'Surface',
    storyGroups: surfaceStoryGroups,
  },
];
