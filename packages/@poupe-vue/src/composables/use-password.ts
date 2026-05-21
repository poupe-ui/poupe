import { type IconifyIcon } from '@iconify/vue';
import { computed, type ComputedRef, type MaybeRefOrGetter, ref, type Ref, toValue } from 'vue';
import { usePoupeIcons } from './use-icons';

export function usePasswordToggle(origType: MaybeRefOrGetter<string>): {
  passwordToggleIcon: ComputedRef<IconifyIcon | string>
  showPassword: Ref<boolean>
  typeAttr: ComputedRef<string>
} {
  const { poupe: icons } = usePoupeIcons().icons;

  const showPassword = ref(false);

  return {
    showPassword,
    passwordToggleIcon: computed(() => (showPassword.value ? icons.hidePassword : icons.showPassword)),
    typeAttr: computed(() => showPassword.value ? 'text' : toValue(origType)),
  };
}
