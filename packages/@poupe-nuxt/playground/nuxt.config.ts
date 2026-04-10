export default defineNuxtConfig({
  modules: ['@poupe/nuxt'],

  devtools: { enabled: true },
  compatibilityDate: '2025-04-09',

  poupe: {
    theme: {
      colors: {
        primary: '#5b6abf',
      },
    },
  },
});
