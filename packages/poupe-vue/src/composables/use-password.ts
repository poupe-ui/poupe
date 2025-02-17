import { type MaybeRefOrGetter, computed, ref, toValue } from 'vue';
import { usePoupeIcons } from './use-icons';

export function usePasswordToggle(origType: MaybeRefOrGetter<string>) {
  const { poupe: icons } = usePoupeIcons().icons;

  const showPassword = ref(false);

  return {
    showPassword,
    passwordToggleIcon: computed(() => (showPassword.value ? icons.hidePassword : icons.showPassword)),
    typeAttr: computed(() => showPassword.value ? 'text' : toValue(origType)),
  };
}
