import { usePoupeIcons } from './use-icons';

const { icons } = usePoupeIcons();

export const usePoupeConfig = () => {
  return {
    icons,
  } as const;
};
