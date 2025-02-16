import {
  type MaybeRefOrGetter,

  reactive,
  readonly,
  toValue,
} from 'vue';

import { type IconifyIcon } from '@iconify/types';
type IconValue = IconifyIcon | string;

const blankIcon: IconValue = {
    body: '',
    width: 24,
    height: 24,
  }, unknownIcon: IconValue = {
    body: '<path d="M6 19h12v-4h-12v4zm0-6h12V9H6v4zm0-6h12V5H6v4z" fill="currentColor" />',
    width: 24,
    height: 24,
  };

const defaultIcons = {
  blankIcon,
  unknownIcon,
};

type IconNames = keyof typeof defaultIcons;

const globalIcons = reactive<{ poupe: Record<IconNames, IconValue> } & Record<string, Record<string, IconValue>>>({
  poupe: defaultIcons,
});

const registerIcons = (namespace: string, icons: Record<string, IconValue>) => {
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
  return toIcon(icons[camelCase]) || globalIcons.poupe.unknownIcon;
};

export const usePoupeIcons = () => {
  return {
    icons: readonly(globalIcons),
    toIcon,
    registerIcons,
  } as const;
};
