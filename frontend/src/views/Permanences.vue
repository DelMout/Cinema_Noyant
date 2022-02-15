<template>
	<div>
		<h1>Permanences des Bénévoles</h1>
		<div>
			<table>
				<tr>
					<th>Bénévoles</th>
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
				<!-- <tr>
					<td>Tartempion</td>
					<td>1</td>
					<td>1</td>
				</tr> -->
				<tr v-for="vol in volunteers" :key="vol.id">
					<td>{{ vol.name }}</td>
					<td>1</td>
					<td>1</td>
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
			volunteers: [],
			sessions: [],
		};
	},
	created: function () {
		//* Display all volunteers, Sessions and Permanences
		this.getVolunteers();
		this.getSessions();
	},
	methods: {
		//* Get French date
		dateFr: function (date) {
			moment.locale("fr");
			return `${moment(date).format("dddd D MMMM YYYY").toUpperCase()}`;
		},

		//* Table of all volunteers
		getVolunteers: function () {
			this.volunteers = [];
			axios({
				method: "get",
				url: process.env.VUE_APP_API + "volunteer/getallvolunteers",
				// headers: {
				// 	Authorization: `Bearer ${this.token}`,
				// },
			}).then((vol) => {
				for (let v = 0; v < vol.data.length; v++) {
					this.volunteers.push({
						id: vol.data[v].id,
						name: vol.data[v].first_name + " " + vol.data[v].last_name,
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
td {
	text-align: left;
	padding-left: 1rem;
	height: 2rem;
}
.times {
	font-weight: 100;
	text-align: left;
	margin-left: 4rem;
}
.times span {
	font-weight: bold;
}
</style>
