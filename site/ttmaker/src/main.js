import { createApp } from 'vue';
import App from './App.vue';
import store from './store';

import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

const app = createApp(App);
app.use(store);
app.component('v-select', vSelect);
app.mount('#app');