import type { Component, VNode } from 'vue';

export interface StoryConfig {
  component?: Component
  description?: string
  props?: Record<string, unknown>
  slots?: Record<string, (() => VNode | VNode[]) | string>
  title: string
  wrapperClass?: string
}

export interface StoryGroup {
  description?: string
  stories: StoryConfig[]
  title: string
}

export interface StoryConfigOptions {
  componentPrefix?: string
}
