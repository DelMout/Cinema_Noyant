<template>
	<div>
		<h1>Envoi email à tous les bénévoles</h1>

		<div id="email">
			<p id="titre">
				<label for="object">Objet : </label
				><InputText type="text" id="object" v-model="object" />
			</p>
			<div id="window">
				<Editor v-model="body" editorStyle="height: 50vh;">
					<template #toolbar>
						<span class="ql-formats">
							<button class="ql-bold"></button>
							<button class="ql-italic"></button>
							<button class="ql-underline"></button>
							<button class="ql-list" value="ordered"></button>
							<button class="ql-list" value="bullet"></button>
						</span>
					</template>
				</Editor>
			</div>
			<div id="pied">
				<br />
				<a href="http://localhost:8080/">Voir les permanences des bénévoles</a>
				<p>Merci de ne pas répondre à cet email.</p>
				<p>L'administration de l'équipe Cinéma de Noyant</p>
			</div>
			<div id="send">
				<div v-if="!emailSent">
					<Button
						label="Envoyer l'email"
						class="p-button-raised p-button-primary envoi"
						@click="sendEmail"
					/>
				</div>
				<div v-if="emailSent">
					<ProgressSpinner />
				</div>
			</div>
		</div>
		<div>
			<Dialog header="Confirmation" v-model:visible="dialog" :style="{ width: '20vw' }"
				><p>Email envoyé à tous les bénévoles !</p>
				<template #footer>
					<Button label="OK" @click="closeCreated" autofocus />
				</template>
			</Dialog>
		</div>
		<div style="width: 30vw">
			<Toast position="center" :breakpoints="{ '400px': { width: '95%' } }">
				<template #message="slotProps">
					<div class="p-d-flex p-flex-row">
						<div class="p-text-center">
							<i class="pi pi-exclamation-triangle" style="font-size: 2rem"></i>
							<p>{{ slotProps.message.detail }}</p>
						</div>
					</div>
				</template>
			</Toast>
		</div>
	</div>
</template>
<script>
import axios from "axios";
import { mapState, mapActions } from "vuex";

export default {
	data() {
		return {
			body: "",
			object: "",
			emailSent: false,
			dialog: false,
		};
	},
	computed: {
		...mapState(["token", "connected"]),
	},
	methods: {
		...mapActions(["checkConnect"]),
		//* Send email to all volunteers
		sendEmail: function () {
			this.$store.dispatch("checkConnect");
			if (!this.connected) {
				this.$router.push("/");
			} else {
				// If no poster selected OR title OR contenu do not continue
				if (this.object == "") {
					this.$toast.add({
						severity: "error",
						detail: "Merci d'écrire un objet à votre email.",
						closable: false,
						life: 4000,
					});
				} else if (this.body == "") {
					this.$toast.add({
						severity: "error",
						detail: "Merci d'écrire un contenu dans le corps de votre email.",
						closable: false,
						life: 4000,
					});
				} else {
					this.emailSent = true;
					axios({
						method: "post",
						url: process.env.VUE_APP_API + "volunteer/emailinfo",
						data: {
							title: this.object,
							content: this.body,
						},
						headers: {
							Authorization: `Bearer ${this.token}`,
						},
					})
						.then(() => {
							this.dialog = true;
							this.emailSent = false;
						})
						.catch(() => {
							this.$toast.add({
								severity: "error",
								detail: "Un problème est survenu. L'envoi de l'email n'a pas été effectué.",
								closable: false,
								life: 4000,
							});
						});
				}
			}
		},

		//* Close dialog box
		closeCreated: function () {
			this.dialog = false;
			location.reload();
		},
	},
};
</script>
<style scoped>
h1 {
	margin-top: 5rem;
}
#email {
	width: 60%;
	margin: auto;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}
#window {
	width: 100%;
}
#pied {
	text-align: left;
}
#send {
	margin-bottom: 5rem;
}
.envoi {
	font-weight: bold;
}
a {
	color: blue;
	margin-left: 0;
}
</style>
