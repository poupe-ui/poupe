import { ref, onMounted, onUnmounted, type Ref } from 'vue';

export interface RippleOptions {
  /**
   * Ripple color (CSS color value)
   * @defaultValue `'currentColor'`
   */
  color?: string
  /**
   * Ripple opacity
   * @defaultValue `0.12`
   */
  opacity?: number
  /**
   * Duration in milliseconds
   * @defaultValue `600`
   */
  duration?: number
  /**
   * Whether the ripple is bounded by the container
   * @defaultValue `true`
   */
  bounded?: boolean
  /**
   * Disable ripple effect
   * @defaultValue `false`
   */
  disabled?: boolean
}

interface Ripple {
  x: number
  y: number
  size: number
  id: number
}

export function useRipple(
  elementReference: Ref<HTMLElement | undefined>,
  options: RippleOptions = {},
) {
  const {
    color = 'currentColor',
    opacity = 0.12,
    duration = 600,
    bounded = true,
    disabled = false,
  } = options;

  const ripples = ref<Ripple[]>([]);
  let rippleId = 0;

  const addRipple = (event: MouseEvent | TouchEvent) => {
    if (disabled || !elementReference.value) return;

    const element = elementReference.value;
    const rect = element.getBoundingClientRect();

    let x: number;
    let y: number;

    if (event instanceof MouseEvent) {
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
    } else {
      const touch = event.touches[0];
      x = touch.clientX - rect.left;
      y = touch.clientY - rect.top;
    }

    // Calculate ripple size
    const sizeX = Math.max(x, rect.width - x);
    const sizeY = Math.max(y, rect.height - y);
    const size = Math.hypot(sizeX, sizeY) * 2;

    const id = rippleId++;
    const ripple: Ripple = { x, y, size, id };

    ripples.value.push(ripple);

    // Remove ripple after animation
    setTimeout(() => {
      ripples.value = ripples.value.filter(r => r.id !== id);
    }, duration);
  };

  const handleMouseDown = (event: MouseEvent) => {
    addRipple(event);
  };

  const handleTouchStart = (event: TouchEvent) => {
    addRipple(event);
  };

  onMounted(() => {
    if (!elementReference.value || disabled) return;

    elementReference.value.addEventListener('mousedown', handleMouseDown);
    elementReference.value.addEventListener('touchstart', handleTouchStart, { passive: true });

    // Add ripple container styles
    elementReference.value.style.position = 'relative';
    elementReference.value.style.overflow = bounded ? 'hidden' : 'visible';
  });

  onUnmounted(() => {
    if (!elementReference.value) return;

    elementReference.value.removeEventListener('mousedown', handleMouseDown);
    elementReference.value.removeEventListener('touchstart', handleTouchStart);
  });

  const getRippleStyle = (ripple: Ripple) => {
    return {
      position: 'absolute' as const,
      left: `${ripple.x}px`,
      top: `${ripple.y}px`,
      width: `${ripple.size}px`,
      height: `${ripple.size}px`,
      transform: 'translate(-50%, -50%)',
      borderRadius: '50%',
      backgroundColor: color,
      opacity: opacity,
      pointerEvents: 'none' as const,
      animation: `ripple ${duration}ms ease-out`,
    };
  };

  return {
    ripples,
    getRippleStyle,
  };
}
