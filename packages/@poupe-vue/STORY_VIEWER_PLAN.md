# Story Viewer System - Summary and Integration Plan

## Executive Summary

The Story Viewer is a custom-built, embeddable component documentation system for @poupe/vue that replaces Histoire. It provides an interactive showcase of Material Design 3 components with full responsiveness and dark mode support, designed to be easily integrated into Nuxt-based websites as a single component.

## Current Implementation

### Core Components

1. **StoryViewer** (`src/components/story/viewer.vue`)
   - Main container with responsive sidebar navigation
   - Handles story selection and routing
   - Mobile-responsive with collapsible sidebar
   - Exports: `@poupe/vue/story-viewer`

2. **StorySection** (`src/components/story/section.vue`)
   - Content sections with title and description
   - Supports rich content with slots
   - Consistent spacing and typography

3. **StoryShowcase** (`src/components/story/showcase.vue`)
   - Flexible grid layout for component variants
   - Responsive columns (1-4 based on viewport)
   - Background customization for visibility

### Existing Story Files

Currently in stash:
- `button.stories.vue` - Button variants, sizes, states
- `card.stories.vue` - Surface types, elevations, slots
- `icon.stories.vue` - Sizes, colors, animations
- `input.stories.vue` - Input types, states, validation
- `placeholder.stories.vue` - Loading states, skeletons

## Integration Plan for Nuxt Website

### Phase 1: Story Viewer as Embeddable Component

```vue
<!-- In your Nuxt page/component -->
<template>
  <div class="min-h-screen">
    <PoupeStoryViewer :stories="stories" />
  </div>
</template>

<script setup>
// Import the viewer from the separate export
import { StoryViewer as PoupeStoryViewer } from '@poupe/vue/story-viewer'

// Import all stories (can be async for code splitting)
const stories = [
  {
    name: 'Getting Started',
    component: () => import('./stories/introduction.vue')
  },
  {
    name: 'Components',
    children: [
      { name: 'Button', component: () => import('@poupe/vue/stories/button.stories.vue') },
      { name: 'Card', component: () => import('@poupe/vue/stories/card.stories.vue') },
      { name: 'Input', component: () => import('@poupe/vue/stories/input.stories.vue') },
      // ... more components
    ]
  },
  {
    name: 'Patterns',
    children: [
      { name: 'Forms', component: () => import('./stories/patterns/forms.vue') },
      { name: 'Navigation', component: () => import('./stories/patterns/navigation.vue') }
    ]
  }
]
</script>
```

### Phase 2: Enhanced Story Structure

Each component story should follow this pattern:

```vue
<!-- button.stories.vue -->
<template>
  <div>
    <!-- Overview -->
    <StorySection 
      title="Button" 
      description="Buttons allow users to take actions with a single tap."
    >
      <StoryShowcase :cols="3">
        <PButton variant="filled">Filled</PButton>
        <PButton variant="outlined">Outlined</PButton>
        <PButton variant="text">Text</PButton>
      </StoryShowcase>
    </StorySection>

    <!-- Variants -->
    <StorySection title="Variants">
      <p class="text-on-surface-light mb-4">
        Material Design 3 defines five button types...
      </p>
      <StoryShowcase :cols="1">
        <!-- Detailed examples with descriptions -->
      </StoryShowcase>
    </StorySection>

    <!-- Interactive States -->
    <StorySection title="States">
      <StoryShowcase background="surface">
        <div v-for="state in states" :key="state">
          <PButton :class="state">{{ state }}</PButton>
        </div>
      </StoryShowcase>
    </StorySection>

    <!-- Code Examples -->
    <StorySection title="Usage">
      <CodeBlock :code="exampleCode" language="vue" />
    </StorySection>

    <!-- API Reference -->
    <StorySection title="Props">
      <PropsTable :props="buttonProps" />
    </StorySection>
  </div>
</template>
```

### Phase 3: Nuxt Module Integration

Create `@poupe/nuxt` enhancements:

```typescript
// In @poupe/nuxt module
export default defineNuxtModule({
  setup(options, nuxt) {
    // Auto-import story components
    nuxt.options.components.push({
      path: '~/node_modules/@poupe/vue/dist/story-viewer',
      prefix: 'Story',
      global: true
    })

    // Add route for documentation
    if (options.enableDocs) {
      nuxt.hook('pages:extend', (pages) => {
        pages.push({
          name: 'poupe-docs',
          path: options.docsPath || '/design-system',
          file: '@poupe/vue/pages/documentation.vue'
        })
      })
    }
  }
})
```

### Phase 4: Advanced Features

1. **Search Integration**
   ```vue
   <StoryViewer 
     :stories="stories"
     :searchable="true"
     :search-keys="['name', 'description', 'tags']"
   />
   ```

2. **Theme Playground**
   ```vue
   <StorySection title="Theme Customization">
     <ThemePlayground 
       :initial-theme="currentTheme"
       @update="updateLiveTheme"
     />
   </StorySection>
   ```

3. **Live Code Editor**
   ```vue
   <StorySection title="Try It">
     <LiveEditor 
       :code="defaultCode"
       :scope="{ PButton, PCard, PInput }"
     />
   </StorySection>
   ```

4. **Accessibility Inspector**
   ```vue
   <StoryShowcase :a11y-check="true">
     <PButton>Check my accessibility</PButton>
   </StoryShowcase>
   ```

## Implementation Timeline

### Week 1: Core Story Files
- [ ] Complete all component story files
- [ ] Add interactive examples
- [ ] Include accessibility notes
- [ ] Document Material Design 3 compliance

### Week 2: Enhanced Features
- [ ] Add code examples with syntax highlighting
- [ ] Create props tables component
- [ ] Implement theme playground
- [ ] Add search functionality

### Week 3: Nuxt Integration
- [ ] Create documentation page template
- [ ] Set up auto-imports in Nuxt module
- [ ] Configure route generation
- [ ] Add SEO optimization

### Week 4: Polish & Deploy
- [ ] Performance optimization (lazy loading)
- [ ] Full accessibility audit
- [ ] Mobile experience refinement
- [ ] Documentation site deployment

## Benefits

1. **Single Component Integration**: Import one component to get complete documentation
2. **Nuxt-Native**: Built specifically for SSR and Nuxt optimization
3. **Fully Responsive**: Works seamlessly on all devices
4. **Theme-Aware**: Respects your app's theme configuration
5. **SEO-Friendly**: Server-rendered for search engines
6. **Developer Experience**: Hot reload, TypeScript support
7. **Customizable**: Extend with your own patterns and examples

## Technical Considerations

### Bundle Size Optimization
```javascript
// Vite config for story files
{
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'stories': [/\.stories\.vue$/]
        }
      }
    }
  }
}
```

### SSR Compatibility
- All story components are SSR-safe
- Lazy loading for client-only features
- Progressive enhancement approach

### Performance
- Virtual scrolling for large story lists
- Code splitting per story
- Optimized asset loading

## Next Steps

1. **Immediate**: Pull story files from stash and review
2. **Short-term**: Complete missing component stories
3. **Medium-term**: Implement enhanced features
4. **Long-term**: Full Nuxt integration with dedicated docs site

This approach provides a scalable, maintainable solution for component documentation that integrates seamlessly with your Nuxt-based website while maintaining the flexibility to evolve with your needs.