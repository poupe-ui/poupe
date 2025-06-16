import type { Component } from 'vue';
import type { StoryConfig, StoryConfigOptions, StoryGroup } from './types';

export function generateCode(
  story: StoryConfig,
  options: StoryConfigOptions = {},
): string {
  const { componentPrefix = 'P' } = options;

  // If explicit code is provided, use it
  if (story.code) {
    return story.code.trim();
  }

  // If template is provided, use it
  if (story.template) {
    return story.template.trim();
  }

  // Generate code from component and props
  if (story.component && story.props) {
    const componentName = getComponentName(story.component, componentPrefix);
    const propsString = generatePropsString(story.props);
    const slotsString = story.slots ? generateSlotsString(story.slots) : '';

    return slotsString ? `<${componentName}${propsString}>\n${slotsString}\n</${componentName}>` : `<${componentName}${propsString} />`;
  }

  return '';
}

function getComponentName(component: Component, prefix: string): string {
  if (typeof component === 'string') {
    return component;
  }

  const name = (component as Record<string, unknown>).name || (component as Record<string, unknown>).__name;
  if (!name || typeof name !== 'string') return 'Component';

  // If component name doesn't start with prefix, add it
  if (name.startsWith(prefix)) {
    return name;
  }

  // Capitalize the first letter when adding prefix
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
  return `${prefix}${capitalizedName}`;
}

function generatePropsString(props: Record<string, unknown>): string {
  const entries = Object.entries(props);
  if (entries.length === 0) return '';

  const propsArray = entries.map(([key, value]) => {
    if (value === true) {
      return key;
    } else if (value === false) {
      return `:${key}="false"`;
    } else if (typeof value === 'string') {
      return `${key}="${value}"`;
    } else if (typeof value === 'number') {
      return `:${key}="${value}"`;
    } else {
      return `:${key}="${JSON.stringify(value).replaceAll('"', '\'')}"`;
    }
  });

  return ' ' + propsArray.join(' ');
}

function generateSlotsString(slots: Record<string, string | (() => unknown)>): string {
  const slotsArray = Object.entries(slots).map(([name, content]) => {
    const slotContent = typeof content === 'function' ? 'Dynamic content' : content;

    return name === 'default' ? `  ${slotContent}` : `  <template #${name}>\n    ${slotContent}\n  </template>`;
  });

  return slotsArray.join('\n');
}

export function createStory(config: StoryConfig): StoryConfig {
  return config;
}

export function createStoryGroup(
  title: string,
  description: string,
  stories: StoryConfig[],
): StoryGroup {
  return { title, description, stories };
}
