import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { h } from 'vue';
import StoryViewer from '../viewer.vue';

describe('StoryViewer', () => {
  const mockStories = [
    {
      name: 'Story 1',
      component: { template: '<div>Story 1 Content</div>' },
      description: 'First story',
    },
    {
      name: 'Story 2',
      component: { template: '<div>Story 2 Content</div>' },
    },
    {
      name: 'Story 3',
      component: { template: '<div>Story 3 Content</div>' },
    },
  ];

  it('renders with stories', () => {
    const wrapper = mount(StoryViewer, {
      props: {
        stories: mockStories,
      },
    });

    expect(wrapper.find('h1').text()).toBe('Component Stories');
    expect(wrapper.find('nav').findAll('button')).toHaveLength(3);
  });

  it('displays story navigation buttons', () => {
    const wrapper = mount(StoryViewer, {
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
    const wrapper = mount(StoryViewer, {
      props: {
        stories: mockStories,
      },
    });

    expect(wrapper.html()).toContain('Story 1 Content');
  });

  it('uses defaultStory when provided', () => {
    const wrapper = mount(StoryViewer, {
      props: {
        stories: mockStories,
        defaultStory: 'Story 2',
      },
    });

    expect(wrapper.html()).toContain('Story 2 Content');
  });

  it('switches stories on button click', async () => {
    const wrapper = mount(StoryViewer, {
      props: {
        stories: mockStories,
      },
    });

    const buttons = wrapper.find('nav').findAll('button');
    await buttons[1].trigger('click');

    expect(wrapper.html()).toContain('Story 2 Content');
    expect(wrapper.html()).not.toContain('Story 1 Content');
  });

  it('displays story description when available', () => {
    const wrapper = mount(StoryViewer, {
      props: {
        stories: mockStories,
      },
    });

    expect(wrapper.text()).toContain('First story');
  });

  it('uses custom title slot', () => {
    const wrapper = mount(StoryViewer, {
      props: {
        stories: mockStories,
      },
      slots: {
        title: 'Custom Stories Title',
      },
    });

    expect(wrapper.find('h1').text()).toBe('Custom Stories Title');
  });

  it('uses custom story slot', () => {
    const wrapper = mount(StoryViewer, {
      props: {
        stories: mockStories,
      },
      slots: {
        story: ({ story }) =>
          h('div', { class: 'custom-story' }, story?.name),
      },
    });

    expect(wrapper.find('.custom-story').text()).toBe('Story 1');
  });

  it('is responsive on mobile', () => {
    const wrapper = mount(StoryViewer, {
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
