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
							:label="perm.sess_un.sess"
							:id="perm.sess_un.sess"
							class="grey p-button-secondary"
							@click="selectAvailable"
						/>
					</td>
					<td v-if="qty_sessions > 1">
						<Button
							:label="perm.sess_de.sess"
							:id="perm.sess_de.sess"
							class="grey p-button-secondary"
							@click="selectAvailable"
						/>
					</td>
					<td v-if="qty_sessions > 2">
						<Button
							:label="perm.sess_tr.sess"
							:id="perm.sess_tr.sess"
							class="grey p-button-secondary"
							@click="selectAvailable"
						/>
					</td>
					<td v-if="qty_sessions > 3">
						<Button
							:label="perm.sess_qu.sess"
							:id="perm.sess_qu.sess"
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
		};
	},
	created: function () {
		//* Display all volunteers, Sessions and Permanences
		this.getPermanences();
		this.getSessions();
	},
	methods: {
		//* Get French date
		dateFr: function (date) {
			moment.locale("fr");
			return `${moment(date).format("dddd D MMMM YYYY").toUpperCase()}`;
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
													sess_id: sess.data[this.first_session].id,
													sess: availun.data,
												},
												sess_de: {
													sess_id: sess.data[this.sec_session].id,
													sess: availde.data,
												},
												sess_tr: {
													sess_id: sess.data[this.third_session].id,
													sess: availtr.data,
												},
												sess_qu: {
													sess_id: sess.data[this.fourth_session].id,
													sess: availqu.data,
												},
											});
										});
									});
								});
							});
						}
					});
				}
			});
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
					this.sessions.sort(function (a, b) {
						var dateA = a.date;
						var dateB = b.date;

						if (dateA < dateB) {
							return -1;
						}
						if (dateA > dateB) {
							return 1;
						}
						return 0;
					});
				}
				// console.log(this.sessions);
			});
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
