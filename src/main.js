import moment from "moment";
import { createApp } from 'vue';
import App from './App.vue';
import Prototypes from '@/calendar/utils/Prototypes';

Prototypes();

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core';

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

/* import specific icons */
import { faChevronLeft, faChevronRight, faXmark, faUpRightAndDownLeftFromCenter, faTable, faTableColumns, faThumbtack } from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-regular-svg-icons';

/* add icons to the library */
library.add(faChevronLeft);
library.add(faChevronRight);
library.add(faXmark);
library.add(faUpRightAndDownLeftFromCenter);
library.add(faTable);
library.add(faTableColumns);
library.add(faSquare);
library.add(faThumbtack);

let app = createApp(App).component('font-awesome-icon', FontAwesomeIcon);
app.config.globalProperties.moment = moment;
app.mount("#app");

