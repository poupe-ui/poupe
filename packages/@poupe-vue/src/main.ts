import './assets/css/main.css';

import { createHead } from '@unhead/vue/client';
import { createApp } from 'vue';

import App from './app.vue';
import { createPoupe } from './composables';

createApp(App)
  .use(createHead())
  .use(createPoupe())
  .mount('#app');
