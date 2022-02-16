<template>
	<div>
		<h1>Permanences des Bénévoles</h1>
		<p>
			Légende : Dispo, Pas dispo, Présense requise dans l'équipe Technique, dans l'équipe
			Accueil
		</p>
		<div>
			<table>
				<tr>
					<th id="black"></th>
					<th>
						<p>
							{{ dateFr(sessions[0].date) }}
						</p>
						<p class="times">
							<span>{{ sessions[0].time_perma }}</span> Permanence<br />
							<span>{{ sessions[0].time_seance }}</span> Séance
						</p>
					</th>
					<th>
						<p>
							{{ dateFr(sessions[1].date) }}
						</p>
						<p class="times">
							<span>{{ sessions[1].time_perma }}</span> Permanence<br />
							<span>{{ sessions[1].time_seance }}</span> Séance
						</p>
					</th>
					<th>
						<p>
							{{ dateFr(sessions[2].date) }}
						</p>
						<p class="times">
							<span>{{ sessions[2].time_perma }}</span> Permanence<br />
							<span>{{ sessions[2].time_seance }}</span> Séance
						</p>
					</th>
				</tr>

				<tr v-for="perm in permanences" :key="perm.id">
					<td id="name">{{ perm.name }}</td>
					<td v-if="qty_sessions > 0">
						<Button
							:label="perm.sess_un.avail"
							:id="perm.sess_un.avail"
							class="grey p-button-secondary"
							@click="selectAvailable($event, perm, sessions[0].id, 1)"
						/>
					</td>
					<td v-if="qty_sessions > 1">
						<Button
							:label="perm.sess_de.avail"
							:id="perm.sess_de.avail"
							class="grey p-button-secondary"
							@click="selectAvailable"
						/>
					</td>
					<td v-if="qty_sessions > 2">
						<Button
							:label="perm.sess_tr.avail"
							:id="perm.sess_tr.avail"
							class="grey p-button-secondary"
							@click="selectAvailable"
						/>
					</td>
					<td v-if="qty_sessions > 3">
						<Button
							:label="perm.sess_qu.avail"
							:id="perm.sess_qu.avail"
							class="grey p-button-secondary"
							@click="selectAvailable"
						/>
					</td>
				</tr>
			</table>
		</div>
	</div>
</template>
<script>
import axios from "axios";
import moment from "moment";

