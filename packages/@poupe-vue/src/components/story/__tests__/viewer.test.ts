import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mountWithPoupe } from '../../__tests__/test-utils';
import { h, markRaw, type Component } from 'vue';
import StoryViewer from '../viewer.vue';

interface StorySlotProps {
  story: {
    name: string
    component?: Component
    description?: string
  }
}

describe('StoryViewer', () => {
  beforeEach(() => {
    // Reset hash before each test to prevent interference
    if (globalThis.location !== undefined) {
      globalThis.location.hash = '';
    }
  });

  afterEach(() => {
    // Clean up after each test
    if (globalThis.location !== undefined) {
      globalThis.location.hash = '';
    }
  });

  const mockStories = [
    {
      name: 'Story 1',
      component: markRaw({ template: '<div>Story 1 Content</div>' }),
      description: 'First story',
    },
    {
      name: 'Story 2',
      component: markRaw({ template: '<div>Story 2 Content</div>' }),
    },
    {
      name: 'Story 3',
      component: markRaw({ template: '<div>Story 3 Content</div>' }),
    },
  ];

  it('renders with stories', () => {
    const wrapper = mountWithPoupe(StoryViewer, {
      props: {
        stories: mockStories,
      },
    });

    expect(wrapper.find('h1').text()).toBe('Component Stories');
    expect(wrapper.find('nav').findAll('button')).toHaveLength(3);
  });

  it('displays story navigation buttons', () => {
    const wrapper = mountWithPoupe(StoryViewer, {
      props: {
        stories: mockStories,
      },
    });

    const buttons = wrapper.find('nav').findAll('button');
    expect(buttons[0].text()).toBe('Story 1');
    expect(buttons[1].text()).toBe('Story 2');
    expect(buttons[2].text()).toBe('Story 3');
  });

  it('shows first story by default', () => {
    const wrapper = mountWithPoupe(StoryViewer, {
      props: {
        stories: mockStories,
      },
    });

    expect(wrapper.html()).toContain('Story 1 Content');
  });

  it('uses defaultStory when provided', async () => {
    // Create a fresh set of stories for this test to avoid interference
    const testStories = [
      {
        name: 'Test Story 1',
        component: markRaw({ template: '<div>Test Story 1 Content</div>' }),
      },
      {
        name: 'Test Story 2',
        component: markRaw({ template: '<div>Test Story 2 Content</div>' }),
      },
    ];

    const wrapper = mountWithPoupe(StoryViewer, {
      props: {
        stories: testStories,
        defaultStory: 'Test Story 2',
      },
    });

    await wrapper.vm.$nextTick();

    // Check that Test Story 2 is selected in navigation
    const buttons = wrapper.find('nav').findAll('button');
    expect(buttons[1].classes()).toContain('bg-primary');

    // Check that Test Story 2 content is displayed
    expect(wrapper.html()).toContain('Test Story 2 Content');
  });

  it('switches stories on button click', async () => {
    const wrapper = mountWithPoupe(StoryViewer, {
      props: {
        stories: mockStories,
      },
    });

    const buttons = wrapper.find('nav').findAll('button');
    await buttons[1].trigger('click');

    expect(wrapper.html()).toContain('Story 2 Content');
    expect(wrapper.html()).not.toContain('Story 1 Content');
  });

  it('displays story description when available', async () => {
    // Use unique stories to avoid test interference
    const descriptionTestStories = [
      {
        name: 'Described Story',
        component: markRaw({ template: '<div>Described Story Content</div>' }),
        description: 'This story has a description',
      },
      {
        name: 'No Description Story',
        component: markRaw({ template: '<div>No Description Content</div>' }),
      },
    ];

    const wrapper = mountWithPoupe(StoryViewer, {
      props: {
        stories: descriptionTestStories,
      },
    });

    await wrapper.vm.$nextTick();

    // The story header is inside the main content area
    const storyDescription = wrapper.find('.text-on-surface-variant');
    expect(storyDescription.exists()).toBe(true);
    expect(storyDescription.text()).toBe('This story has a description');
  });

  it('uses custom title slot', () => {
    const wrapper = mountWithPoupe(StoryViewer, {
      props: {
        stories: mockStories,
      },
      slots: {
        title: 'Custom Stories Title',
      },
    });

    expect(wrapper.find('h1').text()).toBe('Custom Stories Title');
  });

  it('uses custom story slot', async () => {
    // Use unique stories to avoid test interference
    const slotTestStories = [
      {
        name: 'Slot Test Story',
        component: markRaw({ template: '<div>Should not be visible</div>' }),
      },
    ];

    const wrapper = mountWithPoupe(StoryViewer, {
      props: {
        stories: slotTestStories,
      },
      slots: {
        story: ({ story }: StorySlotProps) =>
          h('div', { class: 'custom-story' }, story?.name),
      },
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find('.custom-story').text()).toBe('Slot Test Story');
  });

  it('is responsive on mobile', () => {
    const wrapper = mountWithPoupe(StoryViewer, {
      props: {
        stories: mockStories,
      },
      global: {
        stubs: {
          teleport: true,
        },
      },
    });

    // Mobile header should exist
    const mobileHeader = wrapper.find(String.raw`.lg\:hidden`);
    expect(mobileHeader.exists()).toBe(true);

    // Desktop sidebar should exist
    const sidebar = wrapper.find(String.raw`.lg\:static`);
    expect(sidebar.exists()).toBe(true);
  });
});
