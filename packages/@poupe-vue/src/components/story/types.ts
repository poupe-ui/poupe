import type { Component, VNode } from 'vue';

export interface StoryConfig {
  title: string
  description?: string
  component?: Component
  props?: Record<string, unknown>
  slots?: Record<string, string | (() => VNode | VNode[])>
  wrapperClass?: string
}

export interface StoryGroup {
  title: string
  description?: string
  stories: StoryConfig[]
}

export interface StoryConfigOptions {
  componentPrefix?: string
}
