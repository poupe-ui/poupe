import './assets/css/main.css';

import { createHead } from '@unhead/vue/client';
import { createApp } from 'vue';

import App from './app.vue';

createApp(App)
  .use(createHead())
  .mount('#app');
