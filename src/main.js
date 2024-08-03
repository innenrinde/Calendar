import moment from "moment";
import { createApp } from 'vue';
import App from './App.vue';

let app = createApp(App);
app.config.globalProperties.moment = moment;

app.mount("#app");