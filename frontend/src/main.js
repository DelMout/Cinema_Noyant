import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import InputText from "primevue/inputtext";
import Button from "primevue/button";

import "primevue/resources/themes/saga-orange/theme.css"; //theme
import "primevue/resources/primevue.min.css"; //core css
import "primeicons/primeicons.css"; //icons

createApp(App)
	.use(PrimeVue)
	.component("InputText", InputText)
	.component("Button", Button)
	.use(router)
	.mount("#app");
