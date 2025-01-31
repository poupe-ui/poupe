import { installModule } from '@nuxt/kit';

export const installTailwindModule = async () => {
  await installModule('@nuxtjs/tailwindcss', {
    exposeConfig: true,
    config: {
      darkMode: 'class' as const,
    },
  });
};
