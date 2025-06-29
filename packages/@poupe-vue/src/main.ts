import './assets/css/main.css';

import { createApp } from 'vue';
import { createHead } from '@unhead/vue/client';
import { createPoupe, type PoupeOptions } from './composables/use-poupe';

import App from './app.vue';

const poupeOptions: PoupeOptions = {};

createApp(App)
  .use(createHead())
  .use(createPoupe(poupeOptions))
  .mount('#app');
