import './assets/css/main.css';

import { createApp } from 'vue';
import { createHead } from '@unhead/vue/client';

import App from './app.vue';
import { 
  Story, 
  Variant,
  HstText,
  HstNumber,
  HstCheckbox,
  HstSelect
} from './components/story-viewer/story-compat';

const app = createApp(App);

// Register Story and Variant components globally for story viewer
app.component('Story', Story);
app.component('Variant', Variant);
app.component('HstText', HstText);
app.component('HstNumber', HstNumber);
app.component('HstCheckbox', HstCheckbox);
app.component('HstSelect', HstSelect);

app.use(createHead()).mount('#app');
