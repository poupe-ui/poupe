export default defineNuxtConfig({
  modules: ['@poupe/nuxt'],

  devtools: { enabled: true },
  devServer: {
    host: '0.0.0.0',
  },
  compatibilityDate: '2025-04-09',

  poupe: {
    theme: {
      colors: {
        primary: '#5b6abf',
      },
    },
  },
});
