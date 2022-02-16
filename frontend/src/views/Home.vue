<template>
	<div class="home">
		<h1>Bienvenue au Cinéma de Noyant</h1>
		<div id="login">
			<div>
				<p class="p-float-label">
					<InputText class="" id="email" type="text" v-model="email" />
					<label for="email">Email</label>
				</p>
				<p class="p-float-label password">
					<InputText class="" id="password" type="text" v-model="password" />
					<label for="password">Mot de passe</label>
				</p>
			</div>
			<div>
				<Button label="Je me connecte" class="connect" @click="toConnect" />
			</div>
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
		};
	},
	components: {},
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
					localStorage.clear(); // ! A mettre dans beforeMount si non connecté ensuite
				})
				.catch((err) => {
					console.log(err);
				});
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
#login div:nth-child(2) {
	margin: 0;
	margin-top: auto;
	margin-left: 8rem;
}

.password {
	margin-top: 2.5rem;
	margin-bottom: 0;
}
.connect {
	font-size: 1.2rem;
	font-weight: bold;
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
</style>
