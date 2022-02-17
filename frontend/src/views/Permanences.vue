<template>
	<div>
		<h1>Permanences des Bénévoles</h1>
		<p>
			Légende : Dispo, Pas dispo, Présense requise dans l'équipe Technique, dans l'équipe
			Accueil
		</p>
		<p>
			Cliquer sur la case au croisement de votre nom et de la permanence voulue. Faites autant
			de clics nécessaires pour faire apparaitre le status souhaité.
		</p>
		<div>
			<table>
				<tr>
					<th class="black"></th>
					<th v-if="qty_sessions > 0" class="black total">
						<p>
							Accueil : {{ totalVolunteers[0].count.Accueil }}<br />
							Technique : {{ totalVolunteers[0].count.Technique }}
						</p>
					</th>
					<th v-if="qty_sessions > 1" class="black total">
						<p>
							Accueil : {{ totalVolunteers[1].count.Accueil }}<br />
							Technique : {{ totalVolunteers[1].count.Technique }}
						</p>
					</th>
					<th v-if="qty_sessions > 2" class="black total">
						<p>
							Accueil : {{ totalVolunteers[2].count.Accueil }}<br />
							Technique : {{ totalVolunteers[2].count.Technique }}
						</p>
					</th>
					<th v-if="qty_sessions > 3" class="black total">
						<p>
							Accueil : {{ totalVolunteers[3].count.Accueil }}<br />
							Technique : {{ totalVolunteers[3].count.Technique }}
						</p>
					</th>
				</tr>
				<tr>
					<th class="black">
						<Button
							v-if="volunId == admin_id"
							:label="statusAdmin"
							:id="statusAdmBack"
							class="p-button-secondary"
							@click="adminProfil"
						/>
						<p v-if="volunId == admin_id">{{ profil }}</p>
					</th>
					<th v-if="qty_sessions > 0">
						<p>
							{{ dateFr(sessions[0].date) }}
						</p>
						<p class="times">
							<span>{{ sessions[0].time_perma }}</span> Permanence<br />
							<span>{{ sessions[0].time_seance }}</span> Séance
						</p>
					</th>
					<th v-if="qty_sessions > 1">
						<p>
							{{ dateFr(sessions[1].date) }}
						</p>
						<p class="times">
							<span>{{ sessions[1].time_perma }}</span> Permanence<br />
							<span>{{ sessions[1].time_seance }}</span> Séance
						</p>
					</th>
					<th v-if="qty_sessions > 2">
						<p>
							{{ dateFr(sessions[2].date) }}
						</p>
						<p class="times">
							<span>{{ sessions[2].time_perma }}</span> Permanence<br />
							<span>{{ sessions[2].time_seance }}</span> Séance
						</p>
					</th>
					<th v-if="qty_sessions > 3">
						<p>
							{{ dateFr(sessions[3].date) }}
						</p>
						<p class="times">
							<span>{{ sessions[3].time_perma }}</span> Permanence<br />
							<span>{{ sessions[3].time_seance }}</span> Séance
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
							@click="selectAvailable($event, perm, sessions[1].id, 2)"
						/>
					</td>
					<td v-if="qty_sessions > 2">
						<Button
							:label="perm.sess_tr.avail"
							:id="perm.sess_tr.avail"
							class="grey p-button-secondary"
							@click="selectAvailable($event, perm, sessions[2].id, 3)"
						/>
					</td>
					<td v-if="qty_sessions > 3">
						<Button
							:label="perm.sess_qu.avail"
							:id="perm.sess_qu.avail"
							class="grey p-button-secondary"
							@click="selectAvailable($event, perm, sessions[3].id, 4)"
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
				{
					avail_id: "perm.sess_un.avail_id",
					avail: "perm.sess_un.avail",
					count: "countun",
				},
				{
					avail_id: "perm.sess_de.avail_id",
					avail: "perm.sess_de.avail",
					count: "countde",
				},
				{
					avail_id: "perm.sess_tr.avail_id",
					avail: "perm.sess_tr.avail",
					count: "counttr",
				},
				{
					avail_id: "perm.sess_qu.avail_id",
					avail: "perm.sess_qu.avail",
					count: "countqu",
				},
			],
			newavailable: "",
			volunId: 3, //! A mettre dans Vuex lors d ela connexion
			admin_change: false, //to modify status of others
			statusAdmin: "Prendre profil Administrateur",
			statusAdmBack: "yellow",
			admin_id: process.env.VUE_APP_ADMIN,
			profil: "Profil Bénévole = OK",
			totalVolunteers: [],
		};
	},
	created: function () {
		//* Display all volunteers, Sessions and Permanences
		this.getSessions();
		this.getPermanences();
		this.getTotalVolunteers();
	},
	beforeMount: function () {
		// See profil in localStorage
		if (localStorage.getItem("profil") == "Admin") {
			this.statusAdmin = "Prendre profil Bénévole";
			this.statusAdmBack = "orange";
			this.profil = "Profil Admin = OK";
			this.admin_change = true; //to modify status of others
		} else {
			this.statusAdmin = "Prendre profil Administrateur";
			this.statusAdmBack = "yellow";
			this.profil = "Profil Bénévole = OK";
			this.admin_change = false;
		}
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
				}
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
												volun_id: vol.data[v].id,
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
			console.log(this.sessions);
		},

		//* Change the status of avail from a volunteer
		changeStatus: function (availid, availnow) {
			if (availnow == "dispo") {
				this.newavailable = "indispo";
			} else if (availnow == "indispo") {
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
					location.reload();
				})
				.catch((err) => console.log(err));
		},

		//* Change the status of avail from the administrator
		adminStatus: function (availid, availnow) {
			if (availnow == "dispo") {
				this.newavailable = "Accueil";
			} else if (availnow == "Accueil") {
				this.newavailable = "Technique";
			} else if (availnow == "Technique") {
				this.newavailable = "dispo";
			} else {
				console.log("la personne dopit avoir un status 'dispo' pour être confirmé !");
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

		//* Click on status of permamence
		selectAvailable: function (event, perm, sessionid, sessorder) {
			//! Si volun_Id est diff de vuex : mess err. Tu modifies seulement tes disponibilités...
			console.log(process.env.VUE_APP_ADMIN);
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
				if (this.volunId == process.env.VUE_APP_ADMIN && this.admin_change === true) {
					//! volunId de Vueex
					this.adminStatus(avail_id, avail);
					console.log("l'admin va changer le status !");
				} else {
					this.changeStatus(avail_id, avail);
				}
				console.log("modifier la donnée 'available' dans la table");
			}
		},

		//* Choose Admin profil or volunteer profil (from the administrator)
		adminProfil: function () {
			if (this.statusAdmin == "Prendre profil Administrateur") {
				this.statusAdmin = "Prendre profil Bénévole";
				this.statusAdmBack = "orange";
				this.profil = "Profil Admin = OK";
				this.admin_change = true; //to modify status of others
				localStorage.setItem("profil", "Admin");
			} else {
				this.statusAdmin = "Prendre profil Administrateur";
				this.statusAdmBack = "yellow";
				this.profil = "Profil Bénévole = OK";
				this.admin_change = false; //to modify status of others
				localStorage.setItem("profil", "Bénévole");
			}
		},

		//* Get total of volunteers who do Technique and Accueil by session
		getTotalVolunteers: function () {
			this.totalVolunteers = [];

			//! rechercher les sessions avec get, puis ordre croissant du tabl sur les id session
			// get all sessions
			axios({
				method: "get",
				url: process.env.VUE_APP_API + "session/getallsessions ",
				// headers: {
				// 	Authorization: `Bearer ${this.token}`,
				// },
			}).then((sess) => {
				for (let s = 0; s < sess.data.length; s++) {
					axios({
						method: "get",
						url:
							process.env.VUE_APP_API +
							"availability/gettotalvolunteers/" +
							sess.data[s].id +
							"/Technique",
						// headers: {
						// 	Authorization: `Bearer ${this.token}`,
						// },
					}).then((countTech) => {
						axios({
							method: "get",
							url:
								process.env.VUE_APP_API +
								"availability/gettotalvolunteers/" +
								sess.data[s].id +
								"/Accueil",
							// headers: {
							// 	Authorization: `Bearer ${this.token}`,
							// },
						}).then((countAcc) => {
							this.totalVolunteers.push({
								sessionid: sess.data[s].id,
								count: { Technique: countTech.data, Accueil: countAcc.data },
							});
							// sort alpha order
							this.totalVolunteers.sort(function (a, b) {
								var idA = a.sessionid;
								var idB = b.sessionid;

								if (idA < idB) {
									return -1;
								}
								if (idA > idB) {
									return 1;
								}
								return 0;
							});
						});
					});
				}
				console.log(this.totalVolunteers);
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
.black {
	background-color: black;
}
.total {
	text-align: left;
	padding-left: 4rem;
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
	background-color: rgb(68, 67, 67);
	font-weight: bold;
}
#yellow {
	background-color: yellow;
	color: black;
	font-weight: bold;
	width: 60%;
	height: 5rem;
}
#orange {
	background-color: orangered;
	color: black;
	font-weight: bold;
	width: 60%;
	height: 5rem;
}
</style>
