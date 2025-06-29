<script lang="ts">
import type { SurfaceProps } from './surface.vue';

/** Material Design 3 button types */
export type ButtonType = 'text' | 'outlined' | 'filled' | 'elevated' | 'tonal';

/** Button color variants */
export type ButtonVariant = 'base' | 'primary' | 'secondary' | 'tertiary' | 'error';

/** Button component props */
export interface ButtonProps extends Omit<SurfaceProps, 'padding' | 'role' | 'tone' | 'level' | 'variant'> {
  /** Button label text */
  label?: string

  /** Material Design 3 button type */
  type?: ButtonType

  /** Button size */
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl'

  /** Semantic color variant for the button */
  variant?: ButtonVariant

  /** Loading state */
  loading?: boolean

  /** Disabled state */
  disabled?: boolean

  /** Full width button */
  expand?: boolean

  /** Add ellipsis to label */
  ellipsis?: boolean

  /** Floating Action Button mode */
  fab?: boolean

  /** Extended FAB (only with fab=true) */
  extended?: boolean

  /** Icon button mode */
  iconButton?: boolean

  /** Toggle button mode */
  toggle?: boolean

  /** Toggle pressed state */
  pressed?: boolean

  /** Leading icon */
  icon?: string

  /** Trailing icon */
  trailingIcon?: string

  /** Icon start slot content */
  iconStart?: string

  /** Icon end slot content */
  iconEnd?: string
}

/** Button default props */
export const buttonDefaults: Partial<ButtonProps> = {
  type: 'filled',
  size: 'base',
  variant: 'primary',
  shape: 'md',
  disabled: false,
  loading: false,
  expand: false,
  ellipsis: false,
  fab: false,
  extended: false,
  iconButton: false,
  toggle: false,
  pressed: false,
};

// Augment the PoupeComponentDefaults interface
declare module '../composables/use-poupe' {
  interface PoupeComponentDefaults {
    button?: {
      type?: ButtonType
      size?: ButtonProps['size']
      variant?: ButtonVariant
      shape?: ButtonProps['shape']
      shadow?: ButtonProps['shadow']
      border?: ButtonProps['border']
      interactive?: ButtonProps['interactive']
      disabled?: ButtonProps['disabled']
      loading?: ButtonProps['loading']
      expand?: ButtonProps['expand']
      ellipsis?: ButtonProps['ellipsis']
      fab?: ButtonProps['fab']
      extended?: ButtonProps['extended']
      iconButton?: ButtonProps['iconButton']
      toggle?: ButtonProps['toggle']
      pressed?: ButtonProps['pressed']
    }
  }
}
</script>

<script setup lang="ts">
/* global MouseEvent, HTMLButtonElement */
import { computed, useTemplateRef } from 'vue';
import { usePoupeMergedProps, useRipple } from '../composables';
import Icon from './icon.vue';
import Surface from './surface.vue';

// Define props without withDefaults
const directProps = defineProps<ButtonProps>();

const emit = defineEmits<{
  click: [event: MouseEvent]
}>();

// Merge props with global defaults
const props = computed(() =>
  usePoupeMergedProps(directProps, 'button', buttonDefaults),
);

// Button reference for ripple effect using useTemplateRef
const buttonElement = useTemplateRef<InstanceType<typeof Surface>>('buttonElement');

// Get the actual DOM element from Surface component
const buttonDOMElement = computed<HTMLButtonElement | undefined>(() => buttonElement.value?.$el);

// Use ripple effect (disabled state is handled reactively)
const isDisabled = computed(() => props.value.disabled);
const { ripples, getRippleStyle } = useRipple(buttonDOMElement, {
  disabled: isDisabled,
});

// Compute surface props based on button type
const surfaceProps = computed<Partial<SurfaceProps>>(() => {
  const { type, variant, shape, shadow, border, interactive } = props.value;

  // Base props
  const baseProps: Partial<SurfaceProps> = {
    shape,
    padding: 'none',
    interactive: interactive ?? true,
  };

  // FAB-specific defaults
  if (props.value.fab) {
    baseProps.shape = props.value.extended ? 'lg' : 'full';
    baseProps.shadow = shadow ?? 'z3';
  }

  // Icon button defaults
  if (props.value.iconButton && !props.value.fab) {
    baseProps.shape = shape ?? 'full';
  }

  // Map variant to appropriate border color for outlined type
  const getOutlineBorder = () => {
    if (border) return border;
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'tertiary':
      case 'error':
        return variant;
      default:
        return 'outline';
    }
  };

  // Apply type-specific props
  switch (type) {
    case 'text':
      return {
        ...baseProps,
        role: 'surface',
        tone: 'base',
        shadow: shadow ?? 'none',
        border: border ?? 'none',
      };

    case 'outlined':
      return {
        ...baseProps,
        role: 'surface',
        tone: 'base',
        shadow: shadow ?? 'none',
        border: getOutlineBorder(),
      };

    case 'filled':
      return {
        ...baseProps,
        variant: variant === 'base' ? undefined : variant,
        role: variant === 'base' ? 'surface' : undefined,
        tone: variant === 'base' ? 'base' : undefined,
        shadow: shadow ?? 'none',
        border: border ?? 'none',
      };

    case 'elevated':
      return {
        ...baseProps,
        role: 'surface',
        tone: 'base',
        shadow: shadow ?? 'z1',
        border: border ?? 'none',
      };

    case 'tonal': {
      // For tonal buttons, use container variant colors
      const tonalVariant = variant === 'base'
        ? undefined
        : `${variant}-container` as SurfaceProps['variant'];
      return {
        ...baseProps,
        variant: tonalVariant,
        role: variant === 'base' ? 'container' : undefined,
        level: variant === 'base' ? 'base' : undefined,
        shadow: shadow ?? 'none',
        border: border ?? 'none',
      };
    }

    default:
      return baseProps;
  }
});

