<script lang="ts">
import type { SurfaceProps } from './surface.vue';

/** Card component props */
export interface CardProps extends Omit<SurfaceProps, 'padding'> {
  /** Card title displayed in header */
  title?: string

  /** Convenience prop for surface colors */
  surface?: 'base' | 'dim' | 'bright' | 'lowest' |
    'low' | 'container' | 'high' |
    'highest'

  /** Convenience prop for container colors */
  container?: 'primary' | 'secondary' | 'tertiary' | 'error'
}

// Define defaults in one place
const cardDefaults = {
  title: undefined,
  surface: 'container',
  container: undefined,
  shape: 'md',
  shadow: 'z1',
} as const;

// Module augmentation for global defaults
declare module '../composables/use-poupe' {
  interface PoupeComponentDefaults {
    card?: Partial<CardProps>
  }
}
</script>

<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { tryWarn } from '../utils/utils';
import { usePoupeMergedProps } from '../composables';
import Surface from './surface.vue';

// Define props without withDefaults
const directProps = defineProps<CardProps>();

// Merge with global defaults and component defaults
const props = computed(() =>
  usePoupeMergedProps(directProps, 'card', cardDefaults),
);

// Helper to map surface convenience prop to role and level/tone
function mapSurfaceToRoleAndLevel(surface: CardProps['surface']) {
  switch (surface) {
    case 'lowest':
    case 'low':
    case 'container':
    case 'high':
    case 'highest':
      return {
        role: 'container' as const,
        level: surface === 'container' ? 'base' as const : surface,
      };
    case 'base':
    case 'dim':
    case 'bright':
      return {
        role: 'surface' as const,
        tone: surface,
      };
    default:
      return undefined;
  }
}

// Compute variant and color from surface/container props
const surfaceProps = computed(() => {
  // Warn if both surface and container are specified
  if (props.value.surface && props.value.container) {
    tryWarn(
      '[PCard] Both "surface" and "container" props are specified. '
      + 'The "container" prop will take precedence. '
      + 'Please use only one of these props.',
    );
  }

  const result: Partial<SurfaceProps> = {
    shape: props.value.shape,
    shadow: props.value.shadow,
    border: props.value.border,
    interactive: props.value.interactive,
    padding: 'none',
  };

  if (props.value.container) {
    result.variant = props.value.container;
  } else if (props.value.surface) {
    const mapped = mapSurfaceToRoleAndLevel(props.value.surface);
    if (mapped) {
      Object.assign(result, mapped);
    }
  } else {
    // Pass through any other Surface props
    if (props.value.role) result.role = props.value.role;
    if (props.value.tone) result.tone = props.value.tone;
    if (props.value.level) result.level = props.value.level;
    if (props.value.variant) result.variant = props.value.variant;
  }

  return result;
});

const slots = useSlots();
const hasHeader = computed(() => props.value.title !== undefined || slots.header !== undefined);
const hasFooter = computed(() => slots.footer !== undefined);
</script>

<template>
  <Surface v-bind="surfaceProps">
    <!-- Header -->
    <div
      v-if="hasHeader"
      class="px-4 pt-4"
    >
      <slot name="header">
        <h3
          v-if="props.title"
          class="text-xl font-medium"
        >
          {{ props.title }}
        </h3>
      </slot>
    </div>

    <!-- Content -->
    <div class="px-4 py-4">
      <slot />
    </div>

    <!-- Footer -->
    <div
      v-if="hasFooter"
      class="px-4 pb-4"
    >
      <slot name="footer" />
    </div>
  </Surface>
</template>
