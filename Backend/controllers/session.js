const { session } = require("../models");
const moment = require("moment");

//* Create a new session
exports.createSession = (req, res) => {
	const newSession = new session({
		...req.body,
	});
	newSession
		.save()
		.then((session) => {
			res.send("new session created !");
		})
		.catch((err) => {
			res.status(401).send(err);
		});
};

// * Get all sessions
exports.getAllSessions = (req, res) => {
	session.findAll({}).then((obj) => {
		res.send(obj);
	});
};

// * Delete a session
exports.delete = (req, res) => {
	session
		.destroy({ where: { id: req.params.sessionid } })
		.then(() => {
			res.send("session deleted");
		})
		.catch((err) => {
			res.send(err);
		});
};

//* Delete sessions if past dates
exports.deletePastDates = (req, res) => {
	//get all sessions
	session.findAll({}).then((sessions) => {
		const today = moment(new Date()).format("YYYY-MM-DD");
		// res.send(today);
		for (let s = 0; s < sessions.length; s++) {
			if (today > sessions[s].date) {
				session
					.destroy({ where: { id: sessions[s].id } })
					.then(() => {
						res.send("session deleted");
					})
					.catch((err) => {
						res.send(err);
					});
			}
		}
	});
};
