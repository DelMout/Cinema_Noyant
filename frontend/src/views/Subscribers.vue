<template>
	<div>
		<h1>Liste des abonnés</h1>
		<div>
			<table>
				<tr>
					<th>Nom</th>
					<th>Prénom</th>
					<th>Email</th>
				</tr>
				<tr v-for="sub in subscribers" :key="sub.email">
					<td>
						<p>{{ sub.last_name }}</p>
					</td>
					<td>
						<p>{{ sub.first_name }}</p>
					</td>
					<td>
						<p>{{ sub.email }}</p>
					</td>
				</tr>
				<tr class="creation_title">
					<th>Nom</th>
					<th>Prénom</th>
					<th>Email</th>
				</tr>
				<tr class="creation">
					<td>
						<input class="createProd" type="text" id="qtymini" v-model="last_name" />
					</td>
					<td><input class="" type="text" id="" v-model="first_name" /></td>
					<td><input class="" type="text" id="" v-model="email" /></td>
				</tr>
				<tr id="emplac_button">
					<td colspan="3">
						<Button
							label="Créer le nouvel abonné"
							class="button_subscriber"
							@click="createSubscriber"
						/>
					</td>
				</tr>
			</table>
		</div>
		<div>
			<Dialog header="Confirmation" v-model:visible="dialog" :style="{ width: '15vw' }"
				><p>Nouvel abonné créé !</p>
				<template #footer>
					<Button label="OK" @click="closeCreated" autofocus />
				</template>
			</Dialog>
		</div>
	</div>
</template>
<script>
import axios from "axios";
import { mapState, mapActions } from "vuex";

export default {
	data() {
		return {
			subscribers: [],
			last_name: "",
			first_name: "",
			email: "",
			dialog: false,
		};
	},
	computed: {
		...mapState(["token", "connected"]),
	},
	beforeCreate: function () {
		this.subscribers = [];
	},
	created: function () {
		//* All subscribers
		this.$store.dispatch("checkConnect");
		if (!this.connected) {
			this.$router.push("/");
		} else {
			axios({
				method: "get",
				url: process.env.VUE_APP_API + "subscriber/getallsubs",
				headers: {
					Authorization: `Bearer ${this.token}`,
				},
			}).then((subs) => {
				console.log(subs.data.length);
				for (let s = 0; s < subs.data.length; s++) {
					this.subscribers.push({
						last_name: subs.data[s].last_name,
						first_name: subs.data[s].first_name,
						email: subs.data[s].email,
					});
					// sort alpha order
					this.subscribers.sort(function (a, b) {
						var nameA = a.last_name.toUpperCase();
						var nameB = b.last_name.toUpperCase();

						if (nameA < nameB) {
							return -1;
						}
						if (nameA > nameB) {
							return 1;
						}
						return 0;
					});
				}
			});
		}
	},
	methods: {
		...mapActions(["checkConnect"]),
		//* Create a new subscriber
		createSubscriber: function () {
			this.$store.dispatch("checkConnect");
			if (!this.connected) {
				this.$router.push("/");
			} else {
				axios({
					method: "post",
					url: process.env.VUE_APP_API + "subscriber/create",
					data: {
						email: this.email,
						last_name: this.last_name,
						first_name: this.first_name,
					},
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				}).then(() => {
					this.dialog = true;
				});
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
	margin-top: 6rem;
}
table {
	margin: auto;
	margin-top: 3rem;
	border-collapse: collapse;
	background-color: dimgray;
}
td,
th {
	border: 1px solid white;
	width: 16rem;
}
th {
	height: 2.5rem;
	background-color: rgb(68, 67, 67);
}
td {
	text-align: left;
	padding-left: 1rem;
}
.creation_title th {
	background-color: orange;
	color: black;
}
.creation td,
.creation input {
	background-color: rgb(243, 184, 75);
	color: black;
	height: 2rem;
}
#emplac_button td {
	background-color: black;
	border-collapse: collapse;
	border: 1px solid black;
}
.button_subscriber {
	background-color: orange;
	margin-top: 1rem;
	font-weight: bold;
	margin-left: 16rem;
}
</style>