export default {
	data() {
		return {
			permanences: [],
			sessions: [],
			qty_sessions: "",
			first_session: 0,
			sec_session: 0,
			third_session: 0,
			fourth_session: 0,
			value_avail: [
				{ avail_id: "nothing", avail: "nothing" },
				{ avail_id: "perm.sess_un.avail_id", avail: "perm.sess_un.avail" },
			],
			newavailable: "",
			volunId: 3, //! A mettre dans Vuex lors d ela connexion
		};
	},
	created: function () {
		//* Display all volunteers, Sessions and Permanences
		this.getSessions();
		this.getPermanences();
	},

	methods: {
		//* Get French date
		dateFr: function (date) {
			moment.locale("fr");
			return `${moment(date).format("dddd D MMMM YYYY").toUpperCase()}`;
		},

		//* Table of next sessions
		getSessions: function () {
			this.sessions = [];
			axios({
				method: "get",
				url: process.env.VUE_APP_API + "session/getallsessions",
				// headers: {
				// 	Authorization: `Bearer ${this.token}`,
				// },
			}).then((sess) => {
				for (let s = 0; s < sess.data.length; s++) {
					this.sessions.push({
						id: sess.data[s].id,
						date: sess.data[s].date,
						time_perma: sess.data[s].time_perma,
						time_seance: sess.data[s].time_seance,
					});
					// sort alpha order
					// this.sessions.sort(function (a, b) {
					// 	var dateA = a.date;
					// 	var dateB = b.date;

					// 	if (dateA < dateB) {
					// 		return -1;
					// 	}
					// 	if (dateA > dateB) {
					// 		return 1;
					// 	}
					// 	return 0;
					// });
				}
				// console.log(this.sessions);
			});
		},

		//* Get permanences
		getPermanences: function () {
			this.permanences = [];
			this.available_volun = [];

			// get all volunteers
			axios({
				method: "get",
				url: process.env.VUE_APP_API + "volunteer/getallvolunteers",
				// headers: {
				// 	Authorization: `Bearer ${this.token}`,
				// },
			}).then((vol) => {
				// for (let v = 0; v < 1; v++) {
				for (let v = 0; v < vol.data.length; v++) {
					//!
					// get all sessions
					axios({
						method: "get",
						url: process.env.VUE_APP_API + "session/getallsessions ",
						// headers: {
						// 	Authorization: `Bearer ${this.token}`,
						// },
					}).then((sess) => {
						this.qty_sessions = sess.data.length;
						if (this.qty_sessions === 0) {
							//do nothing
						} else {
							if (this.qty_sessions > 1) {
								this.sec_session = 1;
							}
							if (this.qty_sessions > 2) {
								this.third_session = 2;
							}
							if (this.qty_sessions > 3) {
								this.fourth_session = 3;
							}

							// get each permanence
							axios({
								method: "get",
								url:
									process.env.VUE_APP_API +
									"availability/getavailable/" +
									vol.data[v].id +
									"/" +
									sess.data[this.first_session].id,
								// headers: {
								// 	Authorization: `Bearer ${this.token}`,
								// },
							}).then((availun) => {
								axios({
									method: "get",
									url:
										process.env.VUE_APP_API +
										"availability/getavailable/" +
										vol.data[v].id +
										"/" +
										sess.data[this.sec_session].id,
									// headers: {
									// 	Authorization: `Bearer ${this.token}`,
									// },
								}).then((availde) => {
									axios({
										method: "get",
										url:
											process.env.VUE_APP_API +
											"availability/getavailable/" +
											vol.data[v].id +
											"/" +
											sess.data[this.third_session].id,
										// headers: {
										// 	Authorization: `Bearer ${this.token}`,
										// },
									}).then((availtr) => {
										axios({
											method: "get",
											url:
												process.env.VUE_APP_API +
												"availability/getavailable/" +
												vol.data[v].id +
												"/" +
												sess.data[this.fourth_session].id,
											// headers: {
											// 	Authorization: `Bearer ${this.token}`,
											// },
										}).then((availqu) => {
											this.permanences.push({
												id: vol.data[v].id,
												name:
													vol.data[v].first_name +
													" " +
													vol.data[v].last_name,
												sess_un: {
													avail_id: availun.data.id,
													sess_id: sess.data[this.first_session].id,
													avail: availun.data.available,
												},
												sess_de: {
													avail_id: availde.data.id,
													sess_id: sess.data[this.sec_session].id,
													avail: availde.data.available,
												},
												sess_tr: {
													avail_id: availtr.data.id,
													sess_id: sess.data[this.third_session].id,
													avail: availtr.data.available,
												},
												sess_qu: {
													avail_id: availqu.data.id,
													sess_id: sess.data[this.fourth_session].id,
													avail: availqu.data.available,
												},
											});
											// sort alpha order
											this.permanences.sort(function (a, b) {
												var nameA = a.name;
												var nameB = b.name;

												if (nameA < nameB) {
													return -1;
												}
												if (nameA > nameB) {
													return 1;
												}
												return 0;
											});
										});
									});
								});
							});
						}
					});
				}
			});
			console.log(this.permanences);
		},

		//* Change the status of avail from a volunteer
		changeStatus: function (availid, availnow) {
			if (availnow == "dispo") {
				this.newavailable = "indispo";
			} else {
				this.newavailable = "dispo";
			}
			axios({
				method: "put",
				url:
					process.env.VUE_APP_API +
					"availability/volunteermodify/" +
					availid +
					"/" +
					this.newavailable,
				// headers: {
				// 	Authorization: `Bearer ${this.token}`,
				// },
			}).then(() => {
				location.reload();
			});
		},

		//* Create a new avail from a volunteer (new line in table "availabilities")
		createStatus: function (volunid, sessionid) {
			axios({
				method: "post",
				url: process.env.VUE_APP_API + "availability/create/" + volunid + "/" + sessionid,
				// headers: {
				// 	Authorization: `Bearer ${this.token}`,
				// },
			})
				.then(() => {
					console.log("youpi");
					// location.reload();
				})
				.catch((err) => console.log(err));
		},

		//* Change status of permamence
		selectAvailable: function (event, perm, sessionid, sessorder) {
			//! Si volunteerId est diff de vuex : mess err. Tu modifies seulement tes disponibilités...
			var avail_id = eval(this.value_avail[sessorder].avail_id);
			var avail = eval(this.value_avail[sessorder].avail);
			console.log("co = " + this.value_avail[1].avail_id);
			console.log("avail = " + avail);
			console.log("sessionId = " + sessionid);
			console.log("availId = " + avail_id);
			if (avail == null) {
				this.createStatus(this.volunId, sessionid);
				//! volunteerId = volunteerId de Vuex
				console.log("il faut créer une nouvelle entrée dans la table availabilitues");
			} else {
				this.changeStatus(avail_id, avail);
				console.log("modifier la donnée 'available' dans la table");
			}
		},
	},
};
</script>
<style scoped>
h1 {
	margin-top: 5rem;
}
table {
	margin: auto;
	margin-top: 3rem;
	margin-bottom: 2rem;
	border-collapse: collapse;
	background-color: dimgray;
}
td,
th {
	border: 5px solid black;
	width: 16rem;
}
th {
	height: 2.5rem;
	background-color: rgb(68, 67, 67);
}
#black {
	background-color: black;
}
td {
	text-align: left;
	height: 2.5rem;
}
.times {
	font-weight: 100;
	text-align: left;
	margin-left: 4rem;
}
.times span {
	font-weight: bold;
}
#dispo {
	background-color: green;
}
#indispo {
	background-color: red;
}
#Accueil {
	background-color: purple;
	color: white;
	font-weight: bold;
}
#Technique {
	background-color: blue;
	color: white;
	font-weight: bold;
}
.grey {
	background-color: grey;
	width: 100%;
}
#name {
	padding-left: 1rem;
}
</style>
