import {
  type DeepReadonly,
  type MaybeRefOrGetter,

  reactive,
  readonly,
  toValue,
} from 'vue';

import { type IconifyIcon } from '@iconify/vue';

type IconValue = IconifyIcon | string;

const blankIcon: IconValue = {
    body: '',
    width: 24,
    height: 24,
  }, unknownIcon: IconValue = {
    body: '<text y=".9em" font-size="90" fill="currentColor">�</text>',
    width: 100,
    height: 100,
  };

type IconNames = 'blankIcon' | 'hidePassword' | 'showPassword' | 'spinner' | 'unknownIcon';

const defaultIcons: Record<IconNames, IconValue> = {
  blankIcon,
  unknownIcon,
  spinner: 'svg-spinners:6-dots-scale',
  // input[type=password]
  showPassword: 'heroicons:eye',
  hidePassword: 'heroicons:eye-slash',
};

type GlobalIcons = Record<string, Record<string, IconValue>> & { poupe: Record<IconNames, IconValue> };

const globalIcons: GlobalIcons = reactive<GlobalIcons>({
  poupe: defaultIcons,
});

const registerIcons = (namespace: string, icons: Record<string, IconValue>): void => {
  globalIcons[namespace] = {
    ...globalIcons[namespace],
    ...icons,
  };
};

const toIcon = (icon: MaybeRefOrGetter<IconifyIcon | string | undefined>): IconifyIcon | string => {
  const v = toValue(icon);
  if (!v)
    return globalIcons.poupe.blankIcon;
  if (typeof v !== 'string')
    return v;

  const i = v.indexOf(':');
  const icons = globalIcons[i > 0 ? v.slice(0, i) : 'poupe'];
  if (!icons)
    return v;

  const name = i === -1 ? v : v.slice(i + 1);
  if (icons[name])
    return toIcon(icons[name]);

  const camelCase = name.replaceAll(/[-_]([a-z])/g, (_, c) => c.toUpperCase());
  if (icons[camelCase])
    return toIcon(icons[camelCase]);

  return globalIcons.poupe.unknownIcon;
};

export const usePoupeIcons = (): {
  icons: DeepReadonly<typeof globalIcons>
  registerIcons: typeof registerIcons
  toIcon: typeof toIcon
} => ({
  icons: readonly(globalIcons),
  toIcon,
  registerIcons,
});
