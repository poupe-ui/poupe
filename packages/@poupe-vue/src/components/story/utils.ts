import type { Component } from 'vue';
import type { StoryConfig, StoryConfigOptions, StoryGroup } from './types';

export function generateCode(
  story: StoryConfig,
  options: StoryConfigOptions = {},
): string {
  const { componentPrefix = 'P' } = options;

  if (!story.component) {
    return '';
  }

  const componentName = getComponentName(story.component, componentPrefix);
  const propsString = generatePropsString(story.props || {});
  const slotsString = story.slots ? generateSlotsString(story.slots) : '';

  let componentCode = slotsString
    ? `<${componentName}${propsString}>\n${slotsString}\n</${componentName}>`
    : `<${componentName}${propsString} />`;

  // If wrapper class is specified, wrap the component
  if (story.wrapperClass) {
    componentCode = `<div class="${story.wrapperClass}">${componentCode}</div>`;
  }

  return componentCode;
}

function getComponentName(component: Component, prefix: string): string {
  if (typeof component === 'string') {
    return component;
  }

  const name = (component as Record<string, unknown>).name || (component as Record<string, unknown>).__name;
  if (!name || typeof name !== 'string') return 'Component';

  // Return name as-is if it already has the prefix
  if (name.startsWith(prefix)) return name;

  // Add prefix and capitalize first letter of component name
  return `${prefix}${name.charAt(0).toUpperCase()}${name.slice(1)}`;
}

function generatePropsString(props: Record<string, unknown>): string {
  const entries = Object.entries(props)
    .filter(([, value]) => value !== undefined && value !== null);

  if (entries.length === 0) return '';

  const propsArray = entries.map(([key, value]) => {
    // Boolean true: just the attribute name
    if (value === true) return key;

    // Boolean false: bind with false value
    if (value === false) return `:${key}="false"`;

    // String: escape and use as attribute
    if (typeof value === 'string') {
      const escaped = value
        .replaceAll('&', '&amp;')
        .replaceAll('"', '&quot;')
        .replaceAll('\'', '&#39;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;');
      return `${key}="${escaped}"`;
    }

    // Number or other: bind with value
    return `:${key}="${JSON.stringify(value).replaceAll('"', '&quot;')}"`;
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