// Compute button classes
const buttonClasses = computed(() => {
  const { size, expand, disabled, loading, fab, iconButton } = props.value;
  const classes: string[] = [
    'inline-flex items-center justify-center gap-2',
    'transition-all duration-200',
    'select-none',
    'font-medium',
  ];

  // Size classes
  const sizeClasses: Record<string, string> = {
    xs: 'text-xs h-8 px-2',
    sm: 'text-sm h-9 px-3',
    base: 'text-sm h-10 px-6',
    lg: 'text-base h-12 px-7',
    xl: 'text-lg h-14 px-8',
  };

  // FAB size classes
  const fabSizeClasses: Record<string, string> = {
    xs: 'h-10 w-10',
    sm: 'h-12 w-12',
    base: 'h-14 w-14',
    lg: 'h-16 w-16',
    xl: 'h-20 w-20',
  };

  // Extended FAB size classes
  const extendedFabSizeClasses: Record<string, string> = {
    xs: 'h-10 px-3',
    sm: 'h-12 px-4',
    base: 'h-14 px-5',
    lg: 'h-16 px-6',
    xl: 'h-20 px-8',
  };

  // Icon button size classes
  const iconButtonSizeClasses: Record<string, string> = {
    xs: 'h-8 w-8',
    sm: 'h-9 w-9',
    base: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-14 w-14',
  };

  // Apply size classes
  if (fab && !props.value.extended) {
    classes.push(fabSizeClasses[size] || fabSizeClasses.base);
  } else if (fab && props.value.extended) {
    classes.push(extendedFabSizeClasses[size] || extendedFabSizeClasses.base);
  } else if (iconButton) {
    classes.push(iconButtonSizeClasses[size] || iconButtonSizeClasses.base);
  } else {
    classes.push(sizeClasses[size] || sizeClasses.base);
  }

  // State classes
  if (disabled || loading) {
    classes.push('opacity-38 cursor-not-allowed');
  }

  if (expand) {
    classes.push('w-full');
  }

  return classes.join(' ');
});

// Compute label
const computedLabel = computed(() => {
  const label = props.value.label || '';
  return props.value.ellipsis ? `${label}…` : label;
});

// Icon size based on button size
const iconSize = computed(() => {
  const sizes: Record<string, string> = {
    xs: 'text-base',
    sm: 'text-lg',
    base: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };
  return sizes[props.value.size] || sizes.base;
});
</script>

<template>
  <Surface
    v-bind="surfaceProps"
    ref="buttonElement"
    tag="button"
    :class="buttonClasses"
    :disabled="props.disabled || props.loading"
    @click="emit('click', $event)"
  >
    <!-- Ripple effects -->
    <span
      v-for="ripple in ripples"
      :key="ripple.id"
      class="ripple-effect"
      :style="getRippleStyle(ripple)"
    />

    <!-- Button content -->
    <div class="contents">
      <!-- Leading icon -->
      <Icon
        v-if="props.icon || props.iconStart"
        :icon="props.icon || props.iconStart"
        :class="iconSize"
      />

      <!-- Label -->
      <span
        v-if="computedLabel && (!props.iconButton || props.extended)"
        class="leading-none"
      >
        {{ computedLabel }}
      </span>

      <!-- Default slot -->
      <slot v-if="!computedLabel && !props.iconButton" />

      <!-- Trailing icon -->
      <Icon
        v-if="props.trailingIcon || props.iconEnd"
        :icon="props.trailingIcon || props.iconEnd"
        :class="iconSize"
      />

      <!-- Loading indicator -->
      <Icon
        v-if="props.loading"
        icon="svg-spinners:12-dots-scale-rotate"
        :class="iconSize"
      />
    </div>
  </Surface>
</template>
