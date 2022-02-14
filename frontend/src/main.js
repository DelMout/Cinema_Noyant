import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Editor from "primevue/editor";
import ProgressSpinner from "primevue/progressspinner";
import Calendar from "primevue/calendar";

import "primevue/resources/themes/saga-orange/theme.css"; //theme
import "primevue/resources/primevue.min.css"; //core css
import "primeicons/primeicons.css"; //icons

createApp(App)
	.use(PrimeVue)
	.component("Dialog", Dialog)
	.component("InputText", InputText)
	.component("Button", Button)
	.component("Editor", Editor)
	.component("ProgressSpinner", ProgressSpinner)
	.component("Calendar", Calendar)
	.use(router)
	.mount("#app");
