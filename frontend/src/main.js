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
import ConfirmPopup from "primevue/confirmpopup";
import ConfirmationService from "primevue/confirmationservice";
import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";
import Password from "primevue/password";

import "primevue/resources/themes/saga-orange/theme.css"; //theme
import "primevue/resources/primevue.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import store from "./store";

createApp(App)
	.use(store)
	.use(PrimeVue, {
		locale: {
			weak: "Faible",
			medium: "Moyen",
			strong: "Fort",
			passwordPrompt: "Saisir un mot de passe",
			accept: "OK",
			reject: "Non",
			dayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
			dayNamesShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
			dayNamesMin: ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"],
			monthNames: [
				"Janvier",
				"Février",
				"Mars",
				"Avril",
				"Mai",
				"Juin",
				"Juillet",
				"Août",
				"Septembre",
				"Octobre",
				"Novembre",
				"Décembre",
			],
			monthNamesShort: [
				"Jan",
				"Fév",
				"Mar",
				"Avr",
				"Mai",
				"Jun",
				"Jul",
				"Aoû",
				"Sep",
				"Oct",
				"Nov",
				"Déc",
			],
			firstDayOfWeek: 1,
			dateFormat: "dd/mm/yyyy",
		},
	})
	.use(ConfirmationService)
	.component("Dialog", Dialog)
	.component("InputText", InputText)
	.component("Button", Button)
	.component("Editor", Editor)
	.component("ProgressSpinner", ProgressSpinner)
	.component("Calendar", Calendar)
	.component("ConfirmPopup", ConfirmPopup)
	.component("Password", Password)
	.use(ToastService)
	.component("Toast", Toast)
	.use(router)
	.mount("#app");
