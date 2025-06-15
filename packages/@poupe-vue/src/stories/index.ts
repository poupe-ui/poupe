import type { StoryGroup } from '../components/story/types';

export interface ComponentStory {
  name: string
  storyGroups: StoryGroup[]
}

export const allComponentStories: ComponentStory[] = [];
