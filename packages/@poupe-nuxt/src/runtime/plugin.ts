import { createPoupe } from '@poupe/vue/composables';

import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(createPoupe());
});
