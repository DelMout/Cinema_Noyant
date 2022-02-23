<template>
	<div id="nav">
		<div id="volun">
			<router-link to="/">Accueil</router-link>
			<router-link v-if="connected" to="/permanences">Permanences</router-link>
		</div>
		<div id="admin">
			<router-link to="/abonnes">Abonnés</router-link>
			<router-link to="/email_abonnes">Email Abonnés</router-link>
			<router-link to="/selection_seances">Séances</router-link>
			<router-link to="/email_benevoles">Email Bénévoles</router-link>
			<router-link v-if="connected" to="/decon" @click="disconnect">Déconnexion</router-link>
		</div>
	</div>
	<div id="router"><router-view /></div>
</template>
<script>
import { mapState, mapActions } from "vuex";

export default {
	data() {
		return {
			isAdminApp: 0,
		};
	},
	computed: {
		...mapState(["connected"]),
	},
	beforeMount: function () {
		this.$store.dispatch("checkConnect");
		this.isAdminApp = parseInt(localStorage.getItem("isAdmin"));
	},
	updated: function () {
		this.$store.dispatch("checkConnect");
		this.isAdminApp = parseInt(localStorage.getItem("isAdmin"));
	},
	methods: {
		...mapActions(["disconnect"]),

		//* Disconnect
		disconnect: function () {
			localStorage.clear();
			this.$store.dispatch("disconnect");
			this.$router.push("/");
		},
	},
};
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: white;
}

#nav {
	margin-top: 2rem;
	z-index: 1;
	position: absolute;
	top: 0;
	/* background-color: yellow; */
	width: 100%;
	display: flex;
	justify-content: center;
}
#router {
	z-index: 10;
}

#nav a {
	font-weight: bold;
	color: white;
}

#admin a.router-link-exact-active {
	color: greenyellow;
}
#volun a {
	color: rgb(158, 158, 20);
}
#volun a.router-link-exact-active {
	color: yellow;
}
a {
	margin-left: 0.5rem;
	margin-right: 0.5rem;
}
</style>
