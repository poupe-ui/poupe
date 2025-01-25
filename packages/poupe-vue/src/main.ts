import './assets/css/main.css';

import { createApp } from 'vue';
import { createHead } from '@unhead/vue';

import App from './app.vue';

createApp(App)
  .use(createHead())
  .mount('#app');
