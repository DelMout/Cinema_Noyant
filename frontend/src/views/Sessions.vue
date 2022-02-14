<template>
	<div>
		<h1>Sélectionner les séances</h1>
		<div id="date">
			<p class="p-float-label">
				<Calendar id="dateformat" v-model="date" dateFormat="dd/mm/yy" />
				<label for="dateformat">Date </label>
			</p>
			<p class="p-float-label">
				<InputText class="" id="time_perma" type="text" v-model="time_perma" />
				<label for="time_perma">Heure permanence</label>
			</p>
			<p class="p-float-label">
				<InputText class="" id="time_seance" type="text" v-model="time_seance" />
				<label for="time_seance">Heure séance film</label>
			</p>
			<div id="button">
				<div v-if="!sessionSaved">
					<Button
						label="Sauvegarder cette séance"
						class="p-button-raised p-button-primary save"
						@click="saveSession"
					/>
				</div>
				<div v-if="sessionSaved">
					<ProgressSpinner />
				</div>
			</div>
		</div>
		<div>
			<Dialog header="Confirmation" v-model:visible="dialog" :style="{ width: '15vw' }"
				><p>Séance sauvegardée !</p>
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
			date: "",
			time_perma: "",
			time_seance: "",
			sessionSaved: false,
			dialog: false,
		};
	},
	methods: {
		//* Create a new session
		saveSession: function () {
			this.sessionSaved = true;
			axios
				.post(process.env.VUE_APP_API + "session/create", {
					date: this.date,
					time_perma: this.time_perma,
					time_seance: this.time_seance,
				})
				.then(() => {
					console.log("session saved !");
					this.sessionSaved = false;
					this.dialog = true;
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
	margin-top: 7rem;
}
#date {
	margin: auto;
	margin-top: 2rem;
	width: 20%;
	/* background-color: aqua; */
	display: flex;
	flex-direction: column;
}
#date > p {
	display: flex;
}
p {
	margin-top: 2rem;
}
#button {
	display: flex;
	margin-top: 3rem;
}
.save {
	font-weight: bold;
}
</style>
