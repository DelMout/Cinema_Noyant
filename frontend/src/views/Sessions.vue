<template>
	<div>
		<h1>Créer les séances</h1>
		<div>
			<p>
				Nombre de séances maxi autorisé = 4<br />
				Séances à créer dans l'ordre chronologique.<br />
				Les séances dans le passé disparaissent automatiquement.
			</p>
		</div>
		<div id="date">
			<table>
				<tr>
					<th>Date</th>
					<th>Heure<br />Permanence</th>
					<th>Heure<br />séance film</th>
					<th class="black"></th>
				</tr>
				<tr v-for="sess in sessions" :key="sess.id">
					<td id="day">
						<p>{{ dateFr(sess.date) }}</p>
					</td>
					<td>
						<p>{{ sess.time_perma }}</p>
					</td>
					<td>
						<p>{{ sess.time_seance }}</p>
					</td>
					<td class="black">
						<Button
							id="trash"
							icon="pi pi-trash"
							class="p-button-rounded p-button-danger"
							@click="wantDelete($event, sess)"
						/>
					</td>
				</tr>

				<tr>
					<td class="creation">
						<p class="p-float-label">
							<Calendar
								id="dateformat"
								class="cell"
								v-model="date"
								dateFormat="dd/mm/yy"
							/>
							<label for="dateformat">Date </label>
						</p>
					</td>
					<td class="creation">
						<p class="p-float-label">
							<InputText
								class="cell"
								id="time_perma"
								type="text"
								v-model="time_perma"
							/>
							<label for="time_perma">Heure permanence</label>
						</p>
					</td>
					<td class="creation">
						<p class="p-float-label">
							<InputText
								class="cell"
								id="time_seance"
								type="text"
								v-model="time_seance"
							/>
							<label for="time_seance">Heure séance film</label>
						</p>
					</td>
					<td class="black" id="emplac_button">
						<div v-if="!sessionSaved">
							<Button
								label="Créer cette séance"
								class="p-button-raised p-button-primary save"
								@click="saveSession"
							/>
						</div>
						<div v-if="sessionSaved">
							<ProgressSpinner />
						</div>
					</td>
				</tr>
				<!-- <tr id="emplac_button">
					<td colspan="3">
						<div v-if="!sessionSaved">
							<Button
								label="Créer cette séance"
								class="p-button-raised p-button-primary save"
								@click="saveSession"
							/>
						</div>
						<div v-if="sessionSaved">
							<ProgressSpinner />
						</div>
					</td>
				</tr> -->
			</table>
		</div>
		<div>
			<Dialog header="Confirmation" v-model:visible="dialog" :style="{ width: '15vw' }"
				><p>Séance sauvegardée !</p>
				<template #footer>
					<Button label="OK" @click="closeCreated" autofocus />
				</template>
			</Dialog>
		</div>
		<ConfirmPopup></ConfirmPopup>
		<ConfirmPopup group="demo">
			<template #message="slotProps">
				<div class="p-d-flex p-p-4">
					<i :class="slotProps.message.icon" style="font-size: 1.5rem"></i>
					<p class="p-pl-2">{{ slotProps.message.message }}</p>
				</div>
			</template>
		</ConfirmPopup>
	</div>
</template>
<script>
import axios from "axios";
import moment from "moment";

export default {
	data() {
		return {
			date: "",
			time_perma: "",
			time_seance: "",
			sessionSaved: false,
			dialog: false,
			sessions: [],
		};
	},
	created: function () {
		this.getAllSessions();
	},
	methods: {
		//* Get French date
		dateFr: function (date) {
			moment.locale("fr");
			return `${moment(date).format("dddd D MMMM YYYY").toUpperCase()}`;
		},

		//* Get all sessions
		getAllSessions: function () {
			(this.sessions = []),
				axios.get(process.env.VUE_APP_API + "session/getallsessions").then((sess) => {
					for (let s = 0; s < sess.data.length; s++) {
						this.sessions.push({
							id: sess.data[s].id,
							date: sess.data[s].date,
							time_perma: sess.data[s].time_perma,
							time_seance: sess.data[s].time_seance,
						});
					}
				});
		},

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

		//* Want delete a session
		wantDelete: function (event, sess) {
			this.$confirm.require({
				target: event.currentTarget,
				message: "Souhaitez-vous supprimer cette séance ?",
				icon: "pi pi-info-circle",
				acceptClass: "p-button-danger",
				accept: () => {
					this.deleteSession(event, sess);
				},
				reject: () => {},
			});
		},

		//* Delete a session
		deleteSession: function (event, sess) {
			axios.delete(process.env.VUE_APP_API + "session/delete/" + sess.id).then(() => {
				location.reload();
			});
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
	width: 50%;
	/* background-color: aqua; */
	display: flex;
	flex-direction: column;
}

.save {
	font-weight: bold;
	margin-top: auto;
}
#emplac_button {
	background-color: black;
}

table {
	margin: auto;
	border-collapse: collapse;
	background-color: dimgray;
}
td,
th {
	border: 3px solid black;
	width: 10rem;
}
th {
	height: 3.5rem;
	background-color: rgb(68, 67, 67);
}
td {
	text-align: left;
	padding-left: 1rem;
}
.cell {
	width: 10rem;
	margin-right: 1rem;
}
.creation {
	background-color: rgb(243, 184, 75);
	color: black;
}
.creation p {
	margin-top: 2rem;
}
/* .creation td p {
	margin-top: 5rem;
	margin-bottom: 0rem;
	background-color: green;
} */
#day {
	width: 15rem;
}
table .black {
	background-color: black;
	border: 3px solid black;
}
</style>
