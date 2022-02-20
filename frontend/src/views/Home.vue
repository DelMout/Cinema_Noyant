<template>
	<div class="home">
		<h1>Bienvenue au Cinéma de Noyant</h1>
		<div id="login">
			<div>
				<p class="p-float-label">
					<InputText
						class="email"
						id="email"
						type="text"
						inputStyle="width:100%"
						v-model="email"
					/>
					<label for="email">Email</label>
				</p>
				<p v-if="!forgot" class="p-float-label password">
					<!-- <InputText class="" id="password" type="text" v-model="password" /> -->
					<Password
						class=" "
						id="password"
						@keyup.enter="enter"
						v-model="password"
						inputStyle="width:100%"
						:feedback="false"
						toggleMask
					>
					</Password>

					<label for="password">Mot de passe</label>
				</p>
				<p id="init" v-if="forgot">
					Merci de renseigner votre adresse email.<br />Vous allez recevoir un email pour
					initialiser votre mot de passe.
				</p>
			</div>
			<div>
				<Button
					v-if="!forgot"
					label="Mot de passe oublié"
					class="forgot p-button-text p-button-secondary"
					id="forgot"
					@click="forgotten"
				/>
				<Button v-if="!forgot" label="Je me connecte" class="connect" @click="toConnect" />
				<Button
					v-if="forgot"
					label="Initialiser mot de passe"
					class="forgot_button"
					@click="sendLinkPassword"
				/>
			</div>
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
		<div id="delphine">
			<a href="https://delmout.com" target="_blank"
				><i>&#xA9; Site créé par Delphine Moutault</i></a
			>
		</div>
	</div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";

export default {
	name: "Home",
	data() {
		return {
			email: "",
			password: "",
			forgot: false,
		};
	},
	created: function () {
		this.deletePastSessions();
	},
	methods: {
		//* To Connect
		toConnect: function () {
			axios
				.post(process.env.VUE_APP_API + "volunteer/login", {
					email: this.email,
					password: this.password,
				})
				.then(() => {
					console.log("you are connected !");
					// update jeton
					axios({
						method: "put",
						url: process.env.VUE_APP_API + "volunteer/newjeton/" + this.email,
						// headers: {
						// 	Authorization: `Bearer ${this.token}`,
						// },
					}).then(() => {
						this.$router.push("/permanences");
					});
					localStorage.clear(); // ! A mettre dans beforeMount si non connecté ensuite
				})
				.catch((err) => {
					console.log(err);
				});
		},

		//* Password forgotten
		forgotten: function () {
			this.forgot = true;
		},

		// Ask for initialisation of password
		sendLinkPassword: function () {
			axios
				.post(process.env.VUE_APP_API + "volunteer/emailpassword/" + this.email)
				.then(() => {
					this.$toast.add({
						severity: "info",
						detail: "Email envoyé !",
						closable: false,
						life: 4000,
					});
					this.forgot = false;
				})
				.catch(() => {
					this.$toast.add({
						severity: "error",
						detail: "Cette adresse email ne correspond à aucun compte.",
						closable: false,
						life: 4000,
					});
				});
		},

		//* Delete sessions if past dates
		deletePastSessions: function () {
			axios
				.delete(process.env.VUE_APP_API + "session/deletepastdates ")
				.then(() => {})
				.catch(() => {});
		},
	},
};
</script>
<style scoped>
.home {
	position: absolute;
	top: 0;
	width: 100vw;
	height: 100vh;
	background-image: url("../assets/screen.jpg");
	background-size: 100% 120%;
	/* background-color: blue; */
}
h1 {
	margin-top: 8rem;
	color: white;
}
#login {
	/* background-color: pink; */
	margin-top: 30vh;
	display: flex;
	width: 35%;
	margin-left: 35%;
}
#login > div {
	font-size: 1.2rem;
	width: 35%;
	/* background-color: blue; */
	margin-top: auto;
	text-align: left;
	display: flex;
	flex-direction: column;
}
.email {
	width: 100%;
}
#login div:nth-child(2) {
	margin: 0;
	margin-top: 0;
	margin-left: 8rem;
}

.password {
	margin-top: 2.5rem;
	margin-bottom: 0;
}
.forgot {
	text-decoration: underline;
	margin-top: 1rem;
}
#forgot {
	color: black;
}
.connect {
	font-size: 1.2rem;
	font-weight: bold;
	margin-top: 3.5rem;
}

#delphine {
	position: absolute;
	bottom: 1rem;
	right: 1rem;
	font-weight: bold;
}
#delphine a {
	color: white;
	text-decoration: none;
}
#init {
	color: black;
	text-align: justify;
	margin: 0;
	font-size: 1rem;
}
.forgot_button {
	margin-bottom: 0rem;
	margin-top: auto;
	font-weight: bold;
}
</style>
