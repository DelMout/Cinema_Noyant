<template>
	<div>
		<h1>Bonjour {{ prenom }} {{ nom }},</h1>
		<p>Merci de renseigner ci-dessous votre nouveau mot de passe.</p>
		<div id="juxtaButton">
			<p class="p-float-label field">
				<Password
					class="fill"
					id="password"
					@keyup.enter="enter"
					v-model="password"
					inputStyle="width:100%"
					:feedback="true"
					toggleMask
				>
					<template #footer>
						<br />
						<ul class="p-pl-2 p-ml-2 p-mt-0" style="line-height: 1.5">
							<li>Au moins 1 minuscule</li>
							<li>Au moins 1 majuscule</li>
							<li>Au moins 1 chiffre</li>
							<li>Minimum 8 caractères</li>
						</ul>
					</template>
				</Password>
				<label for="password">Mot de passe</label>
			</p>
			<Button label="Valider" class="p-button-raised p-button valider" @click="setpassword" />
		</div>
	</div>
</template>
<script>
import axios from "axios";
import { mapMutations, mapState, mapActions } from "vuex";

export default {
	data() {
		return {
			prenom: "",
			nom: "",
			password: "",
			email: "",
		};
	},
	beforeMount: function () {
		this.findDatas();
	},
	computed: {
		...mapState(["", "token", "userId", "isAdmin"]),
	},
	methods: {
		...mapMutations(["setAdmin"]),
		...mapActions(["checkConnect"]),
		//* Find datas user from jeton
		findDatas: function () {
			axios({
				method: "get",
				url: process.env.VUE_APP_API + "volunteer/fromjeton/" + this.$route.params.jeton,
			}).then((volunteer) => {
				this.prenom = volunteer.data.first_name;
				this.nom = volunteer.data.last_name;
				this.email = volunteer.data.email;
			});
		},

		//* Save new password
		setpassword: function () {
			axios
				.put(process.env.VUE_APP_API + "volunteer/password/" + this.$route.params.jeton, {
					password: this.password,
				})
				.then(() => {
					// login
					axios
						.post(process.env.VUE_APP_API + "volunteer/login", {
							email: this.email,
							password: this.password,
						})
						.then((vol) => {
							const { volunteerId, token, isAdmin } = vol.data;
							localStorage.setItem("volunteerId", volunteerId);
							localStorage.setItem("token", token);
							localStorage.setItem("isAdmin", isAdmin);
							this.setAdmin(isAdmin);
							this.$store.commit("setExpired", false);
							this.$store.dispatch("checkConnect");

							// update jeton
							axios({
								method: "put",
								url: process.env.VUE_APP_API + "volunteer/newjeton/" + this.email,
								headers: {
									Authorization: `Bearer ${this.token}`,
								},
							})
								.then(() => {
									this.$router.push("/permanences");
								})
								.catch(() => {
									this.$router.push("/permanences");
								});
						});
				});
		},
		//* Press Enter on password cell
		enter: function () {
			this.setpassword();
		},
	},
};
</script>
<style scoped>
h1 {
	color: white;
	margin-top: 10rem;
}
.field {
	width: 20vw;
	margin-right: 2rem;
}
.fill {
	width: 20vw;
}
#juxtaButton {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 2rem;
}
.valider {
	height: 40px;
}
</style>
