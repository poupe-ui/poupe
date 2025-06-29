<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Button from './button.vue';
import type { ButtonProps } from './button.vue';
import Icon from './icon.vue';

export interface FabMenuItem {
  key: string
  icon: string
  label: string
  variant?: ButtonProps['variant']
  onClick?: () => void
}

export interface FabProps {
  /**
   * Icon to show when menu is closed
   */
  icon?: string
  /**
   * Icon to show when menu is open
   */
  closeIcon?: string
  /**
   * Color variant for the main FAB button
   */
  variant?: ButtonProps['variant']
  /**
   * Menu items to display when FAB is expanded
   */
  items?: FabMenuItem[]
  /**
   * Whether to show the menu initially
   */
  modelValue?: boolean
  /**
   * Position of the FAB
   */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  /**
   * Offset from edge in rem units
   */
  offset?: number
}

const props = withDefaults(defineProps<FabProps>(), {
  icon: 'material-symbols:add',
  closeIcon: 'material-symbols:close',
  variant: 'primary',
  items: () => [],
  modelValue: false,
  position: 'bottom-right',
  offset: 1.5,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>();

// Internal state for menu
const internalIsOpen = ref(props.modelValue);

// Sync internal state with props
watch(() => props.modelValue, (newValue) => {
  internalIsOpen.value = newValue;
});

// Computed property that manages both internal state and v-model
const isOpen = computed({
  get: () => internalIsOpen.value,
  set: (value) => {
    internalIsOpen.value = value;
    emit('update:modelValue', value);
  },
});

// Toggle menu
const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

// Position styles
const positionStyles = computed(() => {
  const offsetRem = `${props.offset}rem`;
  const styles: Record<string, string> = {};

  if (props.position.includes('bottom')) {
    styles.bottom = offsetRem;
  } else {
    styles.top = offsetRem;
  }

  if (props.position.includes('right')) {
    styles.right = offsetRem;
  } else {
    styles.left = offsetRem;
  }

  return styles;
});

// Calculate menu item position based on FAB position
const getItemStyle = (index: number) => {
  const spacing = 4; // rem between items
  const offset = (index + 1) * spacing;

  return props.position.includes('bottom') ? { bottom: `${offset}rem` } : { top: `${offset}rem` };
};

// Menu item click handler
const handleItemClick = (item: FabMenuItem) => {
  if (item.onClick) {
    item.onClick();
  }
  isOpen.value = false;
};
</script>

<template>
  <div
    class="fixed z-navigation-floating"
    :style="positionStyles"
    data-testid="fab-container"
  >
    <!-- Menu Items Container -->
    <div
      v-if="isOpen"
      class="pointer-events-none"
      data-testid="fab-menu-container"
    >
      <!-- Menu Items -->
      <transition-group name="fab-menu">
        <div
          v-for="(item, index) in items"
          :key="item.key"
          class="absolute right-0 pointer-events-auto"
          :style="getItemStyle(index)"
          data-testid="fab-menu-item"
        >
          <Button
            :variant="item.variant || 'secondary'"
            type="tonal"
            size="base"
            shape="full"
            shadow="z2"
            :aria-label="item.label"
            @click="handleItemClick(item)"
          >
            <slot
              :name="`item-${item.key}`"
              :item="item"
            >
              <Icon
                :icon="item.icon"
                size="text-xl"
                class="pointer-events-none"
              />
            </slot>
          </Button>
        </div>
      </transition-group>
    </div>

    <!-- Main FAB Button -->
    <Button
      :variant="variant"
      fab
      aria-label="Toggle menu"
      class="relative"
      @click="toggleMenu"
    >
      <Icon
        :icon="isOpen ? closeIcon : icon"
        size="text-2xl"
        :class="{ 'rotate-45': isOpen }"
        class="transition-transform duration-200 pointer-events-none"
      />
    </Button>
  </div>
</template>

<style scoped>
.fab-menu-enter-active,
.fab-menu-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fab-menu-enter-from,
.fab-menu-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(10px);
}

.rotate-45 {
  transform: rotate(45deg);
}
</style>
