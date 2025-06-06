import { defineNuxtPlugin } from '#app';
import { 
  Story, 
  Variant, 
  HstText, 
  HstNumber, 
  HstCheckbox, 
  HstSelect 
} from '../components/story-compat';

export default defineNuxtPlugin((nuxtApp) => {
  // Register story compatibility components globally
  nuxtApp.vueApp.component('Story', Story);
  nuxtApp.vueApp.component('Variant', Variant);
  nuxtApp.vueApp.component('HstText', HstText);
  nuxtApp.vueApp.component('HstNumber', HstNumber);
  nuxtApp.vueApp.component('HstCheckbox', HstCheckbox);
  nuxtApp.vueApp.component('HstSelect', HstSelect);
});