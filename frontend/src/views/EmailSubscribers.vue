<template>
	<div>
		<h1>Envoi email à tous les abonnés</h1>

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
				<p>Merci de ne pas répondre à cet email.</p>
				<p>
					L'équipe Cinéma de Noyant<br />
					Familles Rurales
				</p>
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
			<Dialog header="Confirmation" v-model:visible="dialog" :style="{ width: '15vw' }"
				><p>Email envoyé à tous les abonnés !</p>
				<template #footer>
					<Button label="OK" @click="closeCreated" autofocus />
				</template>
			</Dialog>
		</div>
	</div>
</template>
<script>
import axios from "axios";

export default {
	data() {
		return {
			body: "",
			object: "",
			emailSent: false,
			dialog: false,
		};
	},
	methods: {
		//* Send email to all subscribers
		sendEmail: function () {
			this.emailSent = true;
			axios({
				method: "post",
				url: process.env.VUE_APP_API + "subscriber/sendemail",
				data: {
					title: this.object,
					content: this.body,
				},
				// headers: {
				// 	Authorization: `Bearer ${this.token}`,
				// },
			}).then(() => {
				this.dialog = true;
				this.emailSent = false;
			});
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
</style>
